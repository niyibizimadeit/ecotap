<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>EcoTap — Project Roadmap</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --emerald:        #064E3B;
    --emerald-mid:    #065F46;
    --emerald-bright: #059669;
    --emerald-light:  #A7F3D0;
    --emerald-pale:   #ECFDF5;
    --ivory:          #FEFCE8;
    --cream:          #FEF9EF;
    --cream-dark:     #F5EDD8;
    --gold:           #92400E;
    --gold-light:     #D97706;
    --gold-pale:      #FEF3C7;
    --ink:            #1C1917;
    --ink-mid:        #44403C;
    --ink-light:      #78716C;
    --border:         rgba(6,78,59,0.12);
    --shadow:         0 4px 24px rgba(6,78,59,0.08);
    --shadow-lg:      0 12px 48px rgba(6,78,59,0.12);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--ivory);
    color: var(--ink);
    min-height: 100vh;
    line-height: 1.6;
  }

  /* Grain texture overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.6;
  }

  /* ── Header ── */
  header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(254,252,232,0.88);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 48px;
  }

  .header-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-mark {
    width: 32px;
    height: 32px;
    background: var(--emerald);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-mark svg { width: 16px; height: 16px; }

  .logo-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--emerald);
    letter-spacing: -0.02em;
  }

  .header-meta {
    font-size: 12px;
    color: var(--ink-light);
    font-weight: 300;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .progress-global {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .progress-bar-wrap {
    width: 120px;
    height: 4px;
    background: var(--emerald-pale);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--emerald-bright), var(--gold-light));
    border-radius: 2px;
    transition: width 0.6s cubic-bezier(.4,0,.2,1);
  }

  .progress-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--emerald-mid);
    min-width: 32px;
  }

  /* ── Hero ── */
  .hero {
    position: relative;
    max-width: 1100px;
    margin: 0 auto;
    padding: 72px 48px 48px;
  }

  .hero-eyebrow {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--emerald-bright);
    margin-bottom: 16px;
  }

  .hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(42px, 6vw, 72px);
    font-weight: 600;
    color: var(--emerald);
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin-bottom: 16px;
  }

  .hero-title em {
    font-style: italic;
    color: var(--gold);
  }

  .hero-sub {
    font-size: 15px;
    color: var(--ink-light);
    font-weight: 300;
    max-width: 480px;
    line-height: 1.7;
  }

  .hero-decoration {
    position: absolute;
    top: 48px;
    right: 48px;
    width: 220px;
    height: 220px;
    border: 1px solid var(--border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.5;
    pointer-events: none;
  }

  .hero-decoration::before {
    content: '';
    width: 160px;
    height: 160px;
    border: 1px solid var(--border);
    border-radius: 50%;
  }

  /* ── Stats bar ── */
  .stats-bar {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 48px 56px;
    display: flex;
    gap: 32px;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 600;
    color: var(--emerald);
    line-height: 1;
  }

  .stat-label {
    font-size: 11px;
    color: var(--ink-light);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 400;
  }

  .stat-divider {
    width: 1px;
    height: 40px;
    background: var(--border);
    align-self: center;
  }

  /* ── Main layout ── */
  .main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 48px 120px;
  }

  /* ── Phase card ── */
  .phase {
    margin-bottom: 20px;
    border: 1px solid var(--border);
    border-radius: 16px;
    background: var(--cream);
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }

  .phase:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-1px);
  }

  .phase.complete {
    border-color: rgba(16, 185, 129, 0.25);
    background: linear-gradient(135deg, #F0FDF4, var(--cream));
  }

  .phase-header {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 24px 28px;
    cursor: pointer;
    user-select: none;
  }

  .phase-number {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--ink-light);
    min-width: 40px;
  }

  .phase-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 18px;
    transition: transform 0.2s;
  }

  .phase:hover .phase-icon { transform: scale(1.05); }

  .phase-meta { flex: 1; }

  .phase-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--emerald);
    letter-spacing: -0.01em;
    margin-bottom: 2px;
  }

  .phase-desc {
    font-size: 13px;
    color: var(--ink-light);
    font-weight: 300;
  }

  .phase-progress {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .phase-bar-wrap {
    width: 80px;
    height: 3px;
    background: var(--cream-dark);
    border-radius: 2px;
    overflow: hidden;
  }

  .phase-bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.5s cubic-bezier(.4,0,.2,1);
  }

  .phase-pct {
    font-size: 12px;
    font-weight: 500;
    min-width: 32px;
    text-align: right;
  }

  .phase-chevron {
    width: 20px;
    height: 20px;
    color: var(--ink-light);
    transition: transform 0.3s cubic-bezier(.4,0,.2,1);
    flex-shrink: 0;
  }

  .phase.open .phase-chevron { transform: rotate(180deg); }

  /* ── Tasks ── */
  .tasks {
    display: none;
    padding: 0 28px 20px 88px;
    flex-direction: column;
    gap: 2px;
  }

  .phase.open .tasks { display: flex; }

  .task {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .task:hover { background: rgba(6,78,59,0.04); }

  .task-checkbox {
    width: 18px;
    height: 18px;
    border: 1.5px solid var(--border);
    border-radius: 5px;
    flex-shrink: 0;
    margin-top: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    background: white;
  }

  .task.done .task-checkbox {
    background: var(--emerald);
    border-color: var(--emerald);
  }

  .task.done .task-checkbox::after {
    content: '';
    width: 10px;
    height: 6px;
    border-left: 1.5px solid white;
    border-bottom: 1.5px solid white;
    transform: rotate(-45deg) translateY(-1px);
    display: block;
  }

  .task-text {
    font-size: 14px;
    color: var(--ink-mid);
    font-weight: 400;
    line-height: 1.5;
  }

  .task.done .task-text {
    text-decoration: line-through;
    color: var(--ink-light);
  }

  .task-tag {
    font-size: 10px;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.06em;
    padding: 2px 7px;
    border-radius: 4px;
    align-self: flex-start;
    margin-top: 3px;
    flex-shrink: 0;
  }

  /* ── Tag colors ── */
  .tag-fe  { background: var(--emerald-pale); color: var(--emerald-mid); }
  .tag-be  { background: var(--gold-pale);    color: var(--gold); }
  .tag-db  { background: #EDE9FE;             color: #5B21B6; }
  .tag-api { background: #FEE2E2;             color: #991B1B; }

  /* ── Section label ── */
  .section-label {
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--ink-light);
    font-weight: 500;
    margin: 40px 0 16px;
  }

  /* ── Footer ── */
  footer {
    text-align: center;
    padding: 40px;
    font-size: 12px;
    color: var(--ink-light);
    font-weight: 300;
    letter-spacing: 0.06em;
    border-top: 1px solid var(--border);
  }

  footer span { color: var(--emerald-bright); }
</style>
</head>
<body>

<header>
  <div class="header-inner">
    <div class="logo">
      <div class="logo-mark">
        <svg viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white"/>
          <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity=".6"/>
          <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity=".6"/>
          <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity=".35"/>
        </svg>
      </div>
      <span class="logo-name">EcoTap</span>
    </div>
    <div class="progress-global">
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill" id="global-bar" style="width:0%"></div>
      </div>
      <span class="progress-label" id="global-pct">0%</span>
      <span class="header-meta">overall</span>
    </div>
  </div>
</header>

<div class="hero">
  <div class="hero-eyebrow">Project roadmap · 15 phases</div>
  <h1 class="hero-title">Build<br><em>EcoTap</em></h1>
  <p class="hero-sub">NFC + QR digital business cards for companies and individuals. Smart, elegant, Rwandan-built.</p>
  <div class="hero-decoration"></div>
</div>

<div class="stats-bar">
  <div class="stat">
    <span class="stat-value" id="stat-done">0</span>
    <span class="stat-label">Tasks done</span>
  </div>
  <div class="stat-divider"></div>
  <div class="stat">
    <span class="stat-value" id="stat-total">0</span>
    <span class="stat-label">Total tasks</span>
  </div>
  <div class="stat-divider"></div>
  <div class="stat">
    <span class="stat-value" id="stat-phases">0</span>
    <span class="stat-label">Phases complete</span>
  </div>
  <div class="stat-divider"></div>
  <div class="stat">
    <span class="stat-value">15</span>
    <span class="stat-label">Total phases</span>
  </div>
</div>

<main class="main" id="phases-container">

  <div class="section-label">Frontend — Phases 1–7</div>

  <!-- Phase 1 -->
  <div class="phase" data-phase="1">
    <div class="phase-header" onclick="togglePhase(this)">
      <span class="phase-number">01</span>
      <div class="phase-icon" style="background:#ECFDF5; font-size:20px">🏠</div>
      <div class="phase-meta">
        <div class="phase-title">Home page & design system</div>
        <div class="phase-desc">Tailwind tokens, fonts, home page layout, hero, CTA</div>
      </div>
      <div class="phase-progress">
        <div class="phase-bar-wrap"><div class="phase-bar-fill" style="background:var(--emerald-bright);width:0%"></div></div>
        <span class="phase-pct" style="color:var(--emerald-mid)">0%</span>
      </div>
      <svg class="phase-chevron" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="tasks">
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Set up Next.js 14 project with TypeScript and Tailwind</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Configure custom Tailwind tokens — emerald, ivory, cream, gold palette</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Install and configure Cormorant Garamond + DM Sans fonts</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build home page hero section with CTA buttons (org login / individual login)</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build features section, how-it-works section</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build pricing teaser section (no exact prices — contact us CTA)</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build footer with links and branding</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Create shared Button, Badge, Input, Card UI primitives</span><span class="task-tag tag-fe">FE</span></div>
    </div>
  </div>

  <!-- Phase 2 -->
  <div class="phase" data-phase="2">
    <div class="phase-header" onclick="togglePhase(this)">
      <span class="phase-number">02</span>
      <div class="phase-icon" style="background:#FEF9EF;">🔐</div>
      <div class="phase-meta">
        <div class="phase-title">Authentication pages</div>
        <div class="phase-desc">Login and register UI for organizations and individuals</div>
      </div>
      <div class="phase-progress">
        <div class="phase-bar-wrap"><div class="phase-bar-fill" style="background:var(--emerald-bright);width:0%"></div></div>
        <span class="phase-pct" style="color:var(--emerald-mid)">0%</span>
      </div>
      <svg class="phase-chevron" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="tasks">
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build organization login page UI</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build organization register page UI (multi-step form)</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build individual / employee login page UI</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build individual register page UI</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build "pending approval" holding page shown after signup</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Add form validation UI (react-hook-form + zod schemas)</span><span class="task-tag tag-fe">FE</span></div>
    </div>
  </div>

  <!-- Phase 3 -->
  <div class="phase" data-phase="3">
    <div class="phase-header" onclick="togglePhase(this)">
      <span class="phase-number">03</span>
      <div class="phase-icon" style="background:#ECFDF5;">👤</div>
      <div class="phase-meta">
        <div class="phase-title">Employee / individual dashboard</div>
        <div class="phase-desc">Profile editor, card preview, QR display</div>
      </div>
      <div class="phase-progress">
        <div class="phase-bar-wrap"><div class="phase-bar-fill" style="background:var(--emerald-bright);width:0%"></div></div>
        <span class="phase-pct" style="color:var(--emerald-mid)">0%</span>
      </div>
      <svg class="phase-chevron" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="tasks">
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build employee dashboard layout with sidebar navigation</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build profile editor form (name, title, phone, email, bio, social links)</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build live card preview component (updates as user types)</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build QR code display and download UI</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build contact exchanges inbox (list of visitors who tapped card)</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build card design selector (choose from available designs)</span><span class="task-tag tag-fe">FE</span></div>
    </div>
  </div>

  <!-- Phase 4 -->
  <div class="phase" data-phase="4">
    <div class="phase-header" onclick="togglePhase(this)">
      <span class="phase-number">04</span>
      <div class="phase-icon" style="background:#FEF9EF;">🏢</div>
      <div class="phase-meta">
        <div class="phase-title">Company admin dashboard</div>
        <div class="phase-desc">Employee management, branding, department structure</div>
      </div>
      <div class="phase-progress">
        <div class="phase-bar-wrap"><div class="phase-bar-fill" style="background:var(--emerald-bright);width:0%"></div></div>
        <span class="phase-pct" style="color:var(--emerald-mid)">0%</span>
      </div>
      <svg class="phase-chevron" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="tasks">
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build company admin dashboard layout</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build employee list table with status badges</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build company branding settings page (logo, brand color)</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build department management UI (create, edit, assign employees)</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build subscription status page (plan, employee count, billing)</span><span class="task-tag tag-fe">FE</span></div>
    </div>
  </div>

  <!-- Phase 5 -->
  <div class="phase" data-phase="5">
    <div class="phase-header" onclick="togglePhase(this)">
      <span class="phase-number">05</span>
      <div class="phase-icon" style="background:#ECFDF5;">🃏</div>
      <div class="phase-meta">
        <div class="phase-title">Public card pages</div>
        <div class="phase-desc">The NFC tap destination — profile, vCard download, contact exchange</div>
      </div>
      <div class="phase-progress">
        <div class="phase-bar-wrap"><div class="phase-bar-fill" style="background:var(--emerald-bright);width:0%"></div></div>
        <span class="phase-pct" style="color:var(--emerald-mid)">0%</span>
      </div>
      <svg class="phase-chevron" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="tasks">
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build public card page layout for company employees</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build public card page layout for individuals/freelancers</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build "Save contact" .vcf download button</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build visitor contact exchange form (name, email, phone)</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build social links row (LinkedIn, Twitter, WhatsApp, website)</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build card theme rendering (apply selected design + brand color)</span><span class="task-tag tag-fe">FE</span></div>
    </div>
  </div>

  <!-- Phase 6 -->
  <div class="phase" data-phase="6">
    <div class="phase-header" onclick="togglePhase(this)">
      <span class="phase-number">06</span>
      <div class="phase-icon" style="background:#FEF9EF;">📦</div>
      <div class="phase-meta">
        <div class="phase-title">Card ordering UI</div>
        <div class="phase-desc">Design selection, quantity, shipping address, order status</div>
      </div>
      <div class="phase-progress">
        <div class="phase-bar-wrap"><div class="phase-bar-fill" style="background:var(--emerald-bright);width:0%"></div></div>
        <span class="phase-pct" style="color:var(--emerald-mid)">0%</span>
      </div>
      <svg class="phase-chevron" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="tasks">
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build card design gallery (available designs with preview)</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build order form (design picker, quantity input, shipping address)</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build order confirmation and success page</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build order history list with status tracking</span><span class="task-tag tag-fe">FE</span></div>
    </div>
  </div>

  <!-- Phase 7 -->
  <div class="phase" data-phase="7">
    <div class="phase-header" onclick="togglePhase(this)">
      <span class="phase-number">07</span>
      <div class="phase-icon" style="background:#ECFDF5;">🛡️</div>
      <div class="phase-meta">
        <div class="phase-title">Super Admin panel UI</div>
        <div class="phase-desc">Approvals, card orders, designs, billing management</div>
      </div>
      <div class="phase-progress">
        <div class="phase-bar-wrap"><div class="phase-bar-fill" style="background:var(--emerald-bright);width:0%"></div></div>
        <span class="phase-pct" style="color:var(--emerald-mid)">0%</span>
      </div>
      <svg class="phase-chevron" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="tasks">
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build super admin dashboard layout</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build pending approvals queue (companies + individuals)</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build card orders management table with approve/ship/deliver actions</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build card designs management (upload, activate, deactivate)</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build users table (view all profiles, filter by role/status)</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build billing plans management page</span><span class="task-tag tag-fe">FE</span></div>
    </div>
  </div>

  <div class="section-label">Backend & Integration — Phases 8–15</div>

  <!-- Phase 8 -->
  <div class="phase" data-phase="8">
    <div class="phase-header" onclick="togglePhase(this)">
      <span class="phase-number">08</span>
      <div class="phase-icon" style="background:#FEF3C7;">🗄️</div>
      <div class="phase-meta">
        <div class="phase-title">Database schema & migrations</div>
        <div class="phase-desc">All 9 tables, RLS policies, triggers, indexes</div>
      </div>
      <div class="phase-progress">
        <div class="phase-bar-wrap"><div class="phase-bar-fill" style="background:var(--gold-light);width:0%"></div></div>
        <span class="phase-pct" style="color:var(--gold)">0%</span>
      </div>
      <svg class="phase-chevron" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="tasks">
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write migration: profiles table with role + status enums</span><span class="task-tag tag-db">DB</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write migration: companies + departments tables</span><span class="task-tag tag-db">DB</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write migration: cards table with JSONB social_links</span><span class="task-tag tag-db">DB</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write migration: card_designs + card_orders tables</span><span class="task-tag tag-db">DB</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write migration: contact_exchanges table</span><span class="task-tag tag-db">DB</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write migration: billing_plans + company_subscriptions</span><span class="task-tag tag-db">DB</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Configure Row Level Security (RLS) policies for all tables</span><span class="task-tag tag-db">DB</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Add trigger: auto-create profiles row on auth.users insert</span><span class="task-tag tag-db">DB</span></div>
    </div>
  </div>

  <!-- Phase 9 -->
  <div class="phase" data-phase="9">
    <div class="phase-header" onclick="togglePhase(this)">
      <span class="phase-number">09</span>
      <div class="phase-icon" style="background:#FEF3C7;">📚</div>
      <div class="phase-meta">
        <div class="phase-title">Repositories layer</div>
        <div class="phase-desc">All DB access functions — SSOT Layer 2</div>
      </div>
      <div class="phase-progress">
        <div class="phase-bar-wrap"><div class="phase-bar-fill" style="background:var(--gold-light);width:0%"></div></div>
        <span class="phase-pct" style="color:var(--gold)">0%</span>
      </div>
      <svg class="phase-chevron" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="tasks">
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write profiles.repo.ts — CRUD + getByUsername + updateStatus</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write companies.repo.ts — CRUD + getBySlug + updateStatus</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write cards.repo.ts — CRUD + getBySlug + getByProfileId</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write card_orders.repo.ts — create + getByProfileId + updateStatus</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write contact_exchanges.repo.ts — create + getByCardId</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write card_designs.repo.ts — getActive + CRUD (admin)</span><span class="task-tag tag-be">BE</span></div>
    </div>
  </div>

  <!-- Phase 10 -->
  <div class="phase" data-phase="10">
    <div class="phase-header" onclick="togglePhase(this)">
      <span class="phase-number">10</span>
      <div class="phase-icon" style="background:#FEF3C7;">⚙️</div>
      <div class="phase-meta">
        <div class="phase-title">Services layer</div>
        <div class="phase-desc">Business logic — SSOT Layer 3</div>
      </div>
      <div class="phase-progress">
        <div class="phase-bar-wrap"><div class="phase-bar-fill" style="background:var(--gold-light);width:0%"></div></div>
        <span class="phase-pct" style="color:var(--gold)">0%</span>
      </div>
      <svg class="phase-chevron" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="tasks">
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write onboarding.service.ts — register company, register individual, approve/reject</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write cards.service.ts — create card, update profile, generate slug</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write orders.service.ts — place order, approve, mark shipped/delivered</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write contacts.service.ts — record exchange, get inbox for employee</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write admin.service.ts — pending queues, user management</span><span class="task-tag tag-be">BE</span></div>
    </div>
  </div>

  <!-- Phase 11 -->
  <div class="phase" data-phase="11">
    <div class="phase-header" onclick="togglePhase(this)">
      <span class="phase-number">11</span>
      <div class="phase-icon" style="background:#FEF3C7;">⚡</div>
      <div class="phase-meta">
        <div class="phase-title">Server Actions & auth wiring</div>
        <div class="phase-desc">Connect UI to services, middleware route protection</div>
      </div>
      <div class="phase-progress">
        <div class="phase-bar-wrap"><div class="phase-bar-fill" style="background:var(--gold-light);width:0%"></div></div>
        <span class="phase-pct" style="color:var(--gold)">0%</span>
      </div>
      <svg class="phase-chevron" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="tasks">
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Wire Supabase Auth — signup, login, logout, session refresh</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write middleware.ts — role-based route protection for all dashboard routes</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write onboarding.actions.ts — register org, register individual</span><span class="task-tag tag-api">API</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write cards.actions.ts — update profile, change design</span><span class="task-tag tag-api">API</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write orders.actions.ts — place order, admin update status</span><span class="task-tag tag-api">API</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write contacts.actions.ts — visitor submits contact exchange</span><span class="task-tag tag-api">API</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Write admin.actions.ts — approve/reject company, approve/reject individual</span><span class="task-tag tag-api">API</span></div>
    </div>
  </div>

  <!-- Phase 12 -->
  <div class="phase" data-phase="12">
    <div class="phase-header" onclick="togglePhase(this)">
      <span class="phase-number">12</span>
      <div class="phase-icon" style="background:#FEF3C7;">📇</div>
      <div class="phase-meta">
        <div class="phase-title">vCard & QR generation</div>
        <div class="phase-desc">Downloadable .vcf files and QR codes linked to card URLs</div>
      </div>
      <div class="phase-progress">
        <div class="phase-bar-wrap"><div class="phase-bar-fill" style="background:var(--gold-light);width:0%"></div></div>
        <span class="phase-pct" style="color:var(--gold)">0%</span>
      </div>
      <svg class="phase-chevron" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="tasks">
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build lib/vcf/generator.ts — generate .vcf string from card profile</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build API route /api/vcf/[slug] — serves .vcf download for any card</span><span class="task-tag tag-api">API</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Integrate qrcode.react on public card page and employee dashboard</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Add QR PNG download button to employee dashboard</span><span class="task-tag tag-fe">FE</span></div>
    </div>
  </div>

  <!-- Phase 13 -->
  <div class="phase" data-phase="13">
    <div class="phase-header" onclick="togglePhase(this)">
      <span class="phase-number">13</span>
      <div class="phase-icon" style="background:#FEF3C7;">☁️</div>
      <div class="phase-meta">
        <div class="phase-title">Image storage (Cloudflare R2)</div>
        <div class="phase-desc">Profile photos, company logos, card design assets</div>
      </div>
      <div class="phase-progress">
        <div class="phase-bar-wrap"><div class="phase-bar-fill" style="background:var(--gold-light);width:0%"></div></div>
        <span class="phase-pct" style="color:var(--gold)">0%</span>
      </div>
      <svg class="phase-chevron" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="tasks">
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Configure Cloudflare R2 bucket and credentials</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Build lib/r2/upload.ts — upload image, return public URL</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Wire profile photo upload in employee dashboard</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Wire company logo upload in company admin settings</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Wire card design image upload in super admin panel</span><span class="task-tag tag-fe">FE</span></div>
    </div>
  </div>

  <!-- Phase 14 -->
  <div class="phase" data-phase="14">
    <div class="phase-header" onclick="togglePhase(this)">
      <span class="phase-number">14</span>
      <div class="phase-icon" style="background:#FEF3C7;">🔍</div>
      <div class="phase-meta">
        <div class="phase-title">SEO, metadata & OG images</div>
        <div class="phase-desc">Public card pages discoverable and shareable</div>
      </div>
      <div class="phase-progress">
        <div class="phase-bar-wrap"><div class="phase-bar-fill" style="background:var(--gold-light);width:0%"></div></div>
        <span class="phase-pct" style="color:var(--gold)">0%</span>
      </div>
      <svg class="phase-chevron" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="tasks">
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Add dynamic generateMetadata() to all public card pages</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Generate OG image per card using Next.js ImageResponse</span><span class="task-tag tag-fe">FE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Add sitemap.ts for public card pages</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Add robots.txt — allow public cards, block dashboards</span><span class="task-tag tag-be">BE</span></div>
    </div>
  </div>

  <!-- Phase 15 -->
  <div class="phase" data-phase="15">
    <div class="phase-header" onclick="togglePhase(this)">
      <span class="phase-number">15</span>
      <div class="phase-icon" style="background:#FEF3C7;">🚀</div>
      <div class="phase-meta">
        <div class="phase-title">Production launch</div>
        <div class="phase-desc">Vercel deployment, domain, environment, final QA</div>
      </div>
      <div class="phase-progress">
        <div class="phase-bar-wrap"><div class="phase-bar-fill" style="background:var(--gold-light);width:0%"></div></div>
        <span class="phase-pct" style="color:var(--gold)">0%</span>
      </div>
      <svg class="phase-chevron" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="tasks">
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Connect GitHub repo to Vercel project</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Set all environment variables in Vercel dashboard</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Configure ecotap.rw custom domain on Vercel</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Run Supabase migrations against production DB</span><span class="task-tag tag-db">DB</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Seed super admin account in production</span><span class="task-tag tag-db">DB</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">End-to-end QA: register company → approve → create employee → tap card → save contact</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Test NFC chip programming with production URLs</span><span class="task-tag tag-be">BE</span></div>
      <div class="task" onclick="toggleTask(this)"><div class="task-checkbox"></div><span class="task-text">Launch 🎉</span><span class="task-tag tag-be">BE</span></div>
    </div>
  </div>

</main>

<footer>
  Built by <span>AZ Soft Solutions</span> · Kigali, Rwanda
</footer>

<script>
  const STORAGE_KEY = 'ecotap_todo_v1';

  function save(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
  }

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch(e) { return {}; }
  }

  function togglePhase(header) {
    const phase = header.closest('.phase');
    phase.classList.toggle('open');
  }

  function toggleTask(task) {
    task.classList.toggle('done');
    updateAll();
    persistState();
  }

  function updateAll() {
    const phases = document.querySelectorAll('.phase');
    let totalDone = 0, totalAll = 0, phasesDone = 0;

    phases.forEach(phase => {
      const tasks = phase.querySelectorAll('.task');
      const done = phase.querySelectorAll('.task.done').length;
      const total = tasks.length;
      const pct = total ? Math.round((done / total) * 100) : 0;

      totalDone += done;
      totalAll += total;
      if (pct === 100 && total > 0) phasesDone++;

      const bar = phase.querySelector('.phase-bar-fill');
      const pctEl = phase.querySelector('.phase-pct');
      if (bar) bar.style.width = pct + '%';
      if (pctEl) pctEl.textContent = pct + '%';

      if (pct === 100 && total > 0) phase.classList.add('complete');
      else phase.classList.remove('complete');
    });

    const globalPct = totalAll ? Math.round((totalDone / totalAll) * 100) : 0;
    document.getElementById('global-bar').style.width = globalPct + '%';
    document.getElementById('global-pct').textContent = globalPct + '%';
    document.getElementById('stat-done').textContent = totalDone;
    document.getElementById('stat-total').textContent = totalAll;
    document.getElementById('stat-phases').textContent = phasesDone;
  }

  function persistState() {
    const state = {};
    document.querySelectorAll('.phase').forEach((phase, pi) => {
      state['p' + pi] = {
        open: phase.classList.contains('open'),
        tasks: [...phase.querySelectorAll('.task')].map(t => t.classList.contains('done'))
      };
    });
    save(state);
  }

  function restoreState() {
    const state = load();
    document.querySelectorAll('.phase').forEach((phase, pi) => {
      const s = state['p' + pi];
      if (!s) return;
      if (s.open) phase.classList.add('open');
      const tasks = phase.querySelectorAll('.task');
      tasks.forEach((t, ti) => { if (s.tasks && s.tasks[ti]) t.classList.add('done'); });
    });
  }

  restoreState();
  updateAll();
</script>
</body>
</html>