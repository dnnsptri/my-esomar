"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Big conversational search bar (Google/ChatGPT style). Any query routes to
// /search?q=… — the results page decides what to show.
export default function SearchBar({
  size = "lg",
  initialQuery = "",
  autoFocus = false,
}: {
  size?: "lg" | "sm";
  initialQuery?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const heightCls = size === "lg" ? "h-14 md:h-16 text-base md:text-lg" : "h-11 text-sm";

  return (
    <form onSubmit={submit} className="w-full">
      <div
        className={`flex items-center gap-2 rounded-full border border-neutral-900 bg-white pl-6 pr-2 ${heightCls} focus-within:shadow-[0_0_0_1px_#111] transition-shadow`}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={autoFocus}
          placeholder="Ask anything, or search papers, videos, companies…"
          className="flex-1 bg-transparent outline-none placeholder:text-neutral-400"
        />
        <button
          type="submit"
          aria-label="Search"
          className={`flex items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-neutral-700 transition-colors ${
            size === "lg" ? "h-10 w-10 md:h-12 md:w-12" : "h-8 w-8"
          }`}
        >
          {/* Arrow-up glyph, like conversational AI inputs */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M8 13V3M8 3L3.5 7.5M8 3l4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
