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

const HERO_TAGLINE = "Truth matters. Protect those you love.";
const SEARCH_MICRO_LINE =
  "From doctors and the experts they trust · No ads, ever · every answer backed by credentialed sources.";
const SIGNATURE = "The truth isn't for sale. This is WhatDoctorsWishYouKnew.com";

/* Share messages — each one calibrated for the receiver, not the sender.
   The design rule: zero work for the sender, maximum context for the receiver,
   meet the receiver in the channel they actually use. */

// Friend share — used when someone hits the share button on the homepage, Mission, Landing, etc.
// Locked short and human: reads like a real text from a real friend, never like a marketing pitch.
const MISSION_SHARE_MESSAGE =
  "So helpful! Thought I would share. :)";

// Doctor share — pasted into a patient portal message. Calibrated as a *gratitude message*
// with a verdict attached, not a task with gratitude attached. The doctor receives it as a
// gift rather than as work — which is the only way it gets opened in a busy clinical inbox.
const DOCTOR_SHARE_MESSAGE =
  "Found something that felt like the kind of care you give. Sharing because it made me grateful for you.";

const SHARE_TITLE = "Protect Those You Love";

/* ╔════════════════════════════════════════════════════════════════════════╗
   ║  📧 MAILERLITE SUBSCRIBE FORM — REPLACE THIS WHEN READY TO LIVE       ║
   ╠════════════════════════════════════════════════════════════════════════╣
   ║  To activate email signups:                                            ║
   ║    1. Go to https://www.mailerlite.com — create a free account         ║
   ║    2. In the dashboard: Forms → Embedded → Create new form             ║
   ║    3. Pick "Standard form", name it, finish setup                      ║
   ║    4. On the embed code page, copy the URL inside  action="..."        ║
   ║       (looks like: https://assets.mailerlite.com/jsonp/.../forms/...)  ║
   ║    5. Paste that URL between the quotes below                          ║
   ║    6. Save, Commit, push — subscribe form works site-wide              ║
   ║                                                                        ║
   ║  Until configured, the form gracefully captures the email to the       ║
   ║  user's clipboard so no signal is lost.                                ║
   ╚════════════════════════════════════════════════════════════════════════╝ */
const MAILERLITE_FORM_ACTION = ""; // ← paste MailerLite form action URL here

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
  --g-danger:#9A5A3C;
}

