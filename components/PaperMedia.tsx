"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import type { Paper, PaperMediaKind, PaperSection } from "@/lib/content";
import { MediaModal, PatternArt, PlayGlyph } from "@/components/MediaArt";

// Static figure — pure imagery, no player, no controls. Just a generated
// illustration dropped into the body like an editorial diagram.
function PaperFigureBlock({ paper, sectionHeading }: { paper: Paper; sectionHeading?: string }) {
  return (
    <figure className="my-10">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-neutral-900 bg-white">
        <PatternArt pattern={paper.pattern} />
      </div>
      <figcaption className="mt-2 text-xs text-neutral-500">
        Fig. — generated illustration{sectionHeading ? `, “${sectionHeading}”` : ""}
      </figcaption>
    </figure>
  );
}

// "Watch" — a video-style trigger. This is the only block that opens the
// video-look modal; it's about the paper as a whole (a walkthrough), not
// a specific passage.
function PaperWatchBlock({ paper, sectionHeading }: { paper: Paper; sectionHeading?: string }) {
  const [open, setOpen] = useState(false);
  const label = sectionHeading ? `Watch: ${sectionHeading}, walked through` : `Watch: ${paper.title}`;

  return (
    <div className="my-10">
      <button
        onClick={() => setOpen(true)}
        className="group flex w-full items-center gap-4 rounded-2xl border border-neutral-900 p-3 text-left transition-colors hover:bg-neutral-900 hover:text-white"
      >
        <span className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-current">
          <PatternArt pattern={paper.pattern} />
          <span className="absolute inset-0 flex items-center justify-center">
            <PlayGlyph size="h-8 w-8" />
          </span>
        </span>
        <span className="min-w-0">
          <span className="block font-serif text-lg italic leading-snug">{label}</span>
          <span className="block text-sm text-neutral-500 group-hover:text-neutral-300">
            {paper.videoDuration} · generated walkthrough
          </span>
        </span>
      </button>
      {open &&
        createPortal(
          <MediaModal
            title={paper.title}
            meta={`Video walkthrough · ${paper.videoDuration}`}
            pattern={paper.pattern}
            onClose={() => setOpen(false)}
          />,
          document.body
        )}
    </div>
  );
}

// "Listen" — about this page's content, not a companion to the video.
// It quotes the actual paragraph it sits next to, so it reads as "hear
// this passage" rather than "audio version of the clip above." Visually
// distinct from Watch: a compact row with a waveform badge, not a video
// thumbnail.
function PaperListenBlock({ paper, section }: { paper: Paper; section?: PaperSection }) {
  const [open, setOpen] = useState(false);
  const quote = section ? section.paragraphs[0] : paper.abstract;
  const label = section ? `Listen: “${section.heading}”` : "Listen to the abstract";
  const meta = `Narrating “${section ? section.heading : "Abstract"}” · ${paper.audioDuration}`;

  return (
    <div className="my-10 rounded-2xl border border-neutral-900 p-4">
      <button onClick={() => setOpen(true)} className="flex w-full items-center gap-3 text-left">
        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-neutral-900">
          <PatternArt pattern="bars" />
        </span>
        <span className="min-w-0">
          <span className="block text-xs uppercase tracking-[0.15em] text-neutral-500">
            {label} · {paper.audioDuration}
          </span>
          <span className="mt-0.5 block truncate font-serif italic text-neutral-700">
            “{quote.length > 100 ? `${quote.slice(0, 100)}…` : quote}”
          </span>
        </span>
      </button>
      {open &&
        createPortal(
          <MediaModal title={paper.title} meta={meta} pattern="bars" onClose={() => setOpen(false)} />,
          document.body
        )}
    </div>
  );
}

// Dispatcher used by the paper page to drop the right block at each
// computed placement (see paperMediaPlacements in lib/content.ts).
export default function PaperMediaBlock({
  kind,
  paper,
  section,
}: {
  kind: PaperMediaKind;
  paper: Paper;
  section?: PaperSection;
}) {
  if (kind === "image") return <PaperFigureBlock paper={paper} sectionHeading={section?.heading} />;
  if (kind === "video") return <PaperWatchBlock paper={paper} sectionHeading={section?.heading} />;
  return <PaperListenBlock paper={paper} section={section} />;
}
