"use client";

import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import Reveal from "@/components/Reveal";

// Demo & data notice, reachable from the cookie bar and the survey. All
// copy is illustrative for the demo — no real processing happens here.
const points: { heading: string; body: string }[] = [
  {
    heading: "This is a demonstration",
    body: "my Esomar is a working concept built to explore a conversational, AI-first member portal. It is shown for evaluation and feedback only, and is not a live product.",
  },
  {
    heading: "Your data stays within Esomar",
    body: "Anything you share — feedback, ideas, or your details — is used solely to shape this concept. It is never shared, sold, or passed to any third party outside Esomar.",
  },
  {
    heading: "Stored on a secure platform",
    body: "Responses are held on an access-controlled, encrypted platform, handled in line with Esomar's own professional standards and the ICC/Esomar International Code on data ethics, transparency and respondent protection.",
  },
  {
    heading: "Minimal, functional data only",
    body: "The demo uses only the cookies needed to remember your session. There is no advertising, no tracking across sites, and no profiling.",
  },
  {
    heading: "You stay in control",
    body: "Participation is voluntary and you can ask for your response to be removed at any time. Questions? Reach the team at the Esomar stand.",
  },
];

export default function DisclaimerPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-5 pb-24">
      <div className="flex justify-center py-6">
        <Link href="/home" className="transition-opacity hover:opacity-60">
          <Wordmark />
        </Link>
      </div>

      <Reveal>
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-neutral-500">
          Demo &amp; data notice
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
          For demonstration purposes only.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-neutral-600">
          A quick, honest note on what this is and how anything you share is handled.
        </p>
      </Reveal>

      <Reveal delay={150}>
        <div className="mt-10 space-y-8">
          {points.map((p) => (
            <section key={p.heading} className="border-l-2 border-neutral-900 pl-5">
              <h2 className="font-serif text-2xl">{p.heading}</h2>
              <p className="mt-2 leading-[1.8] text-neutral-800">{p.body}</p>
            </section>
          ))}
        </div>
      </Reveal>

      <Reveal delay={280}>
        <p className="mt-12 text-xs text-neutral-400">
          This notice is illustrative and part of the demo. No real personal data is
          processed by this prototype.
        </p>
        <div className="mt-6">
          <Link
            href="/home"
            className="inline-flex rounded-xl border border-neutral-900 px-5 py-3 text-sm transition-colors hover:bg-neutral-900 hover:text-white"
          >
            Back to my Esomar
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
