import { parseUnits } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MADBULL_ADDRESS, PRESALE_ADDRESS, USDT_DECIMALS } from "../config/contracts";
import type { SaleSnapshot, UserRecord } from "../types/presale";
import { getMadbullReadContract, getPresaleReadContract, getPresaleWriteContract, getUsdtWriteContract } from "../web3/clients";

const EMPTY_SNAPSHOT: SaleSnapshot = {
  saleActive: false,
  claimEnabled: false,
  startTime: 0n,
  publicSaleTokenPrice: 0n,
  rate: 0n,
  totalPublicUsdtRaised: 0n,
  totalPrivateUsdtRaised: 0n,
  totalUsdtRaised: 0n,
  totalPresaleSold: 0n,
  totalPrivateSold: 0n
};

const EMPTY_RECORD: UserRecord = {
  publicUsdtInvested: 0n,
  privateUsdtInvestedAmount: 0n,
  publicTokensPurchased: 0n,
  privateTokensPurchased: 0n,
  totalTokensPurchased: 0n,
  totalTokensClaimed: 0n,
  claimableNow: 0n
};

export function usePresale(account: string) {
  const [snapshot, setSnapshot] = useState<SaleSnapshot>(EMPTY_SNAPSHOT);
  const [record, setRecord] = useState<UserRecord>(EMPTY_RECORD);
  const [owner, setOwner] = useState("");
  const [madbullBalance, setMadbullBalance] = useState(0n);
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
      const presale = getPresaleReadContract();
      const [saleActive, claimEnabled, startTime, publicSaleTokenPrice, rate, totalPublicUsdtRaised, totalPrivateUsdtRaised, totalUsdtRaised, totalPresaleSold, totalPrivateSold, ownerAddr] = await Promise.all([
        presale.saleActive(),
        presale.claimEnabled(),
        presale.startTime(),
        presale.publicSaleTokenPrice(),
        presale.rate(),
        presale.totalPublicUsdtRaised(),
        presale.totalPrivateUsdtRaised(),
        presale.totalUsdtRaised(),
        presale.totalPresaleSold(),
        presale.totalPrivateSold(),
        presale.owner()
      ]);

      setSnapshot({
        saleActive,
        claimEnabled,
        startTime,
        publicSaleTokenPrice,
        rate,
        totalPublicUsdtRaised,
        totalPrivateUsdtRaised,
        totalUsdtRaised,
        totalPresaleSold,
        totalPrivateSold
      });
      setOwner(ownerAddr);

      if (account) {
        const user = await presale.getUserSaleRecord(account);
        setRecord({
          publicUsdtInvested: user[0],
          privateUsdtInvestedAmount: user[1],
          publicTokensPurchased: user[2],
          privateTokensPurchased: user[3],
          totalTokensPurchased: user[4],
          totalTokensClaimed: user[5],
          claimableNow: user[6]
        });

        if (MADBULL_ADDRESS) {
          try {
            const mbl = getMadbullReadContract();
            const bal = await mbl.balanceOf(account);
            setMadbullBalance(bal);
          } catch {
            // MBL contract not deployed yet — silently ignore
          }
        }
      }
    } catch (e: any) {
      setError(e?.reason || e?.shortMessage || e?.message || "Failed to load presale data");
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    void refresh();
    const id = setInterval(() => void refresh(), 30_000);
    return () => clearInterval(id);
  }, [refresh]);

  const buyPublic = useCallback(async (usdtAmount: string) => {
    setTxLoading(true);
    setError("");
    try {
      const amount = parseUnits(usdtAmount, USDT_DECIMALS);
      const usdt = await getUsdtWriteContract();
      const presale = await getPresaleWriteContract();

      const approveTx = await usdt.approve(PRESALE_ADDRESS, amount);
      await approveTx.wait();

      const buyTx = await presale.buyTokens(amount);
      await buyTx.wait();

      await refresh();
    } catch (e: any) {
      setError(e?.reason || e?.shortMessage || e?.message || "Public buy failed");
      throw e;
    } finally {
      setTxLoading(false);
    }
  }, [refresh]);

  const claim = useCallback(async () => {
    setTxLoading(true);
    setError("");
    try {
      const presale = await getPresaleWriteContract();
      const tx = await presale.claimTokens();
      await tx.wait();
      await refresh();
    } catch (e: any) {
      setError(e?.reason || e?.shortMessage || e?.message || "Claim failed");
      throw e;
    } finally {
      setTxLoading(false);
    }
  }, [refresh]);

  const setPublicPrice = useCallback(async (priceUsdt: string) => {
    setTxLoading(true);
    setError("");
    try {
      const price = parseUnits(priceUsdt, USDT_DECIMALS);
      const presale = await getPresaleWriteContract();
      const tx = await presale.setPublicSaleTokenPrice(price);
      await tx.wait();
      await refresh();
    } catch (e: any) {
      setError(e?.reason || e?.shortMessage || e?.message || "Price update failed");
      throw e;
    } finally {
      setTxLoading(false);
    }
  }, [refresh]);

  const recordPrivateInvestment = useCallback(async (buyer: string, usdtAmount: string) => {
    setTxLoading(true);
    setError("");
    try {
      const amount = parseUnits(usdtAmount, USDT_DECIMALS);
      const usdt = await getUsdtWriteContract();
      const presale = await getPresaleWriteContract();

      const approveTx = await usdt.approve(PRESALE_ADDRESS, amount);
      await approveTx.wait();

      const tx = await presale.recordPrivateSaleInvestment(buyer, amount);
      await tx.wait();
      await refresh();
    } catch (e: any) {
      setError(e?.reason || e?.shortMessage || e?.message || "Private sale record failed");
      throw e;
    } finally {
      setTxLoading(false);
    }
  }, [refresh]);

  return {
    snapshot,
    record,
    madbullBalance,
    loading,
    txLoading,
    error,
    isOwner,
    refresh,
    buyPublic,
    claim,
    setPublicPrice,
    recordPrivateInvestment
  };
}
