# 🩺 ClinIA — Orientation Clinique Préliminaire
> Exercice académique — ne remplace pas une consultation médicale professionnelle.

## Description
ClinIA est un prototype de système d'orientation clinique préliminaire basé sur une architecture multi-agents LangGraph. Le backend expose une API FastAPI, le frontend React permet de démarrer une consultation, répondre aux questions et récupérer le rapport final.

## Architecture
- `backend/` : API FastAPI et moteur de graphes via LangGraph.
- `frontend/` : application React + Vite.
- `mcp_server/` : serveur MCP pour les orientations cliniques.

## Prérequis
- Python 3.11+
- Node.js 18+
- `uv`
- Une clé OpenAI (optionnelle)

## Installation

### Backend
```bash
uv sync
uv run python -m uvicorn backend.app.api:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev -- --host
```

### LangGraph Studio
```bash
uv run langgraph dev --config backend/langgraph.json
```

## Configuration
```bash
cp .env.example .env
# Renseignez OPENAI_API_KEY (optionnel)
```
> Sans clé OpenAI, le système fonctionne en mode fallback avec des réponses génériques.

## Utilisation
1. Lancez le backend.
2. Lancez le frontend.
3. Ouvrez l'application dans votre navigateur.
4. Démarrez une consultation en décrivant un cas clinique.
5. Répondez aux 5 questions posées par l'agent.
6. Attendez la validation du médecin et récupérez le rapport final.

## Endpoints API
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/sessions/start` | Créer une session |
| POST | `/consultation/start` | Démarrer une consultation |
| POST | `/consultation/resume` | Reprendre la consultation |
| GET | `/consultation/{thread_id}` | État de la consultation |
| GET | `/consultation/{thread_id}/report` | Rapport final |
| GET | `/health` | Santé de l'API |

### Exemples
```bash
curl -X POST http://localhost:8000/consultation/start \
  -H "Content-Type: application/json" \
  -d '{"initial_case": "Patient de 45 ans avec fièvre et toux."}'

curl -X POST http://localhost:8000/consultation/resume \
  -H "Content-Type: application/json" \
  -d '{"thread_id": "ID_DE_LA_SESSION", "patient_answer": "Depuis 3 jours."}'
```

## Jeux de tests
| Cas | Description | Red flags |
|-----|-------------|-----------|
| Cas 1 | Toux sèche depuis 3 jours, fatigue modérée | Non |
| Cas 2 | Essoufflement soudain, douleur thoracique | Oui |
| Cas 3 | Fatigue légère depuis une semaine | Non |

## Limites
- Prototype académique uniquement.
- Ne remplace pas un avis médical professionnel.

## Licence
Projet libre pour usage éducatif.

## Aperçu

### Page d'accueil
![Accueil](docs/screenshots/page0.png)

### Écran 1 — Cas initial
![Cas initial](docs/screenshots/page1.png)

### Écran 2 — Questions patient
![Question 1](docs/screenshots/page3.png)
![Question 3](docs/screenshots/page5_Q3.png)
![Question 5](docs/screenshots/page6_Q5.png)

### Écran 3 — Revue médecin
![Revue médecin](docs/screenshots/page7_revue.png)

### Écran 4 — Rapport final
![Rapport 1](docs/screenshots/rapport_final1.png)
![Rapport 2](docs/screenshots/rapport_final2.png)

### LangGraph Studio
![LangGraph Studio](docs/screenshots/langgraph_studio.png)
