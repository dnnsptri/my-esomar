"use client";

import Link from "next/link";
import { useState } from "react";
import Wordmark from "@/components/Wordmark";
import Reveal from "@/components/Reveal";

// Screen 6 — member feedback questionnaire, reached by "scanning" the demo
// QR (see components/SurveyQR.tsx). Mobile-first: it's meant to open on an
// attendee's phone at the Esomar stand. Demo only — nothing is sent
// anywhere; on submit we mint a random code they'd redeem at the stand.

// Ambiguous characters (0/O, 1/I) left out so a code is easy to read aloud.
function makeCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `ESO-${code}`;
}

type Fields = {
  likes: string;
  dislikes: string;
  ideas: string;
  name: string;
  email: string;
  organisation: string;
  role: string;
};

const EMPTY: Fields = {
  likes: "",
  dislikes: "",
  ideas: "",
  name: "",
  email: "",
  organisation: "",
  role: "",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-neutral-900 bg-white px-4 py-3 text-base outline-none transition-shadow focus:shadow-[0_0_0_1px_#111]";

export default function SurveyPage() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [code, setCode] = useState<string | null>(null);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  // Require at least one substantive answer so the code means something
  const hasContent =
    fields.likes.trim() || fields.dislikes.trim() || fields.ideas.trim();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasContent) return;
    setCode(makeCode());
    // Scroll the success state into view on small screens
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-20">
      <div className="flex justify-center py-6">
        <Link href="/home" className="transition-opacity hover:opacity-60">
          <Wordmark />
        </Link>
      </div>

      {code ? (
        /* ——— Success: the redeemable code ——— */
        <Reveal className="mt-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Thank you
          </p>
          <h1 className="mt-3 font-serif text-3xl leading-tight">
            Your feedback is in.
          </h1>
          <p className="mt-3 text-neutral-600">
            Show this code at the <span className="font-serif italic">Esomar</span> stand
            to claim your refresher.
          </p>

          <div className="mt-8 rounded-2xl border border-neutral-900 p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Your code
            </p>
            <p className="mt-2 font-mono text-4xl font-semibold tracking-[0.2em]">
              {code}
            </p>
          </div>

          <p className="mt-6 text-xs text-neutral-400">
            Demo only — no data leaves this device.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => {
                setFields(EMPTY);
                setCode(null);
              }}
              className="rounded-xl border border-neutral-900 px-5 py-3 text-sm transition-colors hover:bg-neutral-900 hover:text-white"
            >
              Submit another response
            </button>
            <Link
              href="/home"
              className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
            >
              Back to my Esomar
            </Link>
          </div>
        </Reveal>
      ) : (
        /* ——— The questionnaire ——— */
        <form onSubmit={submit}>
          <Reveal>
            <h1 className="font-serif text-3xl leading-tight">
              Tell us what you think
            </h1>
            <p className="mt-2 text-neutral-600">
              A minute of your time shapes where <span className="font-serif italic">my Esomar</span> goes
              next. Complete it and get a code for a refresher at the stand.
            </p>
          </Reveal>

          <Reveal delay={120} className="mt-8 space-y-6">
            <Field label="What do you like?">
              <textarea
                value={fields.likes}
                onChange={set("likes")}
                rows={3}
                placeholder="What works well for you…"
                className={inputCls}
              />
            </Field>
            <Field label="What's missing or frustrating?">
              <textarea
                value={fields.dislikes}
                onChange={set("dislikes")}
                rows={3}
                placeholder="What you'd change…"
                className={inputCls}
              />
            </Field>
            <Field label="Ideas or additions you'd love to see">
              <textarea
                value={fields.ideas}
                onChange={set("ideas")}
                rows={3}
                placeholder="Anything you wish existed…"
                className={inputCls}
              />
            </Field>
          </Reveal>

          <Reveal delay={200} className="mt-8">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Your details
            </p>
            <div className="mt-4 space-y-4">
              <Field label="Name">
                <input value={fields.name} onChange={set("name")} className={inputCls} />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={fields.email}
                  onChange={set("email")}
                  className={inputCls}
                />
              </Field>
              <Field label="Organisation">
                <input
                  value={fields.organisation}
                  onChange={set("organisation")}
                  className={inputCls}
                />
              </Field>
              <Field label="Role">
                <input value={fields.role} onChange={set("role")} className={inputCls} />
              </Field>
            </div>
          </Reveal>

          <Reveal delay={280} className="mt-8">
            <button
              type="submit"
              disabled={!hasContent}
              className="h-12 w-full rounded-xl bg-neutral-900 font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-40"
            >
              Send feedback & get my code
            </button>
            {!hasContent && (
              <p className="mt-2 text-center text-xs text-neutral-400">
                Share at least one thought to get your code.
              </p>
            )}
          </Reveal>
        </form>
      )}
    </main>
  );
}
