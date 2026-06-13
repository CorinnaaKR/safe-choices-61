# Heli - Project Context Document
*Last updated: 13 June 2026*

---

## What is Heli?

**Heli** stands for *Helping Everyone Learn Interactively*. It is a 3D interactive safeguarding simulation — a browser-based game where players work through real-world safeguarding scenarios, gather evidence, make decisions, and experience the consequences of those decisions through story.

The name is also an ode to Helen, the lead developer's sister.

---

## Why does it exist?

The idea came from a personal experience. The lead developer has a care background (10 years working in care, including SEN schools) and built Heli in response to a gap she witnessed directly: her sister, who is autistic, has been the victim of online fraud, financial abuse by friends, and mental and sexual abuse by partners. She doesn't recognise risk or the motives of others. When her sister needed support, the police had no interactive way of teaching awareness. The knowledge of how to recognise safeguarding risks — abuse, fraud, coercion — shouldn't be limited to professional training.

Heli is designed to give that knowledge to everyone: young people, adults with learning difficulties, school children, safeguarding professionals. The goal is independence and autonomy for the learner.

---

## Who is it for?

There are two distinct user groups, served by two modes in the same application:

**Learning Mode** (teens, young adults, people with learning difficulties)
- Story-driven, no visible scoring
- Learning happens through cause and effect -- the story changes based on what you notice and do
- Player is always the *helper* (the detective), never the victim
- No emotion prompts ("how did that make you feel?") -- action prompts only ("which of these clues should you pursue?")
- Plain language throughout; no time pressure; designed to be accessible to those with no sense of risk

**Training Mode** (adults training in safeguarding -- teachers, social workers, care staff)
- Full scoring by skill area
- Areas for improvement with guidance links
- Certificate of completion (via PDF)
- Professional framing and terminology

---

## Key design principles

1. **Emotionally memorable, never emotionally exploitative** -- players feel the stakes and the satisfaction of helping, but are never asked to name or perform emotions
2. **The player is always the helper** -- victim-POV is explicitly ruled out; this is a detective/witness role
3. **Consequences, not scores** -- story reflects your decisions; learning mode never shows numbers
4. **Understandable to all** -- plain language, no time pressure, designed for people with learning difficulties as the baseline
5. **Instinct before understanding** -- players make decisions from what they observe, not from pre-taught frameworks

These principles are non-negotiable across all content and all modes.

---

## The prototype goal

The immediate aim is a **fully playable demo** ready in approximately one month (from mid-June 2026), for three specific meetings:

1. **Charity rep** -- an advocacy charity supporting young vulnerable adults and people with learning difficulties. They are a potential content partner and user-research partner.
2. **University department head** -- potential academic collaboration, possibly for research/evaluation.
3. **Online college colleague** -- wants to trial the demo with his staff. Their specific requested topic: **anti-radicalisation**. This is the second scenario being built.

The prototype needs to demonstrate:
- Two fully playable scenarios (Jamie's Story + Lazlo's Story)
- Both modes working (Learning and Training)
- Scoring, skill-area feedback, and certificate in Training mode
- Real trial data collection via Supabase (with cohort codes so the college trial is queryable as a group)

---

## The two scenarios

### Jamie's Story (complete)
- **Domain**: child safeguarding
- **Player role**: Year 5 class teacher at a primary school
- **Story**: A concerning pattern emerges around a Year 5 pupil. Signs of possible abuse at home. Player must notice, gather evidence, and report.
- **Environments**: classroom, playground, school office
- **Evidence**: 9 items (behavioural, physical, verbal, documentation types)
- **Decision points**: 25 choices across ~15 branching scenes
- **Skill areas tested**: recognising signs, evidence gathering, responding, escalation & referral, record keeping
- **Resources on results page**: NSPCC, Childline, Gov.uk report child abuse

### Lazlo's Story (in development)
- **Domain**: anti-radicalisation
- **Player role**: Evan, Lazlo's friend
- **Story**: Adapted from an existing Ink-engine draft (Heli-V2 repo). Lazlo has withdrawn since his uncle's death. His sister Lilly asks Evan to visit. Key details from the draft: Evan texts first (ignored), the surprise visit is Evan's own instinct, Lazlo has a beard (character detail), the group Lazlo has joined is presented as prayer/community -- not overtly extremist. The player notices environmental and behavioural signs in the home and must decide how to respond without pushing Lazlo away or triggering a Prevent referral prematurely.
- **Environment**: living room (+ hallway/kitchen glimpse) -- being built in Phase 2
- **References**: Prevent duty, ACT Early, Educate Against Hate

