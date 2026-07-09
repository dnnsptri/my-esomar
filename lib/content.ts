// All demo content lives here, keyed by topic. Real Esomar content can be
// dropped in later by replacing/extending these objects — the UI only knows
// the shapes below, never the actual content.

// Which generated b&w illustration to render (no external images/audio —
// see components/MediaArt.tsx). "bars" is the audio waveform look, used
// for "Listen" players; the others double as video thumbnails and heroes.
export type MediaPattern = "circles" | "lines" | "dots" | "bars";

export type Video = {
  id: string;
  title: string;
  event: string;
  duration: string;
  pattern: MediaPattern;
};

export type PaperSection = {
  heading: string;
  paragraphs: string[];
};

export type Paper = {
  slug: string;
  title: string;
  authors: string[];
  year: number;
  readingTime: string;
  abstract: string;
  // Only the "hero" paper needs full sections (it powers the chat);
  // list-only papers can leave this empty.
  sections: PaperSection[];
  // Media rail on the detail page: a hero illustration plus a "Watch" and
  // a "Listen" player, both generated (no real files — see MediaArt.tsx).
  pattern: MediaPattern;
  videoDuration: string;
  audioDuration: string;
};

export type Company = {
  id: string;
  name: string;
  tagline: string;
  // Loose styling hint so the monochrome "logos" don't all look the same
  logoStyle: "serif" | "caps" | "mono";
  // Real profile page on directory.esomar.org — opens in a new tab
  profileUrl: string;
};

export type Recommendation = {
  kind: "video" | "paper" | "event";
  title: string;
  meta: string;
  href: string;
};

export type Topic = {
  id: string;
  label: string;
  videos: Video[];
  papers: Paper[];
  companies: Company[];
  recommendations: Recommendation[];
};

