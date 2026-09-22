import Link from 'next/link'

export const metadata = {
  title: 'JobFlow - AI-powered job application toolkit',
  description: 'Self-hosted AI toolkit that writes a tailored CV and cover letter for every job in under 2 minutes. One-time purchase, deploy to Vercel, bring your own Claude API key.',
}

const STARTER_URL =
  'https://jobflow-ai.lemonsqueezy.com/checkout/buy/8c94e194-a3ca-40e2-af28-48dc88d72b4c'
const PRO_URL =
  'https://jobflow-ai.lemonsqueezy.com/checkout/buy/fe106e14-4419-48f2-b4e9-678a041ce8dc'
const DEPLOY_URL =
  'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faviadel%2Fjobflow-ai' +
  '&env=ANTHROPIC_API_KEY,APP_PASSWORD,INTERNAL_SECRET,JOBFLOW_LICENSE_KEY' +
  '&envDescription=Your%20Claude%20API%20key%2C%20a%20password%20to%20protect%20your%20instance%2C%20a%20random%20string%2C%20and%20your%20license%20key' +
  '&envLink=https%3A%2F%2Fgithub.com%2Faviadel%2Fjobflow-ai%23environment-variables' +
  '&project-name=jobflow-ai&repository-name=jobflow-ai'

const FEATURES = [
  { icon: '📄', title: 'CV generation',       slug: 'cv-generation',       desc: 'Tailored CV per application. Self-correcting AI pass. Section-by-section regen until you approve.' },
  { icon: '✉️', title: 'Cover letters',       slug: 'cover-letters',       desc: 'Written in parallel with your CV. Matches your voice and tone. Custom-prompt regen per section.' },
  { icon: '🔍', title: 'JD Decode',           slug: 'jd-decode',           desc: 'Extract role requirements, keywords, and a fit verdict against your profile in one click.' },
  { icon: '📊', title: 'Application tracker', slug: 'application-tracker', desc: 'Status, notes, and history - stored in your own instance, never shared with anyone.' },
  { icon: '🔬', title: 'Resume audit',        slug: 'resume-audit',        desc: 'ATS compatibility check, keyword gap analysis, and LinkedIn consistency review.', pro: true },
  { icon: '💬', title: 'Application Q&A',     slug: 'application-qa',      desc: 'Paste 1-4 free-text questions from the application form. Claude answers in your voice.', pro: true },
] as const

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

