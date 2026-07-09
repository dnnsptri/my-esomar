"use client";

import { useEffect, useState } from "react";
import type { MediaPattern } from "@/lib/content";

// The "media" is the illustration itself: static as a thumbnail/hero,
// animated inside the modal player. Modes:
//   static  — plain artwork (thumbnail, hero, or modal before first play)
//   playing — CSS animations running
//   paused  — animations frozen mid-frame (a freeze-frame, like real media)
type ArtMode = "static" | "playing" | "paused";

// Deterministic pseudo-randomness for the "bars" waveform. Rounded to 2
// decimals — raw Math.sin output can differ in its last bit between the
// server (Node) and client (browser) JS engines, which is enough for
// React to flag a hydration mismatch on the SVG height attribute.
function barHeight(i: number): number {
  const raw = 10 + Math.abs(Math.sin(i * 0.9) * 0.6 + Math.sin(i * 2.3) * 0.4) * 70;
  return Math.round(raw * 100) / 100;
}

// Generated monochrome artwork (no external images, per the b&w brief).
// viewBox is 16:9 so it maps 1:1 onto aspect-video containers, and scales
// (via preserveAspectRatio) onto the wider aspect-[21/9] paper hero too.
export function PatternArt({
  pattern,
  mode = "static",
}: {
  pattern: MediaPattern;
  mode?: ArtMode;
}) {
  const animate = mode !== "static";
  const playState = mode === "playing" ? "running" : "paused";

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {pattern === "circles" && (
        <g stroke="#111" strokeWidth="1" fill="none">
          {[12, 28, 44, 60, 76, 92, 108].map((r, i) => (
            <circle
              key={r}
              cx="200"
              cy="112.5"
              r={r}
              className={animate ? "pattern-ring" : undefined}
              // Negative delays start the ripple mid-cycle instead of in sync
              style={
                animate
                  ? { animationDelay: `${i * -0.35}s`, animationPlayState: playState }
                  : undefined
              }
            />
          ))}
        </g>
      )}
      {pattern === "lines" && (
        <g
          stroke="#111"
          strokeWidth="1"
          className={animate ? "pattern-lines" : undefined}
          style={animate ? { animationPlayState: playState } : undefined}
        >
          {/* Extra lines left of the viewBox so the 24px drift loops seamlessly */}
          {Array.from({ length: 20 }, (_, i) => {
            const x = (i - 2) * 24;
            return <line key={i} x1={x} y1="0" x2={x - 60} y2="225" />;
          })}
        </g>
      )}
      {pattern === "dots" && (
        <g fill="#111">
          {Array.from({ length: 9 }, (_, row) =>
            Array.from({ length: 15 }, (_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={col * 26 + 14}
                cy={row * 24 + 12}
                r={1.8}
                className={animate ? "pattern-dot" : undefined}
                // Delay by row+col so the pulse sweeps diagonally as a wave
                style={
                  animate
                    ? {
                        animationDelay: `${(row + col) * -0.15}s`,
                        animationPlayState: playState,
                      }
                    : undefined
                }
              />
            ))
          )}
        </g>
      )}
      {pattern === "bars" && (
        <g fill="#111">
          {Array.from({ length: 32 }, (_, i) => {
            const x = i * 12 + 8;
            const h = barHeight(i);
            const y = Math.round((112.5 - h / 2) * 100) / 100;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width="6"
                height={h}
                rx="3"
                className={animate ? "pattern-bar" : undefined}
                style={
                  animate
                    ? {
                        transformBox: "fill-box",
                        transformOrigin: "center",
                        animationDelay: `${i * -0.09}s`,
                        animationPlayState: playState,
                      }
                    : undefined
                }
              />
            );
          })}
        </g>
      )}
    </svg>
  );
}

export function PlayGlyph({ size = "h-12 w-12" }: { size?: string }) {
  return (
    <span
      className={`flex ${size} items-center justify-center rounded-full bg-neutral-900 text-white transition-transform group-hover:scale-110`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
        <path d="M4 2.5v9l7.5-4.5L4 2.5z" />
      </svg>
    </span>
  );
}

// Shown over the canvas only on hover while playing — like any real player,
// controls stay out of the way of the moving artwork until you reach for them.
export function PauseGlyph({ size = "h-16 w-16" }: { size?: string }) {
  return (
    <span
      className={`flex ${size} items-center justify-center rounded-full bg-neutral-900 text-white transition-transform group-hover:scale-110`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
        <rect x="3" y="2.5" width="3" height="9" />
        <rect x="8" y="2.5" width="3" height="9" />
      </svg>
    </span>
  );
}

// Generic overlay player, shared by video cards and the paper media rail
// (both "Watch" and "Listen"). Click the canvas (or the play glyph) to
// toggle play/pause. Playing animates the illustration and advances the
// progress bar — there is no real footage or audio, the moving artwork
// (or waveform) *is* the media.
export function MediaModal({
  title,
  meta,
  pattern,
  onClose,
}: {
  title: string;
  meta: string;
  pattern: MediaPattern;
  onClose: () => void;
}) {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Esc closes; body scroll locks while the overlay is up
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const mode: ArtMode = !started ? "static" : playing ? "playing" : "paused";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop — clicking it closes the modal */}
      <button
        className="absolute inset-0 cursor-default bg-neutral-900/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
        tabIndex={-1}
      />

      <div className="fade-up relative w-full max-w-3xl rounded-2xl border border-neutral-900 bg-white p-4 md:p-5">
        {/* Close button, floating on the panel corner */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -right-3 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-900 bg-white text-neutral-900 transition-transform hover:scale-110"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M1 1l10 10M11 1L1 11" />
          </svg>
        </button>

        {/* Player canvas */}
        <button
          className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-xl border border-neutral-900 bg-white"
          onClick={() => {
            setStarted(true);
            setPlaying((p) => !p);
          }}
          aria-label={playing ? "Pause" : "Play"}
        >
          <PatternArt pattern={pattern} mode={mode} />
          {playing ? (
            <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <PauseGlyph size="h-16 w-16" />
            </span>
          ) : (
            <span className="absolute inset-0 flex items-center justify-center">
              <PlayGlyph size="h-16 w-16" />
            </span>
          )}
        </button>

        {/* Progress bar — starts on first play, freezes while paused */}
        <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className={`h-full bg-neutral-900 ${started ? "progress-fill" : "w-0"}`}
            style={
              started ? { animationPlayState: playing ? "running" : "paused" } : undefined
            }
          />
        </div>

        <div className="mt-3">
          <h3 className="font-serif text-2xl leading-snug">{title}</h3>
          <p className="mt-1 text-sm text-neutral-500">{meta}</p>
        </div>
      </div>
    </div>
  );
}