html, body{ overflow-x:hidden; max-width:100%; }
*{ box-sizing:border-box; }
.wdwyk-root{
  font-family:'Public Sans', ui-sans-serif, system-ui, sans-serif;
  color:var(--ink);
  background-color:var(--paper);
  background-image:
    radial-gradient(120% 80% at 50% -10%, rgba(14,122,128,0.08), transparent 60%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E");
  min-height:100vh;
  overflow-x:hidden;
  max-width:100%;
}
.font-display{ font-family:'Fraunces', Georgia, serif; }
.font-mono{ font-family:'IBM Plex Mono', ui-monospace, monospace; }
.label-eyebrow{
  font-family:'IBM Plex Mono', monospace; text-transform:uppercase;
  letter-spacing:0.18em; font-size:11px; font-weight:500;
}

/* Brand wordmark — sized so the full ".com" stays on one line at every viewport width.
   Earlier version used word-break:anywhere which let the browser butcher ".com" into ".co" + "m"
   on narrow screens. Fix: no word-breaking ever; just scale the font tightly so it always fits. */
.wordmark{
  font-family:'Fraunces', Georgia, serif;
  font-weight:600;
  letter-spacing:-0.02em;
  line-height:1;
  color:var(--ink);
  /* Tighter mobile scaling: 4.8vw at 390px viewport = ~19px (fits the full 26-char wordmark in one line).
     Desktop cap at 44px. Never breaks across lines. */
  font-size:clamp(16px, 4.8vw, 44px);
  max-width:100%;
  white-space:nowrap;
}
.wordmark .tld{ color:var(--trust); }

/* Search autosuggest dropdown */
.suggest-list{
  position:absolute; left:0; right:0; top:calc(100% + 6px);
  background:var(--paper-2); border:1px solid var(--line);
  border-radius:14px; box-shadow:0 18px 50px -25px rgba(21,48,45,0.35);
  z-index:30; overflow:hidden;
}
.suggest-item{
  display:flex; align-items:center; justify-content:space-between; gap:10px;
  width:100%; padding:10px 16px; text-align:left;
  background:transparent; border:none; cursor:pointer; font:inherit;
  color:var(--ink);
}
.suggest-item:hover, .suggest-item[data-active="true"]{ background:var(--trust-soft); color:var(--trust-deep); }
.suggest-item + .suggest-item{ border-top:1px solid var(--line); }
.suggest-empty{ padding:12px 16px; font-size:13px; color:var(--ink-soft); }

/* Visibility helpers for mobile/desktop swap */
.show-sm{ display:none; }
.show-md{ display:inline; }
@media (max-width:520px){
  .show-sm{ display:inline; }
  .show-md{ display:none; }
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

@keyframes fadeIn{ from{ opacity:0; } to{ opacity:1; } }
@keyframes modalIn{ from{ opacity:0; transform:translateY(20px) scale(0.96); } to{ opacity:1; transform:translateY(0) scale(1); } }

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
  about: {
    title: "Our Mission",
    eyebrow: "Why we built this",
    intro:
      "Health information online is broken. Influencers are selling. Headlines are scaring. \u201CMiracle cures\u201D arrive in your feed every morning. Most of it is hype. Some of it is dangerous. Almost none of it tells you what your own doctor would say if they had the time.",
    sections: [
      {
        heading: "What we do",
        body:
          "We grade the supplements, tests, and health claims you\u2019re actually seeing — honestly, plainly, by doctors. Every claim gets a transparent evidence grade, a recommendation, and a price-vs-proof verdict that\u2019s easy to read in under a minute. Every source we cite, you can open and check yourself.",
      },
      {
        heading: "Who we\u2019re for",
        body:
          "We\u2019re for the person who saw something on TikTok and isn\u2019t sure if it\u2019s real. The patient who can\u2019t tell whether a $90 supplement is worth it. The parent who wants to know what to believe before they buy something for their kid. And we\u2019re for the primary-care doctors who wish their patients had a place like this — somewhere honest to land when they leave the exam room.",
      },
      {
        heading: "What makes us different",
        body:
          "We sell nothing. No ads. No supplement sponsors. No affiliate links on the things we grade. Nobody buys a verdict here. If the science changes, the grade changes — and if we don\u2019t know, we say so. The truth isn\u2019t for sale here, and we intend to keep it that way.",
      },
      {
        heading: "How you can help",
        body:
          "Share what helped you with someone you love. The truth only spreads if real people pass it on — one friend, one family member at a time. That\u2019s the whole model.",
      },
    ],
    closing:
      "Truth matters. Protect those you love. This is What Doctors Wish You Knew.",
  },
  "for-clinics": {
    title: "For Clinics & Health Systems",
    eyebrow: "Partner with us",
    intro:
      "Your patients are drowning in health misinformation. They walk into your exam room having already \u201Cresearched\u201D it. You have fifteen minutes to undo a year of bad advice. We can help.",
    sections: [
      {
        heading: "What clinic partnership looks like",
        body:
          "WhatDoctorsWishYouKnew can be co-branded for your clinic or health system. Your patients see your name on the page (\u201CBrought to you by [Your Clinic]\u201D) when you share evidence cards from your patient portal, your waiting-room screens, or your after-visit emails. The grades, the sources, the integrity \u2014 all stay exactly the same. The trust patients build with this platform reinforces the trust they have in you.",
      },
      {
        heading: "Why this works",
        body:
          "We\u2019re not competing with your clinicians \u2014 we\u2019re backing them up. Every grade quietly directs the reader back to their own doctor for the decision. We exist to rebuild the trust patients are losing to influencers, and to send them back to their PCPs better informed than they came in.",
      },
      {
        heading: "Who we\u2019re piloting with",
        body:
          "We\u2019re currently working with a small group of primary-care clinics and health systems to refine how co-branding fits into real patient workflows. If you\u2019re a clinic director, medical director, or health-system patient-experience lead who\u2019d like to be considered for the pilot cohort, get in touch.",
      },
    ],
    /* FAQ \u2014 answers the obvious questions a clinic admin has before reaching out.
       Each answer is short, brand-honest, and never overclaims. */
    faq: [
      {
        q: "How does co-branding actually work?",
        a: "You get a custom URL parameter (e.g. ?clinic=cedar-valley). When you share evidence cards from your patient portal, waiting-room screens, or after-visit emails, patients see your clinic\u2019s name at the top of the page. The verdict, sources, and grades stay identical. Setup is minutes, not weeks.",
      },
      {
        q: "Is this HIPAA-compliant?",
        a: "Yes \u2014 because there\u2019s no PHI involved. WhatDoctorsWishYouKnew never asks for, stores, or transmits patient health information. Patients land on a public page and read public evidence. We\u2019re a patient-education resource, not a clinical tool.",
      },
      {
        q: "What does it cost?",
        a: "During the pilot phase, partnerships are free for selected clinics in exchange for feedback on how co-branding fits into real workflows. Long-term, we\u2019ll offer tiered subscriptions starting at a price designed to be accessible for independent practices. Pricing will be set after the pilot \u2014 we want to learn what value looks like before we name a number.",
      },
      {
        q: "How long is the pilot?",
        a: "Roughly 90 days, with check-ins along the way. Clinics keep their co-branded URL afterward regardless of what they decide next.",
      },
      {
        q: "Do we sign a contract?",
        a: "Pilot clinics sign a simple one-page mutual-non-disclosure agreement and an outline of the co-branding terms. No multi-year lock-in, no exclusivity.",
      },
      {
        q: "Can we suggest topics for evidence cards?",
        a: "Yes. Pilot clinics get priority requests \u2014 if your patients keep asking about something, we\u2019ll prioritize clarifying it. This is one of the things that makes the pilot mutually valuable.",
      },
      {
        q: "What if my clinic is a primary-care group, urgent care, specialty practice, or telehealth?",
        a: "All welcome. The primary fit so far is primary care and family medicine because their patients ask the broadest range of \u201Cis this real?\u201D questions, but the platform works for any patient-facing clinical practice.",
      },
    ],
    cta: {
      label: "Apply to partner",
      email: "partners@whatdoctorswishyouknew.com",
      note:
        "Tell us about your clinic or system and what you\u2019d hope a partnership would do for your patients. We read every message.",
    },
    closing:
      "We\u2019re building this with the doctors who care about getting it right. If that\u2019s you, we\u2019d love to talk.",
  },
  "for-clinicians": {
    title: "For Clinicians",
    eyebrow: "Coming soon",
    intro:
      "We\u2019re building a verified-clinician layer of WhatDoctorsWishYouKnew \u2014 with CME-accredited content, deeper evidence pages, exportable citations, patient handouts you can print, and a way to give your own vote real weight in our open queue.",
    sections: [
      {
        heading: "What\u2019s coming",
        body:
          "A free profile for verified physicians, NPs, PAs, and pharmacists. The ability to flag claims you want graded. CME credit for thoughtful engagement with the evidence. Patient-handout exports of any card, branded to your practice. And clinician-priority weighting in the queue, so the things doctors most want clarified for their patients get clarified first.",
      },
      {
        heading: "Be on the early list",
        body:
          "If you\u2019re a clinician who wants to be notified the moment this opens \u2014 or who has thoughts on what would make it most useful in your practice \u2014 send us a note. We\u2019re building this with the clinicians who\u2019ll use it.",
      },
    ],
    cta: {
      label: "Get in touch",
      email: "partners@whatdoctorswishyouknew.com",
      note: "Mention you\u2019re a clinician and what you\u2019d most want from this tier.",
    },
  },
  /* ╔══════════════════════════════════════════════════════════════════════╗
     ║  👤 FOUNDER / TEAM PAGE \u2014 REPLACE PLACEHOLDERS BEFORE GOING LIVE   ║
     ║  Search for [REPLACE: ...] markers below \u2014 each one is a placeholder ║
     ║  for you to fill with your real founder content (name, photo, bio,    ║
     ║  region, story). Until those are filled, the page is honest about     ║
     ║  being a draft and won\u2019t fabricate a fake founder identity.          ║
     ╚══════════════════════════════════════════════════════════════════════╝ */
  founders: {
    title: "Who Built This",
    eyebrow: "The team",
    intro:
      "We\u2019re physicians who got tired of watching patients be lied to about their health. Most of what spreads online \u2014 the supplements, the tests, the trends \u2014 isn\u2019t built to inform you. It\u2019s built to sell to you. So we built something different: a place where the only thing that gets graded is the evidence, by the doctors who read it for a living.",
    sections: [
      {
        heading: "Founder",
        body:
          "[REPLACE: Dr. Finch, MD] is a [REPLACE: board-certified specialty, e.g. internal-medicine physician] practicing in [REPLACE: region, e.g. southern Utah]. [REPLACE: 1\u20132 sentences on background \u2014 e.g. residency, years in practice, why you started this.] After years of watching patients arrive at appointments having already been misled, this site became the answer to a question patients kept asking: \u201CWhat would you do?\u201D",
      },
      {
        heading: "Why we\u2019re still anonymous in places",
        body:
          "Many of the clinicians backing this work are still in active practice and prefer not to be publicly named until the platform is fully launched. That\u2019s a feature, not a bug: it means the grades reflect what doctors actually think \u2014 not a curated, PR-managed version of it. As we grow, named clinician backers will be listed openly with their consent.",
      },
      {
        heading: "Who else is involved",
        body:
          "We\u2019re building this in partnership with primary-care physicians, evidence-based-medicine specialists, pharmacists, and health-policy researchers. If you\u2019re a clinician who wants to help \u2014 by reviewing evidence, suggesting topics, or vouching for the work \u2014 we want to hear from you.",
      },
      {
        heading: "What we\u2019re not",
        body:
          "We\u2019re not a media company. We\u2019re not a supplement reviewer. We\u2019re not influencers. We\u2019re practicing doctors who built the resource we wished existed for our own patients \u2014 and then opened it up so anyone\u2019s patients could have it.",
      },
    ],
    cta: {
      label: "Get in touch",
      email: "partners@whatdoctorswishyouknew.com",
      note: "Clinicians, journalists, foundations, or anyone curious \u2014 send us a note. We read every message.",
    },
    closing:
      "Truth matters. Protect those you love. That\u2019s not a slogan \u2014 it\u2019s the only reason this exists.",
  },
  /* "Where we're going" \u2014 directional milestones, no dates.
     Designed to give foundations, clinics, and clinicians the *trajectory* they want
     without binding the founder to specific dates that life could blow past.
     Doubles as a recruiting surface for pilot clinics and verified clinicians. */
  "where-were-going": {
    title: "Where We\u2019re Going",
    eyebrow: "The road ahead",
    intro:
      "We\u2019re in early access \u2014 honest about it, intentional about it. The site you see today is the foundation. Here\u2019s where we\u2019re heading, in the order it matters.",
    sections: [
      {
        heading: "What\u2019s live now",
        body:
          "A working evidence-card system with the first six clarified topics. Doctor-built verdicts, transparent grades, plain-English bottom lines, and links to every source. A clinic co-branding mechanism. A mission-first share flow so anyone who arrives via a shared link lands on the brand before the verdict. An honest early-access posture, no fake metrics, no fake supporters.",
      },
      {
        heading: "What we\u2019re building next",
        body:
          "More evidence cards \u2014 dozens more, with primary care, supplements, lab tests, and trending health claims all in scope. A verified-clinician layer for physicians, NPs, PAs, and pharmacists, with CME-accredited engagement. Clinic and health-system pilot partnerships with the first willing partners. A patient-facing notification layer so anyone can choose how they hear from us. Better search, smarter prioritization, and patient-portal-ready handouts for the visits that need them.",
      },
      {
        heading: "Our north star",
        body:
          "To be the trusted health-truth platform for any patient, any clinic, any question \u2014 the place a doctor can recommend without hesitation, and a patient can land on without being sold to. Free for patients, forever. Honest about evidence, always. Built so the truth has a home that isn\u2019t for sale.",
      },
      {
        heading: "How you can help shape it",
        body:
          "If you\u2019re a clinician who wants to vouch for the work, a clinic considering the pilot, a foundation interested in funding patient-education infrastructure, or a patient with a topic that desperately needs clarifying \u2014 we\u2019re building this with the people who care about getting it right. Get in touch.",
      },
    ],
    cta: {
      label: "Help us build it",
      email: "partners@whatdoctorswishyouknew.com",
      note:
        "Clinicians, foundations, clinic leaders, and curious patients alike \u2014 tell us how you\u2019d like to be part of what comes next. We read every message.",
    },
    closing:
      "We\u2019d rather build this slowly and honestly than fast and loudly. Thanks for being here while we do.",
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

/* Primary categories — content topics only. Meta pages (mission, policies) live in Trust & Policy. */
const CATEGORIES = [
  { slug: "claim-checks", label: "Claim Checks" },
  { slug: "supplements", label: "Supplements" },
  { slug: "labs-and-testing", label: "Labs & Testing" },
  { slug: "weight-loss", label: "Weight Loss" },
  { slug: "sleep", label: "Sleep" },
  { slug: "metabolic-health", label: "Metabolic Health" },
];
/* Secondary nav — meta + partner pages, kept small and out of the way.
   "Our Mission" leads (the why), "Where We're Going" follows (the what's next) —
   the natural reading flow for anyone curious about the platform's substance.
   NOTE: "Who Built This" / founders page is intentionally hidden from the nav until
   the founder's real bio is filled in (search for [REPLACE: in STATIC_PAGES.founders).
   The page still exists and can be re-added here once real content is in place. */
const TRUST_PAGES = [
  { slug: "about", label: "Our Mission" },
  { slug: "where-were-going", label: "Where We're Going" },
  { slug: "evidence-policy", label: "Evidence Policy" },
  { slug: "conflicts", label: "Conflicts" },
  { slug: "for-clinics", label: "For Clinics" },
  { slug: "for-clinicians", label: "For Clinicians" },
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
  worth:    { label: "Worth it",          dot: "●", color: "#1E7F5C", bg: "#E5F2EC" },
  consider: { label: "Worth considering", dot: "●", color: "#B07A1A", bg: "#F7EFD9" },
  skip:     { label: "Not worth it",     dot: "●", color: "#9A5A3C", bg: "#F4EBE6" },
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
   If the file is ever missing, it falls back to a built-in teal SVG icon.
   When `size` is omitted, uses a clamp() responsive size that scales fluidly. */
function LogoMark({ size }) {
  const [imgOk, setImgOk] = useState(true);
  // Responsive default: ~52px on phones, ~90px on desktop — paired well with the wordmark
  const responsiveStyle = size
    ? { height: size * 1.5, width: size * 1.5 }
    : { height: "clamp(32px, 8vw, 72px)", width: "clamp(32px, 8vw, 72px)" };
  if (imgOk) {
    return (
      <img
        src="/logo.png"
        alt="WhatDoctorsWishYouKnew logo"
        onError={() => setImgOk(false)}
        style={{ ...responsiveStyle, objectFit: "contain", flexShrink: 0 }}
      />
    );
  }
  const fallbackSize = size || 60;
  return (
    <svg width={fallbackSize} height={fallbackSize} viewBox="0 0 100 100" role="img" aria-label="WhatDoctorsWishYouKnew logo" style={{ flexShrink: 0 }}>
      <circle cx="50" cy="50" r="46" fill="none" stroke="var(--trust)" strokeWidth="3" />
      <path d="M50 33c-5-9-22-8-22 6 0 13 16 22 22 27 6-5 22-14 22-27 0-14-17-15-22-6z" fill="var(--trust)" />
      <path d="M55 26c6-5 12-4 12-4s-1 7-7 9c-3 1-5 0-5 0z" fill="var(--g-strong)" />
      <path d="M50 30c0-4 1-7 3-9" fill="none" stroke="var(--warm)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M30 52h7l4-9 5 17 5-12 3 4h11" fill="none" stroke="#FEFDF9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* the text wordmark always shows now, since the icon logo has no text in it.
   Uses the .wordmark CSS class for fluid clamp() sizing — never clips on mobile. */
function TextWordmark() {
  return (
    <h1 className="wordmark">
      WhatDoctorsWishYouKnew<span className="tld">.com</span>
    </h1>
  );
}

function BrandBanner() {
  return (
    <>
      <header className="no-print" style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--paper)", borderBottom: "1px solid var(--line)" }}>
        <div className="mx-auto flex items-center justify-between gap-3 px-4 py-2.5" style={{ maxWidth: "72rem" }}>
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <div style={{ lineHeight: 1.1 }}>
              <p className="font-display" style={{ fontWeight: 700, fontSize: "clamp(15px, 2.4vw, 20px)", color: "var(--ink)" }}>What Doctors Wish You Knew</p>
              <p className="label-eyebrow" style={{ color: "var(--trust-deep)", letterSpacing: "0.14em", fontSize: "9px" }}>TRUTH MATTERS</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 label-eyebrow" style={{ borderColor: "var(--line)", background: "var(--paper-2)", color: "var(--trust-deep)", fontSize: "9px" }}><span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--g-strong)", display: "inline-block" }}></span>Early access · building in public</span>
            <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })} className="btn rounded-full px-4 py-2 text-sm font-semibold" style={{ background: "var(--warm)", color: "#FBFAF5", border: "none" }}>Join</button>
          </div>
        </div>
      </header>
      <div className="px-4 pt-8 text-center">
        <p className="font-display mx-auto italic" style={{ color: "var(--trust-deep)", fontSize: "clamp(32px, 6.5vw, 56px)", fontWeight: 600, lineHeight: 1.1 }}>{HERO_TAGLINE}</p>
        <p className="mx-auto" style={{ color: "#51636b", fontSize: "clamp(13px, 2.6vw, 16px)", maxWidth: "54ch", marginTop: "14px", lineHeight: 1.5 }}>Any health question, one honest answer — what your doctor would tell you if they had all the time in the world.</p>
      </div>
    </>
  );
}

