import { useState, useEffect } from "react";

const API_URL = (() => {
  if (typeof window !== "undefined") {
    const { hostname, protocol } = window.location;
    if (hostname.endsWith(".app.github.dev")) {
      const backendHost = hostname.replace(/-\d+(\.app\.github\.dev)$/, "-8000$1");
      return `${protocol}//${backendHost}`;
    }
  }
  return "http://localhost:8000";
})();

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800&family=Fraunces:ital,wght@0,300;0,600;1,300&display=swap');

  :root {
    --teal: #0bbfb0;
    --teal-light: #e6faf8;
    --teal-mid: #b2ede8;
    --teal-dark: #079188;
    --teal-deep: #055f58;
    --white: #ffffff;
    --off: #f4fafa;
    --slate: #1a3a38;
    --muted: #5c8280;
    --border: #cceae7;
    --warn: #f59e0b;
    --red: #ef4444;
    --red-bg: #fef2f2;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--off);
    color: var(--slate);
    font-family: 'Cabinet Grotesk', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── WELCOME PAGE ── */
  .welcome {
    min-height: 100vh;
    background: linear-gradient(160deg, #055f58 0%, #0a8f87 40%, #0bbfb0 75%, #7ee8e2 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 24px;
    position: relative; overflow: hidden;
  }

  .welcome::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%);
  }

  .welcome-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .welcome-circles {
    position: absolute; inset: 0; overflow: hidden;
    pointer-events: none;
  }

  .welcome-circle {
    position: absolute; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.08);
    animation: floatCircle linear infinite;
  }

  @keyframes floatCircle {
    0%   { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(-30px) rotate(360deg); }
  }

  .welcome-inner {
    position: relative; z-index: 1;
    max-width: 600px; width: 100%;
    text-align: center;
  }

  .welcome-logo {
    width: 96px; height: 96px;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(16px);
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 28px;
    display: flex; align-items: center; justify-content: center;
    font-size: 44px;
    margin: 0 auto 32px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.15), 0 0 0 8px rgba(255,255,255,0.06);
    animation: logoBounce 0.8s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  @keyframes logoBounce {
    from { opacity: 0; transform: scale(0.5) translateY(-20px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .welcome-title {
    font-family: 'Fraunces', serif;
    font-size: 72px; font-weight: 600;
    color: white; letter-spacing: -3px; line-height: 1;
    margin-bottom: 8px;
    animation: titleReveal 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) both;
  }

  .welcome-title span { font-style: italic; font-weight: 300; }

  @keyframes titleReveal {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .welcome-tagline {
    font-size: 16px; font-weight: 500;
    color: rgba(255,255,255,0.75);
    margin-bottom: 48px; letter-spacing: 0.02em;
    animation: taglineFade 0.7s 0.4s ease both;
  }

  @keyframes taglineFade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .welcome-features {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 16px; margin-bottom: 48px;
    animation: featureSlide 0.7s 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes featureSlide {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .feature-card {
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 16px; padding: 20px 16px;
    transition: transform 0.2s, background 0.2s;
  }

  .feature-card:hover {
    transform: translateY(-4px);
    background: rgba(255,255,255,0.15);
  }

  .feature-icon { font-size: 28px; margin-bottom: 10px; }

  .feature-title {
    font-size: 13px; font-weight: 700;
    color: white; margin-bottom: 4px;
  }

  .feature-desc {
    font-size: 11px; font-weight: 500;
    color: rgba(255,255,255,0.65); line-height: 1.5;
  }

  .welcome-cta {
    animation: ctaPop 0.6s 0.7s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  @keyframes ctaPop {
    from { opacity: 0; transform: scale(0.8); }
    to   { opacity: 1; transform: scale(1); }
  }

  .btn-welcome {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 18px 40px; border-radius: 100px;
    font-size: 16px; font-weight: 800;
    background: white; color: var(--teal-deep);
    border: none; cursor: pointer;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    transition: all 0.2s;
    font-family: 'Cabinet Grotesk', sans-serif;
    letter-spacing: 0.01em;
  }

  .btn-welcome:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.2);
  }

  .btn-welcome:active { transform: translateY(-1px) scale(0.98); }

  .btn-welcome-arrow {
    width: 28px; height: 28px;
    background: var(--teal);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; color: white;
    transition: transform 0.2s;
  }

  .btn-welcome:hover .btn-welcome-arrow { transform: translateX(4px); }

  .welcome-disclaimer {
    margin-top: 24px;
    font-size: 11px; font-weight: 500;
    color: rgba(255,255,255,0.5);
    animation: taglineFade 0.7s 0.9s ease both;
  }

  /* ── HERO ── */
  .hero {
    background: linear-gradient(135deg, #055f58 0%, #0bbfb0 60%, #4dd9d0 100%);
    position: relative; overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Ccircle cx='30' cy='30' r='2' fill='%23ffffff' fill-opacity='0.06'/%3E%3C/g%3E%3C/svg%3E");
  }

  .hero::after {
    content: '';
    position: absolute; bottom: -2px; left: 0; right: 0;
    height: 60px; background: var(--off);
    clip-path: ellipse(55% 100% at 50% 100%);
  }

  .hero-inner {
    position: relative; z-index: 1;
    max-width: 760px; margin: 0 auto;
    padding: 36px 24px 60px;
    display: flex; align-items: center; gap: 20px;
    animation: heroSlideDown 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes heroSlideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .hero-logo {
    width: 52px; height: 52px; flex-shrink: 0;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }

  .hero-text h1 {
    font-family: 'Fraunces', serif;
    font-size: 34px; font-weight: 600;
    color: white; letter-spacing: -1px; line-height: 1;
  }
  .hero-text h1 span { font-style: italic; font-weight: 300; }
  .hero-text p { color: rgba(255,255,255,0.75); font-size: 13px; margin-top: 6px; font-weight: 500; }

  /* ── STEPPER ── */
  .stepper-wrap {
    max-width: 760px; margin: -20px auto 32px;
    padding: 0 24px; position: relative; z-index: 2;
    animation: stepperRise 0.6s 0.2s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes stepperRise {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .stepper {
    background: white; border-radius: 16px; padding: 20px 28px;
    display: flex; align-items: center;
    box-shadow: 0 4px 24px rgba(11,191,176,0.12), 0 1px 4px rgba(0,0,0,0.06);
    border: 1px solid var(--border);
  }

  .step { display: flex; align-items: center; gap: 10px; flex: 1; position: relative; }

  .step:not(:last-child)::after {
    content: ''; position: absolute;
    left: 42px; top: 50%; transform: translateY(-50%);
    width: calc(100% - 42px); height: 2px;
    background: var(--border); z-index: 0;
    transition: background 0.5s;
  }
  .step.done:not(:last-child)::after {
    background: linear-gradient(90deg, var(--teal), var(--teal-mid));
  }

  .step-num {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; flex-shrink: 0; z-index: 1;
    transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
    background: var(--off); border: 2px solid var(--border); color: var(--muted);
  }
  .step.active .step-num {
    background: var(--teal); border-color: var(--teal); color: white;
    box-shadow: 0 0 0 5px rgba(11,191,176,0.18); transform: scale(1.15);
  }
  .step.done .step-num { background: var(--teal-deep); border-color: var(--teal-deep); color: white; }

  .step-label { font-size: 12px; font-weight: 600; color: var(--border); transition: color 0.3s; white-space: nowrap; }
  .step.active .step-label { color: var(--slate); }
  .step.done .step-label { color: var(--muted); }

  /* ── MAIN ── */
  .main { max-width: 760px; margin: 0 auto; padding: 0 24px 80px; }

  /* ── CARD ── */
  .card {
    background: white; border-radius: 20px;
    border: 1px solid var(--border); overflow: hidden;
    box-shadow: 0 4px 24px rgba(11,191,176,0.08), 0 1px 4px rgba(0,0,0,0.04);
  }

  .anim-step1 { animation: step1Enter 0.6s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes step1Enter {
    from { opacity: 0; transform: translateY(32px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .anim-step2 { animation: step2Enter 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes step2Enter {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .anim-step3 { animation: step3Enter 0.6s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes step3Enter {
    from { opacity: 0; transform: translateY(-24px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .anim-step4 { animation: step4Enter 0.7s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes step4Enter {
    from { opacity: 0; transform: scale(0.94); }
    to   { opacity: 1; transform: scale(1); }
  }

  .card-header {
    background: linear-gradient(135deg, var(--teal-light), white);
    border-bottom: 1px solid var(--border); padding: 28px 32px 24px;
  }
  .card-header h2 { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 600; color: var(--slate); letter-spacing: -0.5px; }
  .card-header p { font-size: 13px; color: var(--muted); margin-top: 4px; font-weight: 500; }

  .card-body { padding: 28px 32px; }

  .field-label { display: block; font-size: 11px; font-weight: 800; color: var(--teal-dark); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px; }

  textarea, input[type="text"] {
    width: 100%; background: var(--off); border: 2px solid var(--border); border-radius: 12px;
    color: var(--slate); font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 15px; font-weight: 500; padding: 14px 18px;
    resize: vertical; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; line-height: 1.6;
  }
  textarea:focus, input[type="text"]:focus {
    border-color: var(--teal); background: white; box-shadow: 0 0 0 4px rgba(11,191,176,0.1);
  }
  textarea::placeholder, input::placeholder { color: var(--teal-mid); font-weight: 400; }

  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px; border-radius: 100px;
    font-size: 14px; font-weight: 700; cursor: pointer; border: none;
    transition: all 0.2s; font-family: 'Cabinet Grotesk', sans-serif;
  }
  .btn-primary { background: linear-gradient(135deg, var(--teal-dark), var(--teal)); color: white; box-shadow: 0 4px 16px rgba(11,191,176,0.35); }
  .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(11,191,176,0.45); }
  .btn-primary:active:not(:disabled) { transform: scale(0.97); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-ghost { background: transparent; border: 2px solid var(--border); color: var(--muted); }
  .btn-ghost:hover { border-color: var(--teal-mid); color: var(--teal-dark); }

  .btn-success { background: linear-gradient(135deg, var(--teal-deep), var(--teal-dark)); color: white; box-shadow: 0 4px 16px rgba(5,95,88,0.3); }
  .btn-success:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(5,95,88,0.4); }
  .btn-success:active:not(:disabled) { transform: scale(0.97); }
  .btn-success:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-download { background: linear-gradient(135deg, var(--teal-dark), var(--teal)); color: white; box-shadow: 0 4px 16px rgba(11,191,176,0.35); animation: bouncePop 0.6s 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
  @keyframes bouncePop { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } }

  .actions { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; align-items: center; }

  .scenarios { margin-top: 24px; padding: 20px; background: var(--teal-light); border-radius: 14px; border: 1px solid var(--teal-mid); }
  .scenarios h4 { font-size: 10px; font-weight: 800; color: var(--teal-dark); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 12px; }

  .scenario-btn {
    display: block; width: 100%; text-align: left;
    background: white; border: 1.5px solid var(--border); border-radius: 10px; padding: 11px 16px;
    color: var(--slate); font-size: 13px; font-weight: 500; cursor: pointer; margin-bottom: 8px;
    font-family: 'Cabinet Grotesk', sans-serif; transition: all 0.2s;
    opacity: 0; animation: scenarioCascade 0.4s ease forwards;
  }
  .scenario-btn:nth-child(2) { animation-delay: 0.1s; }
  .scenario-btn:nth-child(3) { animation-delay: 0.2s; }
  .scenario-btn:nth-child(4) { animation-delay: 0.3s; }
  @keyframes scenarioCascade { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: translateX(0); } }
  .scenario-btn:hover { border-color: var(--teal); background: var(--teal-light); transform: translateX(6px); }
  .scenario-btn:last-child { margin-bottom: 0; }
  .scenario-tag { display: inline-block; background: var(--teal); color: white; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 100px; margin-right: 8px; letter-spacing: 0.05em; }

  .progress-wrap { margin-bottom: 24px; }
  .progress-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .progress-label { font-size: 12px; font-weight: 700; color: var(--teal-dark); }
  .progress-count { font-size: 14px; font-weight: 700; color: var(--slate); font-family: 'Fraunces', serif; }
  .progress-bar { height: 8px; background: var(--teal-light); border-radius: 4px; overflow: hidden; border: 1px solid var(--border); }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--teal-deep), var(--teal)); border-radius: 4px; transition: width 0.6s cubic-bezier(0.34,1.56,0.64,1); }

  .question-card { background: var(--teal-light); border: 1.5px solid var(--teal-mid); border-radius: 14px; padding: 20px 24px; margin-bottom: 20px; animation: questionFlip 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes questionFlip { from { opacity: 0; transform: rotateX(-12deg) translateY(-12px); } to { opacity: 1; transform: rotateX(0) translateY(0); } }
  .question-num { font-size: 10px; font-weight: 800; color: var(--teal-dark); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
  .question-text { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 600; color: var(--slate); line-height: 1.4; }

  .thread-chip { display: inline-flex; align-items: center; gap: 6px; background: var(--teal-light); border: 1px solid var(--teal-mid); border-radius: 8px; padding: 4px 12px; font-size: 11px; font-weight: 600; color: var(--teal-dark); margin-bottom: 20px; font-family: monospace; }

  .info-block { border-radius: 12px; padding: 18px 20px; margin-bottom: 16px; border: 1.5px solid var(--border); background: var(--off); opacity: 0; animation: infoSlideDown 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
  .info-block:nth-child(1) { animation-delay: 0.05s; }
  .info-block:nth-child(2) { animation-delay: 0.18s; }
  @keyframes infoSlideDown { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
  .info-block.teal { background: var(--teal-light); border-color: var(--teal-mid); }
  .info-block h4 { font-size: 10px; font-weight: 800; color: var(--teal-dark); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
  .info-block p { font-size: 14px; font-weight: 500; color: var(--slate); line-height: 1.6; }

  .error-box { background: var(--red-bg); border: 1.5px solid #fecaca; border-radius: 10px; padding: 12px 16px; font-size: 13px; font-weight: 600; color: var(--red); margin-top: 12px; display: flex; align-items: center; gap: 8px; animation: shake 0.4s ease; }
  @keyframes shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }

  .spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-state { display: flex; align-items: center; gap: 12px; padding: 40px; justify-content: center; color: var(--muted); font-size: 14px; font-weight: 600; }
  .loading-state .spinner { border-color: var(--teal-mid); border-top-color: var(--teal); }

  .report-body { font-size: 14px; line-height: 1.8; color: var(--slate); }
  .report-body h1 { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 600; color: var(--teal-deep); margin: 0 0 16px; padding-bottom: 12px; border-bottom: 2px solid var(--teal-light); animation: reportH1 0.6s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes reportH1 { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
  .report-body h2 { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600; color: var(--slate); margin: 24px 0 10px; padding-top: 20px; border-top: 1px solid var(--border); }
  .report-body h3 { font-size: 14px; font-weight: 700; color: var(--teal-dark); margin: 16px 0 6px; }
  .report-body p { margin-bottom: 12px; }
  .report-body ul { padding-left: 20px; margin-bottom: 12px; }
  .report-body li { margin-bottom: 6px; }
  .report-body strong { color: var(--teal-deep); font-weight: 700; }
  .report-body hr { border: none; border-top: 2px solid var(--teal-light); margin: 24px 0; }

  .disclaimer { background: linear-gradient(135deg, #fffbeb, #fef3c7); border: 1.5px solid #fcd34d; border-radius: 12px; padding: 16px 20px; font-size: 12px; font-weight: 600; color: #92400e; margin-top: 24px; display: flex; gap: 10px; align-items: flex-start; line-height: 1.6; animation: disclaimerPop 0.5s 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
  @keyframes disclaimerPop { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }

  .confetti-wrap { position: fixed; inset: 0; pointer-events: none; z-index: 999; overflow: hidden; }
  .confetti-piece { position: absolute; top: -10px; width: 8px; height: 12px; border-radius: 2px; animation: confettiFall linear forwards; }
  @keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }

  .pulse-icon { display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 50%; background: var(--teal-light); font-size: 24px; position: relative; margin-bottom: 12px; }
  .pulse-icon::before, .pulse-icon::after { content: ''; position: absolute; inset: -4px; border-radius: 50%; border: 2px solid var(--teal); animation: pulseRing 1.5s ease-out infinite; }
  .pulse-icon::after { animation-delay: 0.5s; }
  @keyframes pulseRing { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.6); opacity: 0; } }

  .section-divider { display: flex; align-items: center; gap: 12px; margin: 28px 0 20px; }
  .section-divider span { font-size: 11px; font-weight: 800; color: var(--teal-dark); letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap; }
  .section-divider::before, .section-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  @media (max-width: 600px) {
    .welcome-title { font-size: 48px; }
    .welcome-features { grid-template-columns: 1fr; }
    .step-label { display: none; }
  }
`;

const STEPS = [
  { label: "Cas initial", short: "01" },
  { label: "Questions", short: "02" },
  { label: "Médecin", short: "03" },
  { label: "Rapport", short: "04" },
];

const SCENARIOS = [
  { tag: "CAS 1", label: "Syndrome respiratoire simple", value: "Toux sèche depuis 3 jours, fatigue modérée, pas de fièvre connue." },
  { tag: "CAS 2", label: "Signes d'alerte (red flags)", value: "Essoufflement soudain au repos, douleur thoracique persistante depuis ce matin." },
  { tag: "CAS 3", label: "Cas bénin (fatigue légère)", value: "Fatigue légère depuis une semaine, sans autres symptômes particuliers." },
];

const CONFETTI_COLORS = ["#0bbfb0","#055f58","#4dd9d0","#f59e0b","#ffffff","#b2ede8"];

function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i, left: Math.random() * 100,
    delay: Math.random() * 1.2, duration: 1.8 + Math.random() * 1.5,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotate: Math.random() * 360,
  }));
  return (
    <div className="confetti-wrap">
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`, background: p.color,
          animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
          transform: `rotate(${p.rotate}deg)`,
        }} />
      ))}
    </div>
  );
}

function Stepper({ currentStep }) {
  return (
    <div className="stepper-wrap">
      <div className="stepper">
        {STEPS.map((s, i) => {
          const n = i + 1;
          const done = n < currentStep;
          const active = n === currentStep;
          return (
            <div key={i} className={`step ${done ? "done" : ""} ${active ? "active" : ""}`}>
              <div className="step-num">{done ? "✓" : s.short}</div>
              <span className="step-label">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function apiPost(path, body) {
  return fetch(`${API_URL}${path}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); });
}

function apiGet(path) {
  return fetch(`${API_URL}${path}`).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); });
}

function renderMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/^---$/gm, "<hr>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/\n\n/g, "</p><p>");
}

export default function App() {
  const [step, setStep] = useState(0); // 0 = welcome
  const [threadId, setThreadId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [initialCase, setInitialCase] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionIndex, setQuestionIndex] = useState(1);
  const [answer, setAnswer] = useState("");
  const [summary, setSummary] = useState("");
  const [interimCare, setInterimCare] = useState("");
  const [treatment, setTreatment] = useState("");
  const [report, setReport] = useState("");

  useEffect(() => {
    if (step === 4) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
    }
  }, [step]);

  const call = async (fn) => {
    setLoading(true); setError(null);
    try { return await fn(); }
    catch (e) { setError(e.message || "Erreur de connexion à l'API"); return null; }
    finally { setLoading(false); }
  };

  const handleStart = async () => {
    if (initialCase.trim().length < 3) { setError("Veuillez décrire le cas en quelques mots."); return; }
    const data = await call(() => apiPost("/consultation/start", { initial_case: initialCase }));
    if (!data) return;
    setThreadId(data.thread_id);
    setCurrentQuestion(data.interrupts?.[0]?.question || data.current_question || "");
    setQuestionIndex(data.interrupts?.[0]?.index || 1);
    setStep(2);
  };

  const handleAnswer = async () => {
    const data = await call(() => apiPost("/consultation/resume", { thread_id: threadId, patient_answer: answer }));
    if (!data) return;
    setAnswer("");
    if (data.status === "awaiting_physician" || data.status === "completed") {
      setSummary(data.diagnostic_summary || "");
      setInterimCare(data.interim_care || "");
      if (data.status === "completed") { setReport(data.final_report || ""); setStep(4); }
      else setStep(3);
    } else {
      setCurrentQuestion(data.interrupts?.[0]?.question || data.current_question || "");
      setQuestionIndex(data.interrupts?.[0]?.index || data.question_count || questionIndex + 1);
    }
  };

  const handlePhysician = async () => {
    if (!treatment.trim()) { setError("Veuillez saisir une conduite à tenir."); return; }
    const data = await call(() => apiPost("/consultation/resume", { thread_id: threadId, physician_treatment: treatment }));
    if (!data) return;
    const rep = data.final_report || await (async () => {
      await new Promise(r => setTimeout(r, 800));
      const r2 = await apiGet(`/consultation/${threadId}/report`);
      return r2?.final_report || "";
    })();
    setReport(rep); setStep(4);
  };

  const reset = () => {
    setStep(0); setThreadId(null); setInitialCase(""); setAnswer("");
    setCurrentQuestion(""); setQuestionIndex(1); setSummary(""); setInterimCare("");
    setTreatment(""); setReport(""); setError(null);
  };

  const downloadReport = () => {
    const blob = new Blob([report], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "rapport_clinia.md"; a.click();
  };

  // ── WELCOME PAGE ──
  if (step === 0) {
    return (
      <>
        <style>{css}</style>
        <div className="welcome">
          <div className="welcome-grid" />
          <div className="welcome-circles">
            {[200,320,480,600].map((s,i) => (
              <div key={i} className="welcome-circle" style={{
                width: s, height: s,
                left: `${[10,60,5,70][i]}%`, top: `${[20,10,60,50][i]}%`,
                animationDuration: `${8+i*3}s`,
                animationDirection: i%2===0 ? 'normal' : 'reverse',
              }} />
            ))}
          </div>
          <div className="welcome-inner">
            <div className="welcome-logo">🩺</div>
            <h1 className="welcome-title">Clin<span>IA</span></h1>
            <p className="welcome-tagline">Système multi-agents d'orientation clinique préliminaire</p>
            <div className="welcome-features">
              <div className="feature-card">
                <div className="feature-icon">🤖</div>
                <div className="feature-title">Multi-Agents</div>
                <div className="feature-desc">Orchestration intelligente via LangGraph</div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">👨‍⚕️</div>
                <div className="feature-title">Human-in-the-Loop</div>
                <div className="feature-desc">Validation médicale à chaque étape</div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📋</div>
                <div className="feature-title">Rapport Structuré</div>
                <div className="feature-desc">Synthèse clinique téléchargeable</div>
              </div>
            </div>
            <div className="welcome-cta">
              <button className="btn-welcome" onClick={() => setStep(1)}>
                Commencer une consultation
                <div className="btn-welcome-arrow">→</div>
              </button>
            </div>
            <p className="welcome-disclaimer">Exercice académique · Ne remplace pas une consultation médicale</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      {showConfetti && <Confetti />}

      <div className="hero">
        <div className="hero-inner">
          <div className="hero-logo">🩺</div>
          <div className="hero-text">
            <h1>Clin<span>IA</span></h1>
            <p>Orientation clinique préliminaire</p>
          </div>
        </div>
      </div>

      <Stepper currentStep={step} />

      <div className="main">

        {step === 1 && (
          <div className="card anim-step1">
            <div className="card-header">
              <h2>Cas initial patient</h2>
              <p>Décrivez les symptômes et le contexte clinique</p>
            </div>
            <div className="card-body">
              <label className="field-label">Description des symptômes</label>
              <textarea rows={5} value={initialCase} onChange={e => setInitialCase(e.target.value)}
                placeholder="Ex. : Toux sèche depuis 3 jours, fatigue modérée, pas de fièvre connue…" />
              {error && <div className="error-box">⚠ {error}</div>}
              <div className="actions">
                <button className="btn btn-primary" onClick={handleStart} disabled={loading}>
                  {loading ? <span className="spinner" /> : "→"}
                  {loading ? "Démarrage…" : "Démarrer la consultation"}
                </button>
                <button className="btn btn-ghost" onClick={reset}>← Retour</button>
              </div>
              <div className="section-divider"><span>Scénarios de test</span></div>
              <div className="scenarios">
                <h4>Cas préchargés</h4>
                {SCENARIOS.map((s, i) => (
                  <button key={i} className="scenario-btn" onClick={() => setInitialCase(s.value)}>
                    <span className="scenario-tag">{s.tag}</span>{s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card anim-step2">
            <div className="card-header">
              <h2>Anamnèse patient</h2>
              <p>L'agent diagnostique recueille les informations nécessaires</p>
            </div>
            <div className="card-body">
              <div className="thread-chip">🔗 {threadId?.slice(0, 20)}…</div>
              <div className="progress-wrap">
                <div className="progress-top">
                  <span className="progress-label">Progression</span>
                  <span className="progress-count">{questionIndex} / 5</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(questionIndex / 5) * 100}%` }} />
                </div>
              </div>
              {loading ? (
                <div className="loading-state"><span className="spinner" /> Traitement en cours…</div>
              ) : (
                <>
                  <div className="question-card">
                    <div className="question-num">Question {questionIndex} sur 5</div>
                    <div className="question-text">{currentQuestion || "Chargement…"}</div>
                  </div>
                  <label className="field-label">Votre réponse</label>
                  <input type="text" value={answer} onChange={e => setAnswer(e.target.value)}
                    placeholder="Entrez votre réponse ici…"
                    onKeyDown={e => e.key === "Enter" && !loading && handleAnswer()} autoFocus />
                  {error && <div className="error-box">⚠ {error}</div>}
                  <div className="actions">
                    <button className="btn btn-primary" onClick={handleAnswer} disabled={loading || !answer.trim()}>
                      {loading ? <span className="spinner" /> : null}
                      {loading ? "Envoi…" : "Envoyer →"}
                    </button>
                    <button className="btn btn-ghost" onClick={reset}>Annuler</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card anim-step3">
            <div className="card-header">
              <h2>Revue médecin traitant</h2>
              <p>Validez ou ajustez la conduite avant la génération du rapport final</p>
            </div>
            <div className="card-body">
              {summary && (
                <div className="info-block teal">
                  <h4>Synthèse clinique préliminaire</h4>
                  <p>{summary}</p>
                </div>
              )}
              {interimCare && (
                <div className="info-block">
                  <h4>Recommandation intermédiaire</h4>
                  <p>{interimCare}</p>
                </div>
              )}
              <div className="section-divider"><span>Intervention médecin</span></div>
              <label className="field-label">Traitement / conduite à tenir</label>
              <textarea rows={4} value={treatment} onChange={e => setTreatment(e.target.value)}
                placeholder="Ex. : Repos, paracétamol si besoin, consultation si fièvre > 38.5°C pendant 48 h…" />
              {error && <div className="error-box">⚠ {error}</div>}
              <div className="actions">
                <button className="btn btn-success" onClick={handlePhysician} disabled={loading || !treatment.trim()}>
                  {loading ? <span className="spinner" /> : "✓"}
                  {loading ? "Génération…" : "Valider et générer le rapport"}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="card anim-step4">
            <div className="card-header" style={{ textAlign: "center" }}>
              <div className="pulse-icon">✅</div>
              <h2>Rapport final ClinIA</h2>
              <p>Consultation terminée · Rapport d'orientation clinique préliminaire</p>
            </div>
            <div className="card-body">
              {report ? (
                <>
                  <div className="report-body"
                    dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(report)}</p>` }} />
                  <div className="disclaimer">
                    <span>⚠</span>
                    <span>Ce rapport est généré à titre académique uniquement. Il ne constitue pas un avis médical professionnel et ne remplace pas une consultation médicale.</span>
                  </div>
                  <div className="actions" style={{ marginTop: 24 }}>
                    <button className="btn btn-download" onClick={downloadReport}>↓ Télécharger (.md)</button>
                    <button className="btn btn-ghost" onClick={reset}>↺ Nouvelle consultation</button>
                  </div>
                </>
              ) : (
                <div className="loading-state"><span className="spinner" /> Génération du rapport…</div>
              )}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
