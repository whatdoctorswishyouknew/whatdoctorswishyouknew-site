import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";

/**
 * WhatDoctorsWishYouKnew.com
 * ---------------------------------------------------------------------------
 * The truth, told like a friend. An ad-free, consumer-unbiased platform that
 * clarifies health claims with warmth AND competence.
 *
 * Drop this into a Vite + React + Tailwind project (StackBlitz, CodeSandbox,
 * or local). Layout uses Tailwind utilities; theme/fonts/animation live in the
 * injected <style> block so the look is fully portable.
 *
 * Brand alignment (per the WDWYK Manifesto v3.0):
 *  - Voice: warm + competent. Plain English. Name the uncertainty. "Improve," not "cure."
 *  - Structure: Truth Sandwich — lead with the truth, never let the myth be loudest.
 *  - Look: confident teal (trust) + a warm accent (humanity), clean and readable.
 *
 * FOUNDER DECISIONS still open (left as comments so they're easy to find):
 *  - HERO_TAGLINE is set to the manifesto's recommended line. Lock or swap it.
 *  - Attach a number to the north-star goal when you're ready (not shown in UI yet).
 *  - Replace placeholder citations/videos with your own vetted picks (see notes).
 * ---------------------------------------------------------------------------
 */

const HERO_TAGLINE = "Truth over hype. Facts over followers.";
const SUPPORT_LINE =
  "Protect your health. Keep your money. Know the truth.";
const HOOK_LINE = "What YOUR doctor wishes you knew — the truth you deserve.";
const SIGNATURE = "The truth isn't for sale. This is WhatDoctorsWishYouKnew.com";

/* Share text used when someone hits the "share this" mission button — written to read
   like a real text from a thoughtful friend, not a marketing pitch. */
const MISSION_SHARE_MESSAGE =
  "This is so needed! Thought it may help you too. Finally — a health site we can trust! :)";

/* ============================ DESIGN SYSTEM ============================== */
const GLOBAL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

:root{
  --paper:#F8F5EF;
  --paper-2:#FEFDF9;
  --ink:#15302D;
  --ink-soft:#436460;
  --trust:#0E7A80;        /* confident teal — competence & trust */
  --trust-deep:#0A565B;
  --trust-soft:#DCEFEF;
  --line:#E2DBCB;
  --warm:#DD7B43;         /* warm accent — humanity, used warmly, never alarmist */
  --warm-soft:#FBEAD9;
  --gold:#9C7A1E;
  --gold-soft:#F3E9CF;

  --g-strong:#1E7F5C;
  --g-mixed:#B07A1A;
  --g-minimal:#5B6660;
  --g-none:#3F4844;
  --g-danger:#B23B2E;
}

