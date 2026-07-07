import type { Video } from "@/lib/content";

// Generated monochrome thumbnails (no external images, per the b&w brief).
// Each pattern is a small inline SVG so thumbnails stay distinct.
function Thumb({ pattern }: { pattern: Video["pattern"] }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-neutral-900 bg-white">
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        {pattern === "circles" && (
          <g stroke="#111" strokeWidth="1" fill="none">
            {[12, 28, 44, 60, 76, 92, 108].map((r) => (
              <circle key={r} cx="50%" cy="50%" r={r} />
            ))}
          </g>
        )}
        {pattern === "lines" && (
          <g stroke="#111" strokeWidth="1">
            {Array.from({ length: 18 }, (_, i) => (
              <line key={i} x1={i * 24} y1="0" x2={i * 24 - 60} y2="100%" />
            ))}
          </g>
        )}
        {pattern === "dots" && (
          <g fill="#111">
            {Array.from({ length: 8 }, (_, row) =>
              Array.from({ length: 14 }, (_, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={col * 26 + 14}
                  cy={row * 24 + 12}
                  r={1.6}
                />
              ))
            )}
          </g>
        )}
      </svg>
      {/* Play glyph */}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white transition-transform group-hover:scale-110">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
            <path d="M4 2.5v9l7.5-4.5L4 2.5z" />
          </svg>
        </span>
      </span>
    </div>
  );
}

export default function VideoCard({ video }: { video: Video }) {
  return (
    <article className="group cursor-pointer">
      <Thumb pattern={video.pattern} />
      <h3 className="mt-3 font-serif text-xl leading-snug group-hover:underline underline-offset-4">
        {video.title}
      </h3>
      <p className="mt-1 text-sm text-neutral-500">
        {video.event} · {video.duration}
      </p>
    </article>
  );
}
