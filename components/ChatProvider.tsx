"use client";

import { createContext, useCallback, useContext, useState } from "react";
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
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>");
  return ctx;
}

export default function ChatProvider({ children }: { children: React.ReactNode }) {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [selection, setSelection] = useState<string | null>(null);
  // Bumped on every askAbout so the panel notices repeat selections
  const [selectionKey, setSelectionKey] = useState(0);
  const [open, setOpen] = useState(false);

  const askAbout = useCallback((p: Paper | null, sel: string | null) => {
    setPaper(p);
    setSelection(sel);
    setSelectionKey((k) => k + 1);
    setOpen(true);
  }, []);

  const setScope = useCallback((p: Paper | null) => setPaper(p), []);

  return (
    <ChatContext.Provider value={{ askAbout, setScope }}>
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

      {/* Closed: just the entry point, always within reach */}
      {!open && (
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
          paper={paper}
          selection={selection}
          selectionKey={selectionKey}
          onClose={() => setOpen(false)}
        />
      </div>
    </ChatContext.Provider>
  );
}