const aiInMarketResearch: Topic = {
  id: "ai-in-market-research",
  label: "AI in market research",
  videos: [
    {
      id: "v1",
      title: "The Synthetic Respondent Debate",
      event: "Esomar Congress 2026 · Keynote",
      duration: "42 min",
      pattern: "circles",
    },
    {
      id: "v2",
      title: "AI Moderation in Qualitative Research",
      event: "Insights Festival 2026 · Panel",
      duration: "18 min",
      pattern: "lines",
    },
    {
      id: "v3",
      title: "Data Quality in the Age of Generative AI",
      event: "Esomar Webinar Series",
      duration: "31 min",
      pattern: "dots",
    },
  ],
  papers: [
    {
      slug: "synthetic-respondents",
      title: "Synthetic Respondents: Validity and Limits of LLM-Simulated Panels",
      authors: ["Dr. Lena Ortiz-Kramer", "Prof. Samuel Adeyemi"],
      year: 2026,
      readingTime: "14 min read",
      abstract:
        "Large language models can produce survey answers that look strikingly human. This paper tests how far that resemblance goes. Across three studies comparing LLM-simulated panels with matched human samples, we find strong convergence on attitudinal averages but systematic failures on distributional variance, minority viewpoints, and novel product concepts. We propose a validity framework for deciding when synthetic respondents are safe to use — and when they quietly mislead.",
      pattern: "dots",
      videoDuration: "6 min",
      audioDuration: "16 min",
      sections: [
        {
          heading: "Introduction",
          paragraphs: [
            "The promise is seductive: a research panel that never sleeps, never churns, and costs a fraction of a human sample. Since 2023, dozens of vendors have launched products that simulate survey respondents with large language models, and adoption inside insight teams has outpaced the evidence. The question practitioners keep asking — can I trust these answers? — has mostly been met with anecdotes.",
            "This paper replaces anecdotes with a systematic comparison. We fielded identical questionnaires to human panels and LLM-simulated panels across three product categories and two markets, then measured where the synthetic answers converge with human ones and where they diverge. Our goal is not to declare synthetic respondents valid or invalid, but to map the boundary between the two.",
          ],
        },
        {
          heading: "Methodology",
          paragraphs: [
            "We ran three parallel studies. Study 1 covered category attitudes in packaged foods (n = 1,200 human; 1,200 synthetic), Study 2 tested concept evaluation for a new financial product (n = 800 per condition), and Study 3 probed brand perception in an established telecom market (n = 1,000 per condition). Human samples were drawn from managed access panels with standard quality controls; synthetic samples were generated with three leading LLMs, each prompted with demographically conditioned personas matched to the human sample frame.",
            "Every questionnaire was fielded identically in both conditions, including question order, scales, and open-ended prompts. We pre-registered our comparison metrics: mean absolute difference on closed questions, distributional overlap (measured by Wasserstein distance), and thematic coverage of open-ended responses coded by two independent analysts blind to condition.",
          ],
        },
        {
          heading: "Findings",
          paragraphs: [
            "On attitudinal averages, the convergence is striking. Across 74 closed questions, the mean absolute difference between human and synthetic top-two-box scores was 4.1 percentage points — inside the margin many trackers tolerate between waves. If all you need is a directional read on a familiar category, synthetic panels look remarkably serviceable.",
            "The picture changes at the distribution level. Synthetic respondents cluster toward the middle of scales, under-producing both enthusiasts and rejectors. Wasserstein distances were 2.3 times larger on questions involving polarising topics. Minority viewpoints — held by fewer than 15% of human respondents — were under-represented by roughly half in every synthetic condition. And on the genuinely novel concept in Study 2, synthetic purchase intent overshot human intent by 19 points: the models had no cultural memory of scepticism toward the unfamiliar.",
          ],
        },
        {
          heading: "Limitations",
          paragraphs: [
            "Three caveats bound these results. First, our synthetic panels used persona-conditioning techniques current in early 2026; prompting strategies evolve quickly, and results may not generalise to future systems. Second, both markets studied were data-rich Western markets that are heavily represented in model training data — divergence is plausibly larger where training coverage is thin. Third, we studied quantitative survey formats; conversational and qualitative uses raise distinct validity questions we do not address here.",
          ],
        },
        {
          heading: "Implications for practice",
          paragraphs: [
            "We propose a simple decision framework. Synthetic respondents are defensible for instrument piloting, question wording tests, and directional reads on well-documented categories — uses where the cost of being somewhat wrong is low and the alternative is often no research at all. They are not defensible, on current evidence, for sizing minority segments, forecasting novel concept adoption, or any decision that depends on the shape of a distribution rather than its centre.",
            "The practical risk is not that synthetic data is obviously bad — it is that it is plausibly good. Averages that land within a few points of human benchmarks create confidence that quietly extends to the use cases where the method fails. Insight teams should treat synthetic respondents the way they treat any new instrument: validated per use case, never assumed.",
          ],
        },
        {
          heading: "Conclusion",
          paragraphs: [
            "LLM-simulated panels reproduce the centre of human opinion with surprising fidelity and miss its edges with equal reliability. The technology deserves a place in the research toolkit — bounded by a validity framework, not by enthusiasm. Our data suggest the profession's task is no longer to ask whether synthetic respondents work, but to specify, use case by use case, what 'working' must mean.",
          ],
        },
      ],
    },
    {
      slug: "prompt-effects",
      title: "Prompt Effects: Question Wording in AI-Assisted Surveys",
      authors: ["Dr. Mareike Voss"],
      year: 2026,
      readingTime: "9 min read",
      abstract:
        "Small changes in prompt phrasing shift LLM-generated survey responses more than equivalent wording changes shift human responses. This study quantifies prompt sensitivity across 40 question variants and offers wording guidelines for AI-assisted instruments.",
      pattern: "lines",
      videoDuration: "4 min",
      audioDuration: "10 min",
      sections: [
        {
          heading: "Introduction",
          paragraphs: [
            "Ask an LLM the same underlying question two slightly different ways and you can get meaningfully different answer distributions — not because the construct changed, but because the model is more sensitive to surface wording than a human respondent would be. That sensitivity is easy to miss: a single pilot run looks stable, and instrument designers rarely test more than one or two phrasings before fielding.",
            "This study asks how large that sensitivity actually is, and whether it's predictable enough to write guidelines against. We compare LLM-generated responses to human responses across matched wording variants of the same 40 underlying questions, spanning satisfaction scales, agreement statements, and open-ended prompts.",
          ],
        },
        {
          heading: "Method",
          paragraphs: [
            "Each of the 40 base questions was rewritten into 3 to 5 wording variants — changing scale anchors, negation, question length, or framing (gain vs. loss) while holding the underlying construct fixed. Every variant was fielded to both a human panel (n = 60 per variant) and three LLMs prompted as survey respondents, then scored for response drift against the base wording.",
          ],
        },
        {
          heading: "Findings",
          paragraphs: [
            "LLM response distributions moved 2.6x more than human distributions across equivalent wording changes, on average. The largest drift came from negated statements ('not dissatisfied' vs. 'satisfied') and from scale-anchor changes at the extremes — LLMs were disproportionately pulled toward the last anchor label they read, an effect barely present in the human data.",
            "Open-ended prompts were more stable than closed ones, which runs counter to the intuition that free text gives a model more room to wander. Constrained response formats appear to concentrate wording sensitivity rather than dilute it.",
          ],
        },
        {
          heading: "Guidelines for practice",
          paragraphs: [
            "Three rules fell out of the data: avoid negated statements in AI-assisted instruments entirely, since the drift they introduce swamps most treatment effects you'd want to detect; pilot scale-anchor wording with the model you intend to field with, not a generic set of anchors, since sensitivity was model-specific; and treat any single-wording AI pilot as underpowered — the wording itself should be varied and averaged, the same way a researcher would triangulate across question formats with an uncertain human population.",
          ],
        },
      ],
    },
    {
      slug: "hybrid-qual",
      title: "Human + Machine: Hybrid Qualitative Analysis at Scale",
      authors: ["Priya Natarajan", "Dr. Tomás Herrera"],
      year: 2026,
      readingTime: "11 min read",
      abstract:
        "A two-year field account of embedding LLM coding assistants in a qualitative team. Machine-first coding with human adjudication cut analysis time by 60% while keeping inter-coder reliability above conventional thresholds.",
      pattern: "circles",
      videoDuration: "5 min",
      audioDuration: "12 min",
      sections: [
        {
          heading: "Background",
          paragraphs: [
            "Qualitative coding doesn't scale the way quantitative analysis does. A tracker can run twice the sample at marginal extra cost; a thematic analysis of 2,000 open-ended responses or 80 interview transcripts still needs a human to read, code, and reconcile every one of them. LLM coding assistants promise to change that arithmetic, but most published accounts are short pilots, not sustained team practice.",
            "This paper reports on two years of a mid-size qualitative team (11 analysts) restructuring around machine-first coding: an LLM proposes codes against a shared codebook, and human analysts adjudicate rather than code from scratch.",
          ],
        },
        {
          heading: "Approach",
          paragraphs: [
            "The team's existing codebook — built over five years of prior studies — was given to the model as a fixed taxonomy rather than letting it invent categories freely, which earlier internal pilots had found produced codebook drift the team couldn't reconcile across waves. The model proposed a code (or 'no fit, flag for review') for every response; analysts confirmed, corrected, or overrode in a lightweight review interface, with disagreements routed to a second analyst blind to the model's suggestion.",
            "Inter-coder reliability was tracked continuously against the team's pre-AI baseline (Krippendorff's alpha), not just at project close, so any quality drift would surface early rather than after a study had already shipped.",
          ],
        },
        {
          heading: "Results",
          paragraphs: [
            "Average time from data collection to a finished code frame fell 60%, driven almost entirely by the adjudication step being faster than first-pass coding, not by any reduction in human review. Inter-coder reliability stayed above the team's conventional threshold (α > 0.80) across the full two years, with one exception: studies involving heavy sarcasm or culturally specific humor, where model-proposed codes needed correction far more often and reliability dipped until analysts flagged those response types for human-first coding.",
            "The 'no fit, flag for review' option turned out to matter more than expected — early in the rollout, analysts found the model rarely used it, defaulting instead to the closest existing code even when nothing fit well. Retraining the prompt to reward flagging over forcing a fit fixed most of the downstream disagreement.",
          ],
        },
        {
          heading: "Lessons for practice",
          paragraphs: [
            "Machine-first coding worked because the team kept humans in the adjudication seat, not the first-pass seat — the reverse ordering (human codes, machine checks) was tried briefly and abandoned, since it didn't reduce analyst workload at all. Teams considering this should budget real time to build and lock a codebook before introducing the model, expect a per-domain exception list (sarcasm, humor, and code-switching all needed carve-outs here), and instrument reliability continuously rather than trusting a one-time validation.",
          ],
        },
      ],
    },
  ],
  // Real companies from directory.esomar.org, picked for the AI space.
  // Taglines are ours (kept short for the chips); links go to the live
  // directory profiles.
  companies: [
    {
      id: "c1",
      name: "Verso",
      tagline: "AI-moderated interviews",
      logoStyle: "serif",
      profileUrl: "https://directory.esomar.org/company/8891/verso",
    },
    {
      id: "c2",
      name: "Bilendi",
      tagline: "Data & AI solutions",
      logoStyle: "caps",
      profileUrl: "https://directory.esomar.org/company/3053/bilendi",
    },
    {
      id: "c3",
      name: "GWI",
      tagline: "Audience insights at scale",
      logoStyle: "mono",
      profileUrl: "https://directory.esomar.org/company/6543/gwi",
    },
    {
      id: "c4",
      name: "Kantar",
      tagline: "Marketing data & analytics",
      logoStyle: "caps",
      profileUrl: "https://directory.esomar.org/company/6814/kantar",
    },
    {
      id: "c5",
      name: "Toluna",
      tagline: "Insights platform & panels",
      logoStyle: "serif",
      profileUrl: "https://directory.esomar.org/company/1375/toluna",
    },
  ],
  recommendations: [
    {
      kind: "paper",
      title: "Prompt Effects: Question Wording in AI-Assisted Surveys",
      meta: "Research paper · Dr. Mareike Voss · 2026",
      href: "/paper/prompt-effects",
    },
    {
      kind: "video",
      title: "AI Moderation in Qualitative Research",
      meta: "Video · Insights Festival 2026 · 18 min",
      href: "/search?q=AI%20in%20market%20research",
    },
    {
      kind: "event",
      title: "Esomar Congress 2026 — Athens",
      meta: "Event · 13–16 September · Call for papers open",
      href: "/search?q=AI%20in%20market%20research",
    },
  ],
};

