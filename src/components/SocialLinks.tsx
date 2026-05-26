const SOCIAL_LINKS = [
  { label: "X", href: "https://x.com/mad_bull9" },
  { label: "Telegram", href: "https://t.me/mad_bull9" },
];

type SocialLinksProps = {
  variant?: "footer";
};

export default function SocialLinks({ variant = "footer" }: SocialLinksProps) {
  return (
    <div className={`social-links social-links--${variant}`} aria-label="Official MadBull social links">
      {SOCIAL_LINKS.map((link) => (
        <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
          {link.label}
        </a>
      ))}
    </div>
  );
}
