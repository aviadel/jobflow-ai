'use client'

import { useState } from 'react'

const FAQ_ITEMS = [
  {
    q: 'How does JobFlow AI generate tailored CVs?',
    a: "JobFlow uses Claude AI to decode the job description, extract requirements and keywords, then maps them against your stored profile. It generates a fully tailored CV and cover letter for that specific role - in under 2 minutes. You can regenerate any section individually until you're satisfied.",
  },
  {
    q: 'I have a license key - what is next?',
    a: "Head to the installation guide and follow the six steps: deploy to Vercel, add your four environment variables (including the license key), set up a free Postgres database, verify your config at /setup, then build your profile at /onboarding. You'll be generating tailored CVs in under ten minutes.",
  },
  {
    q: 'Do I need a paid Vercel account?',
    a: "No. Vercel's free Hobby plan covers everything JobFlow needs - one project, a free Postgres database, and serverless function invocations that fit comfortably within free-tier limits. The only ongoing cost is the Anthropic API, billed at a few cents per generated document.",
  },
  {
    q: 'How much does the Claude API cost per CV?',
    a: 'Typically $0.02-$0.08 per full generation (CV + cover letter), depending on document length and the model used. Apply to 50 jobs and your total API spend is roughly $2-4 - a fraction of one month of any subscription competitor.',
  },
  {
    q: 'Can I regenerate individual sections of my CV?',
    a: 'Yes. Every section - summary, skills, experience bullets - can be regenerated individually with a custom instruction. Add prompts like "make the summary more concise" or "emphasise leadership experience" per pass. You stay in full control of the final output before downloading.',
  },
  {
    q: 'Where is my data stored?',
    a: "On your own Vercel instance with Postgres. Your profile, generated documents, and application history never leave your server. Nothing is shared with JobFlow or any third party - you own and control all of it, permanently.",
  },
]

const Chevron = () => (
  <svg className="jfaqch" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
  </svg>
)

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="jfaql">
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className={`jfaqi${openIndex === i ? ' jfaqo' : ''}`}>
          <button
            className="jfaqq"
            type="button"
            aria-expanded={openIndex === i}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            {item.q}
            <Chevron />
          </button>
          <div className="jfaqa">
            <div className="jfaqai">{item.a}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
