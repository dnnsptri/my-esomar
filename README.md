# my ESOMAR — Conversational AI Demo

A clickable demo of a reimagined ESOMAR member portal: AI-first search, talking to a research paper, and personalized recommendations. Black and white, serif for names and subjects.

## The demo flow

1. **Login** (`/`) — prefilled for Aurélie Reynier, any password works
2. **Home** (`/home`) — "Good afternoon, Aurélie" + conversational search bar
3. **Search** (`/search?q=…`) — every query resolves to the rehearsed topic "AI in market research": videos, research papers, companies
4. **Paper detail** (`/paper/synthetic-respondents`) — select any passage → "Ask about this" → split-screen chat with the paper (bottom sheet on mobile)
5. **Home again** — "Hi Aurélie, since you've looked into AI in market research:" with recommendations

There is a subtle **reset demo** link at the bottom of the home screen. It clears the fake session so you can run the flow again from login.

## Running it

```bash
npm install
npm run dev
```

## How the fake parts work (and how to make them real)

- **Session & history**: localStorage only (`lib/session.ts`). No backend.
- **Content**: everything lives in `lib/content.ts`, keyed by topic. Swap in real papers/videos/companies there; the UI only knows the types.
- **Search**: `findTopicForQuery()` in `lib/content.ts` currently returns the rehearsed topic for any query. Add topics and keyword matching there.
- **Chat**: `/api/chat` streams plain text. Without an API key it streams scripted answers from `lib/mock-chat.ts` (keyword-matched, word-by-word with delays). With `ANTHROPIC_API_KEY` set, it calls Claude with the full paper text as context — the UI does not change.

To go live with the real model, create `.env.local` (or set the variable on Vercel):

```
ANTHROPIC_API_KEY=sk-ant-…
```

## Deploying

```bash
npx vercel
```

Set `ANTHROPIC_API_KEY` in the Vercel project settings when you want real answers instead of scripted ones.
