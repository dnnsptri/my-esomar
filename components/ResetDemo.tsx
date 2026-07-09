"use client";

import { useRouter, usePathname } from "next/navigation";
import { clearAll } from "@/lib/session";

// Persistent demo reset on every page. In normal flow, centered at the
// bottom — on pages that show the feedback QR it lands directly under it.
// Clears the fake session and history, then returns to the login screen so
// the flow can be run again from the top mid-presentation.
export default function ResetDemo() {
  const router = useRouter();
  const pathname = usePathname();
  // Nothing to reset before signing in — hide on the login screen.
  if (pathname === "/") return null;
  return (
    <div className="flex justify-center px-5 pb-8 pt-3">
      <button
        onClick={() => {
          clearAll();
          router.push("/");
        }}
        className="text-xs text-neutral-300 transition-colors hover:text-neutral-600"
      >
        reset demo
      </button>
    </div>
  );
}
