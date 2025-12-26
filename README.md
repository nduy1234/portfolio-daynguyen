# Portfolio Website (Next.js)

A modern portfolio site built with **Next.js (App Router)**, **Tailwind CSS**, and optional **Gemini-powered** features:

- AI chat assistant (`/api/chat`)
- AI “summarize experience” (`/api/summarize`)
- Text-to-speech bio playback (`/api/tts`)

## Getting started

Install dependencies:

```bash
pnpm install
```

Create an environment file:

```bash
cp .env.example .env.local
```

Then run the dev server:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Environment variables

- **`GEMINI_API_KEY`**: Required for the AI routes (`/api/chat`, `/api/summarize`, `/api/tts`).  
  If it’s missing, the portfolio still loads, but AI features will fail at runtime.

## Production build

```bash
pnpm build
pnpm start
```

## Lint

```bash
pnpm lint
```
