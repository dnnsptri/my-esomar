"use client";

import { findTopicForQuery } from "@/lib/content";
import Reveal from "./Reveal";
import VideoCard from "./VideoCard";
import PaperCard from "./PaperCard";
import CompanyChip from "./CompanyChip";

// Home results, rendered inline under the search bar (not a separate page,
// not the side chat). The search bar and the quick-suggestion pills both
// land here, so they give identical results.
export default function InlineResults({ query }: { query: string }) {
  const topic = findTopicForQuery(query);

  return (
    <div className="pb-4">
      <Reveal>
        <p className="text-lg text-neutral-500">
          You searched for{" "}
          <span className="font-serif italic text-2xl text-neutral-900">{query}</span>{" "}
          — here&apos;s what we found.
        </p>
      </Reveal>

      {/* Videos */}
      <Reveal delay={120}>
        <h2 className="mt-10 text-xs uppercase tracking-[0.2em] text-neutral-500">Videos</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topic.videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </Reveal>

      {/* Research papers */}
      <Reveal delay={200}>
        <h2 className="mt-14 text-xs uppercase tracking-[0.2em] text-neutral-500">
          Research papers
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {topic.papers.map((p) => (
            <PaperCard key={p.slug} paper={p} />
          ))}
        </div>
      </Reveal>

      {/* Companies */}
      <Reveal delay={280}>
        <h2 className="mt-14 text-xs uppercase tracking-[0.2em] text-neutral-500">
          Companies in this space
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {topic.companies.map((c) => (
            <CompanyChip key={c.id} company={c} />
          ))}
        </div>
      </Reveal>
    </div>
  );
}
