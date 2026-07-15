# Graph Report - .  (2026-07-15)

## Corpus Check
- Corpus is ~17,386 words - fits in a single context window. You may not need a graph.

## Summary
- 74 nodes · 72 edges · 20 communities (11 shown, 9 thin omitted)
- Extraction: 96% EXTRACTED · 3% INFERRED · 1% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

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
- React DOM Type Definitions
- Vite Bundler
- Vite React Plugin
- Type Effectiveness Logic

## God Nodes (most connected - your core abstractions)
1. `scripts` - 5 edges
2. `React + Vite Template README` - 5 edges
3. `App()` - 4 edges
4. `Continue Example Configuration` - 3 edges
5. `@vitejs/plugin-react` - 3 edges
6. `react` - 2 edges
7. `react-dom` - 2 edges
8. `@eslint/js` - 2 edges
9. `@types/react` - 2 edges
10. `@types/react-dom` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Configured Claude 4 Sonnet Model` --conceptually_related_to--> `Graphify Project Instructions`  [AMBIGUOUS]
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

## Communities (20 total, 9 thin omitted)

### Community 0 - "PortfolioMon Battle Game (App.jsx)"
Cohesion: 0.12
Nodes (11): aboutText, ALL_SUBJECTS, battleThemes, BOSS_ASSETS, bossOptions, educationText, menuOptionsBase, menuPlaylist (+3 more)

### Community 1 - "React App Dependencies (package.json)"
Cohesion: 0.20
Nodes (9): dependencies, react, react-dom, name, private, type, version, react (+1 more)

### Community 2 - "React+Vite Scaffold & Build Tooling"
Cohesion: 0.29
Nodes (8): src/main.jsx Entry Script, PortfolioMon Entry HTML, Oxc, React + Vite Template README, React Compiler, SWC, typescript-eslint, @vitejs/plugin-react

### Community 3 - "Continue Agent Config & LLM Models"
Cohesion: 0.40
Nodes (5): Continue Example Configuration, Configured Claude 4 Sonnet Model, Configured GPT-5 Model, Configured Qwen2.5-Coder 7B Model, Graphify Project Instructions

### Community 4 - "NPM Scripts (build/dev/lint)"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 5 - "App Component & Audio/Color Helpers"
Cohesion: 0.50
Nodes (3): App(), audioUrl(), getTypeColor()

### Community 6 - "ESLint React Hooks Plugin"
Cohesion: 0.67
Nodes (3): eslint-plugin-react-hooks, devDependencies, eslint-plugin-react-hooks

## Ambiguous Edges - Review These
- `Configured Claude 4 Sonnet Model` → `Graphify Project Instructions`  [AMBIGUOUS]
  .continue/agents/new-config.yaml · relation: conceptually_related_to

## Knowledge Gaps
- **37 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+32 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Configured Claude 4 Sonnet Model` and `Graphify Project Instructions`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `devDependencies` connect `ESLint React Hooks Plugin` to `React App Dependencies (package.json)`, `ESLint Core`, `@eslint/js`, `ESLint React Refresh Plugin`, `ESLint Globals`, `React Type Definitions`, `React DOM Type Definitions`, `Vite Bundler`, `Vite React Plugin`?**
  _High betweenness centrality (0.158) - this node is a cross-community bridge._
- **Why does `scripts` connect `NPM Scripts (build/dev/lint)` to `React App Dependencies (package.json)`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `React + Vite Template README` (e.g. with `src/main.jsx Entry Script` and `PortfolioMon Entry HTML`) actually correct?**
  _`React + Vite Template README` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _37 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PortfolioMon Battle Game (App.jsx)` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._