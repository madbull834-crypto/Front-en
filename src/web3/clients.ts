import { BrowserProvider, Contract, JsonRpcProvider } from "ethers";
import { CHAIN_ID, MADBULL_ADDRESS, PRESALE_ADDRESS, RPC_URL, STAKING_ADDRESS, USDT_ADDRESS } from "../config/contracts";
import { ERC20_ABI, PRESALE_ABI } from "./abis/presale";
import { STAKING_ABI } from "./abis/staking";

export function getReadProvider() {
  if (!RPC_URL) {
    throw new Error("Missing VITE_RPC_URL in environment");
  }
  return new JsonRpcProvider(RPC_URL, CHAIN_ID, {
    // Some public BSC RPC endpoints intermittently drop batched responses,
    // which ethers surfaces as "missing response for request".
    batchMaxCount: 1,
  });
}

export async function getBrowserProvider() {
  const injected = (window as any).ethereum;
  if (!injected) {
    throw new Error("Wallet not found. Install MetaMask or compatible wallet.");
  }
  return new BrowserProvider(injected);
}

export function getPresaleReadContract() {
  const provider = getReadProvider();
  return new Contract(PRESALE_ADDRESS, PRESALE_ABI, provider);
}

export async function getPresaleWriteContract() {
  const provider = await getBrowserProvider();
  const signer = await provider.getSigner();
  return new Contract(PRESALE_ADDRESS, PRESALE_ABI, signer);
}

export function getStakingReadContract() {
  const provider = getReadProvider();
  return new Contract(STAKING_ADDRESS, STAKING_ABI, provider);
}

export async function getStakingWriteContract() {
  const provider = await getBrowserProvider();
  const signer = await provider.getSigner();
  return new Contract(STAKING_ADDRESS, STAKING_ABI, signer);
}

export function getUsdtReadContract() {
  const provider = getReadProvider();
  return new Contract(USDT_ADDRESS, ERC20_ABI, provider);
}

export async function getUsdtWriteContract() {
  const provider = await getBrowserProvider();
  const signer = await provider.getSigner();
  return new Contract(USDT_ADDRESS, ERC20_ABI, signer);
}

export function getMadbullReadContract() {
  const provider = getReadProvider();
  return new Contract(MADBULL_ADDRESS, ERC20_ABI, provider);
}
