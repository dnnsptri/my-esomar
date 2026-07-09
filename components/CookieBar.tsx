"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const KEY = "myesomar.cookies";

// Simplest possible consent bar: one line, one button, dismissal remembered
// in localStorage. Functional cookies only, so there's nothing to opt out of.
export default function CookieBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  // Re-check on every navigation, not just mount: "reset demo" clears the
  // consent key and returns to login, and the bar should come back then.
  useEffect(() => {
    try {
      setVisible(!localStorage.getItem(KEY));
    } catch {
      /* private mode — just show it */
      setVisible(true);
    }
  }, [pathname]);

  // Don't cover the disclaimer page the bar links to.
  if (!visible || pathname === "/disclaimer") return null;

  const accept = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-neutral-900 bg-white px-5 py-3">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-neutral-600">
          This demo uses only functional cookies to remember your session.{" "}
          <Link href="/disclaimer" className="underline underline-offset-2 hover:text-neutral-900">
            Learn more
          </Link>
        </p>
        <button
          onClick={accept}
          className="shrink-0 rounded-full bg-neutral-900 px-5 py-2 text-sm text-white transition-colors hover:bg-neutral-700"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
