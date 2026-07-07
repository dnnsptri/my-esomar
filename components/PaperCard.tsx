import Link from "next/link";
import type { Paper } from "@/lib/content";

export default function PaperCard({ paper }: { paper: Paper }) {
  return (
    <Link
      href={`/paper/${paper.slug}`}
      className="group block rounded-2xl border border-neutral-900 p-6 transition-colors hover:bg-neutral-900 hover:text-white"
    >
      <p className="text-xs uppercase tracking-[0.15em] text-neutral-500 group-hover:text-neutral-300">
        Research paper · {paper.year}
      </p>
      <h3 className="mt-2 font-serif text-2xl leading-snug">{paper.title}</h3>
      <p className="mt-2 text-sm text-neutral-500 group-hover:text-neutral-300">
        {paper.authors.join(", ")} · {paper.readingTime}
      </p>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-600 group-hover:text-neutral-200">
        {paper.abstract}
      </p>
    </Link>
  );
}
