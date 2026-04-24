import { CHAIN_NAME } from "../config/contracts";
import { shortAddress } from "../lib/format";
import type { WalletState } from "../types/presale";

type Props = {
  wallet: WalletState;
  wrongNetwork: boolean;
  onConnect: () => Promise<void>;
};

export default function ConnectWalletButton({ wallet, wrongNetwork, onConnect }: Props) {
  if (!wallet.connected) {
    return (
      <button className="btn" onClick={() => void onConnect()}>
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="wallet-pill">
      <span>{shortAddress(wallet.account)}</span>
      <span className={wrongNetwork ? "tag danger" : "tag success"}>
        {wrongNetwork ? `Switch to ${CHAIN_NAME}` : CHAIN_NAME}
      </span>
    </div>
  );
}
