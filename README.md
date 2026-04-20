## Mittal Enterprises

Next.js site for Mittal Enterprises, with a Gemini-powered website assistant grounded in the local product and company catalog.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env.local
```

3. Add your Gemini key to `.env.local`:

```bash
GEMINI_API_KEY=your_key_here
```

Google's Gemini docs say the API libraries also accept `GOOGLE_API_KEY`, and that `GOOGLE_API_KEY` takes priority if both are set:
https://ai.google.dev/gemini-api/docs/api-key

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Chatbot setup

The chat widget is mounted in `components/ChatBubble.tsx`, and the server-side Gemini route lives in `app/api/chat/route.ts`.

Grounding data comes from:

- `lib/data.ts`
- `lib/products-data.ts`
- `lib/company-content.ts`
- `lib/chat/catalog.ts`

The assistant is intentionally constrained to website data. If pricing, lead time, or a spec is not present in the local catalog, it will direct the user to the enquiry or contact pages instead of inventing it.

## Notes

- Default model: `gemini-2.5-flash`
- Optional override: `GEMINI_MODEL`
- The API key is never exposed to the browser. Requests go through the Next.js server route.

Official Gemini references used for this setup:

- Gemini API keys: https://ai.google.dev/gemini-api/docs/api-key
- Gemini models: https://ai.google.dev/gemini-api/docs/models
- `generateContent` API: https://ai.google.dev/api/generate-content
