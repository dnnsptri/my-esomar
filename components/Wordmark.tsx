// "my Esomar" wordmark: possessive "my" in serif italic, brand in tracked semibold.
export default function Wordmark({ size = "sm" }: { size?: "sm" | "lg" }) {
  const cls =
    size === "lg"
      ? "text-4xl md:text-5xl"
      : "text-lg";
  return (
    <span className={`${cls} inline-flex items-baseline gap-[0.35em] select-none`}>
      <span className="font-serif italic">my</span>
      <span className="font-semibold tracking-[0.18em]">Esomar</span>
    </span>
  );
}
