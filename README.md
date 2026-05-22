# 🩺 Diagnostic Multi-Agents d'Orientation Clinique Préliminaire
> Exercice académique — ne remplace pas une consultation médicale professionnelle.

## Description
Ce projet implémente un prototype de système de diagnostic clinique assisté par plusieurs agents.
Le backend expose une API FastAPI pour gérer le flux de consultation, et le frontend React propose une interface utilisateur simple pour démarrer une consultation, répondre aux questions et récupérer le rapport final.

## Architecture
- `backend/` : API FastAPI et moteur de graphes via `langgraph`.
- `frontend/` : application React + Vite.
- `mcp_server/` : serveur MCP pour la configuration et le support des agents.

## Prérequis
- Python 3.11+
- Node.js 18+
- `uv`
- Une clé OpenAI (optionnelle)

## Installation

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

## Configuration
Créez un fichier `.env` à la racine à partir de `.env.example` :
```bash
cp .env.example .env
```
Puis renseignez vos variables :
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

## Limites
- Prototype académique uniquement.
- Ne remplace pas un avis médical professionnel.
- La qualité des suggestions dépend du modèle OpenAI et des prompts.

## Licence
Projet libre pour usage éducatif.