---

## Technical stack

- **React 18 + TypeScript + Vite** (Lovable-generated base, de-Lovabled)
- **Three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing** for 3D environments
- **Tailwind CSS + shadcn/ui** for UI components
- **Vitest + Testing Library** for tests
- **jsPDF** for certificate generation (pattern from Heli-V2)
- **Supabase** for trial data (account to be set up, Phase 4)

**Repository**: github.com/CorinnaaKR/safe-choices-61

**Local build path**: C:\Users\Corinna\Projects\safe-choices-61
(Google Drive cannot host node_modules -- EPERM errors -- all builds run from the local clone)

**Node**: Portable Node v24.16.0 at %LOCALAPPDATA%\node-portable\node-v24.16.0-win-x64

---

## Architecture decisions

- **Scenario registry pattern**: each scenario is a data module in `src/data/scenarios/`. Jamie's Story is authored once in `scenario.ts`; metadata (evidence weights, skill areas, environments) is layered on top in `scenarios/jamie.ts` without touching the authoring file. New scenarios are one new file + registration.
- **Dual-mode gating**: mode is a URL param (`?mode=learning` or `?mode=training`). The engine is identical; the UI layer gates all scoring display. Learning mode hides every number and percentage everywhere.
- **localStorage keyed per scenario + mode**: `heli-state:{scenarioId}:{mode}` -- players can have independent progress in Jamie/learning and Jamie/training simultaneously.
- **Skill-area breakdown**: `useSimulation` exposes `getSkillAreaBreakdown()` returning earned/possible per skill area. Training results use this for per-area feedback bars (Phase 3).
- **Code splitting**: Three.js and r3f in separate chunks; Story and Results pages lazy-loaded. Welcome page JS ~107 KB gzipped.

---

## Build status (as of 13 June 2026)

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Foundation: upgrade three.js, remove Lovable, tests, code-split | Done |
| 1 | Multi-scenario registry + dual-mode architecture | Done |
| 1B | UX reskin: basement.studio design language (monochrome editorial, monospace HUD, outline-pass hover) | Next |
| 2 | Lazlo's Story: HomeScene + content from Ink draft | Upcoming |
| 3 | Scoring, skill-area bars, missed-evidence debrief, certificate | Upcoming |
| 4 | Supabase trial data (sessions, cohort codes, nullable org_id for B2B) | Upcoming |
| 5 | Polish, accessibility, deploy, trial onboarding | Upcoming |

Full checklist: see BUILD_SPEC.md in the G:\My Drive\Heli folder.

---

## UX north star

basement.studio -- specifically their interactive landing page where you can investigate objects in a 3D space. The design language is:
- Near-black background, off-white type, one accent colour
- Monospace font for all HUD/labels (uppercase, letter-spaced)
- Sharp edges and 1px rules -- no rounded pastel cards
- Film grain/noise overlay
- Evidence objects highlighted with a white outline pass on hover, floating monospace label
- Evidence cards styled as "case file" panels with typewriter text reveal and category/importance stamps

This is the target aesthetic for Phase 1B.

---

## Commercial end-state

Two subscription products, same engine:

1. **B2B training platform** -- companies subscribe, train staff, track cohort progress via a dashboard. Immediate revenue model.
2. **Schools curriculum version** -- age-banded levels for different year groups, tackling age-appropriate risks. Same engine, different content tiers.

The Supabase schema is being designed now with nullable `org_id`/`cohort_id` columns so the B2B future is a migration, not a rebuild.

---

## Content pipeline vision

Long-term: real anonymised cases from police, hospital, and social work agencies adapted into scenarios. The schema is kept data-only and CMS-ready. A "field guide" mechanic (backlog) will fill in a signs-of-abuse compendium as players encounter indicators across scenarios -- the same sign (e.g. withdrawal) appearing across different abuse types teaches the nuances between them.

---

## Pending inputs needed

- Safeguarding professional for content review (or document as a known limitation in the funding application)
- Certificate artwork/branding from partner (placeholder until then)
- Supabase account credentials (needed for Phase 4, week 3)
- Decision on visual vs text epilogues for the demo

---

## Key contacts

- **James Adams**: owns Tech Educators (bootcamp) AND Akcela (startup incubator) -- dual role as potential client and potential investor/accelerator. Certificate placeholder currently uses "Tech Educators" branding.

---

*This document summarises the full conversation and decisions from the initial build session (11-13 June 2026). The authoritative technical checklist is BUILD_SPEC.md in G:\My Drive\Heli.*
