# Graph Report - creative-portfolio  (2026-07-16)

## Corpus Check
- 12 files · ~17,955 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 78 nodes · 71 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 3% INFERRED · 1% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f8e8b045`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PortfolioMon Battle Game (App.jsx)
- React App Dependencies (package.json)
- React+Vite Scaffold & Build Tooling
- Continue Agent Config & LLM Models
- NPM Scripts (build/dev/lint)
- App Component & Audio/Color Helpers
- ESLint React Hooks Plugin
- ESLint Core
- @eslint/js
- ESLint React Refresh Plugin
- ESLint Globals
- React Type Definitions
- Type Effectiveness Logic

## God Nodes (most connected - your core abstractions)
1. `scripts` - 5 edges
2. `App()` - 4 edges
3. `React + Vite` - 3 edges
4. `Continue Example Configuration` - 3 edges
5. `react` - 2 edges
6. `react-dom` - 2 edges
7. `@eslint/js` - 2 edges
8. `@types/react` - 2 edges
9. `@types/react-dom` - 2 edges
10. `@vitejs/plugin-react` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Configured Claude 4 Sonnet Model` --conceptually_related_to--> `graphify`  [AMBIGUOUS]
  .continue/agents/new-config.yaml → CLAUDE.md
- `src/main.jsx Entry Script` --conceptually_related_to--> `React + Vite Template README`  [INFERRED]
  index.html → README.md
- `PortfolioMon Entry HTML` --conceptually_related_to--> `React + Vite Template README`  [INFERRED]
  index.html → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **React + Vite Build Toolchain** — readme_vitejs_plugin_react, readme_oxc, readme_swc [INFERRED 0.85]
- **PortfolioMon React+Vite Scaffold** — index_portfoliomon, index_main_jsx, readme_react-vite [INFERRED 0.85]

## Communities (17 total, 5 thin omitted)

### Community 0 - "PortfolioMon Battle Game (App.jsx)"
Cohesion: 0.12
Nodes (11): aboutText, ALL_SUBJECTS, battleThemes, BOSS_ASSETS, bossOptions, educationText, menuOptionsBase, menuPlaylist (+3 more)

### Community 1 - "React App Dependencies (package.json)"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 2 - "React+Vite Scaffold & Build Tooling"
Cohesion: 1.00
Nodes (3): src/main.jsx Entry Script, PortfolioMon Entry HTML, React + Vite Template README

### Community 3 - "Continue Agent Config & LLM Models"
Cohesion: 0.33
Nodes (5): Continue Example Configuration, Configured Claude 4 Sonnet Model, Configured GPT-5 Model, Configured Qwen2.5-Coder 7B Model, graphify

### Community 4 - "NPM Scripts (build/dev/lint)"
Cohesion: 0.40
Nodes (5): dependencies, react, react-dom, react, react-dom

### Community 5 - "App Component & Audio/Color Helpers"
Cohesion: 0.50
Nodes (3): App(), audioUrl(), getTypeColor()

### Community 6 - "ESLint React Hooks Plugin"
Cohesion: 0.11
Nodes (19): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+11 more)

### Community 8 - "ESLint Core"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

## Ambiguous Edges - Review These
- `graphify` → `Configured Claude 4 Sonnet Model`  [AMBIGUOUS]
  .continue/agents/new-config.yaml · relation: conceptually_related_to

## Knowledge Gaps
- **38 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+33 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `graphify` and `Configured Claude 4 Sonnet Model`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `devDependencies` connect `ESLint React Hooks Plugin` to `React App Dependencies (package.json)`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Scripts (build/dev/lint)` to `React App Dependencies (package.json)`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _38 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PortfolioMon Battle Game (App.jsx)` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `ESLint React Hooks Plugin` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._