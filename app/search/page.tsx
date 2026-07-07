"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { findTopicForQuery } from "@/lib/content";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import SearchBar from "@/components/SearchBar";
import VideoCard from "@/components/VideoCard";
import PaperCard from "@/components/PaperCard";
import CompanyChip from "@/components/CompanyChip";

// Screen 3 — curated results. Every query currently resolves to the
// rehearsed topic (see findTopicForQuery); the layout doesn't care.
function SearchResults() {
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const topic = findTopicForQuery(query);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 md:px-10 pb-24">
      <Reveal className="mt-6 max-w-2xl">
        <SearchBar size="sm" initialQuery={query} />
      </Reveal>

      <Reveal delay={100}>
        <p className="mt-10 text-lg text-neutral-500">
          You searched for{" "}
          <span className="font-serif italic text-2xl text-neutral-900">
            {query || topic.label}
          </span>
          {" "}— here&apos;s what we found.
        </p>
      </Reveal>

      {/* Videos */}
      <Reveal delay={200}>
        <h2 className="mt-12 text-xs uppercase tracking-[0.2em] text-neutral-500">
          Videos
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topic.videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </Reveal>

      {/* Research papers */}
      <Reveal delay={320}>
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
      <Reveal delay={440}>
        <h2 className="mt-14 text-xs uppercase tracking-[0.2em] text-neutral-500">
          Companies in this space
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {topic.companies.map((c) => (
            <CompanyChip key={c.id} company={c} />
          ))}
        </div>
      </Reveal>
    </main>
  );
}

export default function SearchPage() {
  return (
    <>
      <Header />
      {/* useSearchParams requires a Suspense boundary in the App Router */}
      <Suspense fallback={null}>
        <SearchResults />
      </Suspense>
    </>
  );
}
