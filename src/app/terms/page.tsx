export const metadata = {
  title: 'Terms & Conditions - JobFlow',
  description: 'JobFlow terms of use, license grant, and purchase policy.',
}

export default function TermsPage() {
  return (
    <div style={{
      fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
      background: '#0d1117',
      minHeight: '100vh',
      color: '#e6edf3',
      padding: '64px 32px',
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        <a href="/" style={{ fontSize: 13, color: '#7d8590', textDecoration: 'none', display: 'inline-block', marginBottom: 40 }}>
          ← Back to home
        </a>

        <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 8 }}>
          Terms &amp; Conditions
        </h1>
        <p style={{ fontSize: 13, color: '#7d8590', marginBottom: 48 }}>
          Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <Section title="1. What you are buying">
          <p>
            JobFlow is a self-hosted software toolkit you deploy to your own Vercel account. When you purchase a license you receive
            a license key that unlocks the software for one deployment. You are not purchasing a hosted service, a subscription, or
            any ongoing managed infrastructure.
          </p>
        </Section>

        <Section title="2. License grant">
          <p>
            Your license is personal and non-transferable. It covers one active Vercel deployment. You may re-deploy (for example,
            after a reset or migration) using the same key. You may not resell, sublicense, or redistribute the software or your
            license key.
          </p>
        </Section>

        <Section title="3. One-time payment">
          <p>
            The purchase price is a single, one-time charge. There are no recurring fees, no subscriptions, and no hidden costs.
            Your Anthropic API usage is billed directly by Anthropic under your own API key - that cost is separate and outside
            this agreement.
          </p>
        </Section>

        <Section title="4. Updates">
          <p>
            Starter licenses include software updates for 6 months from the date of purchase. Professional licenses include
            updates for 12 months. After that period the software continues to work - you simply will not receive new features
            or fixes automatically. You can purchase a new license at any time to renew update access.
          </p>
        </Section>

        <Section title="5. No refunds">
          <p>
            All purchases are final. Because JobFlow is a digital product that is immediately accessible upon payment, we do not
            offer refunds. If you have a technical issue preventing you from running the software, contact us at{' '}
            <a href="mailto:info@jobflow-ai.app" style={{ color: '#4493f8' }}>info@jobflow-ai.app</a> and we will do our best to
            help you resolve it.
          </p>
        </Section>

        <Section title="6. Your data">
          <p>
            JobFlow runs entirely within your own Vercel deployment. Your CV, job descriptions, cover letters, and application
            history are stored in your instance and are never sent to or stored by JobFlow. The only external services your
            instance communicates with are Anthropic (for AI generation) and any database adapter you configure (such as Google
            Sheets), both under your own accounts.
          </p>
        </Section>

        <Section title="7. No warranty">
          <p>
            JobFlow is provided &quot;as is&quot; without warranty of any kind. We do not guarantee that the software will be
            error-free, uninterrupted, or suitable for any particular purpose. AI-generated content (CVs, cover letters) should
            be reviewed by you before use - we are not responsible for the accuracy or outcomes of generated content.
          </p>
        </Section>

        <Section title="8. Limitation of liability">
          <p>
            To the maximum extent permitted by law, JobFlow and its author shall not be liable for any indirect, incidental, or
            consequential damages arising from your use of the software, including but not limited to lost job opportunities,
            data loss, or costs from third-party services.
          </p>
        </Section>

        <Section title="9. Acceptable use">
          <p>
            You may not use JobFlow to generate documents intended to misrepresent your qualifications or deceive employers. You
            may not use it to bulk-spam job applications in an automated, unsupervised manner. Normal job searching is
            explicitly permitted and encouraged.
          </p>
        </Section>

        <Section title="10. Governing law">
          <p>
            These terms are governed by the laws of Israel. Any disputes shall be resolved in the courts of Tel Aviv, Israel.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            Questions about these terms?{' '}
            <a href="mailto:info@jobflow-ai.app" style={{ color: '#4493f8' }}>info@jobflow-ai.app</a>
          </p>
        </Section>

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, color: '#e6edf3', marginBottom: 10 }}>{title}</h2>
      <div style={{ fontSize: 14, color: '#7d8590', lineHeight: 1.75 }}>{children}</div>
    </div>
  )
}
