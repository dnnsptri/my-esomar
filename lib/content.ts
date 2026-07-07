// All demo content lives here, keyed by topic. Real ESOMAR content can be
// dropped in later by replacing/extending these objects — the UI only knows
// the shapes below, never the actual content.

export type Video = {
  id: string;
  title: string;
  event: string;
  duration: string;
  // Which generated b&w thumbnail pattern to render (no external images)
  pattern: "circles" | "lines" | "dots";
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
};

export type Company = {
  id: string;
  name: string;
  tagline: string;
  // Loose styling hint so the monochrome "logos" don't all look the same
  logoStyle: "serif" | "caps" | "mono";
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
      event: "ESOMAR Congress 2025 · Keynote",
      duration: "42 min",
      pattern: "circles",
    },
    {
      id: "v2",
      title: "AI Moderation in Qualitative Research",
      event: "Insights Festival 2025 · Panel",
      duration: "18 min",
      pattern: "lines",
    },
    {
      id: "v3",
      title: "Data Quality in the Age of Generative AI",
      event: "ESOMAR Webinar Series",
      duration: "31 min",
      pattern: "dots",
    },
  ],
  papers: [
    {
      slug: "synthetic-respondents",
      title: "Synthetic Respondents: Validity and Limits of LLM-Simulated Panels",
      authors: ["Dr. Lena Ortiz-Kramer", "Prof. Samuel Adeyemi"],
      year: 2025,
      readingTime: "14 min read",
      abstract:
        "Large language models can produce survey answers that look strikingly human. This paper tests how far that resemblance goes. Across three studies comparing LLM-simulated panels with matched human samples, we find strong convergence on attitudinal averages but systematic failures on distributional variance, minority viewpoints, and novel product concepts. We propose a validity framework for deciding when synthetic respondents are safe to use — and when they quietly mislead.",
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
            "Three caveats bound these results. First, our synthetic panels used persona-conditioning techniques current in early 2025; prompting strategies evolve quickly, and results may not generalise to future systems. Second, both markets studied were data-rich Western markets that are heavily represented in model training data — divergence is plausibly larger where training coverage is thin. Third, we studied quantitative survey formats; conversational and qualitative uses raise distinct validity questions we do not address here.",
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
      year: 2025,
      readingTime: "9 min read",
      abstract:
        "Small changes in prompt phrasing shift LLM-generated survey responses more than equivalent wording changes shift human responses. This study quantifies prompt sensitivity across 40 question variants and offers wording guidelines for AI-assisted instruments.",
      sections: [],
    },
    {
      slug: "hybrid-qual",
      title: "Human + Machine: Hybrid Qualitative Analysis at Scale",
      authors: ["Priya Natarajan", "Dr. Tomás Herrera"],
      year: 2024,
      readingTime: "11 min read",
      abstract:
        "A two-year field account of embedding LLM coding assistants in a qualitative team. Machine-first coding with human adjudication cut analysis time by 60% while keeping inter-coder reliability above conventional thresholds.",
      sections: [],
    },
  ],
  companies: [
    { id: "c1", name: "Quantek Research", tagline: "Synthetic sample validation", logoStyle: "caps" },
    { id: "c2", name: "Mindfield", tagline: "AI-moderated interviews", logoStyle: "serif" },
    { id: "c3", name: "PanelWise", tagline: "Panel quality analytics", logoStyle: "mono" },
    { id: "c4", name: "Novaquant", tagline: "Automated trackers", logoStyle: "caps" },
    { id: "c5", name: "The Signal Room", tagline: "Insight activation studio", logoStyle: "serif" },
  ],
  recommendations: [
    {
      kind: "paper",
      title: "Prompt Effects: Question Wording in AI-Assisted Surveys",
      meta: "Research paper · Dr. Mareike Voss · 2025",
      href: "/paper/prompt-effects",
    },
    {
      kind: "video",
      title: "AI Moderation in Qualitative Research",
      meta: "Video · Insights Festival 2025 · 18 min",
      href: "/search?q=AI%20in%20market%20research",
    },
    {
      kind: "event",
      title: "ESOMAR Congress 2026 — Athens",
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
