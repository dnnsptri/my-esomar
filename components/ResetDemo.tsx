"use client";

import { useRouter } from "next/navigation";
import { clearAll } from "@/lib/session";

// Persistent demo reset, bottom-left on every page. Clears the fake session
// and history, then returns to the login screen so the flow can be run again
// from the top mid-presentation.
export default function ResetDemo() {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        clearAll();
        router.push("/");
      }}
      className="fixed bottom-5 left-5 z-40 text-xs text-neutral-300 transition-colors hover:text-neutral-600"
    >
      reset demo
    </button>
  );
}
