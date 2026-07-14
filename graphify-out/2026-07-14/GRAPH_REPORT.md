# Graph Report - creative-portfolio  (2026-07-14)

## Corpus Check
- 11 files · ~11,371 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 80 nodes · 69 edges · 20 communities (12 shown, 8 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f2df8a36`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Portfolio App component
- package.json config
- React dependencies
- README / Vite docs
- Continue.dev config
- Tech brand logos
- Graphify rules
- App
- getEffectiveness
- HTML entry point
- React-DOM type defs
- CLAUDE.md
- ESLint config file
- ESLint React plugin
- React + Vite starter template
- Vite config file

## God Nodes (most connected - your core abstractions)
1. `scripts` - 5 edges
2. `App()` - 4 edges
3. `React + Vite` - 3 edges
4. `react` - 2 edges
5. `react-dom` - 2 edges
6. `@eslint/js` - 2 edges
7. `@types/react` - 2 edges
8. `@types/react-dom` - 2 edges
9. `@vitejs/plugin-react` - 2 edges
10. `eslint` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Favicon (Vite-style lightning logo)` --conceptually_related_to--> `Vite logo (SVG)`  [INFERRED]
  public/favicon.svg → src/assets/vite.svg
- `Social/UI icon sprite (SVG)` --conceptually_related_to--> `Portfolio hero image (PNG)`  [INFERRED]
  public/icons.svg → src/assets/hero.png
- `React logo (SVG)` --conceptually_related_to--> `Vite logo (SVG)`  [INFERRED]
  src/assets/react.svg → src/assets/vite.svg

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Continue.dev configured models** — continue_claude4_sonnet, continue_qwen25_coder, continue_newconfig_models [EXTRACTED 1.00]
- **Tech brand logos (React / Vite)** — src_assets_react, src_assets_vite, public_favicon [EXTRACTED 0.95]

## Communities (20 total, 8 thin omitted)

### Community 0 - "Portfolio App component"
Cohesion: 0.13
Nodes (10): aboutText, ALL_SUBJECTS, battleThemes, bossOptions, educationText, menuOptionsBase, menuPlaylist, MOVE_DESCRIPTIONS (+2 more)

### Community 1 - "package.json config"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 2 - "React dependencies"
Cohesion: 0.40
Nodes (5): dependencies, react, react-dom, react, react-dom

### Community 3 - "README / Vite docs"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 4 - "Continue.dev config"
Cohesion: 0.67
Nodes (3): Claude 4 Sonnet (configured model), Continue.dev model configuration, Qwen2.5-Coder (configured model)

### Community 6 - "Tech brand logos"
Cohesion: 0.67
Nodes (3): Favicon (Vite-style lightning logo), React logo (SVG), Vite logo (SVG)

### Community 9 - "App"
Cohesion: 0.50
Nodes (3): App(), audioUrl(), getTypeColor()

### Community 13 - "React-DOM type defs"
Cohesion: 0.11
Nodes (19): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+11 more)

## Knowledge Gaps
- **44 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+39 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `React-DOM type defs` to `package.json config`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Why does `dependencies` connect `React dependencies` to `package.json config`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _44 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Portfolio App component` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `React-DOM type defs` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._