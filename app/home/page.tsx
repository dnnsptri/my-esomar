"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { findTopicForQuery, type Recommendation } from "@/lib/content";
import { getUser, getViewed, type User, type ViewedItem } from "@/lib/session";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import SearchBar from "@/components/SearchBar";
import InlineResults from "@/components/InlineResults";

// Esomar is a worldwide community, so greet in many languages. Romanized
// spellings only, so everything renders in the Latin font. The local
// time-based greeting is mixed in too. Picked once per visit; this
// component only ever renders client-side (see `ready` below), so a random
// pick here can't cause a hydration mismatch.
const HELLOS = [
  "Hello", "Hi", "Hey", "Ciao", "Hola", "Bonjour", "Salut", "Hallo", "Olá",
  "Hej", "Hei", "Moi", "Namaste", "Konnichiwa", "Ni hao", "Annyeong", "Salam",
  "Shalom", "Merhaba", "Privet", "Yassou", "Sawubona", "Jambo", "Habari",
  "Xin chao", "Sawasdee", "Halo", "Kamusta", "Ahoj", "Zdravo", "Terve",
  "Selamat", "Aloha", "Kia ora", "Dia dhuit",
];

function greeting(): string {
  const h = new Date().getHours();
  const timeBased = h < 6 ? "Good night" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  // Weight the local time-based greeting a little, then the world.
  const pool = [timeBased, ...HELLOS];
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
  // The active query drives the inline results below the hero. `runId` bumps
  // on every submit so re-running the same query still re-scrolls.
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

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

  // After results render, scroll down to them (header + search stay put).
  useEffect(() => {
    if (runId > 0) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [runId]);

  if (!ready || !user) return null;

  const lastViewed = viewed[0] ?? null;
  const suggestions = [
    "AI in market research",
    "Gen Z media habits",
    "Brand tracking benchmarks",
  ];

  // Search bar and quick suggestions both land here — identical results.
  const runQuery = (q: string) => {
    setActiveQuery(q);
    setRunId((n) => n + 1);
  };

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col px-5 pb-24">
        {/* Hero fills the first screen so the header and search bar keep
            their position; results appear beneath it. svh (small viewport
            height) so the mobile URL bar never crops the content. */}
        <div className="flex min-h-[calc(100svh-80px)] flex-col items-center justify-center">
          <div className="w-full max-w-2xl">
            <Reveal>
              <h1 className="text-center text-4xl md:text-6xl leading-tight">
                {hello}, <span className="font-serif italic">{user.firstName}</span>
              </h1>
              {/* Returning members get a line of context; on a fresh visit the
                  animated search bar below speaks for itself. */}
              {lastViewed && (
                <p className="mt-4 text-center text-lg md:text-xl text-neutral-500">
                  Since you&apos;ve looked into{" "}
                  <span className="font-serif italic text-neutral-900">
                    {lastViewed.topicLabel}
                  </span>
                  :
                </p>
              )}
            </Reveal>

            <Reveal delay={150} className="mt-8">
              <SearchBar
                size="lg"
                autoFocus={!lastViewed}
                onSubmitQuery={runQuery}
                animatedPlaceholder
              />
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
              /* ——— Fresh: quick-suggestion pills — same results as the bar ——— */
              <Reveal delay={300}>
                <p className="mt-8 text-center text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Quick suggestions
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => runQuery(s)}
                      className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </div>

        {/* Inline results, revealed under the hero and scrolled into view */}
        {activeQuery && (
          <div ref={resultsRef} className="mx-auto w-full max-w-5xl scroll-mt-6">
            <InlineResults key={runId} query={activeQuery} />
          </div>
        )}
      </main>
    </>
  );
}
