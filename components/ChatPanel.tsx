"use client";

import { useEffect, useRef, useState } from "react";
import type { Paper } from "@/lib/content";

type Message = { role: "user" | "assistant"; content: string };

// Split-screen "Ask" panel. Streams answers from /api/chat — the endpoint
// decides whether the answer is scripted (demo mode) or a real LLM call,
// so this component never changes when the API key is added.
export default function ChatPanel({
  paper,
  selection,
  onClose,
}: {
  paper: Paper;
  selection: string | null;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentSelectionRef = useRef(false);

  // Keep the newest message in view while streaming
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || streaming) return;

    const history: Message[] = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    // Only attach the highlighted passage to the first question — after
    // that the conversation is about the whole paper.
    const attachSelection = selection && !sentSelectionRef.current ? selection : null;
    sentSelectionRef.current = true;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          paperSlug: paper.slug,
          selection: attachSelection,
        }),
      });
      if (!res.ok || !res.body) throw new Error(`chat failed: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        const current = answer;
        setMessages([...history, { role: "assistant", content: current }]);
      }
    } catch {
      setMessages([
        ...history,
        { role: "assistant", content: "Something went wrong — please try again." },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  const suggestions = [
    "Summarise this for me",
    "How was this studied?",
    "What are the limitations?",
  ];

  return (
    <aside className="flex h-full flex-col bg-white">
      {/* Panel header */}
      <div className="flex items-center justify-between border-b border-neutral-900 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-neutral-500">Ask</p>
          <p className="font-serif italic text-lg leading-tight line-clamp-1">{paper.title}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {selection && (
          <blockquote className="border-l-2 border-neutral-900 pl-3 text-sm italic text-neutral-600">
            “{selection.length > 220 ? `${selection.slice(0, 220)}…` : selection}”
          </blockquote>
        )}

        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-sm text-neutral-500">
              {selection
                ? "Ask anything about the passage you highlighted, or the paper as a whole."
                : "Ask anything about this paper."}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm hover:border-neutral-900 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => {
          const isLast = i === messages.length - 1;
          const showCaret = isLast && m.role === "assistant" && streaming;
          return m.role === "user" ? (
            <p key={i} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-neutral-900 px-4 py-2.5 text-sm text-white">
              {m.content}
            </p>
          ) : (
            <p
              key={i}
              className={`text-sm leading-relaxed whitespace-pre-wrap ${showCaret ? "caret" : ""}`}
            >
              {m.content}
            </p>
          );
        })}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-neutral-900 p-4"
      >
        <div className="flex items-center gap-2 rounded-full border border-neutral-900 pl-4 pr-1.5 h-11 focus-within:shadow-[0_0_0_1px_#111] transition-shadow">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this paper…"
            autoFocus
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
          <button
            type="submit"
            disabled={streaming}
            aria-label="Send"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-neutral-700 disabled:opacity-40 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M8 13V3M8 3L3.5 7.5M8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </form>
    </aside>
  );
}
