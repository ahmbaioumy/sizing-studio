# Sizing — Offline Workforce Sizing & Roster Studio

This is a standalone, offline-first contact-center workforce sizing prototype based on the supplied PRD. It has zero runtime dependencies, no CDN calls, no server, no API calls, and can be opened directly from `dist/sizing-studio.html`.

## Included workflows

- Dashboard with demand, workload, headcount, SLA, occupancy, utilization and backlog KPIs.
- Find Minimum HC and Fixed HC Evaluation modes sharing the same engine.
- Erlang B/C/A estimates with assumptions and limitations.
- Seeded, reproducible simulation with replications, confidence intervals and diagnostics.
- Voice/chat/email/back-office channel configuration surface.
- CSV import preview and validation warnings.
- Forecasting methods: moving average, weighted average and trend.
- Roster generation with shift, break, team and skills columns.
- 5 × 5 volume/AHT sensitivity matrix with heatmap.
- Report tables with CSV and JSON export.
- Scenario save/duplicate/restore through localStorage.
- Portable project JSON export/import and local autosave.

## Build

```bash
python3 build.py
```

The build script inlines `src/styles.css`, `src/engine.js`, `src/ui.js`, and `src/main.js` into one HTML file at `dist/sizing-studio.html`.

## Important scope note

This is a production-shaped offline MVP, not a certified replacement for a full WFM mathematical validation program. The UI labels analytical estimates and simulated outputs separately, keeps the random seed visible, and does not claim a proven global minimum. The PRD's future-grade items (full XLSX parsing, multi-day event-level DES, independent external solver validation and full multi-channel concurrency modeling) are represented by modular extension points and configuration surfaces.
