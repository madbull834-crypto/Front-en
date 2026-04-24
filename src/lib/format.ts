import { formatUnits } from "ethers";

export function shortAddress(address: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatAmount(value: bigint, decimals: number, max = 4) {
  const n = Number(formatUnits(value, decimals));
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString(undefined, { maximumFractionDigits: max });
}

export function formatTimestamp(seconds: bigint) {
  const ms = Number(seconds) * 1000;
  if (!ms || Number.isNaN(ms)) return "-";
  return new Date(ms).toLocaleString();
}
