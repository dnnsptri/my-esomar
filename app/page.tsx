"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { setUser } from "@/lib/session";
import Wordmark from "@/components/Wordmark";
import Reveal from "@/components/Reveal";

// Screen 1 — fake login. Credentials are prefilled for Aurélie and any
// password works; submitting just stores the user and moves on.
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("aurelie.reynier@insightlab.fr");
  const [password, setPassword] = useState("••••••••••");
  const [signingIn, setSigningIn] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSigningIn(true);
    setUser({
      firstName: "Aurélie",
      lastName: "Reynier",
      email,
    });
    // Brief pause so the button state reads as a real sign-in
    setTimeout(() => router.push("/home"), 450);
  }

  return (
    <main className="flex flex-1 items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <Reveal className="text-center">
          <Wordmark size="lg" />
          <p className="mt-3 text-sm text-neutral-500">
            The member portal for the global insights community
          </p>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={submit} className="mt-10 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-500">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-xl border border-neutral-900 bg-white px-4 outline-none focus:shadow-[0_0_0_1px_#111] transition-shadow"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-500">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-xl border border-neutral-900 bg-white px-4 outline-none focus:shadow-[0_0_0_1px_#111] transition-shadow"
              />
            </label>
            <button
              type="submit"
              disabled={signingIn}
              className="h-12 w-full rounded-xl bg-neutral-900 font-medium text-white hover:bg-neutral-700 disabled:opacity-60 transition-colors"
            >
              {signingIn ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </Reveal>

        <Reveal delay={240}>
          <p className="mt-6 text-center text-xs text-neutral-400">
            Signing in as{" "}
            <span className="font-serif italic text-sm text-neutral-600">
              Aurélie Reynier
            </span>{" "}
            · demo
          </p>
        </Reveal>
      </div>
    </main>
  );
}
