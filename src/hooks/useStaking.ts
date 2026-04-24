import { ZeroAddress, parseUnits } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { STAKING_ADDRESS, USDT_ADDRESS, USDT_DECIMALS } from "../config/contracts";
import type { StakingAccount, StakingPosition, StakingSnapshot } from "../types/staking";
import {
  getStakingReadContract,
  getStakingWriteContract,
  getUsdtReadContract,
  getUsdtWriteContract
} from "../web3/clients";

const EMPTY_SNAPSHOT: StakingSnapshot = {
  depositsLive: false,
  minDeposit: 0n,
  dailyRoiBps: 0n,
  level1MonthlyBps: 0n,
  level2MonthlyBps: 0n,
  level3MonthlyBps: 0n,
  founderMonthlyBps: 0n,
  level1InstantBps: 0n,
  founderActivationBps: 0n,
  earlyWithdrawalPenaltyBps: 0n,
  totalActivePrincipal: 0n,
  totalReservedUserRoi: 0n,
  totalReservedReferralRewards: 0n,
  totalReservedFounderRewards: 0n,
  requiredUnreservedUsdt: 0n,
  availableExcessUsdt: 0n,
  nextDepositId: 0n
};

const EMPTY_ACCOUNT: StakingAccount = {
  referrer: "",
  isFounder: false,
  claimableReferralRewards: 0n,
  claimableFounderRewards: 0n,
  positions: []
};

function normalizeAddress(value: string) {
  return value && value !== ZeroAddress ? value : "";
}

