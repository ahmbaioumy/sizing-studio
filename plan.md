# Implementation plan

## Product shape

A self-contained offline HTML application for WFM analysts. The delivered artifact is a single HTML file; the source remains modular so the engine can be tested independently from the UI.

## Architecture

- `src/engine.js`: pure seeded RNG, Erlang B/C/A, workload, forecast, simulation approximation, roster generation, sensitivity, hashing.
- `src/ui.js`: safe DOM rendering helpers, charts, tables, heatmaps and export helpers.
- `src/main.js`: navigation, form state, import/export, local persistence and workflow orchestration.
- `src/styles.css`: responsive dashboard layout and visual system.
- `build.py`: deterministic inliner that produces `dist/sizing-studio.html`.
- `tests/smoke.js`: browser-independent mathematical smoke tests.

## Design direction

- **Tonal probability:** 0.06 — dense industrial control room.
- **Tonal probability:** 0.04 — monochrome spreadsheet utility.
- **Tonal probability:** 0.08 — neon sci-fi command center.

Chosen style: **Calm operations cockpit**. Core principles are decision clarity, traceable assumptions, quiet confidence, and fast drill-down. Navy establishes operational trust; teal marks feasible actions and positive throughput; amber flags warnings without creating alarm fatigue. The layout uses a persistent left rail, metric cards, and evidence panels rather than a marketing hero. Inter/system typography keeps tables legible. Brand essence: “A transparent sizing workbench for analysts who need a defensible staffing answer.” Personality: precise, calm, candid. Voice uses direct labels such as “Run a controlled comparison” and “Estimated lower bound — not certified.”

## Delivery behavior

Opening the HTML directly from the filesystem works because all CSS and JS are inlined and browser APIs are used only where available. LocalStorage is an optional cache; project JSON export is the portable source of truth.
