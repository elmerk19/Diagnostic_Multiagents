# Rapport Technique — ClinIA
## Système Multi-Agents d'Orientation Clinique Préliminaire

> Exercice académique — ne remplace pas une consultation médicale professionnelle.

---

## 1. Introduction

ClinIA est un prototype académique de système d'orientation clinique préliminaire basé sur une architecture multi-agents. Il simule un workflow médical simplifié permettant de recueillir des informations patient, de produire une synthèse clinique, d'intégrer une validation humaine par un médecin traitant, puis de générer un rapport final structuré.

Le projet est développé dans le cadre du cours de systèmes multi-agents et illustre l'utilisation de LangGraph pour orchestrer des agents autonomes avec Human-in-the-Loop.

---

## 2. Architecture générale

```
┌─────────────────────────────────────────────────────────┐
│                        ClinIA                           │
├──────────────┬──────────────────┬───────────────────────┤
│   Frontend   │     Backend      │      MCP Server       │
│  React/Vite  │  FastAPI +       │  Guidelines cliniques │
│  Port 5173   │  LangGraph       │  (stdio)              │
│              │  Port 8000       │                       │
└──────────────┴──────────────────┴───────────────────────┘
```

### Stack technique

| Couche | Technologie |
|--------|-------------|
| Orchestration agents | LangGraph 0.2+ |
| Framework IA | LangChain |
| LLM | OpenAI GPT-4o-mini (optionnel) |
| API | FastAPI |
| Frontend | React + Vite |
| MCP | Model Context Protocol (stdio) |
| Gestion dépendances | uv |

---

## 3. Workflow LangGraph

### 3.1 Graphe d'état

```
START
  │
  ▼
Supervisor ──────────────────────────────┐
  │                                      │
  ▼                                      │
DiagnosticAgent                          │
  ├── Tool: ask_patient (×5)             │
  ├── Tool: recommend_interim_care       │
  └── Tool: fetch_clinical_guidelines    │
  │                                      │
  ▼                                      │
Supervisor                               │
  │                                      │
  ▼                                      │
PhysicianReview (Human-in-the-Loop)      │
  │                                      │
  ▼                                      │
Supervisor                               │
  │                                      │
  ▼                                      │
ReportAgent                              │
  │                                      │
  ▼                                      │
Supervisor ──────────────────────────────┘
  │
  ▼
END
```

### 3.2 État partagé (MedicalState)

L'état du graphe est défini comme un `TypedDict` partagé entre tous les agents :

```python
class MedicalState(TypedDict, total=False):
    messages: Annotated[list, add_messages]
    next: Literal["diagnostic_agent", "physician_review", "report_agent", "FINISH"]
    initial_case: str
    question_count: int
    patient_answers: list[str]
    current_question: str
    interim_care: str
    diagnostic_summary: str
    physician_treatment: str
    final_report: str
    symptom_category: str
    mcp_guidelines: str
```

---

## 4. Description des agents

### 4.1 Supervisor
- **Rôle** : orchestre le workflow et décide du prochain nœud à activer.
- **Logique** : analyse l'état courant et retourne le nom de l'agent suivant.
- **Transitions** : `diagnostic_agent` → `physician_review` → `report_agent` → `FINISH`

### 4.2 Diagnostic Agent
- **Rôle** : recueille les informations patient et produit une synthèse clinique préliminaire.
- **Comportement** :
  1. Pose 5 questions successives au patient via le tool `ask_patient`
  2. Détecte la catégorie symptomatique (respiratoire, général)
  3. Identifie les red flags éventuels
  4. Récupère les orientations cliniques via MCP
  5. Produit une synthèse clinique (via LLM ou fallback)
  6. Génère une recommandation intermédiaire via `recommend_interim_care`

### 4.3 Physician Review (Human-in-the-Loop)
- **Rôle** : représente le médecin traitant qui valide ou ajuste la synthèse.
- **Mécanisme** : utilise `interrupt()` de LangGraph pour suspendre le workflow.
- **Input** : reçoit la synthèse clinique et la recommandation intermédiaire.
- **Output** : traitement ou conduite à tenir proposée par le médecin.

### 4.4 Report Agent
- **Rôle** : génère le rapport final structuré en Markdown.
- **Sections** : Contexte patient, Anamnèse, Synthèse clinique, Recommandation intermédiaire, Conduite du médecin, Références MCP, Avertissement légal.
- **Mode LLM** : génération via GPT-4o-mini si clé disponible.
- **Mode fallback** : génération textuelle structurée sans LLM.

