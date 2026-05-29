# 🩺 ClinIA — Orientation Clinique Préliminaire


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

## Captures d'écran de l'application
Ce projet inclut un outil pour capturer automatiquement l'interface React du frontend.

### Génération automatique
1. Installez les dépendances NPM depuis la racine :

```bash
npm install
```

2. Exécutez le wrapper de capture :

```bash
bash tools/capture_frontend_screenshots.sh
```

3. Les captures s'enregistrent dans `./screenshots` :
   - `app_home.png`
   - `app_initial_case.png`

4. Si vous souhaitez utiliser une URL personnalisée, définissez `APP_URL` :

```bash
APP_URL=http://localhost:5173 bash tools/capture_frontend_screenshots.sh
```

### Insérer les captures dans le README
Une fois les images générées, ajoutez-les simplement dans le README en utilisant des chemins relatifs vers le dossier `screenshots`.

Par exemple :

```md
![Accueil ClinIA](screenshots/app_home.png)

![Cas initial patient](screenshots/app_initial_case.png)
```

Vous pouvez aussi remplacer les noms de fichier par les captures que vous prendrez manuellement.

### Captures manuelles
Si vous préférez, vous pouvez aussi prendre des captures d'écran manuelles depuis le navigateur pour :
- l'écran d'accueil
- le formulaire de cas initial
- l'avancement de la consultation

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
