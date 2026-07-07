"use client";

import { notFound } from "next/navigation";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { findPaper } from "@/lib/content";
import { addViewed } from "@/lib/session";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import ChatPanel from "@/components/ChatPanel";

// Screens 4a/4b — paper detail. Selecting text in the article surfaces an
// "Ask about this" button; opening it splits the screen (bottom sheet on
// mobile) and starts a conversation scoped to the highlighted passage.
export default function PaperPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const found = findPaper(slug);

  const [chatOpen, setChatOpen] = useState(false);
  const [selection, setSelection] = useState<string | null>(null);
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

  function openChat(withText: string | null) {
    setSelection(withText);
    setAskButton(null);
    setChatOpen(true);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div
        className={`flex flex-1 ${chatOpen ? "md:grid md:grid-cols-[1fr_420px]" : ""}`}
      >
        {/* ——— The paper ——— */}
        <main
          className={`min-w-0 flex-1 overflow-y-auto px-5 pb-32 md:px-10 ${
            chatOpen ? "md:h-[calc(100vh-73px)] md:border-r md:border-neutral-900" : ""
          }`}
        >
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

            <Reveal delay={280}>
              <div className="mt-12 space-y-10">
                {paper.sections.map((section) => (
                  <section key={section.heading} className="group/section relative">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="font-serif text-2xl">{section.heading}</h2>
                      {/* Inline fallback so the split screen can be opened
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
                ))}
              </div>
            </Reveal>

            {/* Floating "Ask about this" that follows a text selection */}
            {askButton && !chatOpen && (
              <button
                onClick={() => openChat(askButton.text)}
                style={{ left: askButton.x, top: askButton.y }}
                className="absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-neutral-900 px-4 py-2 text-sm text-white shadow-lg hover:bg-neutral-700 transition-colors"
              >
                Ask about this ↗
              </button>
            )}
          </div>

          {/* Persistent affordance when nothing is selected */}
          {!chatOpen && (
            <button
              onClick={() => openChat(null)}
              className="fixed bottom-6 right-6 z-10 flex items-center gap-2 rounded-full border border-neutral-900 bg-white px-5 py-3 text-sm shadow-lg hover:bg-neutral-900 hover:text-white transition-colors"
            >
              <span className="font-serif italic text-base">Ask</span> about this paper
            </button>
          )}
        </main>

        {/* ——— The chat: right split on desktop, bottom sheet on mobile ——— */}
        {chatOpen && (
          <>
            {/* Mobile scrim */}
            <div
              className="fixed inset-0 z-20 bg-black/30 md:hidden"
              onClick={() => setChatOpen(false)}
            />
            <div className="fixed inset-x-0 bottom-0 z-30 h-[72vh] rounded-t-3xl border-t border-neutral-900 bg-white shadow-2xl md:static md:z-auto md:h-[calc(100vh-73px)] md:rounded-none md:border-t-0 md:shadow-none">
              <ChatPanel
                paper={paper}
                selection={selection}
                onClose={() => setChatOpen(false)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