---

## 5. Tools et intégration MCP

### 5.1 Tools disponibles

| Tool | Description |
|------|-------------|
| `ask_patient` | Formule et enregistre une question pour le patient |
| `build_question` | Construit la question contextuelle selon l'index |
| `recommend_interim_care` | Génère une recommandation prudente selon la catégorie |
| `fetch_clinical_guidelines` | Récupère les orientations via MCP |

### 5.2 Intégration MCP

Le serveur MCP expose un outil `get_clinical_guidelines` qui retourne les orientations cliniques et red flags selon la catégorie symptomatique.

```
mcp_server/
├── server.py          → serveur MCP (FastMCP)
└── data/
    └── guidelines.json → orientations par catégorie
```

Le client MCP (`mcp_client.py`) tente d'abord une connexion stdio au serveur MCP. En cas d'échec, il utilise un fallback local depuis `guidelines.json`.

### 5.3 Catégories supportées

| Catégorie | Mots-clés détectés |
|-----------|-------------------|
| `respiratory` | toux, respir, gorge, nez, bronch, essoufflement |
| `general` | tous les autres cas |

---

## 6. API FastAPI

### 6.1 Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/sessions/start` | Créer une session (UUID) |
| POST | `/consultation/start` | Démarrer une consultation |
| POST | `/consultation/resume` | Reprendre (réponse patient ou médecin) |
| GET | `/consultation/{thread_id}` | État courant de la consultation |
| GET | `/consultation/{thread_id}/report` | Rapport final |
| GET | `/health` | Santé de l'API |

### 6.2 Gestion des interruptions

LangGraph suspend le workflow via `interrupt()`. L'API détecte les interruptions dans le snapshot du graphe et les expose au frontend via le champ `interrupts`.

### 6.3 Persistance en mémoire

Le checkpointer `MemorySaver` de LangGraph maintient l'état de chaque consultation identifiée par un `thread_id` UUID.

---

## 7. Frontend React

### 7.1 Architecture

L'interface est développée en React avec Vite. Elle communique avec le backend via l'API REST.

### 7.2 Écrans

| Écran | Description |
|-------|-------------|
| 1 — Cas initial | Saisie de la description des symptômes |
| 2 — Questions patient | Affichage des 5 questions avec barre de progression |
| 3 — Revue médecin | Synthèse + recommandation + saisie du traitement |
| 4 — Rapport final | Affichage Markdown + téléchargement |

### 7.3 Adaptation Codespace

L'URL de l'API est détectée dynamiquement selon l'environnement (Codespace GitHub ou local).

---

## 8. Installation et exécution

### Prérequis
- Python 3.11+, Node.js 18+, `uv`

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

### Variables d'environnement
```bash
cp .env.example .env
# Renseigner OPENAI_API_KEY (optionnel)
```

---

## 9. Jeux de tests

| Cas | Description | Red flags |
|-----|-------------|-----------|
| Cas 1 | Toux sèche depuis 3 jours, fatigue modérée | Non |
| Cas 2 | Essoufflement soudain, douleur thoracique | Oui |
| Cas 3 | Fatigue légère depuis une semaine | Non |

Pour chaque cas : 5 questions posées, recommandation intermédiaire générée, revue médecin effectuée, rapport final produit.

---

## 10. Choix techniques

### Pourquoi LangGraph ?
LangGraph permet de modéliser des workflows complexes avec état partagé, boucles conditionnelles et interruptions Human-in-the-Loop de façon native.

### Pourquoi FastAPI ?
FastAPI offre une documentation automatique (Swagger), une validation via Pydantic et des performances élevées pour les APIs asynchrones.

### Pourquoi React + Vite ?
React permet une interface réactive et composable. Vite offre un démarrage rapide et un HMR efficace pour le développement.

### Mode fallback sans LLM
Le système fonctionne sans clé OpenAI grâce à des synthèses et rapports générés de façon déterministe — utile pour les tests et démonstrations.

---

## 11. Limitations

- Prototype académique uniquement.
- Ne remplace pas un avis médical professionnel.
- Persistance en mémoire (non persistée entre redémarrages).
- Catégorisation symptomatique simplifiée par mots-clés.

---

## 12. Avertissement légal

**Ce système ne remplace pas une consultation médicale.** Il est développé exclusivement dans un cadre pédagogique et ne constitue pas un dispositif médical. Aucun diagnostic définitif n'est fourni.


