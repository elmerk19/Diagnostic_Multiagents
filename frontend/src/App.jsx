import { useState, useEffect, useRef } from "react";

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

const palette = {
  bg: "#0a0f1a",
  surface: "#0f1626",
  surfaceAlt: "#131d2e",
  border: "#1e2d44",
  borderLight: "#243550",
  accent: "#00c2ff",
  accentGlow: "rgba(0,194,255,0.15)",
  accentDim: "#0099cc",
  success: "#00e5a0",
  successGlow: "rgba(0,229,160,0.12)",
  warn: "#f59e0b",
  text: "#e8edf5",
  textMuted: "#7a8fa8",
  textDim: "#4a5c74",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${palette.bg};
    color: ${palette.text};
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  .grid-bg {
    position: fixed; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(0,194,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,194,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  .noise {
    position: fixed; inset: 0; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.4;
  }

  .app {
    position: relative; z-index: 1;
    max-width: 860px;
    margin: 0 auto;
    padding: 48px 24px 80px;
  }

  .header {
    display: flex; align-items: flex-start; gap: 20px;
    margin-bottom: 56px;
  }

  .header-icon {
    width: 48px; height: 48px; flex-shrink: 0;
    background: linear-gradient(135deg, ${palette.accent}, #0066ff);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    box-shadow: 0 0 30px rgba(0,194,255,0.3);
  }

  .header-text h1 {
    font-family: 'Instrument Serif', serif;
    font-size: 32px;
    font-weight: 400;
    letter-spacing: -0.5px;
    line-height: 1.15;
    background: linear-gradient(135deg, #fff 0%, ${palette.accent} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .header-text p {
    font-size: 13px;
    color: ${palette.textMuted};
    margin-top: 6px;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.02em;
  }

  .stepper {
    display: flex; align-items: center; gap: 0;
    margin-bottom: 48px;
    padding: 20px 24px;
    background: ${palette.surface};
    border: 1px solid ${palette.border};
    border-radius: 16px;
  }

  .step {
    display: flex; align-items: center; gap: 10px;
    flex: 1;
    position: relative;
  }

  .step:not(:last-child)::after {
    content: '';
    position: absolute; right: -2px; top: 50%;
    transform: translateY(-50%);
    width: calc(100% - 36px - 10px);
    height: 1px;
    margin-left: 46px;
    background: ${palette.border};
  }

  .step.done:not(:last-child)::after {
    background: linear-gradient(90deg, ${palette.success}, ${palette.border});
  }

  .step-num {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 600;
    font-family: 'DM Mono', monospace;
    flex-shrink: 0; transition: all 0.4s ease;
    border: 1.5px solid ${palette.border};
    color: ${palette.textDim};
    background: ${palette.bg};
    z-index: 1;
  }

  .step.active .step-num {
    border-color: ${palette.accent};
    color: ${palette.accent};
    box-shadow: 0 0 16px rgba(0,194,255,0.25);
    background: rgba(0,194,255,0.08);
  }

  .step.done .step-num {
    border-color: ${palette.success};
    background: rgba(0,229,160,0.1);
    color: ${palette.success};
  }

  .step-label {
    font-size: 12px; font-weight: 500;
    color: ${palette.textDim};
    white-space: nowrap;
    transition: color 0.3s;
  }
  .step.active .step-label { color: ${palette.text}; }
  .step.done .step-label { color: ${palette.textMuted}; }

  .card {
    background: ${palette.surface};
    border: 1px solid ${palette.border};
    border-radius: 20px;
    padding: 36px;
    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .card-title {
    font-family: 'Instrument Serif', serif;
    font-size: 24px;
    font-weight: 400;
    margin-bottom: 6px;
    color: ${palette.text};
  }

  .card-subtitle {
    font-size: 13px;
    color: ${palette.textMuted};
    margin-bottom: 28px;
    font-family: 'DM Mono', monospace;
  }

  .field-label {
    font-size: 12px;
    font-weight: 600;
    color: ${palette.textMuted};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 10px;
    display: block;
  }

  textarea, input[type="text"] {
    width: 100%;
    background: ${palette.bg};
    border: 1px solid ${palette.border};
    border-radius: 12px;
    color: ${palette.text};
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    padding: 14px 16px;
    resize: vertical;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    line-height: 1.6;
  }

  textarea:focus, input[type="text"]:focus {
    border-color: ${palette.accent};
    box-shadow: 0 0 0 3px rgba(0,194,255,0.1);
  }

  textarea::placeholder, input::placeholder {
    color: ${palette.textDim};
  }

  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 24px;
    border-radius: 10px;
    font-size: 14px; font-weight: 600;
    cursor: pointer; border: none;
    transition: all 0.2s; letter-spacing: 0.01em;
    font-family: 'DM Sans', sans-serif;
  }

  .btn-primary {
    background: linear-gradient(135deg, ${palette.accent}, #0077ff);
    color: #fff;
    box-shadow: 0 4px 20px rgba(0,194,255,0.25);
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(0,194,255,0.35);
  }

  .btn-primary:disabled {
    opacity: 0.5; cursor: not-allowed;
  }

  .btn-ghost {
    background: transparent;
    border: 1px solid ${palette.border};
    color: ${palette.textMuted};
  }
  .btn-ghost:hover { border-color: ${palette.borderLight}; color: ${palette.text}; }

  .btn-success {
    background: linear-gradient(135deg, ${palette.success}, #00a870);
    color: ${palette.bg};
  }
  .btn-success:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(0,229,160,0.3);
  }
  .btn-success:disabled { opacity: 0.5; cursor: not-allowed; }

  .progress-bar {
    width: 100%;
    height: 4px;
    background: ${palette.border};
    border-radius: 2px;
    margin-bottom: 28px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, ${palette.accent}, ${palette.success});
    border-radius: 2px;
    transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .question-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(0,194,255,0.08);
    border: 1px solid rgba(0,194,255,0.2);
    border-radius: 100px;
    padding: 4px 12px;
    font-size: 11px; font-weight: 600;
    color: ${palette.accent};
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.05em;
    margin-bottom: 20px;
  }

  .question-text {
    font-family: 'Instrument Serif', serif;
    font-size: 20px;
    line-height: 1.5;
    color: ${palette.text};
    margin-bottom: 24px;
  }

  .info-block {
    background: ${palette.surfaceAlt};
    border: 1px solid ${palette.border};
    border-left: 3px solid ${palette.accent};
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 20px;
  }

  .info-block h4 {
    font-size: 11px; font-weight: 600;
    color: ${palette.accent};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 8px;
    font-family: 'DM Mono', monospace;
  }

  .info-block p {
    font-size: 14px;
    color: ${palette.textMuted};
    line-height: 1.6;
  }

  .info-block.success {
    border-left-color: ${palette.success};
  }
  .info-block.success h4 { color: ${palette.success}; }

  .thread-chip {
    display: inline-flex; align-items: center; gap: 6px;
    background: ${palette.bg};
    border: 1px solid ${palette.border};
    border-radius: 8px;
    padding: 4px 10px;
    font-size: 11px;
    color: ${palette.textDim};
    font-family: 'DM Mono', monospace;
    margin-bottom: 24px;
  }

  .thread-chip span { color: ${palette.textMuted}; }

  .report-body {
    font-size: 14px; line-height: 1.75;
    color: ${palette.textMuted};
  }

  .report-body h1, .report-body h2 {
    font-family: 'Instrument Serif', serif;
    font-weight: 400; margin: 28px 0 12px;
    color: ${palette.text};
  }

  .report-body h1 { font-size: 26px; margin-top: 0; }
  .report-body h2 { font-size: 18px; padding-top: 16px; border-top: 1px solid ${palette.border}; }
  .report-body h3 { font-size: 14px; font-weight: 600; color: ${palette.text}; margin: 16px 0 8px; }

  .report-body p { margin-bottom: 12px; }
  .report-body ul, .report-body ol { padding-left: 20px; margin-bottom: 12px; }
  .report-body li { margin-bottom: 4px; }

  .report-body strong { color: ${palette.text}; font-weight: 600; }
  .report-body em { color: ${palette.accent}; font-style: italic; }

  .report-body hr {
    border: none; border-top: 1px solid ${palette.border};
    margin: 24px 0;
  }

  .disclaimer-box {
    background: rgba(245,158,11,0.06);
    border: 1px solid rgba(245,158,11,0.2);
    border-radius: 12px;
    padding: 14px 18px;
    font-size: 12px;
    color: ${palette.warn};
    font-family: 'DM Mono', monospace;
    margin-top: 24px;
    line-height: 1.6;
  }

  .error-box {
    background: rgba(239,68,68,0.06);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 13px;
    color: #f87171;
    margin-top: 12px;
  }

  .spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(0,194,255,0.2);
    border-top-color: ${palette.accent};
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-state {
    display: flex; align-items: center; gap: 12px;
    padding: 32px;
    justify-content: center;
    color: ${palette.textMuted};
    font-size: 14px;
  }

  .actions { display: flex; gap: 12px; margin-top: 28px; flex-wrap: wrap; align-items: center; }

  .scenario-list {
    margin-top: 24px;
    padding: 20px;
    background: ${palette.surfaceAlt};
    border: 1px solid ${palette.border};
    border-radius: 12px;
  }

  .scenario-list h4 {
    font-size: 11px; font-weight: 700;
    color: ${palette.textDim}; letter-spacing: 0.1em;
    text-transform: uppercase; margin-bottom: 12px;
    font-family: 'DM Mono', monospace;
  }

  .scenario-btn {
    display: block; width: 100%; text-align: left;
    background: transparent; border: 1px solid ${palette.border};
    border-radius: 8px; padding: 10px 14px;
    color: ${palette.textMuted}; font-size: 13px;
    cursor: pointer; margin-bottom: 8px;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .scenario-btn:hover {
    border-color: ${palette.accent};
    color: ${palette.text};
    background: rgba(0,194,255,0.04);
  }
  .scenario-btn:last-child { margin-bottom: 0; }

  .divider { flex: 1; }
`;

const STEPS = [
  { label: "Cas initial", short: "01" },
  { label: "Questions patient", short: "02" },
  { label: "Revue médecin", short: "03" },
  { label: "Rapport final", short: "04" },
];

const SCENARIOS = [
  { label: "Syndrome respiratoire simple", value: "Toux sèche depuis 3 jours, fatigue modérée, pas de fièvre connue." },
  { label: "Signes d'alerte (red flags)", value: "Essoufflement soudain au repos, douleur thoracique persistante depuis ce matin." },
  { label: "Cas bénin (fatigue légère)", value: "Fatigue légère depuis une semaine, sans autres symptômes particuliers." },
];

function Stepper({ currentStep }) {
  return (
    <div className="stepper">
      {STEPS.map((s, i) => {
        const stepNum = i + 1;
        const done = stepNum < currentStep;
        const active = stepNum === currentStep;
        return (
          <div key={i} className={`step ${done ? "done" : ""} ${active ? "active" : ""}`}>
            <div className="step-num">
              {done ? "✓" : s.short}
            </div>
            <span className="step-label">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function apiPost(path, body) {
  return fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });
}

function apiGet(path) {
  return fetch(`${API_URL}${path}`).then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });
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
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hup])(.+)$/gm, "$1")
    .replace(/^<\/p><p>$/, "");
}

export default function App() {
  const [step, setStep] = useState(1);
  const [threadId, setThreadId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [initialCase, setInitialCase] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionIndex, setQuestionIndex] = useState(1);
  const [answer, setAnswer] = useState("");
  const [summary, setSummary] = useState("");
  const [interimCare, setInterimCare] = useState("");
  const [treatment, setTreatment] = useState("");
  const [report, setReport] = useState("");

  const call = async (fn) => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (e) {
      setError(e.message || "Erreur de connexion à l'API");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    if (initialCase.trim().length < 3) {
      setError("Veuillez décrire le cas en quelques mots.");
      return;
    }
    const data = await call(() => apiPost("/consultation/start", { initial_case: initialCase }));
    if (!data) return;
    setThreadId(data.thread_id);
    const q = data.interrupts?.[0]?.question || data.current_question || "";
    setCurrentQuestion(q);
    setQuestionIndex(data.interrupts?.[0]?.index || 1);
    setStep(2);
  };

  const handleAnswer = async () => {
    const data = await call(() => apiPost("/consultation/resume", {
      thread_id: threadId,
      patient_answer: answer,
    }));
    if (!data) return;
    setAnswer("");

    if (data.status === "awaiting_physician" || data.status === "completed") {
      setSummary(data.diagnostic_summary || "");
      setInterimCare(data.interim_care || "");
      if (data.status === "completed") {
        setReport(data.final_report || "");
        setStep(4);
      } else {
        setStep(3);
      }
    } else {
      const q = data.interrupts?.[0]?.question || data.current_question || "";
      setCurrentQuestion(q);
      setQuestionIndex(data.interrupts?.[0]?.index || data.question_count || questionIndex + 1);
    }
  };

  const handlePhysician = async () => {
    if (!treatment.trim()) { setError("Veuillez saisir une conduite à tenir."); return; }
    const data = await call(() => apiPost("/consultation/resume", {
      thread_id: threadId,
      physician_treatment: treatment,
    }));
    if (!data) return;
    const rep = data.final_report || await (async () => {
      await new Promise(r => setTimeout(r, 800));
      const r2 = await apiGet(`/consultation/${threadId}/report`);
      return r2?.final_report || "";
    })();
    setReport(rep);
    setStep(4);
  };

  const reset = () => {
    setStep(1); setThreadId(null); setInitialCase(""); setAnswer("");
    setCurrentQuestion(""); setQuestionIndex(1); setSummary(""); setInterimCare("");
    setTreatment(""); setReport(""); setError(null);
  };

  const downloadReport = () => {
    const blob = new Blob([report], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "rapport_clinia.md";
    a.click();
  };

  return (
    <>
      <style>{css}</style>
      <div className="grid-bg" />
      <div className="noise" />
      <div className="app">
        <div className="header">
          <div className="header-icon">🩺</div>
          <div className="header-text">
            <h1>ClinIA</h1>
            <p>Orientation clinique préliminaire — exercice académique</p>
          </div>
        </div>

        <Stepper currentStep={step} />

        {step === 1 && (
          <div className="card">
            <p className="card-title">Cas initial patient</p>
            <p className="card-subtitle">Décrivez les symptômes et le contexte clinique</p>
            <label className="field-label">Description initiale</label>
            <textarea
              rows={5}
              value={initialCase}
              onChange={e => setInitialCase(e.target.value)}
              placeholder="Ex. : Toux sèche depuis 3 jours, fatigue modérée, pas de fièvre connue…"
            />
            {error && <div className="error-box">⚠ {error}</div>}
            <div className="actions">
              <button className="btn btn-primary" onClick={handleStart} disabled={loading}>
                {loading ? <span className="spinner" /> : "→"}
                {loading ? "Démarrage…" : "Démarrer la consultation"}
              </button>
            </div>
            <div className="scenario-list">
              <h4>Scénarios de test</h4>
              {SCENARIOS.map((s, i) => (
                <button key={i} className="scenario-btn" onClick={() => setInitialCase(s.value)}>
                  <strong style={{ color: palette.accent }}>Cas {i+1}</strong> — {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <div className="thread-chip">
              <span>🔗</span> {threadId?.slice(0, 18)}…
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(questionIndex / 5) * 100}%` }} />
            </div>
            <div className="question-badge">
              ✦ Question {questionIndex} sur 5
            </div>
            {loading ? (
              <div className="loading-state">
                <span className="spinner" /> Chargement de la question…
              </div>
            ) : (
              <>
                <p className="question-text">{currentQuestion || "Chargement de la question…"}</p>
                <label className="field-label">Votre réponse</label>
                <input
                  type="text"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Entrez votre réponse ici…"
                  onKeyDown={e => e.key === "Enter" && !loading && handleAnswer()}
                  autoFocus
                />
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
        )}

        {step === 3 && (
          <div className="card">
            <p className="card-title">Revue médecin traitant</p>
            <p className="card-subtitle">Validez ou ajustez la conduite avant génération du rapport</p>
            {summary && (
              <div className="info-block" style={{ marginBottom: 16 }}>
                <h4>Synthèse clinique préliminaire</h4>
                <p>{summary}</p>
              </div>
            )}
            {interimCare && (
              <div className="info-block success">
                <h4>Recommandation intermédiaire</h4>
                <p>{interimCare}</p>
              </div>
            )}
            <label className="field-label" style={{ marginTop: 24 }}>Traitement / conduite à tenir</label>
            <textarea
              rows={4}
              value={treatment}
              onChange={e => setTreatment(e.target.value)}
              placeholder="Ex. : Repos, paracétamol si besoin, consultation si fièvre > 38.5°C pendant 48 h…"
            />
            {error && <div className="error-box">⚠ {error}</div>}
            <div className="actions">
              <button className="btn btn-success" onClick={handlePhysician} disabled={loading || !treatment.trim()}>
                {loading ? <span className="spinner" /> : "✓"}
                {loading ? "Génération…" : "Valider et générer le rapport"}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="card">
            <p className="card-title">Rapport final ClinIA</p>
            <p className="card-subtitle" style={{ marginBottom: 28 }}>Consultation terminée</p>
            {report ? (
              <>
                <div
                  className="report-body"
                  dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(report)}</p>` }}
                />
                <div className="disclaimer-box">
                  ⚠ Ce rapport est généré à titre académique et ne constitue pas un avis médical professionnel.
                </div>
                <div className="actions">
                  <button className="btn btn-primary" onClick={downloadReport}>
                    ↓ Télécharger (.md)
                  </button>
                  <button className="btn btn-ghost" onClick={reset}>
                    ↺ Nouvelle consultation
                  </button>
                </div>
              </>
            ) : (
              <div className="loading-state">
                <span className="spinner" /> Génération du rapport…
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
