"use client";

import { useEffect, useRef, useState } from "react";
import type { Paper } from "@/lib/content";

type Message = { role: "user" | "assistant"; content: string };

// The persistent "Ask" panel (see ChatProvider for where it lives).
// Streams answers from /api/chat — the endpoint decides whether the answer
// is scripted (demo mode) or a real LLM call, so this component never
// changes when the API key is added.
//
// `paper` scopes the conversation; null means the general portal assistant.
// `selection` + `selectionKey` hand over a highlighted passage: the passage
// is quoted in the panel and attached to the next question only.
// `initialQuestion` + `askKey` auto-send a first message when the panel is
// opened from the home search bar (conversational, Google-AI-mode style).
export default function ChatPanel({
  paper,
  selection,
  selectionKey,
  initialQuestion,
  askKey = 0,
  onClose,
}: {
  paper: Paper | null;
  selection: string | null;
  selectionKey: number;
  initialQuestion?: string | null;
  askKey?: number;
  onClose?: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  // Passage waiting to be attached to the next question
  const [pending, setPending] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Guards the auto-send effect so a given ask fires exactly once
  const lastAskRef = useRef(0);

  // A new selection arrived from a page → quote it and focus the composer
  useEffect(() => {
    if (selectionKey === 0) return;
    setPending(selection);
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectionKey]);

  // The home search bar handed us a question → send it as the next message,
  // building up the conversation.
  useEffect(() => {
    if (!askKey || askKey === lastAskRef.current) return;
    lastAskRef.current = askKey;
    if (initialQuestion && initialQuestion.trim()) send(initialQuestion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [askKey]);

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

    // Attach the highlighted passage to this question only — after that
    // the conversation is about the paper (or portal) as a whole.
    const attachSelection = pending;
    setPending(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          paperSlug: paper?.slug ?? null,
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

  const suggestions = paper
    ? ["Summarise this for me", "How was this studied?", "What are the limitations?"]
    : ["What's new in AI and market research?", "Recommend a paper to read", "What is Esomar?"];

  return (
    <aside className="flex h-full flex-col bg-white">
      {/* Panel header */}
      <div className="flex items-center justify-between border-b border-neutral-900 px-5 py-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.15em] text-neutral-500">Ask</p>
          <p className="font-serif italic text-lg leading-tight line-clamp-1">
            {paper ? paper.title : "my Esomar assistant"}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close chat"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.length === 0 && !pending && (
          <div className="space-y-2">
            <p className="text-sm text-neutral-500">
              {paper
                ? "Ask anything about this paper, or highlight a passage to ask about it."
                : "Ask anything — papers, videos, companies, or the industry at large."}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm transition-colors hover:border-neutral-900"
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

        {/* Passage queued for the next question */}
        {pending && (
          <blockquote className="border-l-2 border-neutral-900 pl-3 text-sm italic text-neutral-600">
            “{pending.length > 220 ? `${pending.slice(0, 220)}…` : pending}”
            <span className="mt-1 block not-italic text-xs text-neutral-400">
              Attached to your next question
            </span>
          </blockquote>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-neutral-900 p-4"
      >
        <div className="flex h-11 items-center gap-2 rounded-full border border-neutral-900 pl-4 pr-1.5 transition-shadow focus-within:shadow-[0_0_0_1px_#111]">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={paper ? "Ask about this paper…" : "Ask me anything…"}
            // text-base (16px) avoids iOS auto-zoom when the field is focused
            className="flex-1 bg-transparent text-base outline-none placeholder:text-neutral-400"
          />
          <button
            type="submit"
            disabled={streaming}
            aria-label="Send"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-neutral-700 disabled:opacity-40"
          >
            {/* "?" — matches the home search bar's ask button */}
            <span className="text-base font-semibold leading-none">?</span>
          </button>
        </div>
      </form>
    </aside>
  );
}
