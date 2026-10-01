# JobFlow AI

Self-hosted AI toolkit that writes a tailored CV and cover letter for every job application in under 2 minutes. Free and open source — deploy your own instance to Vercel, bring your own Anthropic API key, keep your data on your own server.

[jobflow-ai.app](https://jobflow-ai.app) · [Install guide](https://jobflow-ai.app/install) · [How it works](https://jobflow-ai.app/how-it-works)

## Features

- **CV generation** — tailored CV per application, with a self-correcting AI pass and section-by-section regeneration until you approve it
- **Cover letters** — written in parallel with your CV, matches your voice and tone
- **JD Decode** — extracts role requirements, ATS keywords, and a fit verdict against your profile in one click
- **Application tracker** — status, notes, and history, stored in your own instance
- **Resume audit** — ATS compatibility check, keyword gap analysis, LinkedIn consistency review
- **Application Q&A** — paste free-text application questions, get drafted answers in your voice

All features are available to everyone — there is no tier, license key, or paid plan.

## Deploy your own instance

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faviadel%2Fjobflow-ai&env=ANTHROPIC_API_KEY,APP_PASSWORD&envDescription=Your%20Claude%20API%20key%20and%20a%20password%20to%20protect%20your%20instance&envLink=https%3A%2F%2Fgithub.com%2Faviadel%2Fjobflow-ai%23environment-variables&project-name=jobflow-ai&repository-name=jobflow-ai)

For a detailed, non-technical walkthrough (including setting up a free Postgres database so your data persists), see the [install guide](https://jobflow-ai.app/install).

Quick version:

1. Click **Deploy with Vercel** above.
2. Fill in `ANTHROPIC_API_KEY` (from [console.anthropic.com](https://console.anthropic.com)) and `APP_PASSWORD` (any password you choose).
3. After deploying, go to your Vercel project → **Storage** → **Create Database** → **Neon (Postgres)**, then add `DATA_PROVIDER=postgres` as an environment variable and redeploy. Without this, your data is stored temporarily and is lost when the server restarts.
4. Visit `your-app.vercel.app/setup` to confirm everything is configured correctly.
5. Go to `/onboarding` to build your profile, then `/new` to generate your first CV.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Your Claude API key from [console.anthropic.com](https://console.anthropic.com). Usage is billed directly to you by Anthropic (typically a few cents per generated document). |
| `APP_PASSWORD` | Yes | A password of your choosing. Your browser will prompt for it (HTTP Basic Auth) on every visit — leave the username field blank. |
| `DATA_PROVIDER` | No (default `json`) | `postgres` (recommended), `sheets`, or `json` (temporary, for trying the app out only). |
| `POSTGRES_URL` | If `DATA_PROVIDER=postgres` | Set automatically when you create a Postgres database in the Vercel dashboard. |
| `GOOGLE_SHEETS_SPREADSHEET_ID` / `GOOGLE_SERVICE_ACCOUNT_JSON` | If `DATA_PROVIDER=sheets` | See `.env.example` for details. |
| `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | No | Cloudflare Web Analytics beacon token. Safe to expose. |

See [`.env.example`](.env.example) for the full annotated list.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in ANTHROPIC_API_KEY and APP_PASSWORD
npm run dev
```

The app runs on `DATA_PROVIDER=json` by default locally, which writes to a temp directory — fine for development, not for anything you want to keep.

```bash
npm run build   # production build
npm run lint    # eslint
npm run test    # vitest
```

## Architecture

Next.js 16 App Router, two route groups:

- `(app)` — the protected tool itself (dashboard, CV generation, tracker, profile, setup)
- `(marketing)` / top-level pages — the public landing page, install guide, terms

Auth is a single `APP_PASSWORD` checked via HTTP Basic Auth in `src/proxy.ts` (Next.js 16 renamed `middleware.ts` to `proxy.ts`). Storage is pluggable through a `DataProvider` interface (`src/lib/db/`) with Postgres, Google Sheets, and a temporary JSON adapter.

## Contributing

Issues and pull requests are welcome. By submitting a contribution you agree it's licensed under the same terms as the rest of the project (Apache-2.0).

## License

[Apache License 2.0](LICENSE) — you may use, modify, and redistribute this software, including commercially, as long as you retain the copyright notice and license text.
