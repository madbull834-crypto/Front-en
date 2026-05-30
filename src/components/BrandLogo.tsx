import madbullLogo from "../assets/madbull-logo.jpg";

type BrandLogoProps = {
  className?: string;
  size?: "nav" | "hero" | "footer" | "whitepaper";
};

export default function BrandLogo({ className = "", size = "nav" }: BrandLogoProps) {
  return (
    <span className={`brand-logo brand-logo--${size} ${className}`.trim()}>
      <img src={madbullLogo} alt="MadBull logo" className="brand-logo-img" />
      <span className="brand-logo-text" aria-label="MadBull">
        <span className="logo-red">MAD</span>
        <span className="logo-green">BULL</span>
      </span>
    </span>
  );
}
