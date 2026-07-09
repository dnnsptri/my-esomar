import { findPaper, paperFullText } from "@/lib/content";
import { getGenericMockAnswer, getMockAnswer } from "@/lib/mock-chat";

type ChatMessage = { role: "user" | "assistant"; content: string };

type ChatRequest = {
  messages: ChatMessage[];
  // Null/absent → the general portal assistant (persistent sidebar with
  // no paper in scope); a slug → conversation grounded in that paper.
  paperSlug?: string | null;
  selection?: string | null;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Streams a canned answer word by word so it feels like a live model.
function streamMockAnswer(answer: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const words = answer.split(" ");
  return new ReadableStream({
    async start(controller) {
      // Small "thinking" pause before the first token
      await sleep(500);
      for (let i = 0; i < words.length; i++) {
        controller.enqueue(encoder.encode(i === 0 ? words[i] : ` ${words[i]}`));
        await sleep(18 + Math.random() * 40);
      }
      controller.close();
    },
  });
}

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequest;
  const found = body.paperSlug ? findPaper(body.paperSlug) : null;
  if (body.paperSlug && !found) {
    return new Response("Unknown paper", { status: 404 });
  }
  const lastUser = [...(body.messages ?? [])].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return new Response("No question", { status: 400 });
  }

  const headers = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-cache",
  };

  // Demo mode: no API key → scripted answers from lib/mock-chat.ts.
  // Real mode: key present → answer grounded in the actual paper text.
  // The client streams plain text either way, so flipping modes is
  // purely an environment variable change (ANTHROPIC_API_KEY on Vercel).
  if (!process.env.ANTHROPIC_API_KEY) {
    const answer = found
      ? getMockAnswer(lastUser.content, body.selection ?? undefined)
      : getGenericMockAnswer(lastUser.content);
    return new Response(streamMockAnswer(answer), { headers });
  }

  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();

  const system = [
    found
      ? "You are the research assistant inside the Esomar member portal. Answer questions about the research paper below."
      : "You are the assistant inside the Esomar member portal. Help members explore market research topics, papers, videos, and companies. Esomar is the global community for insights, analytics and market research professionals.",
    "Be concise (a short paragraph or two), factual, and grounded" +
      (found ? " strictly in the paper." : "."),
    'If a question is out of scope (not covered by the paper or by Esomar\'s published work), reply with exactly: "I have no verified Esomar work on that yet."',
    body.selection
      ? `The member highlighted this passage and is asking about it:\n"""${body.selection}"""`
      : null,
    found ? `THE PAPER:\n${paperFullText(found.paper)}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const anthropicStream = client.messages.stream({
    model: "claude-sonnet-5",
    max_tokens: 1024,
    system,
    messages: body.messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, { headers });
}
