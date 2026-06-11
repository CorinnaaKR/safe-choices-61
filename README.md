# Heli — Safeguarding Simulation

**Heli** (Helping Everyone Learn Interactively) is a web-based 3D interactive simulation for learning to recognise safeguarding risks — abuse, radicalisation, exploitation — and act on them. Players explore story-driven scenarios as the *helper*: noticing signs, gathering evidence, and making decisions whose consequences play out in the story.

Built with React 18, TypeScript, Vite, Tailwind/shadcn and [react-three-fiber](https://docs.pmnd.rs/react-three-fiber).

## Getting started

Requires Node.js 20+ (see `.nvmrc`).

```sh
npm install
npm run dev        # dev server on http://localhost:8080
```

> ⚠️ **Windows + Google Drive**: do not clone or `npm install` inside a Google Drive folder (`G:\My Drive\...`). The Drive filesystem rejects npm's writes. Work from a local path (e.g. `C:\Users\<you>\Projects\`).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server (port 8080) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm test` | Run vitest suite once |
| `npm run lint` | ESLint |

## Project structure

```
src/
  components/3d/         R3F scenes, player, NPCs, evidence objects
  components/simulation/ HUD, evidence panel, choices, feedback
  components/ui/         shadcn primitives
  data/                  scenario definitions
  hooks/useSimulation.ts game-state engine (evidence, decisions, scoring, persistence)
  pages/                 Welcome / Story / Results
  types/simulation.ts    core domain types
```

## Roadmap

See `BUILD_SPEC.md` (kept alongside the project) for the phased build plan: multi-scenario architecture, dual Learning/Training modes, scoring + certificates, Supabase trial telemetry, and the basement.studio-inspired UX reskin.
