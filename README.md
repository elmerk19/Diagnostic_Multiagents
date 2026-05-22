# 🩺 Système Multi-Agents d'Orientation Clinique Préliminaire

> Exercice académique — ne remplace pas une consultation médicale professionnelle.

## Architecture

## Installation

### Prérequis
- Python 3.11+
- Node.js 18+
- uv

### Backend
```bash
uv sync
uv run uvicorn backend.app.api:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev -- --host
```

## Variables d'environnement

Copiez `.env.example` en `.env` :
```bash
OPENAI_API_KEY="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"
OPENAI_MODEL=gpt-4o-mini
```

> Sans clé OpenAI, le système fonctionne en mode fallback (réponses génériques).

## Flux de consultation

1. **Cas initial** — description des symptômes
2. **5 questions** — anamnèse guidée par l'agent diagnostique
3. **Revue médecin** — validation humaine de la synthèse
4. **Rapport final** — document Markdown téléchargeable

## API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/consultation/start` | Démarrer une consultation |
| POST | `/consultation/resume` | Répondre à une question |
| GET | `/consultation/{id}` | État de la consultation |
| GET | `/consultation/{id}/report` | Rapport final |
| GET | `/health` | Santé de l'API |