export const topics: Topic[] = [aiInMarketResearch];

// The rehearsed demo resolves every query to this topic for now.
// When more topics are added, match on keywords here.
export function findTopicForQuery(_query: string): Topic {
  return aiInMarketResearch;
}

export function findPaper(slug: string): { paper: Paper; topic: Topic } | null {
  for (const topic of topics) {
    const paper = topic.papers.find((p) => p.slug === slug);
    if (paper) return { paper, topic };
  }
  return null;
}

// Flattened paper text, used as context for the (real) LLM call.
export function paperFullText(paper: Paper): string {
  const body = paper.sections
    .map((s) => `## ${s.heading}\n${s.paragraphs.join("\n\n")}`)
    .join("\n\n");
  return `# ${paper.title}\nAuthors: ${paper.authors.join(", ")} (${paper.year})\n\nAbstract: ${paper.abstract}\n\n${body}`;
}

// Where the "Watch" video, "Listen" audio, and static image land in the
// body of a paper. Deterministic per paper (seeded by slug) so layout is
// stable across renders — but different papers scatter differently, so
// media reads as embedded content rather than one templated header.
export type PaperMediaKind = "image" | "video" | "audio";
export type PaperMediaPlacement = { afterSection: number; kind: PaperMediaKind };

function seedFromSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h || 1;
}

// mulberry32 — small, deterministic PRNG, good enough for layout variety
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function paperMediaPlacements(paper: Paper): PaperMediaPlacement[] {
  const kinds: PaperMediaKind[] = ["image", "video", "audio"];
  const slots = paper.sections.length;

  // No body to scatter across yet — land everything right after the
  // abstract instead of inventing a fake position.
  if (slots === 0) {
    return kinds.map((kind) => ({ afterSection: -1, kind }));
  }

  const rand = mulberry32(seedFromSlug(paper.slug));
  const indices = Array.from({ length: slots }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return kinds.map((kind, i) => ({ afterSection: indices[i % indices.length], kind }));
}