export function useStaking(account: string) {
  const [snapshot, setSnapshot] = useState<StakingSnapshot>(EMPTY_SNAPSHOT);
  const [stakingAccount, setStakingAccount] = useState<StakingAccount>(EMPTY_ACCOUNT);
  const [owner, setOwner] = useState("");
  const [usdtBalance, setUsdtBalance] = useState(0n);
  const [usdtAllowance, setUsdtAllowance] = useState(0n);
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState("");

  const isOwner = useMemo(() => {
    if (!account || !owner) return false;
    return owner.toLowerCase() === account.toLowerCase();
  }, [account, owner]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (!STAKING_ADDRESS) {
        throw new Error("Missing VITE_STAKING_ADDRESS in environment");
      }
      if (!USDT_ADDRESS) {
        throw new Error("Missing VITE_USDT_ADDRESS in environment");
      }

      const staking = getStakingReadContract();
      const baseCalls = await Promise.all([
        staking.depositsLive(),
        staking.minDeposit(),
        staking.dailyRoiBps(),
        staking.level1MonthlyBps(),
        staking.level2MonthlyBps(),
        staking.level3MonthlyBps(),
        staking.founderMonthlyBps(),
        staking.level1InstantBps(),
        staking.founderActivationBps(),
        staking.earlyWithdrawalPenaltyBps(),
        staking.totalActivePrincipal(),
        staking.totalReservedUserRoi(),
        staking.totalReservedReferralRewards(),
        staking.totalReservedFounderRewards(),
        staking.requiredUnreservedUsdt(),
        staking.availableExcessUsdt(),
        staking.nextDepositId(),
        staking.owner()
      ]);

      setSnapshot({
        depositsLive: baseCalls[0],
        minDeposit: baseCalls[1],
        dailyRoiBps: baseCalls[2],
        level1MonthlyBps: baseCalls[3],
        level2MonthlyBps: baseCalls[4],
        level3MonthlyBps: baseCalls[5],
        founderMonthlyBps: baseCalls[6],
        level1InstantBps: baseCalls[7],
        founderActivationBps: baseCalls[8],
        earlyWithdrawalPenaltyBps: baseCalls[9],
        totalActivePrincipal: baseCalls[10],
        totalReservedUserRoi: baseCalls[11],
        totalReservedReferralRewards: baseCalls[12],
        totalReservedFounderRewards: baseCalls[13],
        requiredUnreservedUsdt: baseCalls[14],
        availableExcessUsdt: baseCalls[15],
        nextDepositId: baseCalls[16]
      });
      setOwner(baseCalls[17]);

      if (!account) {
        setStakingAccount(EMPTY_ACCOUNT);
        setUsdtBalance(0n);
        setUsdtAllowance(0n);
        return;
      }

      const usdt = getUsdtReadContract();
      const [referrer, isFounder, claimableReferralRewards, claimableFounderRewards, depositIds, balance, allowance] = await Promise.all([
        staking.referrerOf(account),
        staking.isFounder(account),
        staking.claimableReferralRewards(account),
        staking.claimableFounderRewards(account),
        staking.getUserDepositIds(account),
        usdt.balanceOf(account),
        usdt.allowance(account, STAKING_ADDRESS)
      ]);

      const positions = await Promise.all(
        [...depositIds]
          .map((id) => BigInt(id))
          .sort((a, b) => Number(b - a))
          .map(async (depositId): Promise<StakingPosition> => {
            const [deposit, pendingRoi, claimableRoi, claimedRoi] = await Promise.all([
              staking.deposits(depositId),
              staking.pendingRoi(depositId),
              staking.claimableRoiByDeposit(depositId),
              staking.totalRoiClaimedByDeposit(depositId)
            ]);

            return {
              id: deposit.id,
              user: deposit.user,
              principalUsdt: deposit.principalUsdt,
              tokenEquivalent: deposit.tokenEquivalent,
              startTime: deposit.startTime,
              endTime: deposit.endTime,
              lastAccrualTime: deposit.lastAccrualTime,
              principalWithdrawn: deposit.principalWithdrawn,
              closed: deposit.closed,
              level1: normalizeAddress(deposit.level1),
              level2: normalizeAddress(deposit.level2),
              level3: normalizeAddress(deposit.level3),
              pendingRoi,
              claimableRoi,
              claimedRoi
            };
          })
      );

      setStakingAccount({
        referrer: normalizeAddress(referrer),
        isFounder,
        claimableReferralRewards,
        claimableFounderRewards,
        positions
      });
      setUsdtBalance(balance);
      setUsdtAllowance(allowance);
    } catch (e: any) {
      setError(e?.reason || e?.shortMessage || e?.message || "Failed to load staking data");
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    void refresh();
    const id = setInterval(() => void refresh(), 30_000);
    return () => clearInterval(id);
  }, [refresh]);

  const stake = useCallback(async (usdtAmount: string, referrerAddress: string) => {
    setTxLoading(true);
    setError("");
    try {
      const amount = parseUnits(usdtAmount, USDT_DECIMALS);
      const sanitizedReferrer = referrerAddress.trim() || ZeroAddress;
      const usdt = await getUsdtWriteContract();
      const staking = await getStakingWriteContract();

      const approveTx = await usdt.approve(STAKING_ADDRESS, amount);
      await approveTx.wait();

      const tx = await staking.deposit(amount, sanitizedReferrer);
      await tx.wait();
      await refresh();
    } catch (e: any) {
      setError(e?.reason || e?.shortMessage || e?.message || "Staking deposit failed");
      throw e;
    } finally {
      setTxLoading(false);
    }
  }, [refresh]);

  const claimRoi = useCallback(async (depositId: bigint) => {
    setTxLoading(true);
    setError("");
    try {
      const staking = await getStakingWriteContract();
      const tx = await staking.claimRoi(depositId);
      await tx.wait();
      await refresh();
    } catch (e: any) {
      setError(e?.reason || e?.shortMessage || e?.message || "ROI claim failed");
      throw e;
    } finally {
      setTxLoading(false);
    }
  }, [refresh]);

  const withdrawPrincipal = useCallback(async (depositId: bigint) => {
    setTxLoading(true);
    setError("");
    try {
      const staking = await getStakingWriteContract();
      const tx = await staking.withdrawPrincipal(depositId);
      await tx.wait();
      await refresh();
    } catch (e: any) {
      setError(e?.reason || e?.shortMessage || e?.message || "Principal withdrawal failed");
      throw e;
    } finally {
      setTxLoading(false);
    }
  }, [refresh]);

  const claimReferralRewards = useCallback(async () => {
    setTxLoading(true);
    setError("");
    try {
      const staking = await getStakingWriteContract();
      const tx = await staking.claimReferralRewards([]);
      await tx.wait();
      await refresh();
    } catch (e: any) {
      setError(e?.reason || e?.shortMessage || e?.message || "Referral claim failed");
      throw e;
    } finally {
      setTxLoading(false);
    }
  }, [refresh]);

  const claimFounderRewards = useCallback(async () => {
    setTxLoading(true);
    setError("");
    try {
      const staking = await getStakingWriteContract();
      const tx = await staking.claimFounderRewards([]);
      await tx.wait();
      await refresh();
    } catch (e: any) {
      setError(e?.reason || e?.shortMessage || e?.message || "Founder claim failed");
      throw e;
    } finally {
      setTxLoading(false);
    }
  }, [refresh]);

  return {
    snapshot,
    stakingAccount,
    usdtBalance,
    usdtAllowance,
    loading,
    txLoading,
    error,
    isOwner,
    refresh,
    stake,
    claimRoi,
    withdrawPrincipal,
    claimReferralRewards,
    claimFounderRewards
  };
}
