# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `functions/` directory:

```bash
npm run lint      # ESLint check (also runs automatically before deploy)
npm run deploy    # Deploy to Firebase (runs lint first via predeploy hook)
```

There are no test scripts.

## Architecture

GuiPT is a single Firebase Cloud Function (`functions/index.js`) that serves as an AI assistant API answering questions about Gui. The entire backend is one file (~144 lines).

**Request pipeline:**
1. Input sanitization — strips HTML tags, normalizes whitespace
2. Input validation — max 200 chars, allowlist of characters (rejects `@$%&/+` etc.)
3. Fetch system prompt from **Langfuse** (cached 3 minutes) for prompt versioning
4. Call **Google Gemini** (`gemini-flash-lite-latest`, temp 0.4, max 400 tokens) with safety filters
5. Log each stage via **Sentry** structured logging
6. Return plain text response

**Key design details:**
- Clients (`GoogleGenAI`, `Langfuse`) are initialized at cold start (module scope); the Langfuse prompt is fetched per-request with a 3-minute cache to pick up prompt changes
- Chat history is passed in from the request body (stateless function)
- Safety filters block harassment/hate/explicit at `LOW_AND_ABOVE`, dangerous content at `MEDIUM_AND_ABOVE`
- Max 5 concurrent instances, 8-second timeout, CORS enabled

**Required environment variables:**
- `GEMINI_API_KEY`, `LANGFUSE_SECRET_KEY`, `LANGFUSE_PUBLIC_KEY`, `SENTRY_DSN`
- Set directly in the Firebase Console (no `.env` file). Available at cold start (`process.env.*` at module scope).

**Sentry:** Errors logged to the `website` project (`WEBSITE-*` issue IDs).

## Code Style

- Max line length: 80 characters (enforced by ESLint Google style config).
