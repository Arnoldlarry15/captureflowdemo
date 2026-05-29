<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# CaptureFlow Demo

This repository contains a Next.js demo for CaptureFlow with Gemini-powered extraction and synthesis APIs.

View your app in AI Studio: https://ai.studio/apps/3778b25b-6c65-443b-a0bf-53e7fb3e3278

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy on Vercel

1. Import this repository in Vercel.
2. Framework preset: **Next.js**.
3. Build command: `npm run build` (default).
4. Output directory: leave default (Next.js).
5. Add environment variable:
   - `GEMINI_API_KEY` = your Gemini API key
6. Deploy.

### Notes

- API routes are configured for Node.js runtime and extended execution time for model calls.
- If `GEMINI_API_KEY` is missing, API routes return an error by design.
