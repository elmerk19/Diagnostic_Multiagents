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
- `npm`
- Une clé OpenAI si vous souhaitez activer les appels OpenAI

## Installation

### Backend

1. Créez et activez un environnement Python :
```bash
python -m venv .venv
source .venv/bin/activate
```
2. Installez les dépendances :
```bash
pip install -r backend/requirements.txt
```
3. Lancez le backend :
```bash
uv run uvicorn backend.app.api:app --reload --port 8000
```

### Frontend

1. Ouvrez un terminal et allez dans le dossier frontend :
```bash
cd frontend
```
2. Installez les dépendances :
```bash
npm install
```
3. Démarrez le serveur de développement :
```bash
npm run dev -- --host
```

## Configuration

Créez un fichier `.env` à la racine du projet et ajoutez les variables suivantes :

```bash
OPENAI_API_KEY="votre_cle_openai"
OPENAI_MODEL=gpt-4o-mini
```

> Si vous n'avez pas de clé OpenAI, le système peut fonctionner en mode fallback avec des réponses génériques, mais le comportement sera limité.

## Utilisation

1. Lancez le backend.
2. Lancez le frontend.
3. Ouvrez l'application web dans votre navigateur.
4. Démarrez une consultation en décrivant un cas clinique.
5. Répondez aux questions posées par l'agent.
6. Attendez la validation du médecin et récupérez le rapport final.

## Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/consultation/start` | Démarrer une consultation avec un cas initial |
| POST | `/consultation/resume` | Reprendre la consultation en envoyant la réponse du patient ou le traitement du médecin |
| GET | `/consultation/{thread_id}` | Obtenir l'état courant d'une consultation |
| GET | `/consultation/{thread_id}/report` | Récupérer le rapport final généré |
| GET | `/health` | Vérifier l'état de santé de l'API |

### Exemple de requête

Démarrer une consultation :
```bash
curl -X POST http://localhost:8000/consultation/start \
  -H "Content-Type: application/json" \
  -d '{"initial_case": "Patient de 45 ans avec fièvre et toux."}'
```

Reprendre une consultation :
```bash
curl -X POST http://localhost:8000/consultation/resume \
  -H "Content-Type: application/json" \
  -d '{"thread_id": "ID_DE_LA_SESSION", "patient_answer": "La douleur est localisée à la poitrine."}'
```

## Limites

- Prototype académique uniquement.
- Ne remplace pas un avis médical professionnel.
- La qualité des suggestions dépend du modèle OpenAI et des prompts.

## Contribution

- Améliorer le flux de conversation
- Ajouter une interface utilisateur plus complète
- Intégrer un système de sessions persistantes
- Ajouter des tests unitaires

---

## Licence

Projet libre pour usage éducatif.
