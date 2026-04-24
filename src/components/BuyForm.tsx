import { useState } from "react";

type Props = {
  disabled: boolean;
  onBuy: (amount: string) => Promise<void>;
};

export default function BuyForm({ disabled, onBuy }: Props) {
  const [amount, setAmount] = useState("");

  return (
    <section className="card">
      <h2>Public Sale Buy</h2>
      <div className="row">
        <input
          className="input"
          placeholder="USDT amount (e.g. 100)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="btn"
          disabled={disabled || !amount}
          onClick={async () => {
            await onBuy(amount);
            setAmount("");
          }}
        >
          Approve + Buy
        </button>
      </div>
    </section>
  );
}