*{ box-sizing:border-box; }
.wdwyk-root{
  font-family:'Public Sans', ui-sans-serif, system-ui, sans-serif;
  color:var(--ink);
  background-color:var(--paper);
  background-image:
    radial-gradient(120% 80% at 50% -10%, rgba(14,122,128,0.08), transparent 60%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E");
  min-height:100vh;
}
.font-display{ font-family:'Fraunces', Georgia, serif; }
.font-mono{ font-family:'IBM Plex Mono', ui-monospace, monospace; }
.label-eyebrow{
  font-family:'IBM Plex Mono', monospace; text-transform:uppercase;
  letter-spacing:0.18em; font-size:11px; font-weight:500;
}

.wd-card{
  background:var(--paper-2);
  border:1px solid var(--line);
  border-radius:14px;
  box-shadow:0 1px 0 rgba(21,48,45,0.04), 0 14px 40px -28px rgba(21,48,45,0.5);
}
.hairline{ border-top:1px solid var(--line); }

.wd-search{ transition:box-shadow .2s ease, border-color .2s ease; }
.wd-search:focus-within{
  border-color:var(--trust);
  box-shadow:0 0 0 4px rgba(14,122,128,0.12), 0 18px 50px -30px rgba(21,48,45,0.55);
}

.btn{ transition:transform .12s ease, box-shadow .15s ease, background .15s ease; cursor:pointer; }
.btn:active{ transform:translateY(1px) scale(.985); }

.share-cta{ transition:transform .15s ease, box-shadow .2s ease, background .2s ease; }
.share-cta:hover{ transform:translateY(-1px); box-shadow:0 6px 18px -8px rgba(221,123,67,0.55); background:#FBE0C8; }
@keyframes sharePulse{ 0%,100%{ box-shadow:0 0 0 0 rgba(221,123,67,0); } 50%{ box-shadow:0 0 0 6px rgba(221,123,67,0.12); } }
.share-cta{ animation:sharePulse 2.6s ease-in-out infinite; }

.chip{ transition:all .15s ease; cursor:pointer; }
.chip:hover{ background:var(--ink); color:var(--paper); border-color:var(--ink); }
.chip-active{ background:var(--ink); color:var(--paper); border-color:var(--ink); }

@keyframes counterPop{
  0%{ transform:scale(1); }
  35%{ transform:scale(1.07); color:var(--trust); }
  100%{ transform:scale(1); }
}
.counter-pop{ animation:counterPop .5s ease; }

@keyframes riseIn{ from{ opacity:0; transform:translateY(10px);} to{opacity:1; transform:none;} }
.rise{ animation:riseIn .5s ease both; }

@keyframes slideDown{ from{ transform:translateY(-100%); } to{ transform:none; } }
.cobrand{ animation:slideDown .4s ease both; }

@keyframes toastIn{ from{opacity:0; transform:translateY(12px);} to{opacity:1; transform:none;} }
.toast{ animation:toastIn .3s ease both; }

a.cite{ color:var(--trust); text-decoration:none; border-bottom:1px solid rgba(14,122,128,0.35); }
a.cite:hover{ color:var(--trust-deep); border-bottom-color:var(--trust); }

@media print{
  .no-print{ display:none !important; }
  .wdwyk-root{ background:#fff !important; }
  .print-area{ box-shadow:none !important; border:none !important; }
  .print-stack{ display:block !important; }
  .print-stack > *{ width:100% !important; }
}
`;

/* ============================ SAMPLE DATABASE ============================ */
/* Every summary is a TEMPLATE — verify each line yourself before publishing.
   Citation links are PubMed *search* URLs (never fabricated, never 404).
   Replace with specific vetted PMIDs once you've chosen the papers.
   grade ∈ Strong | Mixed | Minimal | No Evidence | Potentially Dangerous   */
const EVIDENCE_DB = [
  {
    id: "berberine",
    title: "Berberine",
    aliases: ["berberine", "natures ozempic", "nature's ozempic", "ozempic supplement"],
    category: ["supplements", "metabolic-health", "weight-loss", "claim-checks"],
    grade: "Mixed",
    recommendation: "consider",
    bottomLine:
      "It can modestly nudge blood sugar and cholesterol — but it isn't Ozempic, and it isn't a weight-loss shortcut.",
    claim: 'Sold online as "Nature\u2019s Ozempic" for blood sugar control and weight loss.',
    // The fast answer the person actually came for:
    worthIt: {
      health: "Possible small benefit for blood sugar and cholesterol. Not a treatment on its own.",
      money: "~$15–$30/month. Cheap as supplements go — but proven options may do more for less.",
      consider: "Daily pills, GI side effects are common, and it interacts with several prescriptions. Talk to your doctor before a long trial.",
    },
    // Each claim carries a source index → superscript footnote.
    whatWeKnow: [
      { text: "It can modestly lower fasting blood sugar and long-term blood sugar (HbA1c) in studies.", source: 0 },
      { text: "It can modestly lower LDL (\u201Cbad\u201D) cholesterol.", source: 1 },
      { text: "A few small studies compared its blood-sugar effect to early diabetes drugs — but those trials were small and lower quality.", source: 0 },
      { text: "Stomach upset (cramping, diarrhea, constipation) is common at typical doses.", source: 2 },
    ],
    // "What the ads leave out" — the catch the marketing omits.
    adsLeaveOut: [
      { text: 'It works nothing like Ozempic. Ozempic is a GLP-1 drug; berberine mainly acts on a cell-energy pathway (AMPK). The \u201CNature\u2019s Ozempic\u201D name is marketing, not biology.', source: 3 },
      { text: "Any weight-loss effect is small — it is not a weight-loss shortcut.", source: 0 },
      { text: "It interacts with common prescriptions, and brand-to-brand strength and purity vary widely.", source: 2 },
    ],
    // Honest scientific unknowns (kept separate so the label above stays truthful).
    stillStudying: [
      { text: "Whether the benefit lasts — most trials run only weeks to a few months.", source: 0 },
      { text: "Whether it improves outcomes that matter (like heart attacks), not just lab numbers.", source: 0 },
      { text: "How it compares head-to-head with proven prescription medicine.", source: 0 },
    ],
    verdict: "Real, but small. Won't change your life, definitely not Ozempic. Worth a chat with your doctor, not a miracle.",
    pcpAlign:
      "If you take diabetes, blood-pressure or cholesterol medicine — or you're pregnant — bring berberine to your clinician first. It can stack with glucose-lowering drugs and interacts with several common prescriptions.",
    // Numbered sources. Replace each `url` with a specific verified PMID when ready.
    citations: [
      { label: "Berberine & blood sugar (HbA1c, fasting glucose) — reviews & trials", url: "https://pubmed.ncbi.nlm.nih.gov/?term=berberine+glycemic+control+meta-analysis" },
      { label: "Berberine & cholesterol/lipids — trials", url: "https://pubmed.ncbi.nlm.nih.gov/?term=berberine+lipid+lowering+randomized+controlled+trial" },
      { label: "Berberine — side effects, interactions & supplement quality", url: "https://pubmed.ncbi.nlm.nih.gov/?term=berberine+safety+drug+interactions" },
      { label: "Berberine mechanism (AMPK) vs. GLP-1 drugs", url: "https://pubmed.ncbi.nlm.nih.gov/?term=berberine+AMPK+mechanism" },
    ],
    videos: [
      { title: "What berberine actually does (and doesn't)", channel: "Verified MD · add your curated video ID", embedId: null },
    ],
  },
  {
    id: "ag1",
    title: "AG1 (Greens Powder)",
    aliases: ["ag1", "athletic greens", "greens powder", "green powder"],
    category: ["supplements", "claim-checks"],
    grade: "Minimal",
    recommendation: "skip",
    bottomLine:
      "It's a pricey multivitamin. Pleasant if you enjoy it — but a few-dollar multivitamin does the same job for most people.",
    claim: "An all-in-one daily greens powder promising broad foundational health benefits.",
    whatWeKnow: [
      "It's essentially a flavored multivitamin and mineral blend with added probiotics and adaptogens.",
      "It can help fill specific micronutrient gaps — the same as a far cheaper standard multivitamin.",
    ],
    whatWeDontKnow: [
      "There's no solid independent study showing its specific blend improves real health outcomes.",
      "Whether it does anything more than a basic multivitamin (or simply eating vegetables) for someone without a deficiency.",
    ],
    priceVsProof: {
      verdict: "High cost, minimal independent proof.",
      detail:
        "Roughly $79–$99/mo. For most people without a diagnosed deficiency, the price far outpaces the proven benefit. A generic multivitamin delivers similar micronutrients for a few dollars.",
    },
    pcpAlign:
      "If you suspect a deficiency (iron, B12, vitamin D), ask for a targeted blood test rather than guessing with a broad powder. Treating a confirmed gap is cheaper and works better.",
    citations: [
      { label: "Greens powders & health outcomes (PubMed)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=greens+powder+supplement+health+outcomes" },
      { label: "Multivitamins & mortality — trials (PubMed)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=multivitamin+mortality+randomized+controlled+trial" },
    ],
    videos: [
      { title: "Is an expensive greens powder worth it?", channel: "Verified RD · add your curated video ID", embedId: null },
    ],
  },
  {
    id: "cold-plunges",
    title: "Cold Plunges",
    aliases: ["cold plunge", "cold plunges", "cold water immersion", "ice bath", "ice baths", "cryotherapy"],
    category: ["claim-checks", "metabolic-health", "weight-loss"],
    grade: "Mixed",
    recommendation: "consider",
    bottomLine:
      "It may lift your mood and ease sore muscles. The big fat-loss and metabolism claims aren't there yet.",
    claim: "Cold water immersion sold for recovery, metabolism, mood, immunity and fat loss.",
    whatWeKnow: [
      "Short term, it may ease how sore your muscles feel after exercise and can give a real, repeatable lift in mood and alertness.",
      "Plenty of people report genuinely feeling better afterwards.",
    ],
    whatWeDontKnow: [
      "Done right after strength training, it may actually blunt muscle and strength gains.",
      "Claims about lasting fat loss, metabolic change and immune boosting are weak or unproven, and the best protocol is unclear.",
    ],
    priceVsProof: {
      verdict: "Free to do, modest and context-dependent benefit.",
      detail:
        "A cold shower costs nothing; dedicated tubs run into the thousands. The mood and recovery upside is real for some but small — spend on equipment only if you'll genuinely use it.",
    },
    flag: "The cold-shock response can be dangerous for people with heart conditions, uncontrolled blood pressure, or certain arrhythmias.",
    pcpAlign:
      "If you have any heart condition, are pregnant, or have a seizure disorder, clear cold immersion with your clinician first. Start gradually, and never plunge alone.",
    citations: [
      { label: "Cold water immersion & recovery — review (PubMed)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=cold+water+immersion+recovery+meta-analysis" },
      { label: "Cold immersion & training gains (PubMed)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=cold+water+immersion+resistance+training+hypertrophy" },
    ],
    videos: [
      { title: "What the cold-plunge evidence really shows", channel: "Verified MD · add your curated video ID", embedId: null },
    ],
  },

  /* --- extra sample entries so category pages aren't empty --- */
  {
    id: "magnesium-sleep",
    title: "Magnesium for Sleep",
    aliases: ["magnesium", "magnesium glycinate", "magnesium for sleep"],
    category: ["supplements", "sleep"],
    grade: "Minimal",
    bottomLine: "Cheap and low-risk to try — just keep your expectations modest.",
    claim: "Magnesium supplements marketed as a natural sleep aid.",
    whatWeKnow: [
      "Magnesium is essential, and correcting a true deficiency may help your sleep.",
      "It's generally well tolerated; the glycinate form is gentler on the stomach than oxide.",
    ],
    whatWeDontKnow: [
      "Evidence that supplementing people who aren't deficient meaningfully improves sleep is weak and low quality.",
      "The best dose and form specifically for sleep aren't well established.",
    ],
    priceVsProof: {
      verdict: "Low cost, low-but-plausible benefit.",
      detail: "Roughly $8–$20/mo. Low risk and cheap, so a reasonable trial — just keep expectations modest.",
    },
    pcpAlign:
      "If you have kidney disease, check with your clinician before supplementing magnesium, as it can build up to dangerous levels.",
    citations: [
      { label: "Magnesium & sleep quality (PubMed)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=magnesium+sleep+quality+randomized" },
    ],
    videos: [{ title: "Magnesium and sleep: signal vs. hype", channel: "Verified MD · add your curated video ID", embedId: null }],
  },
  {
    id: "cgm-non-diabetic",
    title: "CGMs for Non-Diabetics",
    aliases: ["cgm", "continuous glucose monitor", "glucose monitor", "metabolic wearable"],
    category: ["labs-and-testing", "metabolic-health"],
    grade: "Minimal",
    bottomLine: "Fascinating to watch, but there's no proof it improves your health if you don't have diabetes.",
    claim: "Wearable glucose monitors marketed to healthy people to 'optimize metabolism'.",
    whatWeKnow: [
      "Continuous glucose monitors are well proven and valuable for people with diabetes.",
      "They reliably show that glucose rises and falls with food and activity in everyone.",
    ],
    whatWeDontKnow: [
      "Whether tracking glucose in a healthy, non-diabetic person improves any real health outcome.",
      'Normal "spikes" in healthy people are often misread as harmful by marketing apps.',
    ],
    priceVsProof: {
      verdict: "High ongoing cost, unproven benefit for healthy users.",
      detail: "Monthly subscriptions add up. Educational and fun — but no evidence it improves outcomes in people without diabetes.",
    },
    pcpAlign:
      "If you're worried about blood sugar, ask for a fasting glucose or A1c — a one-time, low-cost test that answers the real question.",
    citations: [
      { label: "CGM in non-diabetic adults (PubMed)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=continuous+glucose+monitoring+non-diabetic+healthy" },
    ],
    videos: [{ title: "Do healthy people need a CGM?", channel: "Verified MD · add your curated video ID", embedId: null }],
  },
];

/* Static content for non-topic routes — written in the manifesto voice */
const STATIC_PAGES = {
  "start-here": {
    title: "Start Here",
    blurb:
      "Health information online is a mess. Influencers selling supplements. Headlines pushing fear. \u201CMiracle cures\u201D in your feed every morning. Most of it is hype — some of it is dangerous — and almost none of it tells you what your own doctor would say if they had time. That\u2019s why this site exists. We grade the supplements, tests, and health claims you\u2019re seeing — honestly, plainly, by doctors. So you can protect your health, keep your money, and stop wasting time on what doesn\u2019t work. Send it to the people you love. They deserve the truth too.",
  },
  "evidence-policy": {
    title: "Evidence Policy",
    blurb:
      "Here at WhatDoctorsWishYouKnew, every grade reflects one thing: the strength, consistency and quality of human evidence — not how loudly something is being marketed. We favor systematic reviews and well-run randomized trials. We name uncertainty plainly. We downgrade small, short, or industry-funded studies. We re-grade as new evidence comes in. If we don\u2019t know, we say so. If the science changes, the grade changes. That\u2019s the whole bar — and it\u2019s the reason a doctor can recommend this site and a patient can trust it.",
  },
  conflicts: {
    title: "Conflicts of Interest",
    blurb:
      "We take no money from anyone whose products we grade — no supplement makers, no device companies, no pharma. Nobody buys a verdict here. We don\u2019t sell anything to you either: no products, no premium tier, no affiliate links on what we review. If this site is ever supported, that support comes from sources outside the things we grade (think: clinics or non-health partners), it\u2019s clearly labeled, and it never touches a grade. And we celebrate other honest sources — we\u2019re here to add light, not throw shade.",
  },
};

const CATEGORIES = [
  { slug: "start-here", label: "Start Here" },
  { slug: "claim-checks", label: "Claim Checks" },
  { slug: "supplements", label: "Supplements" },
  { slug: "labs-and-testing", label: "Labs & Testing" },
  { slug: "weight-loss", label: "Weight Loss" },
  { slug: "sleep", label: "Sleep" },
  { slug: "metabolic-health", label: "Metabolic Health" },
  { slug: "evidence-policy", label: "Evidence Policy" },
  { slug: "conflicts", label: "Conflicts" },
];

const GRADE_META = {
  Strong: { color: "var(--g-strong)", glyph: "●●●●", note: "Consistent, high-quality evidence" },
  Mixed: { color: "var(--g-mixed)", glyph: "●●○○", note: "Conflicting or moderate evidence" },
  Minimal: { color: "var(--g-minimal)", glyph: "●○○○", note: "Little reliable human evidence" },
  "No Evidence": { color: "var(--g-none)", glyph: "○○○○", note: "No credible supporting evidence" },
  "Potentially Dangerous": { color: "var(--g-danger)", glyph: "⚠", note: "Evidence of possible harm" },
};

/* Recommendation = "what should I do?" — separate from evidence grade ("how good is the science?").
   This is the at-a-glance traffic light. Wording is deliberately not a medical order. */
const REC_META = {
  worth:    { label: "Worth it",          dot: "🟢", color: "#1E7F5C", bg: "#E5F2EC" },
  consider: { label: "Worth considering", dot: "🟡", color: "#B07A1A", bg: "#F7EFD9" },
  skip:     { label: "Skip the hype",     dot: "🔴", color: "#B23B2E", bg: "#F7E4E1" },
  early:    { label: "Too early to tell", dot: "⚪", color: "#5B6660", bg: "#ECEAE3" },
};

/* ============================== HELPERS ================================= */
const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();

function prettifyClinic(slug) {
  return decodeURIComponent(slug)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function findMatches(query) {
  const q = norm(query);
  if (!q) return [];
  return EVIDENCE_DB.filter((item) => {
    const hay = [item.title, ...(item.aliases || [])].map(norm);
    return hay.some((h) => h.includes(q) || q.includes(h));
  });
}

/* simple edit-distance for typo tolerance ("cold plundge" -> "Cold Plunges") */
function editDistance(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

/* returns up to 3 close topic suggestions for a query that didn't match,
   so misspellings/near-misses don't become junk queue votes. */
function findSuggestions(query) {
  const q = norm(query);
  if (q.length < 3) return [];
  const scored = [];
  for (const item of EVIDENCE_DB) {
    const candidates = [item.title, ...(item.aliases || [])].map(norm);
    let best = Infinity;
    for (const c of candidates) {
      // distance on whole string, and on each word, to catch partial typos
      best = Math.min(best, editDistance(q, c));
      for (const w of c.split(" ")) best = Math.min(best, editDistance(q, w));
    }
    // tolerant threshold: allow ~1 error per 4 chars
    const tolerance = Math.max(2, Math.floor(q.length / 3));
    if (best <= tolerance) scored.push({ item, dist: best });
  }
  scored.sort((a, b) => a.dist - b.dist);
  return scored.slice(0, 3).map((s) => s.item);
}

function seedVotes(term) {
  const t = norm(term);
  let h = 7;
  for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) % 99991;
  return 180 + (h % 1400);
}

function useAnimatedNumber(target) {
  const [display, setDisplay] = useState(target);
  const raf = useRef(null);
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    const start = display;
    const delta = target - start;
    if (delta === 0) return;
    const dur = 450;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(start + delta * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return display;
}

/* ============================ SUB-COMPONENTS ============================ */

function GradeBadge({ grade, size = "md" }) {
  const meta = GRADE_META[grade] || GRADE_META.Minimal;
  const pad = size === "lg" ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-semibold ${pad}`}
      style={{ background: meta.color, color: "#FBFAF5" }}
      title={meta.note}
    >
      <span className="font-mono" style={{ opacity: 0.9 }}>{meta.glyph}</span>
      {grade}
    </span>
  );
}

