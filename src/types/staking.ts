export type StakingSnapshot = {
  depositsLive: boolean;
  minDeposit: bigint;
  dailyRoiBps: bigint;
  level1MonthlyBps: bigint;
  level2MonthlyBps: bigint;
  level3MonthlyBps: bigint;
  founderMonthlyBps: bigint;
  level1InstantBps: bigint;
  founderActivationBps: bigint;
  earlyWithdrawalPenaltyBps: bigint;
  totalActivePrincipal: bigint;
  totalReservedUserRoi: bigint;
  totalReservedReferralRewards: bigint;
  totalReservedFounderRewards: bigint;
  requiredUnreservedUsdt: bigint;
  availableExcessUsdt: bigint;
  nextDepositId: bigint;
};

export type StakingPosition = {
  id: bigint;
  user: string;
  principalUsdt: bigint;
  tokenEquivalent: bigint;
  startTime: bigint;
  endTime: bigint;
  lastAccrualTime: bigint;
  principalWithdrawn: boolean;
  closed: boolean;
  level1: string;
  level2: string;
  level3: string;
  pendingRoi: bigint;
  claimableRoi: bigint;
  claimedRoi: bigint;
};

export type StakingAccount = {
  referrer: string;
  isFounder: boolean;
  claimableReferralRewards: bigint;
  claimableFounderRewards: bigint;
  positions: StakingPosition[];
};
