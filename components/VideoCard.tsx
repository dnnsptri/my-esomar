"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import type { Video } from "@/lib/content";
import { MediaModal, PatternArt, PlayGlyph } from "@/components/MediaArt";

export default function VideoCard({ video }: { video: Video }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="group block w-full cursor-pointer text-left"
        onClick={() => setOpen(true)}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-neutral-900 bg-white">
          <PatternArt pattern={video.pattern} />
          <span className="absolute inset-0 flex items-center justify-center">
            <PlayGlyph />
          </span>
        </div>
        <h3 className="mt-3 font-serif text-xl leading-snug underline-offset-4 group-hover:underline">
          {video.title}
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          {video.event} · {video.duration}
        </p>
      </button>
      {/* Portal to <body>: the cards sit inside a Reveal wrapper whose
          entrance animation leaves a transform behind, which would trap
          this fixed-position overlay inside the card grid. */}
      {open &&
        createPortal(
          <MediaModal
            title={video.title}
            meta={`${video.event} · ${video.duration}`}
            pattern={video.pattern}
            onClose={() => setOpen(false)}
          />,
          document.body
        )}
    </>
  );
}
