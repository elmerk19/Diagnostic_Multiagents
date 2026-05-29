# Instructions : Tester le projet dans LangGraph Studio

Ce guide explique comment installer LangGraph Studio localement, charger le fichier `backend/langgraph.json`, visualiser les transitions entre nœuds et produire des captures d'écran comme preuve.

Prérequis
- Python 3.10+ et `pip`
- Node.js (pour l'automatisation Playwright, optionnel)
- Accès au dépôt (depuis la racine du projet)

Étapes manuelles (recommandées)
1. Créez et activez un environnement virtuel Python :

```bash
python -m venv .venv
source .venv/bin/activate
```

2. Installez `langgraph` :

```bash
pip install langgraph
```

3. Lancez LangGraph Studio :

```bash
langgraph studio
```

4. Dans le navigateur, ouvrez l'interface Studio (généralement `http://localhost:8080`).

5. Chargez le fichier de configuration du projet : sélectionnez l'option d'import / load et fournissez `backend/langgraph.json` (chemin relatif depuis la racine du dépôt).

6. Ouvrez le graph `medical_workflow` et naviguez visuellement entre les nœuds suivants : `supervisor`, `diagnostic_agent`, `physician_review`, `report_agent`.

7. Pour démontrer les transitions, vous pouvez :
   - Démarrer une session (via l'UI ou en lançant l'API) puis suivre les tâches et interruptions affichées dans Studio.
   - Utiliser la fonctionnalité de simulation/stepper de Studio si disponible.

Captures d'écran (manuel)
- Utilisez l'outil capture d'écran de votre OS ou l'outil développeur du navigateur pour capturer :
  1) Le graph global affichant les nœuds et les arêtes
  2) L'exécution/trace montrant une interruption `physician_review`
  3) La génération du `final_report`

Automatisation (optionnel)
Vous trouverez un script d'automatisation minimal dans `tools/playwright_capture.js` et un wrapper shell `tools/capture_langgraph_screenshots.sh` qui :
- lance (ou suppose) LangGraph Studio sur `http://localhost:8080`
- exécute un script Playwright pour prendre des captures d'écran et les enregistrer dans `./screenshots`

Captures de l'application ClinIA
- Pour prendre des captures d'écran de l'interface frontend ClinIA, utilisez le script dédié :
  `bash tools/capture_frontend_screenshots.sh`
- Ce script démarre le frontend React, prend une capture d'écran du point d'entrée puis ouvre le formulaire de cas initial.

Remarques importantes
- Les sélecteurs CSS dans le script Playwright sont génériques : adaptez le script si l'UI de votre version de LangGraph Studio diffère.
- Le script Playwright nécessite `npm i -D playwright` avant usage.

Commandes rapides

```bash
# Démarrage manuel
source .venv/bin/activate
pip install langgraph
langgraph studio

# Automatisation (optionnel)
npm install
npm i -D playwright
bash tools/capture_langgraph_screenshots.sh
```

Si vous voulez, je peux adapter le script Playwright aux sélecteurs exacts de votre version de Studio une fois que vous m'indiquerez l'URL et/ou partagerez une capture d'écran de l'interface.