const RESPONSIVE = `
:root {
  --b:#2563EB;--bl:#3B82F6;--b50:#EFF6FF;--b100:#DBEAFE;--bd:#1E40AF;--b900:#1E3A8A;
  --am:#D97706;--aml:#FEF3C7;--pu:#7C3AED;--pul:#EDE9FE;
  --cy:#0891B2;--cyl:#ECFEFF;--ok:#059669;--okl:#D1FAE5;--er:#DC2626;--erl:#FEE2E2;
  --bg:#F8FAFC;--bg2:#F1F5F9;--ca:#FFFFFF;--bo:#CBD5E1;--bo2:#E2E8F0;
  --t1:#0F172A;--t2:#475569;--t3:#64748B;--t4:#94A3B8;
  --nb:rgba(248,250,252,0.93);
  --ss:0 1px 3px rgba(0,0,0,.06);--sm:0 4px 12px rgba(0,0,0,.09);--sl:0 8px 24px rgba(0,0,0,.12);
  --sg:0 0 36px rgba(37,99,235,.13);
  --r1:6px;--r2:10px;--r3:16px;--sp:80px;
  --fd:'Outfit',system-ui,sans-serif;--fb:'DM Sans',system-ui,sans-serif;
}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --b:#60A5FA;--bl:#93C5FD;--b50:#172554;--b100:#1E3A5F;--bd:#3B82F6;--b900:#EFF6FF;
  --am:#FBBF24;--aml:#422006;--pu:#A78BFA;--pul:#2E1065;
  --cy:#22D3EE;--cyl:#083344;--ok:#34D399;--okl:#064E3B;--er:#F87171;--erl:#450A0A;
  --bg:#0B1120;--bg2:#111827;--ca:#1E293B;--bo:#334155;--bo2:#1E293B;
  --t1:#F1F5F9;--t2:#94A3B8;--t3:#64748B;--t4:#475569;--nb:rgba(11,17,32,0.93);
  --ss:0 1px 3px rgba(0,0,0,.4);--sm:0 4px 12px rgba(0,0,0,.5);--sl:0 8px 24px rgba(0,0,0,.6);
}}
:root[data-theme="dark"]{
  --b:#60A5FA;--bl:#93C5FD;--b50:#172554;--b100:#1E3A5F;--bd:#3B82F6;--b900:#EFF6FF;
  --am:#FBBF24;--aml:#422006;--pu:#A78BFA;--pul:#2E1065;
  --cy:#22D3EE;--cyl:#083344;--ok:#34D399;--okl:#064E3B;--er:#F87171;--erl:#450A0A;
  --bg:#0B1120;--bg2:#111827;--ca:#1E293B;--bo:#334155;--bo2:#1E293B;
  --t1:#F1F5F9;--t2:#94A3B8;--t3:#64748B;--t4:#475569;--nb:rgba(11,17,32,0.93);
  --ss:0 1px 3px rgba(0,0,0,.4);--sm:0 4px 12px rgba(0,0,0,.5);--sl:0 8px 24px rgba(0,0,0,.6);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:var(--fb);background:var(--bg);color:var(--t1);-webkit-font-smoothing:antialiased;overflow-x:hidden;line-height:1.6}
a{color:inherit;text-decoration:none}
.jw{max-width:1120px;margin:0 auto;padding-inline:20px}

/* NAV */
.jnav{position:sticky;top:env(safe-area-inset-top,0px);z-index:100;background:var(--nb);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--bo);transition:box-shadow .3s}
.jnav.jsc{box-shadow:0 2px 16px rgba(0,0,0,.07)}
.jni{display:flex;align-items:center;justify-content:space-between;height:62px;gap:10px}
.jlogo{display:flex;align-items:center;gap:9px;font-family:var(--fd);font-weight:700;font-size:1rem;color:var(--t1)}
.jlogoi{width:30px;height:30px;background:linear-gradient(135deg,var(--b),var(--pu));border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.jnl{display:flex;align-items:center;gap:2px;list-style:none}
.jnl a{font-size:.85rem;font-weight:500;color:var(--t2);padding:5px 11px;border-radius:var(--r1);transition:color .15s,background .15s;white-space:nowrap}
.jnl a:hover{color:var(--b);background:var(--b50)}
.jncta{background:var(--b)!important;color:#fff!important;font-weight:600!important;box-shadow:0 2px 8px rgba(37,99,235,.22)}
.jncta:hover{filter:brightness(1.08)!important;background:var(--b)!important}
.jntog{display:none;background:none;border:1.5px solid var(--bo);padding:6px;border-radius:var(--r1);color:var(--t2);line-height:0;flex-shrink:0;cursor:pointer}
.jntog svg{width:18px;height:18px;display:block}

/* HERO */
.jhero{padding-block:72px 52px;position:relative;overflow:hidden}
.jhero::before{content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(37,99,235,.09) 1px,transparent 1px);background-size:28px 28px;mask-image:radial-gradient(ellipse 75% 70% at 50% 40%,black 20%,transparent 72%);-webkit-mask-image:radial-gradient(ellipse 75% 70% at 50% 40%,black 20%,transparent 72%);pointer-events:none}
.jhg{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;position:relative;z-index:1}
.jbadge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:var(--b50);border:1px solid var(--b100);border-radius:999px;font-size:.76rem;font-weight:600;color:var(--b);margin-bottom:18px}
.jbdot{width:6px;height:6px;background:var(--ok);border-radius:50%;animation:jdp 2s infinite;display:inline-block}
@keyframes jdp{0%,100%{opacity:1}50%{opacity:.45}}
.jhero h1{font-family:var(--fd);font-size:clamp(1.85rem,4vw,3rem);font-weight:800;line-height:1.15;letter-spacing:-.03em;margin-bottom:16px;text-wrap:balance}
.jgr{background:linear-gradient(135deg,var(--b),var(--bl),var(--am));background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.jhsub{font-size:.98rem;color:var(--t2);line-height:1.75;max-width:490px;margin-bottom:26px}
.jctas{display:flex;gap:9px;flex-wrap:wrap;margin-bottom:20px}
.jbp{display:inline-flex;align-items:center;gap:6px;padding:11px 22px;background:linear-gradient(135deg,var(--b),#6D28D9);color:#fff;border-radius:var(--r2);font-weight:700;font-size:.92rem;box-shadow:0 4px 12px rgba(109,40,217,.2);transition:all .2s}
.jbp:hover{filter:brightness(1.1);transform:translateY(-2px);box-shadow:0 6px 20px rgba(109,40,217,.3)}
.jbs{display:inline-flex;align-items:center;gap:6px;padding:11px 22px;background:var(--ca);color:var(--t1);border:1.5px solid var(--bo);border-radius:var(--r2);font-weight:600;font-size:.92rem;transition:all .2s}
.jbs:hover{border-color:var(--b);color:var(--b);transform:translateY(-1px)}
.jproof{display:flex;gap:16px;flex-wrap:wrap;font-size:.8rem;color:var(--t3)}
.jproof span{display:flex;align-items:center;gap:5px}
.jck{color:var(--ok);font-weight:700}

/* TYPEWRITER WIDGET */
.jtw{background:var(--bg2);border:1.5px solid var(--bo);border-radius:var(--r3);padding:16px;box-shadow:var(--sl)}
.jtwh{display:flex;align-items:center;justify-content:space-between;margin-bottom:11px}
.jtwwho{display:flex;align-items:center;gap:8px}
.jtwav{width:28px;height:28px;background:linear-gradient(135deg,#1E293B,#0F172A);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.jtwav svg{width:14px;height:14px}
.jtwname{font-size:.7rem;font-weight:700;color:var(--t1)}
.jtwsub{font-size:.6rem;color:var(--t3)}
.jtwbadge{font-size:.62rem;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--okl);color:var(--ok)}
.jpaper{background:var(--ca);border:1px solid var(--bo);border-radius:var(--r2);padding:12px;margin-bottom:9px;max-height:148px;overflow:hidden}
.jcvn{font-size:.68rem;font-weight:800;color:var(--t1);text-transform:uppercase;letter-spacing:.05em;margin-bottom:1px}
.jcvm{font-size:.58rem;color:var(--t3);margin-bottom:7px}
.jcvd{border-top:1px solid var(--bo2);margin:4px 0}
.jcvs{font-size:.56rem;font-weight:700;color:var(--b);text-transform:uppercase;letter-spacing:.07em;margin-bottom:2px}
.jcvl{font-size:.6rem;color:var(--t2);line-height:1.55}
.jkeys{display:flex;gap:2px;flex-wrap:wrap;justify-content:center;margin-bottom:8px}
.jkey{width:20px;height:17px;background:var(--ca);border:1px solid var(--bo);border-radius:3px;font-size:.46rem;display:flex;align-items:center;justify-content:center;color:var(--t3);font-weight:700;box-shadow:0 1.5px 0 var(--bo)}
.jkey.jon{background:var(--b50);border-color:var(--b);color:var(--b)}
.jtwst{display:flex;align-items:center;justify-content:space-between;padding:7px 10px;background:var(--ca);border:1px solid var(--bo);border-radius:var(--r1);margin-bottom:10px}
.jsdot{width:7px;height:7px;border-radius:50%;background:var(--ok);flex-shrink:0}
.jstxt{font-size:.66rem;font-weight:600;color:var(--t2);margin-left:6px}
.jstm{font-size:.66rem;font-weight:700;color:var(--b)}
.jcvout{background:var(--ca);border:2px solid var(--ok);border-radius:var(--r2);padding:11px}
.jcvouth{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.jcvic{width:28px;height:28px;background:var(--okl);border-radius:var(--r1);display:flex;align-items:center;justify-content:center;font-size:.8rem;flex-shrink:0}
.jcvinfo h4{font-size:.7rem;font-weight:700;color:var(--t1)}
.jcvinfo span{font-size:.6rem;color:var(--ok);font-weight:600}
.jcvbtns{display:flex;gap:5px;margin-bottom:7px}
.jcvb{padding:4px 10px;border-radius:var(--r1);font-size:.63rem;font-weight:600;border:none;cursor:default;font-family:inherit}
.jcvbp{background:var(--b);color:#fff}.jcvbg{background:var(--bg2);color:var(--t2)}
.jclr{display:flex;align-items:center;gap:6px;font-size:.64rem;color:var(--t2)}
.jclic{width:20px;height:20px;background:var(--b50);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:.65rem;flex-shrink:0}

/* STATS */
.jstats{padding-block:32px;background:var(--bg2);border-top:1px solid var(--bo);border-bottom:1px solid var(--bo)}
.jstatsg{display:grid;grid-template-columns:repeat(4,1fr)}
.jstat{text-align:center;padding:12px 8px;border-right:1px solid var(--bo)}
.jstat:last-child{border-right:none}
.jstatv{font-family:var(--fd);font-size:clamp(1.6rem,2.4vw,2.2rem);font-weight:800;line-height:1.1}
.jstat:nth-child(1) .jstatv{color:var(--b)}
.jstat:nth-child(2) .jstatv{color:var(--pu)}
.jstat:nth-child(3) .jstatv{color:var(--am)}
.jstat:nth-child(4) .jstatv{color:var(--cy)}
.jstatl{font-size:.78rem;color:var(--t3);margin-top:3px}

/* SECTION COMMON */
.jsec{padding-block:var(--sp)}
.jseca{background:var(--bg2)}
.jshd{text-align:center;margin-bottom:44px}
.jeyb{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--b);margin-bottom:9px;display:inline-flex;align-items:center;gap:6px}
.jeyb::before{content:'';width:16px;height:2px;background:var(--b);border-radius:1px}
.jshd .jeyb{justify-content:center}
.jsttl{font-family:var(--fd);font-size:clamp(1.5rem,2.8vw,2.05rem);font-weight:800;letter-spacing:-.025em;margin-bottom:9px;text-wrap:balance}
.jssub{font-size:.95rem;color:var(--t2);max-width:520px;margin-inline:auto;line-height:1.7}

/* FEATURES */
.jfeatg{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.jfc{padding:22px;background:var(--ca);border:1.5px solid var(--bo);border-radius:var(--r3);transition:all .3s;display:block;color:inherit;position:relative}
.jfc::before{content:'';position:absolute;inset:-1.5px;border-radius:var(--r3);background:linear-gradient(135deg,var(--b),var(--am));opacity:0;transition:opacity .3s;z-index:-1;padding:1.5px;mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask-composite:exclude;-webkit-mask-composite:xor}
.jfc:hover{border-color:transparent;box-shadow:var(--sl),var(--sg);transform:translateY(-4px)}
.jfc:hover::before{opacity:1}
.jfcic{width:38px;height:38px;border-radius:var(--r2);display:flex;align-items:center;justify-content:center;font-size:1.05rem;margin-bottom:11px}
.jib{background:var(--b50)}.jia{background:var(--aml)}.jip{background:var(--pul)}.jic{background:var(--cyl)}
.jfc h3{font-family:var(--fd);font-size:.88rem;font-weight:700;margin-bottom:5px}
.jprot{display:inline-block;background:var(--aml);color:var(--am);font-size:.55rem;font-weight:800;padding:2px 5px;border-radius:3px;margin-left:4px;vertical-align:middle;text-transform:uppercase}
.jfc p{font-size:.8rem;color:var(--t2);line-height:1.6}

/* INCENTIVES */
.jincg{display:grid;grid-template-columns:1fr 1fr;gap:44px;align-items:center}
.jincv{display:flex;flex-direction:column;gap:12px}
.jinca{padding:18px;border-radius:var(--r3);border:2px solid}
.jinb{background:var(--erl);border-color:var(--er)}
.jing{background:var(--okl);border-color:var(--ok)}
.jincl{font-size:.64rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;display:flex;align-items:center;gap:5px}
.jinb .jincl{color:var(--er)}.jing .jincl{color:var(--ok)}
.jincr{display:flex;align-items:flex-start;gap:7px;padding:3px 0;font-size:.82rem;color:var(--t1)}
.jvs{text-align:center;font-size:.65rem;font-weight:800;color:var(--t4);text-transform:uppercase;letter-spacing:.12em;position:relative;padding:2px 0}
.jvs::before,.jvs::after{content:'';position:absolute;top:50%;height:1px;width:34px;background:var(--bo)}
.jvs::before{right:calc(50% + 16px)}.jvs::after{left:calc(50% + 16px)}
.jinct .jsttl,.jinct .jssub,.jinct .jeyb{text-align:left;margin-inline:0;justify-content:flex-start}
.jincq{margin-top:18px;padding:14px 16px;background:var(--ca);border-left:3px solid var(--b);border-radius:0 var(--r2) var(--r2) 0;font-size:.88rem;font-style:italic;color:var(--t2);line-height:1.75;box-shadow:var(--ss)}

/* HOW IT WORKS */
.jstepsg{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
.jstep{padding:20px 16px;background:var(--ca);border:1.5px solid var(--bo);border-radius:var(--r3);transition:all .3s}
.jstep:hover{transform:translateY(-3px);box-shadow:var(--sl),var(--sg);border-color:var(--b)}
.jstepn{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;color:#fff;font-size:.78rem;font-weight:800;margin-bottom:10px;font-family:var(--fd)}
.jstep:nth-child(1) .jstepn{background:var(--b)}
.jstep:nth-child(2) .jstepn{background:var(--pu)}
.jstep:nth-child(3) .jstepn{background:var(--cy)}
.jstep:nth-child(4) .jstepn{background:var(--am)}
.jstep h3{font-family:var(--fd);font-size:.87rem;font-weight:700;margin-bottom:5px}
.jstep p{font-size:.78rem;color:var(--t2);line-height:1.6}
.jstept{display:inline-flex;align-items:center;gap:3px;margin-top:8px;font-size:.65rem;font-weight:600;padding:2px 6px;border-radius:999px}
.jstep:nth-child(1) .jstept{color:var(--b);background:var(--b50)}
.jstep:nth-child(2) .jstept{color:var(--pu);background:var(--pul)}
.jstep:nth-child(3) .jstept{color:var(--cy);background:var(--cyl)}
.jstep:nth-child(4) .jstept{color:var(--am);background:var(--aml)}
.jinst{display:flex;align-items:center;gap:16px;padding:16px 20px;background:var(--ca);border:1.5px solid var(--bo);border-radius:var(--r3);box-shadow:var(--ss)}
.jinstic{width:40px;height:40px;background:var(--b50);border-radius:var(--r2);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0}
.jinsttx h4{font-family:var(--fd);font-size:.88rem;font-weight:700;margin-bottom:2px}
.jinsttx p{font-size:.77rem;color:var(--t2)}
.jinstbtn{margin-left:auto;display:inline-flex;align-items:center;gap:5px;padding:8px 14px;background:var(--b);color:#fff;border-radius:var(--r2);font-size:.77rem;font-weight:600;white-space:nowrap;flex-shrink:0;transition:all .2s;box-shadow:0 2px 8px rgba(37,99,235,.2)}
.jinstbtn:hover{filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 4px 14px rgba(37,99,235,.3)}

/* PRICING */
.jpcg{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;align-items:start}
.jpc{padding:24px 20px;background:var(--ca);border:1.5px solid var(--bo);border-radius:var(--r3);position:relative;overflow:hidden}
.jpc::before{content:'';position:absolute;top:0;left:0;right:0;height:3px}
.jpc:nth-child(1)::before{background:var(--b)}
.jpc:nth-child(2)::before{background:linear-gradient(90deg,var(--b),var(--pu))}
.jpc:nth-child(3)::before{background:var(--t4)}
.jpc.jpcf{border-color:var(--b);box-shadow:var(--sl),var(--sg);transform:scale(1.03)}
.jpcbadge{position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,var(--b),var(--pu));color:#fff;padding:3px 12px;border-radius:999px;font-size:.63rem;font-weight:700;white-space:nowrap;box-shadow:0 2px 10px rgba(124,58,237,.25)}
.jpctier{font-size:.77rem;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px}
.jpcpr{font-family:var(--fd);font-size:2.3rem;font-weight:800;color:var(--t1);line-height:1.1}
.jpcpr .jcur{font-size:1.1rem;vertical-align:super}
.jpcpd{font-size:.8rem;color:var(--t3);margin-bottom:18px}
.jpcfl{list-style:none;margin-bottom:20px}
.jpcfl li{display:flex;align-items:flex-start;gap:7px;padding:5px 0;font-size:.81rem;color:var(--t2);border-bottom:1px solid var(--bo2)}
.jpcfl li:last-child{border-bottom:none}
.jpck{color:var(--ok);font-weight:700;flex-shrink:0;margin-top:1px}
.jpcd{color:var(--t4);flex-shrink:0}
.jpcbtn{display:block;width:100%;padding:11px;text-align:center;border-radius:var(--r2);font-weight:700;font-size:.88rem;border:none;cursor:pointer;transition:all .2s;font-family:inherit}
.jpbp{background:linear-gradient(135deg,var(--b),var(--pu));color:#fff;box-shadow:0 4px 12px rgba(124,58,237,.2)}
.jpbp:hover{filter:brightness(1.08);transform:translateY(-2px)}
.jpbs{background:var(--bg2);color:var(--t1)}.jpbs:hover{background:var(--b50);color:var(--b)}
.jpbd{background:var(--bg2);color:var(--t3);cursor:not-allowed;opacity:.65}
.jpcnote{text-align:center;margin-top:22px;font-size:.84rem;color:var(--t3)}

/* FAQ */
.jfaql{max-width:680px;margin-inline:auto;display:flex;flex-direction:column;gap:8px}
.jfaqi{background:var(--ca);border:1.5px solid var(--bo);border-radius:var(--r2);overflow:hidden}
.jfaqq{display:flex;align-items:center;justify-content:space-between;padding:13px 17px;cursor:pointer;font-weight:600;font-size:.88rem;background:none;border:none;width:100%;text-align:left;color:var(--t1);gap:10px;font-family:var(--fb);transition:color .15s}
.jfaqq:hover{color:var(--b)}
.jfaqch{width:15px;height:15px;flex-shrink:0;color:var(--t3);transition:transform .3s}
.jfaqi.jfaqo .jfaqch{transform:rotate(180deg)}
.jfaqa{max-height:0;overflow:hidden;transition:max-height .4s ease}
.jfaqi.jfaqo .jfaqa{max-height:240px}
.jfaqai{padding:0 17px 13px;font-size:.845rem;color:var(--t2);line-height:1.75}

/* CTA BANNER */
.jcta{padding-block:60px;text-align:center;background:linear-gradient(135deg,var(--b900),var(--bd),var(--b900),var(--b));background-size:300% 300%;animation:jcsh 10s ease-in-out infinite;color:#fff;position:relative;overflow:hidden}
.jcta::before{content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px);background-size:22px 22px}
@keyframes jcsh{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.jcta h2{font-family:var(--fd);font-size:clamp(1.3rem,2.8vw,1.8rem);font-weight:800;margin-bottom:9px;position:relative;z-index:1;text-wrap:balance}
.jcta p{font-size:.95rem;opacity:.85;margin-bottom:24px;max-width:440px;margin-inline:auto;position:relative;z-index:1;line-height:1.65}
.jbgh{display:inline-flex;align-items:center;gap:6px;padding:11px 24px;background:transparent;color:#fff;border:2px solid rgba(255,255,255,.7);border-radius:var(--r2);font-weight:700;font-size:.9rem;transition:all .2s;position:relative;z-index:1}
.jbgh:hover{background:rgba(255,255,255,.1);border-color:#fff}

/* FOOTER */
.jfoot{padding-block:22px;position:relative}
.jfoot::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--b),var(--pu),var(--cy),var(--am));opacity:.3}
.jfooti{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.jfootbr{display:flex;align-items:center;gap:7px;font-family:var(--fd);font-weight:700;color:var(--b);font-size:.9rem}
.jfootbric{width:24px;height:24px;background:linear-gradient(135deg,var(--b),var(--pu));border-radius:5px;display:flex;align-items:center;justify-content:center}
.jftlks{display:flex;gap:16px;list-style:none;flex-wrap:wrap;align-items:center}
.jftlks a{font-size:.78rem;color:var(--t3);transition:color .15s}
.jftlks a:hover{color:var(--b)}
.jf-email::after{content:attr(data-u) "\\40" attr(data-d);font-size:.78rem;color:var(--t3)}
.jftnote{font-size:.7rem;color:var(--t4);width:100%;margin-top:2px}

/* RESPONSIVE */
@media(max-width:1000px){
  .jhg{grid-template-columns:1fr;gap:28px}
  .jhct{text-align:center}
  .jhsub,.jproof{margin-inline:auto}
  .jctas{justify-content:center}
  .jproof{justify-content:center}
  .jtw{max-width:400px;margin-inline:auto}
  .jfeatg{grid-template-columns:repeat(2,1fr)}
  .jstepsg{grid-template-columns:repeat(2,1fr)}
  .jincg{grid-template-columns:1fr;gap:24px}
  .jinct .jsttl,.jinct .jssub,.jinct .jeyb{text-align:center;margin-inline:auto;justify-content:center}
  .jincv{max-width:420px;margin-inline:auto}
}
@media(max-width:820px){
  .jntog{display:flex;align-items:center;justify-content:center}
  .jnl{display:none;position:fixed;top:62px;left:0;right:0;flex-direction:column;background:var(--ca);border-bottom:1px solid var(--bo);padding:12px 20px 16px;gap:2px;box-shadow:var(--sl);align-items:flex-start}
  .jnl.jnlo{display:flex}
  .jnl a{font-size:.95rem;width:100%;padding:9px 12px}
}
@media(max-width:720px){
  :root{--sp:52px}
  .jstatsg{grid-template-columns:repeat(2,1fr)}
  .jstat:nth-child(2){border-right:none}
  .jstat:nth-child(1),.jstat:nth-child(2){border-bottom:1px solid var(--bo)}
  .jfeatg{grid-template-columns:1fr}
  .jstepsg{grid-template-columns:1fr}
  .jpcg{grid-template-columns:1fr;max-width:340px;margin-inline:auto}
  .jpc.jpcf{transform:none}
  .jinst{flex-direction:column;align-items:flex-start}
  .jinstbtn{width:100%;justify-content:center;margin-left:0}
  .jfooti{justify-content:center;text-align:center}
  .jftlks{justify-content:center}
}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}
`

