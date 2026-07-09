"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Demo-only "QR" — a generated black & white pattern that reads as a QR
// code but encodes nothing. Tapping it just navigates to the questionnaire
// (at a real stand a scannable code would point phones to /survey). Kept
// deterministic (integer hash, no Math.random) so server and client render
// the same modules — no hydration mismatch.
const N = 25; // modules per side, like a small QR grid

// The three corner "finder" squares that make a QR recognisable: a 7×7
// ring with a 3×3 solid core.
function finderPixel(rr: number, cc: number): boolean {
  const onRing = rr === 0 || rr === 6 || cc === 0 || cc === 6;
  const inCore = rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4;
  return onRing || inCore;
}

// The smaller 5×5 alignment square near the bottom-right of real QR codes.
function alignmentPixel(rr: number, cc: number): boolean {
  const onRing = rr === 0 || rr === 4 || cc === 0 || cc === 4;
  const center = rr === 2 && cc === 2;
  return onRing || center;
}

// Deterministic pseudo-random data fill (~48% black), stable across renders.
function dataBit(r: number, c: number): boolean {
  let h = (r * 73856093) ^ (c * 19349663);
  h = (h ^ (h >>> 13)) >>> 0;
  return h % 100 < 48;
}

// null = forced white (separators/quiet gaps), true/false = module colour
function moduleFilled(r: number, c: number): boolean | null {
  const regions: Array<[number, number, (rr: number, cc: number) => boolean, number]> = [
    [0, 0, finderPixel, 7], // top-left finder
    [0, N - 7, finderPixel, 7], // top-right finder
    [N - 7, 0, finderPixel, 7], // bottom-left finder
    [N - 9, N - 9, alignmentPixel, 5], // alignment square
  ];
  for (const [r0, c0, fn, size] of regions) {
    // one-module white separator ring around each pattern
    if (r >= r0 - 1 && r < r0 + size + 1 && c >= c0 - 1 && c < c0 + size + 1) {
      if (r >= r0 && r < r0 + size && c >= c0 && c < c0 + size) {
        return fn(r - r0, c - c0);
      }
      return false; // separator gap
    }
  }
  return dataBit(r, c);
}

function FakeQR({ className = "" }: { className?: string }) {
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (moduleFilled(r, c) === true) {
        cells.push(<rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} />);
      }
    }
  }
  return (
    // Quiet zone via a 2-module margin around the N×N grid
    <svg viewBox={`${-2} ${-2} ${N + 4} ${N + 4}`} className={className} aria-hidden>
      <rect x={-2} y={-2} width={N + 4} height={N + 4} fill="#fff" />
      <g fill="#111" shapeRendering="crispEdges">
        {cells}
      </g>
    </svg>
  );
}

export default function SurveyQR() {
  const pathname = usePathname();
  // Hide on the questionnaire itself and on the bare login screen
  if (pathname?.startsWith("/survey") || pathname === "/") return null;

  return (
    <Link
      href="/survey"
      aria-label="Share your feedback"
      title="Share your feedback"
      className="fixed bottom-5 left-1/2 z-40 h-14 w-14 -translate-x-1/2 overflow-hidden rounded-lg border border-neutral-900 bg-white p-1 shadow-lg transition-transform hover:-translate-y-0.5"
    >
      <FakeQR className="h-full w-full" />
    </Link>
  );
}
