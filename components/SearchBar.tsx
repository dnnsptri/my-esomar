"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Example prompts the home bar types out on a loop, to signal "you can ask
// me anything" the way a conversational agent does.
const ROTATING_QUESTIONS = [
  "What's new in AI and market research?",
  "Summarise the synthetic respondents paper",
  "Which companies work on AI moderation?",
  "How reliable are LLM-simulated panels?",
];

// Big conversational search bar (Google/ChatGPT style). By default a query
// routes to /search?q=… and the results page decides what to show. Pass
// `onSubmitQuery` to instead answer conversationally in place (the home
// page uses this). `animatedPlaceholder` types the prompts above out with a
// blinking caret while the field is empty.
export default function SearchBar({
  size = "lg",
  initialQuery = "",
  autoFocus = false,
  onSubmitQuery,
  animatedPlaceholder = false,
}: {
  size?: "lg" | "sm";
  initialQuery?: string;
  autoFocus?: boolean;
  onSubmitQuery?: (query: string) => void;
  animatedPlaceholder?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [typed, setTyped] = useState("");

  // Typewriter: type a question, hold, delete, move to the next, forever.
  useEffect(() => {
    if (!animatedPlaceholder) return;
    let questionIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const full = ROTATING_QUESTIONS[questionIndex];
      if (!deleting) {
        charIndex += 1;
        setTyped(full.slice(0, charIndex));
        if (charIndex === full.length) {
          deleting = true;
          timer = setTimeout(tick, 1800); // hold the finished question
          return;
        }
        timer = setTimeout(tick, 45 + Math.random() * 40);
      } else {
        charIndex -= 1;
        setTyped(full.slice(0, charIndex));
        if (charIndex === 0) {
          deleting = false;
          questionIndex = (questionIndex + 1) % ROTATING_QUESTIONS.length;
          timer = setTimeout(tick, 350);
          return;
        }
        timer = setTimeout(tick, 25);
      }
    };

    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [animatedPlaceholder]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (onSubmitQuery) {
      onSubmitQuery(q);
      setQuery(""); // hand off to the conversation; clear for the next prompt
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  // text-base (16px) minimum so iOS doesn't auto-zoom the field on focus.
  const heightCls = size === "lg" ? "h-14 md:h-16 text-base md:text-lg" : "h-11 text-base";
  // The animated prompt only shows while the user hasn't typed anything.
  const showOverlay = animatedPlaceholder && query === "";

  return (
    <form onSubmit={submit} className="w-full">
      <div
        className={`relative flex items-center gap-2 rounded-full border border-neutral-900 bg-white pl-6 pr-2 ${heightCls} focus-within:shadow-[0_0_0_1px_#111] transition-shadow`}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={autoFocus}
          placeholder={animatedPlaceholder ? "" : "Ask anything, or search papers, videos, companies…"}
          // Hide the real caret while the animated one is showing so there
          // is only ever one blinking cursor.
          className={`flex-1 bg-transparent outline-none placeholder:text-neutral-400 ${
            showOverlay ? "caret-transparent" : ""
          }`}
        />
        {showOverlay && (
          <div className="pointer-events-none absolute inset-y-0 left-6 right-16 flex items-center overflow-hidden text-neutral-400">
            {/* Cursor stays on the left; the question types out beside it */}
            <span className="caret-lead" />
            <span className="whitespace-nowrap">{typed}</span>
          </div>
        )}
        <button
          type="submit"
          aria-label="Ask"
          className={`flex items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-neutral-700 transition-colors ${
            size === "lg" ? "h-10 w-10 md:h-12 md:w-12" : "h-8 w-8"
          }`}
        >
          {/* "?" — this button asks the question, not sends a message */}
          <span className={`font-semibold leading-none ${size === "lg" ? "text-xl" : "text-base"}`}>
            ?
          </span>
        </button>
      </div>
    </form>
  );
}
