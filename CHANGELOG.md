# Changelog

## [0.1.0] — 2026-05-21

Initial release. Element name: `ha-schedule-card` (`type: custom:ha-schedule-card`).

### Features
- **Daily view** (full + compact) with 24-hour timeline, "now" marker, and per-day blocks list
- **Weekly view** (full + compact): vertical 7-day grid + horizontal compact lanes
- **Visual editor** using `ha-form` with all options translatable
- **i18n**: English (default) + Hebrew, with RTL handling and Intl-based time/date formatting
- **Tap / hold / double-tap actions** (standard HA `action` config)
- **HACS-ready** packaging

### Built on current Home Assistant standards (2026.x+)
- Uses the official `schedule.get_schedule` service — works for both UI- and YAML-defined schedules
- Uses `<ha-spinner>` (current HA loading indicator)
- Modern `getLayoutOptions()` for grid/section layouts
- Defensive WebSocket timeout (15 s) and render-side loading cap (30 s) so the card never gets stuck
- `shouldUpdate` guards in child views to skip unnecessary re-renders on unrelated `hass` updates
