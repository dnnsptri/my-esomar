"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Paper } from "@/lib/content";
import ChatPanel from "./ChatPanel";

// The conversational agent floats over the app as a layer, it never
// reframes the page. Closed by default: only an "Ask me" pill in the
// bottom-right corner. Open: a floating card on the right (~1/4 of the
// viewport on desktop, like a browser side panel; bottom sheet on mobile).
// Pages talk to it through useChat().

type ChatContextValue = {
  // Scope the conversation to a paper (or null for the general assistant),
  // hand over a highlighted passage, and open the panel.
  askAbout: (paper: Paper | null, selection: string | null) => void;
  // Quietly change what the panel is scoped to (e.g. on page navigation)
  // without opening anything or attaching a passage.
  setScope: (paper: Paper | null) => void;
  // Open the panel and immediately send `question` as the first message —
  // the home search bar uses this to answer conversationally in place.
  ask: (question: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>");
  return ctx;
}

export default function ChatProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [selection, setSelection] = useState<string | null>(null);
  // Bumped on every askAbout so the panel notices repeat selections
  const [selectionKey, setSelectionKey] = useState(0);
  // A question to auto-send when the panel opens (from the home search bar)
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [askKey, setAskKey] = useState(0);
  const [open, setOpen] = useState(false);
  // Bumped to remount ChatPanel and wipe its conversation on demo reset.
  const [chatKey, setChatKey] = useState(0);

  // "reset demo" navigates back to login ("/") — close the chat window and
  // clear the conversation so the next run starts clean.
  useEffect(() => {
    if (pathname === "/") {
      setOpen(false);
      setChatKey((k) => k + 1);
    }
  }, [pathname]);

  const askAbout = useCallback((p: Paper | null, sel: string | null) => {
    setPaper(p);
    setSelection(sel);
    setSelectionKey((k) => k + 1);
    setOpen(true);
  }, []);

  const setScope = useCallback((p: Paper | null) => setPaper(p), []);

  const ask = useCallback((question: string) => {
    setPaper(null); // general assistant, no paper in scope
    setPendingQuestion(question);
    setAskKey((k) => k + 1);
    setOpen(true);
  }, []);

  // Hide the floating "Ask me" pill where it doesn't belong: on login (no
  // session yet) and on home (the center search bar is the opener there).
  const hidePill = pathname === "/" || pathname === "/home";

  return (
    <ChatContext.Provider value={{ askAbout, setScope, ask }}>
      {/* flex + flex-col here mirrors what <body> used to provide directly:
          several pages (login, home, search) have a root `<main
          className="flex-1 ...">` that relies on being a flex-column child
          to fill and center within the viewport. A plain block div here
          breaks that — flex-1 does nothing without a flex parent — so this
          wrapper has to keep the same flex context, not just the same
          height. Padding (not a grid column) keeps the chat panel itself
          floating free of the page frame when open. */}
      <div
        className={`flex min-h-screen flex-col transition-[padding] duration-300 ease-out ${
          open ? "lg:pr-[calc(25vw+3rem)]" : ""
        }`}
      >
        {children}
      </div>

      {/* Closed: just the entry point, always within reach — except on the
          home page, where the center search bar is the conversation opener */}
      {!open && !hidePill && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-neutral-900 bg-white px-5 py-3 text-sm shadow-lg transition-colors hover:bg-neutral-900 hover:text-white"
        >
          <span className="font-serif italic text-base">Ask</span> me
        </button>
      )}

      {/* Mobile scrim behind the bottom sheet */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* The panel stays mounted while hidden so the conversation
          survives closing and reopening. Mobile = bottom sheet,
          desktop = floating card, detached from every edge. */}
      <div
        className={`${
          open ? "fade-up" : "hidden"
        } fixed inset-x-0 bottom-0 z-50 h-[72vh] overflow-hidden rounded-t-3xl border-t border-neutral-900 bg-white shadow-2xl lg:inset-x-auto lg:bottom-6 lg:right-6 lg:top-6 lg:h-auto lg:w-[25vw] lg:min-w-[340px] lg:rounded-2xl lg:border lg:border-neutral-900`}
      >
        <ChatPanel
          key={chatKey}
          paper={paper}
          selection={selection}
          selectionKey={selectionKey}
          initialQuestion={pendingQuestion}
          askKey={askKey}
          onClose={() => setOpen(false)}
        />
      </div>
    </ChatContext.Provider>
  );
}
