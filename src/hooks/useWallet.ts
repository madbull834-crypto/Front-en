import { useCallback, useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { CHAIN_ID } from "../config/contracts";
import type { WalletState } from "../types/presale";

const EMPTY: WalletState = { account: "", chainId: 0, connected: false };

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>(EMPTY);

  const refresh = useCallback(async () => {
    const injected = (window as any).ethereum;
    if (!injected) return setWallet(EMPTY);

    const provider = new BrowserProvider(injected);
    const accounts = await provider.send("eth_accounts", []);
    if (!accounts.length) return setWallet(EMPTY);

    const network = await provider.getNetwork();
    setWallet({
      account: accounts[0],
      chainId: Number(network.chainId),
      connected: true
    });
  }, []);

  const connect = useCallback(async () => {
    const injected = (window as any).ethereum;
    if (!injected) throw new Error("Wallet not found");

    const provider = new BrowserProvider(injected);
    const accounts = await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();
    setWallet({ account: accounts[0], chainId: Number(network.chainId), connected: true });
  }, []);

  useEffect(() => {
    const injected = (window as any).ethereum;
    if (!injected) return;

    const onAccountsChanged = (accounts: string[]) => {
      if (!accounts.length) setWallet(EMPTY);
      else setWallet((prev) => ({ ...prev, account: accounts[0], connected: true }));
    };

    const onChainChanged = () => {
      void refresh();
    };

    injected.on("accountsChanged", onAccountsChanged);
    injected.on("chainChanged", onChainChanged);
    void refresh();

    return () => {
      injected.removeListener("accountsChanged", onAccountsChanged);
      injected.removeListener("chainChanged", onChainChanged);
    };
  }, [refresh]);

  return {
    wallet,
    connect,
    refresh,
    wrongNetwork: wallet.connected && wallet.chainId !== CHAIN_ID
  };
}
