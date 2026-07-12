# Graph Report - .  (2026-07-12)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 50 nodes · 49 edges · 16 communities (6 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5cbf5cd1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- App.jsx
- scripts
- eslint-plugin-react-refresh
- App
- devDependencies
- @eslint/js
- eslint-plugin-react-hooks
- globals
- @types/react
- @types/react-dom
- vite
- @vitejs/plugin-react
- getEffectiveness

## God Nodes (most connected - your core abstractions)
1. `scripts` - 5 edges
2. `App()` - 3 edges
3. `react` - 2 edges
4. `react-dom` - 2 edges
5. `@eslint/js` - 2 edges
6. `@types/react` - 2 edges
7. `@types/react-dom` - 2 edges
8. `@vitejs/plugin-react` - 2 edges
9. `eslint` - 2 edges
10. `eslint-plugin-react-hooks` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (16 total, 10 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.20
Nodes (9): dependencies, react, react-dom, name, private, type, version, react (+1 more)

### Community 1 - "App.jsx"
Cohesion: 0.22
Nodes (5): aboutText, bossOptions, educationText, menuOptionsBase, menuPlaylist

### Community 2 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 5 - "devDependencies"
Cohesion: 0.67
Nodes (3): eslint, devDependencies, eslint

## Knowledge Gaps
- **24 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+19 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`, `eslint-plugin-react-refresh`, `@eslint/js`, `eslint-plugin-react-hooks`, `globals`, `@types/react`, `@types/react-dom`, `vite`, `@vitejs/plugin-react`?**
  _High betweenness centrality (0.352) - this node is a cross-community bridge._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._