import { useState } from "react";

type Props = {
  disabled: boolean;
  onSetPrice: (priceUsdt6: string) => Promise<void>;
  onRecordPrivate: (buyer: string, usdtAmount: string) => Promise<void>;
};

export default function AdminPanel({ disabled, onSetPrice, onRecordPrivate }: Props) {
  const [price, setPrice] = useState("");
  const [buyer, setBuyer] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <section className="card">
      <h2>Owner Controls</h2>

      <div className="stack">
        <label className="label">Set Public Sale Price (USDT 6-decimal units)</label>
        <div className="row">
          <input
            className="input"
            placeholder="40000 = $0.04"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button
            className="btn"
            disabled={disabled || !price}
            onClick={async () => {
              await onSetPrice(price);
              setPrice("");
            }}
          >
            Update Price
          </button>
        </div>
      </div>

      <div className="stack">
        <label className="label">Record Private Investment</label>
        <div className="grid two">
          <input
            className="input"
            placeholder="Buyer wallet address"
            value={buyer}
            onChange={(e) => setBuyer(e.target.value)}
          />
          <input
            className="input"
            placeholder="USDT amount (e.g. 1000)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button
          className="btn"
          disabled={disabled || !buyer || !amount}
          onClick={async () => {
            await onRecordPrivate(buyer, amount);
            setBuyer("");
            setAmount("");
          }}
        >
          Approve + Record Private
        </button>
      </div>
    </section>
  );
}
