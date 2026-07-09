import type { Company } from "@/lib/content";

// Monochrome "logo" chips: same palette, different type treatments so the
// companies read as distinct brands without any image assets.
const logoCls: Record<Company["logoStyle"], string> = {
  serif: "font-serif italic text-lg",
  caps: "uppercase tracking-[0.2em] text-xs font-semibold",
  mono: "font-mono text-sm font-medium",
};

export default function CompanyChip({ company }: { company: Company }) {
  return (
    <a
      href={company.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-neutral-900 px-6 py-5 text-center transition-colors hover:bg-neutral-900 hover:text-white"
      title={`${company.tagline} — view on the Esomar directory`}
    >
      <span className={logoCls[company.logoStyle]}>{company.name}</span>
      <span className="text-[11px] text-neutral-500 group-hover:text-neutral-300">
        {company.tagline}
      </span>
    </a>
  );
}
