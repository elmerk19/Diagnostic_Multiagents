# 🩺 ClinIA — Système Multi-Agents d'Orientation Clinique Préliminaire
> Exercice académique — ne remplace pas une consultation médicale professionnelle.

## Description
ClinIA est un prototype académique de système d'orientation clinique préliminaire basé sur une architecture multi-agents LangGraph. Il simule un workflow médical complet : recueil des informations patient, synthèse clinique préliminaire, validation humaine par un médecin traitant, et génération d'un rapport final structuré.

## Architecture

```mermaid
graph TB
    subgraph Frontend["🖥️ Frontend — React/Vite (port 5173)"]
        UI[Interface ClinIA]
    end

    subgraph Backend["⚙️ Backend — FastAPI (port 8000)"]
        API[API REST]
        subgraph LangGraph["🔗 LangGraph Workflow"]
            SUP[Supervisor]
            DIAG[Diagnostic Agent]
            PHY[Physician Review\nHuman-in-the-Loop]
            REP[Report Agent]
        end
    end

    subgraph MCP["🔌 MCP Server"]
        GUIDE[Clinical Guidelines]
    end

    UI -->|HTTP| API
    API --> SUP
    SUP --> DIAG
    DIAG -->|fetch_clinical_guidelines| GUIDE
    DIAG --> SUP
    SUP --> PHY
    PHY --> SUP
    SUP --> REP
    REP --> SUP
```

## Workflow LangGraph

```mermaid
flowchart LR
    START([START]) --> SUP{Supervisor}
    SUP --> DIAG[Diagnostic Agent\n5 questions patient]
    DIAG --> SUP
    SUP --> PHY[Physician Review\nHuman-in-the-Loop]
    PHY --> SUP
    SUP --> REP[Report Agent\nRapport final]
    REP --> SUP
    SUP --> END([END])
```

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Orchestration agents | LangGraph 0.2+ |
| Framework IA | LangChain |
| LLM | OpenAI GPT-4o-mini (optionnel) |
| API | FastAPI |
| Frontend | React + Vite |
| Intégration outils | MCP (Model Context Protocol) |
| Gestion dépendances | uv |

## Agents

| Agent | Rôle |
|-------|------|
| Supervisor | Orchestre le workflow et décide du prochain nœud |
| Diagnostic Agent | Pose 5 questions, détecte les red flags, produit une synthèse |
| Physician Review | Human-in-the-Loop — validation médicale obligatoire |
| Report Agent | Génère le rapport final structuré en Markdown |

## Tools

| Tool | Description |
|------|-------------|
| `ask_patient` | Formule et pose une question au patient |
| `recommend_interim_care` | Génère une recommandation prudente |
| `fetch_clinical_guidelines` | Récupère les orientations via MCP |

## Prérequis
- Python 3.11+
- Node.js 18+
- `uv`
- Une clé OpenAI (optionnelle — mode fallback disponible)

## Installation

### 1. Cloner le projet
```bash
git clone https://github.com/elmerk19/Diagnostic_Multiagents.git
cd Diagnostic_Multiagents
```

### 2. Configuration
```bash
cp .env.example .env
# Renseignez OPENAI_API_KEY dans .env (optionnel)
```

### 3. Backend
```bash
uv sync
uv run python -m uvicorn backend.app.api:app --reload --port 8000
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev -- --host
```

### 5. LangGraph Studio
```bash
uv run langgraph dev --config backend/langgraph.json
# Ouvrir : https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024
```

## Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/sessions/start` | Créer une session |
| POST | `/consultation/start` | Démarrer une consultation |
| POST | `/consultation/resume` | Reprendre (réponse patient ou médecin) |
| GET | `/consultation/{thread_id}` | État de la consultation |
| GET | `/consultation/{thread_id}/report` | Rapport final |
| GET | `/health` | Santé de l'API |

### Exemples curl
```bash
# Démarrer une consultation
curl -X POST http://localhost:8000/consultation/start \
  -H "Content-Type: application/json" \
  -d '{"initial_case": "Toux sèche depuis 3 jours, fatigue modérée."}'

# Répondre à une question
curl -X POST http://localhost:8000/consultation/resume \
  -H "Content-Type: application/json" \
  -d '{"thread_id": "ID_SESSION", "patient_answer": "Depuis 3 jours."}'

# Validation médecin
curl -X POST http://localhost:8000/consultation/resume \
  -H "Content-Type: application/json" \
  -d '{"thread_id": "ID_SESSION", "physician_treatment": "Repos et hydratation."}'
```

## Jeux de tests

| Cas | Description | Red flags |
|-----|-------------|-----------|
| Cas 1 | Toux sèche depuis 3 jours, fatigue modérée | Non |
| Cas 2 | Essoufflement soudain, douleur thoracique | Oui |
| Cas 3 | Fatigue légère depuis une semaine | Non |

## Intégration MCP
Le serveur MCP expose l'outil `get_clinical_guidelines` qui retourne les orientations cliniques et red flags selon la catégorie symptomatique. Le client tente d'abord une connexion stdio, puis utilise un fallback local.

## Mode fallback
Sans clé OpenAI, le système génère des synthèses et rapports de façon déterministe — utile pour les tests et démonstrations.

## Limites
- Prototype académique uniquement.
- Ne remplace pas un avis médical professionnel.
- Persistance en mémoire (non persistée entre redémarrages).

## Licence
Projet libre pour usage éducatif.

---

## Aperçu de l'application

### Page d'accueil
![Accueil](docs/screenshots/page0.png)

### Écran 1 — Cas initial
![Cas initial](docs/screenshots/page1.png)
![Cas initial avec scénarios](docs/screenshots/page1_part2.png)

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
