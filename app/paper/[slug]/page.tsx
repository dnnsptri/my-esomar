"use client";

import { notFound } from "next/navigation";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { findPaper, paperMediaPlacements } from "@/lib/content";
import { addViewed } from "@/lib/session";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import PaperMediaBlock from "@/components/PaperMedia";
import { useChat } from "@/components/ChatProvider";

// Screens 4a/4b — paper detail. Selecting text in the article surfaces an
// "Ask about this" button; it hands the passage to the persistent chat
// sidebar (see ChatProvider) and scopes the conversation to this paper.
export default function PaperPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const found = findPaper(slug);
  const { askAbout, setScope } = useChat();

  // Floating button position, relative to the article wrapper
  const [askButton, setAskButton] = useState<{ x: number; y: number; text: string } | null>(null);
  const articleRef = useRef<HTMLDivElement>(null);

  // Record the visit — this is what powers the personalized home (screen 5)
  useEffect(() => {
    if (!found) return;
    addViewed({
      paperSlug: found.paper.slug,
      paperTitle: found.paper.title,
      topicId: found.topic.id,
      topicLabel: found.topic.label,
    });
  }, [found]);

  // Reading a paper scopes the sidebar to it; leaving the page returns
  // the assistant to its general mode.
  useEffect(() => {
    if (!found) return;
    setScope(found.paper);
    return () => setScope(null);
  }, [found, setScope]);

  const handleSelection = useCallback(() => {
    const sel = window.getSelection();
    const wrapper = articleRef.current;
    if (!sel || sel.isCollapsed || !wrapper) {
      setAskButton(null);
      return;
    }
    const text = sel.toString().trim();
    if (text.length < 12 || !wrapper.contains(sel.anchorNode)) {
      setAskButton(null);
      return;
    }
    // Position the floating button just under the selection
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    setAskButton({
      x: rect.left - wrapperRect.left + rect.width / 2,
      y: rect.bottom - wrapperRect.top + 10,
      text,
    });
  }, []);

  if (!found) notFound();
  const { paper } = found;
  // Deterministic per paper: where Watch/Listen/Figure land in the body
  // (see paperMediaPlacements) instead of one hero banner under the title.
  const mediaPlacements = paperMediaPlacements(paper);
  const rootMedia = mediaPlacements.filter((m) => m.afterSection === -1);

  function openChat(withText: string | null) {
    setAskButton(null);
    askAbout(paper, withText);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="min-w-0 flex-1 px-5 pb-32 md:px-10">
        <div
          ref={articleRef}
          onMouseUp={handleSelection}
          onTouchEnd={handleSelection}
          className="relative mx-auto max-w-2xl"
        >
          <Reveal>
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-neutral-500">
              Research paper · {paper.year} · {paper.readingTime}
            </p>
            <h1 className="mt-4 font-serif text-4xl md:text-5xl leading-[1.1]">
              {paper.title}
            </h1>
            <p className="mt-4 font-serif italic text-lg text-neutral-600">
              {paper.authors.join(" · ")}
            </p>
          </Reveal>

          <Reveal delay={150}>
            <p className="mt-8 border-l-2 border-neutral-900 pl-5 text-lg leading-relaxed text-neutral-700">
              {paper.abstract}
            </p>
          </Reveal>

          {/* Papers with no sections yet have nowhere else to scatter
              media, so it lands here, right after the abstract */}
          {rootMedia.map((m) => (
            <PaperMediaBlock key={m.kind} kind={m.kind} paper={paper} />
          ))}

          <Reveal delay={280}>
            <div className="mt-12 space-y-10">
              {paper.sections.map((section, idx) => (
                <div key={section.heading}>
                  <section className="group/section relative">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="font-serif text-2xl">{section.heading}</h2>
                      {/* Inline fallback so the chat can be scoped to a section
                          without a text selection */}
                      <button
                        onClick={() => openChat(`${section.heading} — ${section.paragraphs[0].slice(0, 160)}…`)}
                        className="shrink-0 rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-400 opacity-0 transition-opacity group-hover/section:opacity-100 hover:border-neutral-900 hover:text-neutral-900"
                      >
                        Ask about this
                      </button>
                    </div>
                    {section.paragraphs.map((p, i) => (
                      <p key={i} className="mt-4 leading-[1.8] text-neutral-800">
                        {p}
                      </p>
                    ))}
                  </section>
                  {mediaPlacements
                    .filter((m) => m.afterSection === idx)
                    .map((m) => (
                      <PaperMediaBlock key={m.kind} kind={m.kind} paper={paper} section={section} />
                    ))}
                </div>
              ))}
            </div>
          </Reveal>

          {/* Floating "Ask about this" that follows a text selection */}
          {askButton && (
            <button
              onClick={() => openChat(askButton.text)}
              style={{ left: askButton.x, top: askButton.y }}
              className="absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-neutral-900 px-4 py-2 text-sm text-white shadow-lg hover:bg-neutral-700 transition-colors"
            >
              Ask about this ↗
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