function ClinicBanner({ clinic }) {
  if (!clinic) return null;
  return (
    <div
      className="cobrand no-print w-full text-center px-4 py-2.5 text-sm font-medium"
      style={{ background: "var(--trust-deep)", color: "#EAF4F3" }}
    >
      Brought to you by <strong>{prettifyClinic(clinic)}</strong>. Have questions about this evidence?{" "}
      Check in with your care team directly via your patient portal.
    </div>
  );
}

/* Your uploaded icon logo (apple + heart + EKG) lives at /public/logo.png.
   It's an ICON ONLY (no wordmark text), so the banner shows the icon AND
   keeps the "WhatDoctorsWishYouKnew.com" text heading below it.
   If the file is ever missing, it falls back to a built-in teal SVG icon. */
function LogoMark({ size = 64 }) {
  const [imgOk, setImgOk] = useState(true);
  if (imgOk) {
    return (
      <img
        src="/logo.png"
        alt="WhatDoctorsWishYouKnew logo"
        onError={() => setImgOk(false)}
        style={{ height: size * 1.5, width: size * 1.5, objectFit: "contain" }}
      />
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="WhatDoctorsWishYouKnew logo">
      <circle cx="50" cy="50" r="46" fill="none" stroke="var(--trust)" strokeWidth="3" />
      <path d="M50 33c-5-9-22-8-22 6 0 13 16 22 22 27 6-5 22-14 22-27 0-14-17-15-22-6z" fill="var(--trust)" />
      <path d="M55 26c6-5 12-4 12-4s-1 7-7 9c-3 1-5 0-5 0z" fill="var(--g-strong)" />
      <path d="M50 30c0-4 1-7 3-9" fill="none" stroke="var(--warm)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M30 52h7l4-9 5 17 5-12 3 4h11" fill="none" stroke="#FEFDF9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* the text wordmark always shows now, since the icon logo has no text in it */
function TextWordmark() {
  return (
    <h1 className="font-display leading-none" style={{ fontWeight: 600 }}>
      <span className="block text-3xl sm:text-5xl" style={{ color: "var(--ink)", letterSpacing: "-0.02em" }}>
        WhatDoctorsWishYouKnew<span style={{ color: "var(--trust)" }}>.com</span>
      </span>
    </h1>
  );
}

function BrandBanner({ onShareMission }) {
  return (
    <header className="no-print px-4 pt-8 pb-1 text-center">
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-2">
        <LogoMark size={64} />
        <TextWordmark />
      </div>
      <p className="font-display mx-auto text-lg sm:text-xl italic" style={{ color: "var(--trust-deep)" }}>
        {HERO_TAGLINE}
      </p>
      <p className="mx-auto mt-1.5 max-w-lg text-sm font-medium" style={{ color: "var(--ink-soft)" }}>
        {SUPPORT_LINE}
      </p>
      <p className="mx-auto mt-1 max-w-lg text-xs" style={{ color: "var(--ink-soft)" }}>
        {HOOK_LINE}
      </p>
      <div className="mt-4 flex justify-center">
        <button
          onClick={onShareMission}
          aria-label="Share this site with a friend"
          className="share-cta btn rise inline-flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-semibold shadow-sm"
          style={{ background: "var(--warm-soft)", borderColor: "var(--warm)", color: "#9a4f24" }}
        >
          <span aria-hidden>💛</span>
          <span>Share the truth — Help a friend</span>
          <span aria-hidden style={{ fontSize: 15 }}>↗</span>
        </button>
      </div>
    </header>
  );
}

function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="no-print px-4">
      <div className="mx-auto mt-5 max-w-2xl">
        <div className="wd-search flex items-center gap-3 rounded-2xl border px-5 py-5 shadow-sm"
             style={{ borderColor: "var(--trust)", background: "var(--paper-2)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="var(--trust)" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" stroke="var(--trust)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search a supplement, test, or health claim…"
            className="w-full bg-transparent text-lg outline-none"
            style={{ color: "var(--ink)" }}
            aria-label="Search health claims"
          />
          {value && (
            <button onClick={onClear} className="btn text-sm" style={{ color: "var(--ink-soft)" }} aria-label="Clear search">
              Clear
            </button>
          )}
        </div>
        {!value && (
          <p className="mt-2 text-center text-xs" style={{ color: "var(--ink-soft)" }}>
            Try <button onClick={() => onChange("Berberine")} className="font-medium underline" style={{ color: "var(--trust)" }}>Berberine</button>,{" "}
            <button onClick={() => onChange("AG1")} className="font-medium underline" style={{ color: "var(--trust)" }}>AG1</button>, or{" "}
            <button onClick={() => onChange("Cold Plunges")} className="font-medium underline" style={{ color: "var(--trust)" }}>Cold Plunges</button>
          </p>
        )}
      </div>
    </div>
  );
}

function CategoryNav({ active, onPick, variant = "header" }) {
  return (
    <nav className={`no-print px-4 ${variant === "header" ? "mt-6" : "mt-2"}`} aria-label="Categories">
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            onClick={() => onPick(c.slug)}
            className={`chip rounded-full border px-3.5 py-1.5 text-sm font-medium ${active === c.slug ? "chip-active" : ""}`}
            style={{ borderColor: "var(--line)", color: active === c.slug ? "var(--paper)" : "var(--ink-soft)" }}
          >
            {c.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function VideoEmbed({ video }) {
  return (
    <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--line)", background: "#0a2c2e" }}>
      <div className="relative" style={{ paddingTop: "56.25%" }}>
        {video.embedId ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.embedId}`}
            title={video.title}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-3"
               style={{ color: "#BBD6D4" }}>
            <div className="flex h-11 w-11 items-center justify-center rounded-full"
                 style={{ background: "rgba(255,255,255,0.12)" }}>
              <span style={{ fontSize: 18 }}>▶</span>
            </div>
            <span className="text-xs" style={{ opacity: 0.8 }}>Add a verified-clinician embed ID</span>
          </div>
        )}
      </div>
      <div className="px-3 py-2.5">
        <p className="text-sm font-medium" style={{ color: "#EAF4F3" }}>{video.title}</p>
        <p className="text-xs" style={{ color: "#92B3B0" }}>{video.channel}</p>
      </div>
    </div>
  );
}

/* Renders a claim list. Each item can be a plain string (legacy cards) OR
   an object { text, source } where `source` is an index into the card's
   citations array — rendered as a superscript footnote link. */
function Block({ title, items, tone, citations }) {
  const dot = tone === "know" ? "var(--g-strong)" : "var(--warm)";
  return (
    <div className="mt-6">
      <p className="label-eyebrow" style={{ color: "var(--ink-soft)" }}>{title}</p>
      <ul className="mt-2 space-y-2">
        {items.map((item, i) => {
          const text = typeof item === "string" ? item : item.text;
          const srcIdx = typeof item === "string" ? null : item.source;
          const cite = (srcIdx != null && citations && citations[srcIdx]) ? citations[srcIdx] : null;
          return (
            <li key={i} className="flex gap-2.5 text-sm" style={{ color: "var(--ink-soft)" }}>
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: dot }} />
              <span>
                {text}
                {cite && (
                  <a href={cite.url} target="_blank" rel="noopener noreferrer"
                     className="cite-sup" title={cite.label}
                     style={{ marginLeft: 2, fontSize: "0.7em", verticalAlign: "super", color: "var(--trust)", textDecoration: "none", fontWeight: 600 }}>
                    [{srcIdx + 1}]
                  </a>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function EvidenceCard({ item, others, onSelect, onPrint, onShare }) {
  return (
    <section className="px-4">
      <div className="mx-auto mt-8 max-w-5xl">
        <div className="print-stack flex flex-col gap-6 lg:flex-row">
          {/* LEFT 60% */}
          <article className="wd-card print-area rise w-full p-6 sm:p-8 lg:w-3/5">
            {item.recommendation && REC_META[item.recommendation] && (
              <div className="mb-4 flex items-center gap-2 rounded-lg px-4 py-2.5"
                   style={{ background: REC_META[item.recommendation].bg }}>
                <span style={{ fontSize: 16 }}>{REC_META[item.recommendation].dot}</span>
                <span className="text-sm font-bold uppercase" style={{ color: REC_META[item.recommendation].color, letterSpacing: "0.04em" }}>
                  {REC_META[item.recommendation].label}
                </span>
              </div>
            )}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="label-eyebrow no-print" style={{ color: "var(--ink-soft)" }}>Evidence Card</p>
                <h2 className="font-display mt-1 text-3xl" style={{ fontWeight: 600, color: "var(--ink)" }}>{item.title}</h2>
              </div>
              <GradeBadge grade={item.grade} size="lg" />
            </div>

            {/* THE VERDICT — leads the card; the one-look decision line */}
            <div className="mt-4 rounded-lg p-5" style={{ background: "var(--ink)" }}>
              <p className="label-eyebrow" style={{ color: "#9DB9B0" }}>The Verdict</p>
              <p className="mt-1.5 text-base font-semibold" style={{ color: "#F4F1E8" }}>
                {item.verdict || item.bottomLine}
              </p>
            </div>

            <p className="mt-3 text-sm italic" style={{ color: "var(--ink-soft)" }}>The claim: {item.claim}</p>

            {item.flag && (
              <div className="mt-5 rounded-lg border px-4 py-3 text-sm"
                   style={{ background: "var(--warm-soft)", borderColor: "var(--warm)", color: "#9a4f24" }}>
                <strong>⚠ Safety first:</strong> {item.flag}
              </div>
            )}

            {/* Worth it? — the fast health / money / consider answer the person came for */}
            {item.worthIt && (
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {[
                  { icon: "❤️", label: "Your health", val: item.worthIt.health },
                  { icon: "💰", label: "Your money", val: item.worthIt.money },
                  { icon: "🧐", label: "Before you try it", val: item.worthIt.consider || item.worthIt.time },
                ].map((w) => (
                  <div key={w.label} className="rounded-lg border p-3" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
                    <p className="text-xs font-semibold" style={{ color: "var(--ink)" }}>{w.icon} {w.label}</p>
                    <p className="mt-1 text-xs" style={{ color: "var(--ink-soft)" }}>{w.val}</p>
                  </div>
                ))}
              </div>
            )}

            <Block title="What we know" tone="know" items={item.whatWeKnow} citations={item.citations} />
            {/* New cards use adsLeaveOut + stillStudying; legacy cards fall back to whatWeDontKnow */}
            {item.adsLeaveOut
              ? <Block title="What the ads leave out" tone="dont" items={item.adsLeaveOut} citations={item.citations} />
              : item.whatWeDontKnow && <Block title="What we don't know yet" tone="dont" items={item.whatWeDontKnow} citations={item.citations} />
            }
            {item.stillStudying && (
              <Block title="Still being studied" tone="dont" items={item.stillStudying} citations={item.citations} />
            )}

            {/* Legacy cards (no top verdict field) still surface their price/proof detail here.
               New cards show the verdict once, at the top — no repetition. */}
            {!item.verdict && item.priceVsProof && (
              <div className="mt-6 rounded-lg border p-4" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
                <p className="label-eyebrow" style={{ color: "var(--trust)" }}>Price vs. Proof</p>
                <p className="mt-1.5 font-semibold" style={{ color: "var(--ink)" }}>{item.priceVsProof.verdict}</p>
                <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>{item.priceVsProof.detail}</p>
              </div>
            )}

            <div className="mt-6">
              <p className="label-eyebrow" style={{ color: "var(--ink-soft)" }}>Sources</p>
              <p className="mb-2 text-xs" style={{ color: "var(--ink-soft)" }}>
                Every claim above links here. Tap any source to see the evidence yourself.
              </p>
              <ol className="mt-1 space-y-1.5" style={{ listStyle: "none", padding: 0 }}>
                {item.citations.map((c, i) => (
                  <li key={i} className="text-sm" style={{ color: "var(--ink-soft)" }}>
                    <span className="font-mono font-semibold" style={{ color: "var(--trust)" }}>[{i + 1}]</span>{" "}
                    <a className="cite" href={c.url} target="_blank" rel="noopener noreferrer">{c.label} ↗</a>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 rounded-lg border-l-4 p-4" style={{ borderColor: "var(--trust)", background: "var(--paper)" }}>
              <p className="label-eyebrow" style={{ color: "var(--trust)" }}>🩺 What I'd do if you were my patient</p>
              <p className="mt-1.5 text-sm" style={{ color: "var(--ink-soft)" }}>{item.pcpAlign}</p>
              <p className="mt-2 text-xs italic" style={{ color: "var(--ink-soft)" }}>
                This is here to inform your decision — it doesn't replace your own clinician.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button onClick={onPrint} className="btn no-print rounded-lg px-5 py-2.5 text-sm font-semibold"
                      style={{ background: "var(--trust)", color: "#F4F1E8" }}>
                🖨️ Print Evidence Card
              </button>
              <button onClick={onShare} className="btn no-print rounded-lg border px-5 py-2.5 text-sm font-semibold"
                      style={{ borderColor: "var(--trust)", color: "var(--trust)", background: "transparent" }}>
                ↗ Send this to someone who needs it
              </button>
              {others && others.length > 0 && (
                <div className="no-print flex flex-wrap items-center gap-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                  <span>Also matched:</span>
                  {others.map((o) => (
                    <button key={o.id} onClick={() => onSelect(o.title)}
                            className="chip rounded-full border px-3 py-1" style={{ borderColor: "var(--line)" }}>
                      {o.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </article>

          {/* RIGHT 40% */}
          <aside className="no-print rise w-full space-y-5 lg:w-2/5" style={{ animationDelay: ".08s" }}>
            <div className="wd-card p-5">
              <p className="label-eyebrow" style={{ color: "var(--trust)" }}>Credentialed Insights</p>
              <p className="mt-1 mb-4 text-sm" style={{ color: "var(--ink-soft)" }}>
                Explainers from verified medical professionals.
              </p>
              <div className="space-y-4">
                {item.videos.map((v, i) => <VideoEmbed key={i} video={v} />)}
              </div>
            </div>

            <div className="rounded-xl p-5" style={{ background: "var(--trust-deep)" }}>
              <p className="label-eyebrow" style={{ color: "#8FC3C0" }}>Platform Supporter</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg font-display text-lg"
                     style={{ background: "#EAF4F3", color: "var(--trust-deep)", fontWeight: 700 }}>N</div>
                <div>
                  <p className="font-semibold" style={{ color: "#F4F1E8" }}>NorthLeaf Stationery Co.</p>
                  <p className="text-xs" style={{ color: "#92B3B0" }}>Placeholder · non-health brand</p>
                </div>
              </div>
              <p className="mt-3 text-xs" style={{ color: "#92B3B0" }}>
                Support keeps this platform free and ad-free. Supporters are never health or supplement brands, and never influence a grade.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function DemocraticQueue({ term, suggestions, onSelect, onShare }) {
  return (
    <section className="px-4">
      <div className="mx-auto mt-8 max-w-3xl">
        {/* did-you-mean: route likely typos to real topics so the queue stays clean */}
        {suggestions && suggestions.length > 0 && (
          <div className="wd-card rise mb-4 p-4 text-center">
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
              Did you mean:{" "}
              {suggestions.map((s, i) => (
                <span key={s.id}>
                  <button onClick={() => onSelect(s.title)} className="font-semibold underline" style={{ color: "var(--trust)" }}>
                    {s.title}
                  </button>
                  {i < suggestions.length - 1 ? ", " : ""}
                </span>
              ))}
              ?
            </p>
          </div>
        )}

        <div className="wd-card rise p-8 text-center sm:p-10">
          <p className="label-eyebrow" style={{ color: "var(--warm)" }}>Open Queue · Not yet clarified</p>
          <h2 className="font-display mx-auto mt-3 max-w-xl text-2xl sm:text-3xl" style={{ fontWeight: 600, lineHeight: 1.2 }}>
            We haven't clarified the truth about “{term}” yet.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm" style={{ color: "var(--ink-soft)" }}>
            Your search has been added to our open queue. The more people ask about a topic, the sooner our clinicians cut through the hype and clarify it.
          </p>

          <div className="my-7 rounded-xl p-5" style={{ background: "var(--trust-soft)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--trust-deep)" }}>
              Want this clarified sooner?
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm" style={{ color: "var(--ink-soft)" }}>
              Share it. Every person who searches a topic moves it up the queue — and soon, subscribers and verified clinicians will be able to give it even more weight.
            </p>
            <button onClick={() => onShare(term)} className="btn mt-4 rounded-lg px-5 py-2.5 text-sm font-semibold"
                    style={{ background: "var(--trust)", color: "#F4F1E8" }}>
              ↗ Share this search
            </button>
            <p className="mt-3 text-xs" style={{ color: "var(--ink-soft)" }}>
              Subscriber &amp; verified-clinician priority voting — coming soon.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryView({ slug, onSelect }) {
  const meta = CATEGORIES.find((c) => c.slug === slug);
  const staticPage = STATIC_PAGES[slug];
  const topics = EVIDENCE_DB.filter((e) => (e.category || []).includes(slug));

  return (
    <section className="px-4">
      <div className="mx-auto mt-8 max-w-3xl">
        <div className="wd-card rise p-7 sm:p-9">
          <h2 className="font-display text-3xl" style={{ fontWeight: 600 }}>{meta ? meta.label : slug}</h2>

          {staticPage && <p className="mt-3 text-sm" style={{ color: "var(--ink-soft)" }}>{staticPage.blurb}</p>}

          {topics.length > 0 ? (
            <div className="mt-6">
              <p className="label-eyebrow" style={{ color: "var(--ink-soft)" }}>Clarified topics in this category</p>
              <ul className="mt-3 divide-y" style={{ borderColor: "var(--line)" }}>
                {topics.map((t) => (
                  <li key={t.id}>
                    <button onClick={() => onSelect(t.title)}
                            className="btn flex w-full items-center justify-between gap-3 py-3 text-left">
                      <span className="font-medium" style={{ color: "var(--ink)" }}>{t.title}</span>
                      <GradeBadge grade={t.grade} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            !staticPage && (
              <p className="mt-4 text-sm" style={{ color: "var(--ink-soft)" }}>
                No clarified topics here yet — search a claim above to add it to the open queue.
              </p>
            )
          )}
        </div>
      </div>
    </section>
  );
}

function Landing({ onSelect }) {
  const featured = EVIDENCE_DB.slice(0, 3);
  const steps = [
    { n: "1", t: "Search a claim", d: "Any supplement, test, or health trend." },
    { n: "2", t: "See the evidence grade", d: "Strong, Mixed, Minimal, or worse — at a glance." },
    { n: "3", t: "Get the honest verdict", d: "Plain-English truth and price-vs-proof." },
  ];
  return (
    <section className="px-4">
      <div className="mx-auto mt-6 max-w-3xl">
        {/* how it works */}
        <div className="grid gap-3 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="flex items-start gap-3 rounded-lg p-3" style={{ background: "var(--paper-2)", border: "1px solid var(--line)" }}>
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    style={{ background: "var(--trust-soft)", color: "var(--trust-deep)" }}>{s.n}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{s.t}</p>
                <p className="text-xs" style={{ color: "var(--ink-soft)" }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="label-eyebrow text-center mt-8" style={{ color: "var(--ink-soft)" }}>Recently clarified</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {featured.map((t, i) => (
            <button key={t.id} onClick={() => onSelect(t.title)}
                    className="wd-card btn rise p-4 text-left" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="flex flex-wrap items-center gap-2">
                <GradeBadge grade={t.grade} />
                {t.recommendation && REC_META[t.recommendation] && (
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{ background: REC_META[t.recommendation].bg, color: REC_META[t.recommendation].color }}>
                    {REC_META[t.recommendation].dot} {REC_META[t.recommendation].label}
                  </span>
                )}
              </div>
              <p className="font-display mt-3 text-lg" style={{ fontWeight: 600 }}>{t.title}</p>
              <p className="mt-1 text-xs" style={{ color: "var(--ink-soft)" }}>{t.bottomLine}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  // Split the signature so the trailing ".com" can be colored teal like the wordmark.
  // The signature constant ends with "WhatDoctorsWishYouKnew.com" — render that domain stylized.
  const sigText = SIGNATURE.replace(/WhatDoctorsWishYouKnew\.com\s*$/, "WhatDoctorsWishYouKnew");
  return (
    <footer className="no-print relative mt-16 px-4 pb-14 pt-10 hairline">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-display text-base sm:text-lg italic" style={{ color: "var(--trust-deep)", fontWeight: 500 }}>
          {sigText}<span style={{ color: "var(--trust)", fontStyle: "normal", fontWeight: 600 }}>.com</span>
        </p>
        <p className="mx-auto mt-3 max-w-md text-xs" style={{ color: "var(--ink-soft)" }}>
          Educational only — not medical advice. Always align decisions with your own clinician.
        </p>
      </div>
      {/* Small signature mark in the bottom-right — adds a "signed" feel without breaking the top lockup. */}
      <div className="pointer-events-none absolute bottom-4 right-4 opacity-50">
        <LogoMark size={28} />
      </div>
    </footer>
  );
}

/* ================================ APP =================================== */
export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(null);
  const [clinic, setClinic] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const c = params.get("clinic");
      if (c) setClinic(c);
      const q = params.get("q");
      if (q) setQuery(q);
    } catch (_) {}
  }, []);

  const matches = useMemo(() => findMatches(query), [query]);
  const suggestions = useMemo(
    () => (matches.length === 0 ? findSuggestions(query) : []),
    [query, matches.length]
  );
  const hasQuery = norm(query).length > 0;
  const showCard = hasQuery && matches.length > 0;
  const showQueue = hasQuery && matches.length === 0;

  const selectTopic = useCallback((title) => {
    setCategory(null);
    setQuery(title);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const showCopyToast = useCallback(() => {
    setToast("🔗 Copied — share the clarity with someone who needs it.");
    setTimeout(() => setToast(null), 3200);
  }, []);

  const shareCard = useCallback((item) => {
    const text = `${item.title} — WDWYK grade: ${item.grade}. ${item.bottomLine}`;
    const url = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(item.title)}`;
    if (navigator.share) {
      navigator.share({ title: `WDWYK: ${item.title}`, text, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text}\n${url}`).then(showCopyToast).catch(() => {});
    }
  }, [showCopyToast]);

  const shareTerm = useCallback((term) => {
    const text = `I'm asking the doctors at WhatDoctorsWishYouKnew.com to clarify the truth about "${term}". Help bump it up the queue:`;
    const url = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(term)}`;
    if (navigator.share) {
      navigator.share({ title: "What Doctors Wish You Knew", text, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text}\n${url}`).then(showCopyToast).catch(() => {});
    }
  }, [showCopyToast]);

  /* Mission share — used by the orange "Share the truth" badge in the header.
     Shares the landing-page URL (no ?q=) with a friend-to-friend message. */
  const shareMission = useCallback(() => {
    const text = MISSION_SHARE_MESSAGE;
    const url = `${window.location.origin}${window.location.pathname}`;
    if (navigator.share) {
      navigator.share({ title: "What Doctors Wish You Knew", text, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text}\n${url}`).then(showCopyToast).catch(() => {});
    }
  }, [showCopyToast]);

  const pickCategory = useCallback((slug) => {
    setQuery("");
    setCategory((cur) => (cur === slug ? null : slug));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const onSearchChange = (v) => {
    setQuery(v);
    if (category) setCategory(null);
  };

  return (
    <div className="wdwyk-root">
      <style>{GLOBAL_STYLE}</style>

      <ClinicBanner clinic={clinic} />
      <BrandBanner onShareMission={shareMission} />
      <SearchBar value={query} onChange={onSearchChange} onClear={() => setQuery("")} />
      <CategoryNav active={category} onPick={pickCategory} />

      <main className="pb-10">
        {category ? (
          <CategoryView slug={category} onSelect={selectTopic} />
        ) : showCard ? (
          <EvidenceCard item={matches[0]} others={matches.slice(1)} onSelect={selectTopic} onPrint={() => window.print()} onShare={() => shareCard(matches[0])} />
        ) : showQueue ? (
          <DemocraticQueue term={query.trim()} suggestions={suggestions} onSelect={selectTopic} onShare={shareTerm} />
        ) : (
          <Landing onSelect={selectTopic} />
        )}
      </main>

      <Footer />

      {toast && (
        <div className="toast no-print fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-3 text-sm font-medium shadow-lg"
             style={{ background: "var(--ink)", color: "var(--paper)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