const JS_CODE = `
(function(){
'use strict';
var nav=document.getElementById('jf-nav');
if(nav)window.addEventListener('scroll',function(){nav.classList.toggle('jsc',window.scrollY>8);},{passive:true});
var tog=document.getElementById('jf-tog');var lks=document.getElementById('jf-lks');
if(tog&&lks){
  tog.addEventListener('click',function(){var o=lks.classList.toggle('jnlo');tog.setAttribute('aria-expanded',String(o));});
  lks.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){lks.classList.remove('jnlo');tog.setAttribute('aria-expanded','false');});});
}
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){var t=document.querySelector(this.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});if(lks){lks.classList.remove('jnlo');if(tog)tog.setAttribute('aria-expanded','false');}}});
});
document.querySelectorAll('.jfaqq').forEach(function(btn){
  btn.addEventListener('click',function(){
    var item=this.parentElement;var was=item.classList.contains('jfaqo');
    document.querySelectorAll('.jfaqi').forEach(function(fi){fi.classList.remove('jfaqo');fi.querySelector('.jfaqq').setAttribute('aria-expanded','false');});
    if(!was){item.classList.add('jfaqo');this.setAttribute('aria-expanded','true');}
  });
});
})();
`

const FEAT_COLOR: Record<string, string> = {
  'cv-generation': 'jib', 'cover-letters': 'jia', 'jd-decode': 'jip',
  'application-tracker': 'jib', 'resume-audit': 'jia', 'application-qa': 'jic',
}

const LogoSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="18" cy="5" r="3" fill="white"/>
    <circle cx="6" cy="12" r="3" fill="white"/>
    <circle cx="18" cy="19" r="3" fill="white"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const ArrowRight = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const Chevron = () => (
  <svg className="jfaqch" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
  </svg>
)

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: RESPONSIVE }} />

      {/* NAV */}
      <nav className="jnav" id="jf-nav">
        <div className="jw">
          <div className="jni">
            <Link href="/" className="jlogo">
              <span className="jlogoi"><LogoSvg /></span>
              JobFlow AI
            </Link>
            <button className="jntog" id="jf-tog" type="button" aria-label="Toggle menu" aria-expanded="false" aria-controls="jf-lks">
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="2" y1="5" x2="16" y2="5"/>
                <line x1="2" y1="9" x2="16" y2="9"/>
                <line x1="2" y1="13" x2="16" y2="13"/>
              </svg>
            </button>
            <ul className="jnl" id="jf-lks">
              <li><a href="#features">Features</a></li>
              <li><Link href="/how-it-works">How It Works</Link></li>
              <li><a href="#why-saas">Why Not SaaS</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#pricing" className="jncta">Get JobFlow</a></li>
            </ul>
          </div>
        </div>
      </nav>

      <main id="main">

        {/* HERO */}
        <section className="jhero">
          <div className="jw">
            <div className="jhg">
              <div className="jhct">
                <div className="jbadge">
                  <span className="jbdot" />&nbsp;Powered by Claude AI
                </div>
                <h1>A <span className="jgr">tailored CV</span> for every application.</h1>
                <p className="jhsub">Paste a job description. JobFlow decodes it, writes a tailored CV, and drafts a cover letter - in under 2 minutes. Self-hosted on Vercel. One-time purchase. Your data never leaves your server.</p>
                <div className="jctas">
                  <a href="#pricing" className="jbp">Get JobFlow - from &euro;25 <ArrowRight /></a>
                  <a href={DEPLOY_URL} className="jbs" target="_blank" rel="noopener noreferrer">
                    Deploy to Vercel&nbsp;
                    <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                      <path d="M4 1h9v9m0-9L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
                <div className="jproof">
                  <span><span className="jck">&#10003;</span> One-time purchase</span>
                  <span><span className="jck">&#10003;</span> Self-hosted</span>
                  <span><span className="jck">&#10003;</span> No subscriptions</span>
                </div>
              </div>

              {/* Typewriter widget - end state */}
              <div className="jtw" role="img" aria-label="JobFlow AI generating a tailored CV">
                <div className="jtwh">
                  <div className="jtwwho">
                    <div className="jtwav">
                      <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="18" cy="5" r="3" fill="#93C5FD"/>
                        <circle cx="6" cy="12" r="3" fill="#93C5FD"/>
                        <circle cx="18" cy="19" r="3" fill="#93C5FD"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="#93C5FD" strokeWidth="1.8" strokeLinecap="round"/>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="#93C5FD" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <div className="jtwname">JobFlow AI</div>
                      <div className="jtwsub">Generating&hellip;</div>
                    </div>
                  </div>
                  <span className="jtwbadge">&#10003; Done</span>
                </div>
                <div className="jpaper">
                  <div className="jcvn">Alex Rivera</div>
                  <div className="jcvm">Senior Software Engineer &middot; London, UK</div>
                  <div className="jcvd" />
                  <div className="jcvs">Professional Summary</div>
                  <div className="jcvl">Senior engineer with 8+ years building distributed systems. Go, AWS, Kubernetes. Led team delivering 40% API latency reduction.</div>
                  <div className="jcvd" />
                  <div className="jcvs">Technical Skills</div>
                  <div className="jcvl">Go &middot; Python &middot; TypeScript &middot; AWS &middot; GCP &middot; Kubernetes &middot; PostgreSQL &middot; Redis</div>
                  <div className="jcvd" />
                  <div className="jcvs">Experience</div>
                  <div className="jcvl">Lead Engineer - Acme Corp (2019-2024) - Microservices migration, reduced API latency 40%, mentored 4 junior engineers</div>
                </div>
                <div className="jkeys" aria-hidden="true">
                  {['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V'].map((k, i) => (
                    <div key={i} className={`jkey${['E','T','I','S','K','C'].includes(k) ? ' jon' : ''}`}>{k}</div>
                  ))}
                </div>
                <div className="jtwst">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="jsdot" />
                    <span className="jstxt">Done - documents ready</span>
                  </div>
                  <span className="jstm">1.8s</span>
                </div>
                <div className="jcvout">
                  <div className="jcvouth">
                    <div className="jcvic">&#128196;</div>
                    <div className="jcvinfo">
                      <h4>senior_engineer_cv.docx</h4>
                      <span>&#10003; Ready to download</span>
                    </div>
                  </div>
                  <div className="jcvbtns">
                    <button className="jcvb jcvbp">.docx &#8595;</button>
                    <button className="jcvb jcvbg">Preview</button>
                  </div>
                  <div className="jclr">
                    <div className="jclic">&#9993;</div>
                    <span><strong>cover_letter.docx</strong>&nbsp;&nbsp;&#10003; Generated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="jstats">
          <div className="jw">
            <div className="jstatsg">
              <div className="jstat"><div className="jstatv">&lt;2 min</div><div className="jstatl">Per application</div></div>
              <div className="jstat"><div className="jstatv">1&times;</div><div className="jstatl">One-time payment</div></div>
              <div className="jstat"><div className="jstatv">0</div><div className="jstatl">Subscriptions, ever</div></div>
              <div className="jstat"><div className="jstatv">&infin;</div><div className="jstatl">Applications/month</div></div>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <section className="jsec" id="features">
          <div className="jw">
            <div className="jshd">
              <div className="jeyb">Features</div>
              <h2 className="jsttl">Everything you need to land the job</h2>
              <p className="jssub">From decoding the job description to downloading a polished CV - JobFlow handles the entire application workflow.</p>
            </div>
            <div className="jfeatg">
              {FEATURES.map(f => (
                <Link key={f.slug} href={`/features/${f.slug}`} className="jfc">
                  <div className={`jfcic ${FEAT_COLOR[f.slug]}`}>{f.icon}</div>
                  <h3>
                    {f.title}
                    {'pro' in f && f.pro && <span className="jprot">PRO</span>}
                  </h3>
                  <p>{f.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* MISALIGNED INCENTIVES */}
        <section className="jsec jseca" id="why-saas">
          <div className="jw">
            <div className="jincg">
              <div className="jincv">
                <div className="jinca jinb">
                  <div className="jincl">&#10060; SaaS CV Tools</div>
                  <div className="jincr"><span>&#128176;</span><span><strong>$29/month</strong> - you pay as long as you&apos;re searching</span></div>
                  <div className="jincr"><span>&#128148;</span><span>Their business model: <strong>the longer you search, the more they earn</strong></span></div>
                  <div className="jincr"><span>&#128274;</span><span>Lose access to your own CVs when you cancel</span></div>
                </div>
                <div className="jvs">VS</div>
                <div className="jinca jing">
                  <div className="jincl">&#10004; JobFlow AI</div>
                  <div className="jincr"><span>&#128176;</span><span><strong>&euro;25 once</strong> - same tool forever, no matter how long you search</span></div>
                  <div className="jincr"><span>&#128154;</span><span>We <strong>want</strong> you to get hired fast - you already paid</span></div>
                  <div className="jincr"><span>&#128275;</span><span>Your data, your server, your CVs - forever</span></div>
                </div>
              </div>
              <div className="jinct">
                <div className="jeyb">Think About It</div>
                <h2 className="jsttl">SaaS CV tools are the dating apps of job search.</h2>
                <p className="jssub">A dating app profits when you don&apos;t find a match. A subscription CV tool profits when your search drags on. Their incentives are misaligned with yours by design.</p>
                <div className="jincq">JobFlow flips the model. <strong>Pay once, search forever.</strong> We have zero financial incentive to keep you searching. The faster you land the job, the more value you got.</div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="jsec" id="how-it-works-s">
          <div className="jw">
            <div className="jshd">
              <div className="jeyb">Setup</div>
              <h2 className="jsttl">Up and running in 10 minutes</h2>
              <p className="jssub">Deploy once. Use forever. Your API key, your data, your server.</p>
            </div>
            <div className="jstepsg">
              <div className="jstep">
                <div className="jstepn">1</div>
                <h3>Deploy to Vercel</h3>
                <p>Click deploy, add your API keys and license key. Set up a free Postgres database.</p>
                <span className="jstept">&#9201; 3 min</span>
              </div>
              <div className="jstep">
                <div className="jstepn">2</div>
                <h3>Verify Config</h3>
                <p>Visit your Vercel URL, sign in, and confirm all config checks are green.</p>
                <span className="jstept">&#9201; 1 min</span>
              </div>
              <div className="jstep">
                <div className="jstepn">3</div>
                <h3>Set Up Profile</h3>
                <p>Upload your CV, paste your LinkedIn bio, and define target roles. Your base template.</p>
                <span className="jstept">&#9201; 5 min</span>
              </div>
              <div className="jstep">
                <div className="jstepn">4</div>
                <h3>Generate and Apply</h3>
                <p>Paste any job description, hit Generate. Download tailored CV + cover letter as .docx.</p>
                <span className="jstept">&#9201; 2 min</span>
              </div>
            </div>
            <div className="jinst">
              <div className="jinstic">&#128214;</div>
              <div className="jinsttx">
                <h4>Need a detailed walkthrough?</h4>
                <p>The installation guide covers every step - environment variables, Postgres setup, and troubleshooting.</p>
              </div>
              <Link href="/install" className="jinstbtn">
                View Installation Guide <ArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="jsec jseca" id="pricing">
          <div className="jw">
            <div className="jshd">
              <div className="jeyb">Pricing</div>
              <h2 className="jsttl">One-time purchase. Yours forever.</h2>
              <p className="jssub">Bring your own Anthropic API key. No subscription, no lock-in, no data leaving your server.</p>
            </div>
            <div className="jpcg">
              <div className="jpc">
                <div className="jpctier">Starter</div>
                <div className="jpcpr"><span className="jcur">&euro;</span>25</div>
                <div className="jpcpd">one-time</div>
                <ul className="jpcfl">
                  <li><span className="jpck">&#10003;</span> CV generation</li>
                  <li><span className="jpck">&#10003;</span> Cover letters</li>
                  <li><span className="jpck">&#10003;</span> JD Decode</li>
                  <li><span className="jpck">&#10003;</span> Application tracker</li>
                </ul>
                <a href={STARTER_URL} className="jpcbtn jpbs" target="_blank" rel="noopener noreferrer">Buy Starter &rarr;</a>
              </div>
              <div className="jpc jpcf">
                <div className="jpcbadge">&#9733; Best Value</div>
                <div className="jpctier">Professional</div>
                <div className="jpcpr"><span className="jcur">&euro;</span>49</div>
                <div className="jpcpd">one-time</div>
                <ul className="jpcfl">
                  <li><span className="jpck">&#10003;</span> Everything in Starter</li>
                  <li><span className="jpck">&#10003;</span> Resume audit</li>
                  <li><span className="jpck">&#10003;</span> Application Q&amp;A</li>
                  <li><span className="jpck">&#10003;</span> Postgres + Sheets storage</li>
                </ul>
                <a href={PRO_URL} className="jpcbtn jpbp" target="_blank" rel="noopener noreferrer">Buy Professional &rarr;</a>
              </div>
              <div className="jpc">
                <div className="jpctier">Lifetime</div>
                <div className="jpcpr" style={{ fontSize: '1.4rem', color: 'var(--t3)' }}>Coming Soon</div>
                <div className="jpcpd">&nbsp;</div>
                <ul className="jpcfl">
                  <li><span className="jpcd">-</span> Everything in Pro</li>
                  <li><span className="jpcd">-</span> AI job suggestions</li>
                  <li><span className="jpcd">-</span> Custom integrations</li>
                  <li style={{ border: 'none' }}>&nbsp;</li>
                </ul>
                <button className="jpcbtn jpbd" disabled>Coming Soon</button>
              </div>
            </div>
            <p className="jpcnote"><strong>Rezi Pro</strong> charges $29/month. JobFlow costs less - <strong>once</strong>.</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="jsec" id="faq">
          <div className="jw">
            <div className="jshd">
              <div className="jeyb">FAQ</div>
              <h2 className="jsttl">Common questions</h2>
            </div>
            <div className="jfaql">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="jfaqi">
                  <button className="jfaqq" type="button" aria-expanded="false">
                    {item.q}
                    <Chevron />
                  </button>
                  <div className="jfaqa">
                    <div className="jfaqai">{item.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="jcta">
          <div className="jw">
            <h2>Stop writing CVs from scratch.</h2>
            <p>Let AI tailor your CV to every job in under 2 minutes. One purchase. Unlimited applications.</p>
            <a href="#pricing" className="jbgh">Get JobFlow - from &euro;25 <ArrowRight /></a>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="jfoot">
        <div className="jw">
          <div className="jfooti">
            <div className="jfootbr">
              <span className="jfootbric"><LogoSvg /></span>
              JobFlow AI
            </div>
            <ul className="jftlks">
              <li><span className="jf-email" data-u="info" data-d="jobflow-ai.app" /></li>
              <li><Link href="/install">Install guide</Link></li>
              <li><Link href="/terms">Terms &amp; Conditions</Link></li>
              <li><Link href="/how-it-works">How it works</Link></li>
            </ul>
            <p className="jftnote">Self-hosted &middot; Vercel + Claude API &middot; One-time purchase &middot; &copy; 2025-2026 JobFlow AI</p>
          </div>
        </div>
      </footer>

      <script dangerouslySetInnerHTML={{ __html: JS_CODE }}></script>
    </>
  )
}
