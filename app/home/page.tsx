"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { findTopicForQuery, type Recommendation } from "@/lib/content";
import { clearAll, getUser, getViewed, type User, type ViewedItem } from "@/lib/session";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import SearchBar from "@/components/SearchBar";

// A mix of time-appropriate and international greetings — ESOMAR is a
// global community, so the "same old good morning" gets old fast. Picked
// once per visit; this component only ever renders client-side (see
// `ready` below), so a random pick here can't cause a hydration mismatch.
function greeting(): string {
  const h = new Date().getHours();
  const timeBased = h < 6 ? "Good night" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  const pool = [timeBased, timeBased, "Hi", "Ciao", "Hola", "Bonjour", "Hallo"];
  return pool[Math.floor(Math.random() * pool.length)];
}

const glyph: Record<Recommendation["kind"], string> = {
  video: "▶",
  paper: "¶",
  event: "◆",
};

// Screen 2 (fresh) and screen 5 (after the member has explored something):
// same route, the localStorage history decides which story the home tells.
export default function HomePage() {
  const router = useRouter();
  const [user, setUserState] = useState<User | null>(null);
  const [viewed, setViewed] = useState<ViewedItem[]>([]);
  const [ready, setReady] = useState(false);
  // Picked once per mount (not per render) so it doesn't flicker between
  // greetings while the rest of the page updates.
  const [hello] = useState(greeting);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/");
      return;
    }
    setUserState(u);
    setViewed(getViewed());
    setReady(true);
  }, [router]);

  if (!ready || !user) return null;

  const lastViewed = viewed[0] ?? null;
  const suggestions = [
    "AI in market research",
    "Gen Z media habits",
    "Brand tracking benchmarks",
  ];

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-5 pb-24">
        <div className="w-full max-w-2xl">
          {/* Greeting + search bar are the constant first-visit experience,
              whether this is a fresh session or a returning one — what
              changes is what shows up underneath. */}
          <Reveal>
            <h1 className="text-center text-4xl md:text-6xl leading-tight">
              {hello}, <span className="font-serif italic">{user.firstName}</span>
            </h1>
            <p className="mt-4 text-center text-lg md:text-xl text-neutral-500">
              {lastViewed ? (
                <>
                  Since you&apos;ve looked into{" "}
                  <span className="font-serif italic text-neutral-900">
                    {lastViewed.topicLabel}
                  </span>
                  :
                </>
              ) : (
                "What are you looking for?"
              )}
            </p>
          </Reveal>

          <Reveal delay={150} className="mt-8">
            <SearchBar size="lg" autoFocus={!lastViewed} />
          </Reveal>

          {lastViewed ? (
            /* ——— Returning: interesting content based on prior search ——— */
            <div className="mt-8 space-y-3">
              {findTopicForQuery(lastViewed.topicLabel).recommendations.map((rec, i) => (
                <Reveal key={rec.title} delay={280 + i * 120}>
                  <Link
                    href={rec.href}
                    className="group flex items-center gap-5 rounded-2xl border border-neutral-900 px-6 py-5 transition-colors hover:bg-neutral-900 hover:text-white"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-current text-sm">
                      {glyph[rec.kind]}
                    </span>
                    <span>
                      <span className="block font-serif text-xl leading-snug">
                        {rec.title}
                      </span>
                      <span className="block text-sm text-neutral-500 group-hover:text-neutral-300">
                        {rec.meta}
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            /* ——— Fresh: light suggestion chips to get started ——— */
            <Reveal delay={300}>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <Link
                    key={s}
                    href={`/search?q=${encodeURIComponent(s)}`}
                    className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition-colors"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </main>

      {/* Subtle demo reset: clears the fake session and history */}
      <footer className="flex justify-center pb-6">
        <button
          onClick={() => {
            clearAll();
            router.push("/");
          }}
          className="text-xs text-neutral-300 hover:text-neutral-600 transition-colors"
        >
          reset demo
        </button>
      </footer>
    </>
  );
}