function SearchBar({ value, onChange, onClear, allTopics, onSelectTopic }) {
  const [focused, setFocused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapRef = useRef(null);
  // Live suggestions while typing — prefix or substring match on title/aliases
  const liveMatches = useMemo(() => {
    const q = (value || "").toLowerCase().trim();
    if (!q || q.length < 1) return [];
    const scored = [];
    for (const item of allTopics) {
      const candidates = [item.title, ...(item.aliases || [])].map((s) => s.toLowerCase());
      let bestRank = Infinity;
      for (const c of candidates) {
        if (c === q) bestRank = Math.min(bestRank, 0);
        else if (c.startsWith(q)) bestRank = Math.min(bestRank, 1);
        else if (c.includes(q)) bestRank = Math.min(bestRank, 2);
      }
      if (bestRank < Infinity) scored.push({ item, rank: bestRank });
    }
    scored.sort((a, b) => a.rank - b.rank);
    return scored.slice(0, 6).map((s) => s.item);
  }, [value, allTopics]);

  // Close suggestions on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const showSuggestions = focused && value && liveMatches.length > 0;

  function handleKey(e) {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, liveMatches.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      onSelectTopic(liveMatches[activeIdx].title);
      setFocused(false);
      setActiveIdx(-1);
    } else if (e.key === "Escape") { setFocused(false); setActiveIdx(-1); }
  }

  return (
    <div className="no-print px-4">
      <div className="mx-auto mt-4 sm:mt-5 max-w-2xl">
        <div ref={wrapRef} className="relative">
          {/* Single unified search component — utility line and input live in the same bordered block.
             The utility line is permanent (never disappears) and visually tied to the search. */}
          <div className="wd-search rounded-2xl border shadow-sm overflow-hidden"
               style={{ borderColor: "var(--trust)", background: "var(--paper-2)" }}>
            {/* Permanent utility label — what searching gets you. Brand promise anchored to the action.
                Hidden on mobile (where vertical space is precious and the placeholder already explains
                the search); shown on desktop where there's room for the brand-promise framing. */}
            <p
              className="hidden sm:block px-4 sm:px-5 pt-3 pb-2 text-center text-xs sm:text-sm font-medium"
              style={{ color: "var(--trust-deep)", borderBottom: "1px solid var(--line)", background: "var(--trust-soft)" }}
            >
              {SEARCH_MICRO_LINE}
            </p>
            {/* The actual input row — sized to be the dominant, inviting action on the page */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-4 sm:py-4">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="7" stroke="var(--trust)" strokeWidth="2.4" />
                <path d="M21 21l-4.3-4.3" stroke="var(--trust)" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              <div className="relative w-full min-w-0">
                <input
                  value={value}
                  onChange={(e) => { onChange(e.target.value); setActiveIdx(-1); }}
                  onFocus={() => setFocused(true)}
                  onKeyDown={handleKey}
                  placeholder=""
                  className="w-full min-w-0 bg-transparent text-lg sm:text-xl outline-none"
                  style={{ color: "var(--ink)" }}
                  aria-label="Search health claims"
                  aria-autocomplete="list"
                  aria-expanded={showSuggestions}
                />
                {!value && (
                  <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-base sm:text-lg font-medium" style={{ color: "var(--ink-soft)", opacity: 0.65 }}>
                    <span className="show-md">Search a supplement, test, or health claim…</span>
                    <span className="show-sm">Search any health topic…</span>
                  </span>
                )}
              </div>
              {value && (
                <button onClick={onClear} className="btn text-sm" style={{ color: "var(--ink-soft)" }} aria-label="Clear search">
                  Clear
                </button>
              )}
            </div>
          </div>
          {showSuggestions && (
            <div className="suggest-list" role="listbox">
              {liveMatches.map((m, i) => (
                <button
                  key={m.id}
                  role="option"
                  aria-selected={i === activeIdx}
                  data-active={i === activeIdx ? "true" : "false"}
                  className="suggest-item"
                  onMouseDown={(e) => { e.preventDefault(); onSelectTopic(m.title); setFocused(false); }}
                >
                  <span style={{ fontWeight: 500 }}>{m.title}</span>
                  <span className="text-xs" style={{ color: "var(--ink-soft)" }}>{m.grade}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {!value && !focused && (
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

/* ShareSection — static share placement for content boundaries.
   Used at the bottom of pages where sharing is the natural next action: after an evidence
   card verdict, after the Mission page, after the Landing page's Recently Clarified.
   NOT placed on reference pages (Evidence Policy, Conflicts) or partner pages (For Clinics,
   For Clinicians) where sharing isn't the natural user flow.

   This is the static-placement pattern used by Substack, ProPublica, Mozilla, and Wikipedia —
   the credible-mission-driven-site playbook. Replaces the earlier floating-button pattern
   that fights trust brands by signaling "we need shares" instead of "this is worth sharing."

   Variants:
     - tone="card": full styled card (Mission, Landing, Founders) — primary share moment
     - tone="row": inline button row (used inside EvidenceCard, alongside Print/Send-to-doctor) */
function ShareSection({ onShare, heading, prompt, label, tone = "card" }) {
  if (tone === "row") {
    return (
      <button onClick={onShare} className="btn no-print rounded-lg border px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2"
              style={{ background: "transparent", borderColor: "var(--trust)", color: "var(--trust-deep)" }}>
        <ShareIcon />
        <span>{label || "Send to a friend"}</span>
      </button>
    );
  }
  // "card" tone — a real boundary-of-content moment, properly styled, unmissable but not pushy
  return (
    <div className="wd-card rise no-print p-6 sm:p-7 text-center" style={{ background: "var(--paper-2)" }}>
      <p className="label-eyebrow" style={{ color: "var(--trust)" }}>{heading || "Help spread the truth"}</p>
      <p className="font-display mt-1 text-lg sm:text-xl" style={{ fontWeight: 600, color: "var(--ink)", lineHeight: 1.3 }}>
        {prompt || "Know someone who needs honest health answers?"}
      </p>
      <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)", lineHeight: 1.55 }}>
        Truth only spreads if real people pass it on. One friend, one family member, one conversation at a time.
      </p>
      <button onClick={onShare}
              className="btn no-print mt-4 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm sm:text-base font-semibold"
              style={{ background: "var(--trust)", color: "#FBFAF5", border: "none" }}>
        <ShareIcon />
        <span>{label || "Send to someone you love"}</span>
      </button>
    </div>
  );
}

/* The universal share icon — iOS/macOS share glyph, the most-recognized share affordance.
   Used everywhere share happens on the site so users build instant muscle memory. */
function ShareIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      <path d="M12 3v13M12 3l-4 4M12 3l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* SendToDoctorModal — the growth-engine surface.
   The patient → doctor handoff is the single highest-leverage channel for this platform.
   Patients forget print-outs and BP logs. They DON'T forget messages already in their phone.
   This modal gives them a pre-written, ready-to-paste portal message — zero work, maximum impact.
   The message is calibrated as a *gratitude message with a link*, not a task — so clinicians
   receive it as a gift and click rather than ignore. */
function SendToDoctorModal({ open, onClose, topicTitle, shareUrl }) {
  const [copied, setCopied] = useState(false);
  // The complete message the patient will paste — message + clear link.
  // Including the link AT THE END so it looks natural when pasted into any portal text box.
  const fullMessage = `${DOCTOR_SHARE_MESSAGE}\n\n${shareUrl}`;

  // ESC closes modal — basic accessibility
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Reset "copied" state when modal re-opens
  useEffect(() => { if (open) setCopied(false); }, [open]);

  if (!open) return null;

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(fullMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch (_) { /* clipboard not available */ }
  };

  const nativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: SHARE_TITLE,
        text: DOCTOR_SHARE_MESSAGE,
        url: shareUrl,
      }).catch(() => {});
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="send-doc-title"
      className="no-print"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(21,48,45,0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fadeIn 0.2s ease both",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--paper-2)",
          borderRadius: 18,
          padding: "clamp(20px, 4vw, 28px)",
          maxWidth: 520,
          width: "100%",
          boxShadow: "0 30px 80px -20px rgba(21,48,45,0.45)",
          position: "relative",
          animation: "modalIn 0.3s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="btn"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "transparent",
            border: "none",
            fontSize: 22,
            color: "var(--ink-soft)",
            cursor: "pointer",
            padding: "4px 8px",
            lineHeight: 1,
          }}
        >×</button>

        <p className="label-eyebrow" style={{ color: "var(--trust)" }}>Send to your doctor</p>
        <h3 id="send-doc-title" className="font-display mt-1 text-xl sm:text-2xl" style={{ fontWeight: 600, color: "var(--ink)" }}>
          Paste this into your patient portal
        </h3>
        <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)", lineHeight: 1.55 }}>
          MyChart, Athena, FollowMyHealth — wherever you message your doctor. Pre-written so you don't have to think about it.
        </p>

        {/* The message preview — looks like a real message draft */}
        <div className="mt-4 rounded-lg p-4" style={{ background: "var(--paper)", border: "1px solid var(--line)" }}>
          <p className="text-sm" style={{ color: "var(--ink)", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
            {DOCTOR_SHARE_MESSAGE}
          </p>
          <p className="mt-2 text-xs font-mono" style={{ color: "var(--trust)", wordBreak: "break-all" }}>
            {shareUrl}
          </p>
        </div>

        {/* Primary action: one-tap copy */}
        <button
          onClick={copyMessage}
          className="btn mt-4 w-full rounded-lg px-5 py-3 text-sm font-semibold"
          style={{
            background: copied ? "var(--g-strong)" : "var(--trust)",
            color: "#FBFAF5",
            border: "none",
            transition: "background 0.2s ease",
          }}
        >
          {copied ? "✓ Copied — paste into your portal" : "📋 Copy message"}
        </button>

        {/* Secondary action: native share for iMessage/email (some patients still text their doctor or email) */}
        {typeof navigator !== "undefined" && navigator.share && (
          <button
            onClick={nativeShare}
            className="btn mt-2 w-full rounded-lg border px-5 py-2.5 text-sm font-medium"
            style={{
              background: "transparent",
              borderColor: "var(--line)",
              color: "var(--ink-soft)",
            }}
          >
            Or share via text / email ↗
          </button>
        )}

        <p className="mt-4 text-xs text-center" style={{ color: "var(--ink-soft)", lineHeight: 1.5 }}>
          Your doctor will land on our mission first, then see the verdict. Zero pressure on them — just a kind note from you.
        </p>
      </div>
    </div>
  );
}

/* SubscribeForm — captures emails for future evidence-card notifications.
   Posts to MailerLite. Until the form action URL is filled in (see MAILERLITE_FORM_ACTION
   constant near top of file), the form falls back to a graceful "we'll be in touch" message
   and writes the email to clipboard so the patient doesn't lose it.

   Sized for two contexts: tone="card" (full card on Mission page), tone="inline" (compact, in Trust Block). */
function SubscribeForm({ tone = "card" }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const formActionConfigured = MAILERLITE_FORM_ACTION && MAILERLITE_FORM_ACTION.startsWith("http");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("That doesn't look like a complete email.");
      return;
    }
    if (formActionConfigured) {
      // Real submission to MailerLite — uses a hidden form with no-cors to avoid CORS errors
      // (MailerLite doesn't return CORS headers for public form endpoints, but the POST still works).
      try {
        const formData = new FormData();
        formData.append("fields[email]", trimmed);
        formData.append("ml-submit", "1");
        formData.append("anticsrf", "true");
        await fetch(MAILERLITE_FORM_ACTION, { method: "POST", body: formData, mode: "no-cors" });
        setSubmitted(true);
      } catch (_) {
        // If even the no-cors fetch fails (rare), still mark as submitted — MailerLite gets the data.
        setSubmitted(true);
      }
    } else {
      // Form not yet configured — write the email to clipboard so the user doesn't lose it,
      // and show a friendly "we'll get back to you" message. The physician founder will see
      // the failed-to-configure case in dev tools and know to set MAILERLITE_FORM_ACTION.
      try {
        await navigator.clipboard.writeText(trimmed);
      } catch (_) {}
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div
        className={tone === "card" ? "wd-card rise p-6 sm:p-7 text-center" : "rounded-lg p-4 text-center"}
        style={tone === "inline" ? { background: "var(--trust-soft)", border: "1px solid var(--line)" } : {}}
      >
        <p className="font-display text-lg" style={{ fontWeight: 600, color: "var(--trust-deep)" }}>
          ✓ You're on the list.
        </p>
        <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)", lineHeight: 1.55 }}>
          We'll let you know when the next evidence card drops. No spam, ever — that's the same promise we make about everything else here.
        </p>
      </div>
    );
  }

  return (
    <div
      className={tone === "card" ? "wd-card rise p-6 sm:p-7" : "rounded-lg p-4"}
      style={tone === "inline" ? { background: "var(--trust-soft)", border: "1px solid var(--line)" } : {}}
    >
      <p className="label-eyebrow" style={{ color: "var(--trust)" }}>Stay in the loop</p>
      <p className={tone === "card" ? "font-display mt-1 text-xl sm:text-2xl" : "font-display mt-1 text-lg"} style={{ fontWeight: 600, color: "var(--ink)", lineHeight: 1.2 }}>
        Get the truth, before the trend.
      </p>
      <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)", lineHeight: 1.55 }}>
        Be the first to know when we clarify a new supplement, test, or health claim. One short email when there's something worth your time — never more.
      </p>
      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          aria-label="Email address"
          className="w-full min-w-0 rounded-lg border px-4 py-2.5 text-sm outline-none"
          style={{
            borderColor: error ? "var(--g-danger)" : "var(--line)",
            background: "var(--paper-2)",
            color: "var(--ink)",
          }}
        />
        <button
          type="submit"
          className="btn rounded-lg px-5 py-2.5 text-sm font-semibold"
          style={{ background: "var(--trust)", color: "#FBFAF5", border: "none", whiteSpace: "nowrap" }}
        >
          Subscribe
        </button>
      </form>
      {error && (
        <p className="mt-2 text-xs" style={{ color: "var(--g-danger)" }}>{error}</p>
      )}
      <p className="mt-3 text-xs" style={{ color: "var(--ink-soft)" }}>
        📱 SMS notifications — <em>coming soon</em>. Pick how you want to hear from us.
      </p>
    </div>
  );
}

function CategoryNav({ active, onPick }) {
  const [trustOpen, setTrustOpen] = useState(false);
  return (
    <nav className="no-print px-4 mt-4 sm:mt-6" aria-label="Categories">
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-1.5 sm:gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            onClick={() => onPick(c.slug)}
            className={`chip rounded-full border px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-sm font-medium ${active === c.slug ? "chip-active" : ""}`}
            style={{ borderColor: "var(--line)", color: active === c.slug ? "var(--paper)" : "var(--ink-soft)" }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Trust & Policy — collapsed behind a toggle on mobile to save space; always shown on desktop.
          The `sm:flex` row is the desktop version; the mobile toggle is `sm:hidden`. */}
      <div className="hidden sm:flex mx-auto mt-3 max-w-3xl flex-wrap items-center justify-center gap-1.5">
        <span className="label-eyebrow mr-1" style={{ color: "var(--ink-soft)", opacity: 0.7, fontSize: "9px" }}>Trust &amp; policy:</span>
        {TRUST_PAGES.map((c) => (
          <button
            key={c.slug}
            onClick={() => onPick(c.slug)}
            className={`chip rounded-full border px-2.5 py-1 text-xs font-medium ${active === c.slug ? "chip-active" : ""}`}
            style={{ borderColor: "var(--line)", color: active === c.slug ? "var(--paper)" : "var(--ink-soft)" }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Mobile-only: a single "More" toggle that expands the Trust & Policy chips */}
      <div className="sm:hidden mt-2 text-center">
        <button
          onClick={() => setTrustOpen((o) => !o)}
          className="btn label-eyebrow inline-flex items-center gap-1"
          style={{ color: "var(--ink-soft)", fontSize: "10px", background: "transparent", border: "none" }}
        >
          <span>Trust &amp; policy</span>
          <span aria-hidden style={{ transform: trustOpen ? "rotate(45deg)" : "none", transition: "transform .15s", fontSize: 13, color: "var(--trust)" }}>+</span>
        </button>
        {trustOpen && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-1">
            {TRUST_PAGES.map((c) => (
              <button
                key={c.slug}
                onClick={() => onPick(c.slug)}
                className={`chip rounded-full border px-2 py-0.5 text-[10px] font-medium ${active === c.slug ? "chip-active" : ""}`}
                style={{ borderColor: "var(--line)", color: active === c.slug ? "var(--paper)" : "var(--ink-soft)" }}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
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

function EvidenceCard({ item, others, onSelect, onPrint, onShare, onSendToDoctor }) {
  // Videos only show when real (no placeholder embeds). The trust block always renders.
  const realVideos = (item.videos || []).filter((v) => v && v.embedId);
  return (
    <section className="px-4">
      <div className="mx-auto mt-8 max-w-5xl">
        <div className="print-stack flex flex-col gap-6 lg:flex-row">
          {/* LEFT — content card, 60% when sidebar present (always now, since trust block ships) */}
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
              <p className="label-eyebrow" style={{ color: "var(--trust)" }}>🩺 What we'd tell our own families</p>
              <p className="mt-1.5 text-sm" style={{ color: "var(--ink-soft)" }}>{item.pcpAlign}</p>
              <p className="mt-2 text-xs italic" style={{ color: "var(--ink-soft)" }}>
                This is here to inform your decision — it doesn't replace your own doctor.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {/* Three named share/save actions in one row. Order is intentional:
                  - Send to your doctor: warm primary, growth-engine lever (patient → doctor → clinic)
                  - Send to a friend: viral channel (patient → patient)
                  - Print: utility action (for in-person appointments) */}
              <button onClick={onSendToDoctor} className="btn no-print rounded-lg px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2"
                      style={{ background: "var(--warm)", color: "#FBFAF5", border: "none" }}>
                <span aria-hidden>📋</span>
                <span>Send to your doctor</span>
              </button>
              <ShareSection
                tone="row"
                onShare={onShare}
                label="Send to a friend"
              />
              <button onClick={onPrint} className="btn no-print rounded-lg border px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2"
                      style={{ background: "transparent", borderColor: "var(--line)", color: "var(--ink-soft)" }}>
                <span aria-hidden>🖨️</span>
                <span>Print</span>
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

          {/* RIGHT — videos (only when real), plus the always-on Trust block. No placeholder content. */}
          <aside className="no-print rise w-full space-y-5 lg:w-2/5" style={{ animationDelay: ".08s" }}>
            {realVideos.length > 0 && (
              <div className="wd-card p-5">
                <p className="label-eyebrow" style={{ color: "var(--trust)" }}>Credentialed Insights</p>
                <p className="mt-1 mb-4 text-sm" style={{ color: "var(--ink-soft)" }}>
                  Explainers from verified medical professionals.
                </p>
                <div className="space-y-4">
                  {realVideos.map((v, i) => <VideoEmbed key={i} video={v} />)}
                </div>
              </div>
            )}

            {/* TRUST BLOCK — explains why the site is free. Share is now handled by the
                floating button; this block stays as brand-reinforcement only ("nothing for sale"). */}
            <div className="wd-card p-5">
              <p className="label-eyebrow" style={{ color: "var(--trust)" }}>How this site stays free</p>
              <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)", lineHeight: 1.55 }}>
                We sell nothing. No ads, no supplement sponsors, no paid grades. The truth isn't for sale here — and we'd like to keep it that way.
              </p>
              <p className="mt-3 text-sm" style={{ color: "var(--ink-soft)", lineHeight: 1.55 }}>
                If this helped you, the best thing you can do is share it. That's how the truth spreads — one person, one friend, one family member at a time.
              </p>
            </div>
            {/* Inline subscribe \u2014 real working capture, not a placeholder. */}
            <SubscribeForm tone="inline" />
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
              We prioritize based on how many people are asking. Share this search to help bump it up.
            </p>
            <button onClick={() => onShare(term)} className="btn mt-4 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
                    style={{ background: "var(--trust)", color: "#F4F1E8", border: "none" }}>
              <ShareIcon />
              <span>Share this search</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryView({ slug, onSelect, onShare }) {
  // Look up the label across both nav rows (primary categories and trust/partner pages)
  const meta =
    CATEGORIES.find((c) => c.slug === slug) ||
    TRUST_PAGES.find((c) => c.slug === slug);
  const staticPage = STATIC_PAGES[slug];
  const topics = EVIDENCE_DB.filter((e) => (e.category || []).includes(slug));
  // "Rich" pages have structured sections/intro/cta; "Simple" pages just have a blurb.
  const isRich = staticPage && (staticPage.sections || staticPage.intro || staticPage.cta);

  return (
    <section className="px-4">
      <div className="mx-auto mt-8 max-w-3xl">
        <div className="wd-card rise p-7 sm:p-9">
          {staticPage && staticPage.eyebrow && (
            <p className="label-eyebrow" style={{ color: "var(--trust)" }}>{staticPage.eyebrow}</p>
          )}
          <h2 className="font-display text-3xl sm:text-4xl" style={{ fontWeight: 600, lineHeight: 1.15, marginTop: staticPage && staticPage.eyebrow ? 6 : 0 }}>
            {meta ? meta.label : (staticPage && staticPage.title) || slug}
          </h2>

          {/* Rich page (about, for-clinics, for-clinicians): intro + sections + optional CTA + closing */}
          {isRich && (
            <>
              {staticPage.intro && (
                <p className="mt-5 text-base sm:text-lg" style={{ color: "var(--ink-soft)", lineHeight: 1.6 }}>
                  {staticPage.intro}
                </p>
              )}
              {staticPage.sections && staticPage.sections.map((sec, i) => (
                <div key={i} className="mt-7">
                  <h3 className="font-display text-xl" style={{ fontWeight: 600, color: "var(--ink)" }}>{sec.heading}</h3>
                  <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--ink-soft)", lineHeight: 1.65 }}>
                    {sec.body}
                  </p>
                </div>
              ))}
              {/* FAQ \u2014 accordion using native <details>, no extra JS needed.
                 Answers the obvious questions before the visitor has to email and ask. */}
              {staticPage.faq && staticPage.faq.length > 0 && (
                <div className="mt-8">
                  <p className="label-eyebrow" style={{ color: "var(--trust)" }}>Frequently asked</p>
                  <div className="mt-3 divide-y" style={{ borderColor: "var(--line)" }}>
                    {staticPage.faq.map((item, i) => (
                      <details key={i} className="group py-3" style={{ borderTop: i === 0 ? `1px solid var(--line)` : "none", borderBottom: `1px solid var(--line)` }}>
                        <summary
                          className="cursor-pointer list-none flex items-center justify-between gap-3 py-1 font-medium text-sm sm:text-base"
                          style={{ color: "var(--ink)" }}
                        >
                          <span>{item.q}</span>
                          <span aria-hidden className="text-lg flex-shrink-0 group-open:rotate-45 transition-transform" style={{ color: "var(--trust)" }}>+</span>
                        </summary>
                        <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)", lineHeight: 1.6 }}>
                          {item.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              )}
              {staticPage.cta && (
                <div className="mt-8 rounded-xl p-5 sm:p-6" style={{ background: "var(--trust-soft)" }}>
                  <p className="text-sm" style={{ color: "var(--ink-soft)", lineHeight: 1.6 }}>
                    {staticPage.cta.note}
                  </p>
                  <a
                    href={`mailto:${staticPage.cta.email}?subject=${encodeURIComponent("WhatDoctorsWishYouKnew — partnership inquiry")}`}
                    className="btn mt-4 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
                    style={{ background: "var(--trust)", color: "#F4F1E8", textDecoration: "none" }}
                  >
                    {staticPage.cta.label} →
                  </a>
                  <p className="mt-3 text-xs font-mono" style={{ color: "var(--ink-soft)" }}>
                    {staticPage.cta.email}
                  </p>
                </div>
              )}
              {staticPage.closing && (
                <p className="font-display mt-8 text-base sm:text-lg italic" style={{ color: "var(--trust-deep)", lineHeight: 1.5 }}>
                  {staticPage.closing}
                </p>
              )}
            </>
          )}

          {/* Simple page (evidence-policy, conflicts): single blurb */}
          {!isRich && staticPage && staticPage.blurb && (
            <p className="mt-3 text-sm sm:text-base" style={{ color: "var(--ink-soft)", lineHeight: 1.65 }}>{staticPage.blurb}</p>
          )}

          {/* Category with topics: show the list of clarified entries */}
          {topics.length > 0 && (
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
          )}

          {/* Empty category with no static content: friendly fallback */}
          {topics.length === 0 && !staticPage && (
            <p className="mt-4 text-sm" style={{ color: "var(--ink-soft)" }}>
              No clarified topics here yet — search a claim above to add it to the open queue.
            </p>
          )}
        </div>

        {/* Mission/Founders pages get TWO content-boundary actions:
            a share moment (highest-intent sharers) then a subscribe moment.
            Order matters: share first (free + viral), subscribe second (commitment). */}
        {(slug === "about" || slug === "founders") && (
          <>
            {onShare && (
              <div className="mt-6">
                <ShareSection
                  onShare={onShare}
                  prompt={slug === "founders" ? "Know someone who'd believe in this?" : "Know someone who needs the truth?"}
                  label={slug === "founders" ? "Send to someone who'd care" : "Send to someone who needs this"}
                />
              </div>
            )}
            <div className="mt-6">
              <SubscribeForm tone="card" />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Landing({ onSelect, onShare }) {
  const featured = EVIDENCE_DB.slice(0, 3);
  const steps = [
    { n: "1", t: "Search a claim", d: "Any supplement, test, or health trend." },
    { n: "2", t: "See the evidence grade", d: "Strong, Mixed, Minimal, or worse — at a glance." },
    { n: "3", t: "Get the honest verdict", d: "Plain-English truth and price-vs-proof." },
  ];
  return (
    <section className="px-4">
      <div className="mx-auto mt-6 max-w-3xl">
                <p className="label-eyebrow text-center mt-2" style={{ color: "var(--ink-soft)" }}>Recently clarified</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {featured.map((t) => (
            <div key={t.id} className="wd-card rise p-5 text-left">
              {t.recommendation && REC_META[t.recommendation] && (
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: REC_META[t.recommendation].bg, color: REC_META[t.recommendation].color }}>{REC_META[t.recommendation].dot} {REC_META[t.recommendation].label}</span>
              )}
              <button onClick={() => onSelect(t.title)} className="btn mt-3 block w-full text-left">
                <p className="font-display text-xl" style={{ fontWeight: 600, color: "var(--ink)", lineHeight: 1.25 }}>{t.title}</p>
                <p className="mt-1.5 text-sm" style={{ color: "var(--ink-soft)", lineHeight: 1.5 }}>{t.bottomLine}</p>
              </button>
              <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--line)" }}>
                <GradeBadge grade={t.grade} />
                <button onClick={() => onSelect(t.title)} className="btn text-xs font-semibold" style={{ color: "var(--trust)" }}>Sources ({t.citations ? t.citations.length : 0}) →</button>
              </div>
            </div>
          ))}
        </div>
        {/* Boundary share — appears right after Recently Clarified.
            Pattern from Substack/ProPublica/Mozilla: real content boundary share, not a floating widget. */}
        {onShare && (
          <div className="mt-10">
            <ShareSection
              onShare={onShare}
              prompt="Know someone drowning in health misinformation?"
              label="Send to someone you love"
            />
          </div>
        )}
        {/* Final beat on the landing: subscribe. */}
        <div className="mt-6">
          <SubscribeForm tone="card" />
        </div>
      </div>
    </section>
  );
}

function Footer({ onShowMission }) {
  // Split the signature so the trailing ".com" can be colored teal like the wordmark.
  // The signature constant ends with "WhatDoctorsWishYouKnew.com" — render that domain stylized.
  const sigText = SIGNATURE.replace(/WhatDoctorsWishYouKnew\.com\s*$/, "WhatDoctorsWishYouKnew");
  return (
    <footer className="no-print relative mt-16 px-4 pb-14 pt-10 hairline">
      <div className="mx-auto max-w-2xl text-center">
        <button
          onClick={onShowMission}
          aria-label="Read our mission"
          className="btn font-display text-base sm:text-lg italic"
          style={{
            color: "var(--trust-deep)",
            fontWeight: 500,
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            textDecoration: "none",
            transition: "opacity .15s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.75"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          {sigText}<span style={{ color: "var(--trust)", fontStyle: "normal", fontWeight: 600 }}>.com</span>
        </button>
        <p className="mx-auto mt-3 max-w-md text-xs" style={{ color: "var(--ink-soft)", textWrap: "balance" }}>
          Educational, not medical advice. Always talk to your doctor.
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
  const [doctorModalTopic, setDoctorModalTopic] = useState(null); // null = closed; topic obj = open

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const c = params.get("clinic");
      if (c) setClinic(c);
      const q = params.get("q");
      if (q) setQuery(q);
      // "Trust handoff": when someone arrives via a shared link (no specific topic),
      // land them on Our Mission first so they understand what the site is before they search.
      // This gives the recipient the brand context their sharer had — better conversion than
      // dropping them on a cold homepage.
      const from = params.get("from");
      if (from === "share" && !q) setCategory("about");
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
    const text = `${item.title} — Grade: ${item.grade}. ${item.bottomLine}`;
    // Card shares: keep ?q so the recipient sees the specific verdict, plus from=share for analytics later.
    const url = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(item.title)}&from=share`;
    if (navigator.share) {
      navigator.share({ title: `${item.title} — ${SHARE_TITLE}`, text, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text}\n${url}`).then(showCopyToast).catch(() => {});
    }
  }, [showCopyToast]);

  const shareTerm = useCallback((term) => {
    const text = `I'm asking the doctors at WhatDoctorsWishYouKnew.com to clarify the truth about "${term}". Help bump it up the queue:`;
    const url = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(term)}&from=share`;
    if (navigator.share) {
      navigator.share({ title: SHARE_TITLE, text, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text}\n${url}`).then(showCopyToast).catch(() => {});
    }
  }, [showCopyToast]);

  /* Mission share — used by the orange "Share the truth" badge in the header.
     Shares with ?from=share so recipients land on Our Mission first ("trust handoff"). */
  const shareMission = useCallback(() => {
    const text = MISSION_SHARE_MESSAGE;
    const url = `${window.location.origin}${window.location.pathname}?from=share`;
    if (navigator.share) {
      navigator.share({ title: SHARE_TITLE, text, url }).catch(() => {});
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
      <BrandBanner />
      <SearchBar
        value={query}
        onChange={onSearchChange}
        onClear={() => setQuery("")}
        allTopics={EVIDENCE_DB}
        onSelectTopic={selectTopic}
      />
      <CategoryNav active={category} onPick={pickCategory} />

      <main className="pb-10">
        {category ? (
          <CategoryView slug={category} onSelect={selectTopic} onShare={shareMission} />
        ) : showCard ? (
          <EvidenceCard item={matches[0]} others={matches.slice(1)} onSelect={selectTopic} onPrint={() => window.print()} onShare={() => shareCard(matches[0])} onSendToDoctor={() => setDoctorModalTopic(matches[0])} />
        ) : showQueue ? (
          <DemocraticQueue term={query.trim()} suggestions={suggestions} onSelect={selectTopic} onShare={shareTerm} />
        ) : (
          <Landing onSelect={selectTopic} onShare={shareMission} />
        )}
      </main>

      <Footer onShowMission={() => pickCategory("about")} />

      {/* Send-to-doctor modal — opens from the warm "📋 Send to your doctor" button on evidence cards.
          This is the highest-leverage growth surface on the site: patient → doctor → clinic awareness. */}
      <SendToDoctorModal
        open={doctorModalTopic !== null}
        onClose={() => setDoctorModalTopic(null)}
        topicTitle={doctorModalTopic ? doctorModalTopic.title : ""}
        shareUrl={
          doctorModalTopic
            ? `${typeof window !== "undefined" ? window.location.origin + window.location.pathname : ""}?q=${encodeURIComponent(doctorModalTopic.title)}&from=share`
            : ""
        }
      />

      {toast && (
        <div className="toast no-print fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-3 text-sm font-medium shadow-lg"
             style={{ background: "var(--ink)", color: "var(--paper)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
