# JobFlow

AI-powered job application toolkit. Paste a job description, get a tailored CV and cover letter in under two minutes.

You host it yourself on Vercel and bring your own Claude API key, so your CV and application history never touch anyone else's server — including ours.

---

## Setup

Roughly ten minutes, most of it waiting for Vercel to build.

### 1. Get a Claude API key

Sign up at [console.anthropic.com](https://console.anthropic.com), create a key under **Settings → API keys**, and copy it.

While you're there, set a spend limit under **Settings → Limits**. JobFlow typically costs a few cents per application, but a limit means a runaway loop can never surprise you with a bill.

### 2. Deploy to Vercel

Click **Deploy** on the [JobFlow site](https://jobflow-ai.app), or use the Vercel import flow directly. You'll be asked for three values:

| Variable | What to put |
|---|---|
| `ANTHROPIC_API_KEY` | The key from step 1 |
| `APP_PASSWORD` | Any password you choose — your browser prompts for it on first visit |
| `TRIAL_SECRET` | A random string, see below |

Generate `TRIAL_SECRET` with either of these:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```bash
openssl rand -hex 32
```

It's unique to your instance, isn't shared with anyone, and you never need to look at it again.

### 3. Add a database

**Do this before you start using the app.** Without it your data is temporary.

By default JobFlow writes to `/tmp`, which Vercel wipes whenever your server restarts — typically after about fifteen minutes of inactivity. Every CV, cover letter, and tracker entry disappears. Fine for a five-minute look around; not fine for real use.

To make your data permanent:

1. In your Vercel project, go to **Storage → Create Database → Postgres** (the free tier is plenty)
2. Vercel sets `POSTGRES_URL` for you automatically — nothing to copy
3. Add one more environment variable: `DATA_PROVIDER` = `postgres`
4. Redeploy

The tables are created on first use. There's nothing to migrate or configure.

<details>
<summary>Prefer Google Sheets?</summary>

Set `DATA_PROVIDER=sheets` and supply `GOOGLE_SHEETS_SPREADSHEET_ID` plus `GOOGLE_SERVICE_ACCOUNT_JSON` (the full service account key as a single-line string). Also permanent, but noticeably more setup than Postgres.

</details>

### 4. Check your configuration

Visit `/setup` on your new deployment. Every row must be green before JobFlow can generate anything. If something's red, the card tells you exactly what to fix.

### 5. Build your profile

Go to `/onboarding`. Upload your current CV, paste your LinkedIn About section, and name the roles you're targeting. Takes about five minutes.

This is what every generated document is built from, so it's worth doing properly.

---

## Environment variables

**Required**

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Your Claude API key |
| `APP_PASSWORD` | Protects your instance behind a browser password prompt |
| `TRIAL_SECRET` | Random per-instance string that signs your trial cookie |

**Storage** — pick one

| Variable | Purpose |
|---|---|
| `DATA_PROVIDER` | `postgres` (recommended), `sheets`, or `json` (temporary) |
| `POSTGRES_URL` | Set automatically by Vercel when you add a Postgres database |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Sheets only — the ID from the spreadsheet URL |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Sheets only — service account key as one line |

**Optional**

| Variable | Purpose |
|---|---|
| `JOBFLOW_LICENSE_KEY` | Your key from the purchase email. Leave unset to use the 7-day trial |
| `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | Cloudflare Web Analytics beacon token |

See `.env.example` for the annotated version.

---

## Using it

Full walkthrough at [/how-it-works](https://jobflow-ai.app/how-it-works). The short version:

**Decode a job description** — At `/new`, paste the posting URL and click **Analyze JD**. Some platforms (Workday, Greenhouse, Lever, LinkedIn Easy Apply) block automated access; if the URL fails, switch to **Paste JD text**, copy the description across manually, and analyze again.

**Generate a CV** — Click **Generate CV**. Each section can be regenerated on its own, with optional instructions like "emphasise team leadership", so fixing one paragraph doesn't mean redoing the whole document. Download as `.docx`.

**Cover letter** — Written from the same decode. Same per-section regeneration.

**Tracker** — Every generated application is saved automatically at `/tracker`. Update its status, add notes, reopen the documents any time.

**Resume audit** (Professional) — At `/audit`. Scores your profile for ATS compatibility and shows keyword gaps against your target roles.

**Application Q&A** (Professional) — Paste up to four free-text questions from an application form and get answers drafted in your voice.

---

## Trial and licensing

New instances get **7 days free**, starting on your first visit to a protected page. The start date is recorded server-side, so clearing cookies won't extend it.

After that you'll need a license key from [jobflow-ai.app](https://jobflow-ai.app). It arrives by email after purchase — set it as `JOBFLOW_LICENSE_KEY` in Vercel and redeploy.

| Tier | Includes |
|---|---|
| Starter (€25) | CV generation, cover letters, JD decode, tracker |
| Professional (€49) | Everything above, plus resume audit and application Q&A |

One-time purchase. No subscription. Claude API usage is billed to your own Anthropic account.

---

## Costs

- **JobFlow** — one-time, no recurring fee
- **Vercel** — free tier is sufficient for personal use
- **Postgres** — free tier is sufficient
- **Claude API** — pay-as-you-go, typically a few cents per application

---

## Troubleshooting

**Every page redirects to `/setup`** — `TRIAL_SECRET` isn't set. See step 2.

**"Storage" is amber on `/setup`** — You're on the default `json` provider and your data won't survive a restart. See step 3.

**Data disappeared** — Same cause. `/tmp` is wiped when Vercel restarts your server. Postgres fixes it permanently, though anything already lost is gone.

**"Analyze JD" fails on a URL** — That platform blocks automated access. Switch to **Paste JD text**.

**License key rejected** — Check for stray whitespace when pasting, confirm you redeployed after adding it, and note that env var changes only take effect on a new deployment.

**Changes to environment variables seem ignored** — Vercel only picks them up on redeploy. Trigger one from the Deployments tab.

---

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in your values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Built with Next.js 16 and the Anthropic API.
