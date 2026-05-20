# Schedule Card · `ha-schedule-card`

> A Lovelace **custom card** for Home Assistant that visualizes `schedule.*`
> helper entities as a clean 24-hour timeline — with daily/weekly views,
> full/compact layouts, full English + Hebrew (RTL) localization, and a
> complete visual editor.

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/yosef-chai/ha-schedule-card?style=for-the-badge&display_name=tag&sort=semver)](https://github.com/yosef-chai/ha-schedule-card/releases)
[![License](https://img.shields.io/github/license/yosef-chai/ha-schedule-card?style=for-the-badge)](LICENSE)
[![Project Maintenance](https://img.shields.io/badge/maintainer-%40yosef--chai-blue?style=for-the-badge)](https://github.com/yosef-chai)

> 🇬🇧 **English** · [🇮🇱 עברית](#כרטיס-לוחות-זמנים)

---

## Overview

Home Assistant's built-in **Schedule helper** lets you create a weekly
on/off pattern, but the entity itself only exposes `state` (on/off) and
`next_event`. This card calls the WebSocket API directly to render the
full week of time blocks visually:

| | |
|---|---|
| **Daily view** | A 24-hour bar with each active block, a live "now" marker, and a list of today's blocks |
| **Weekly view** | A 7-day grid: vertical columns (full) or horizontal lanes (compact) |
| **Full / Compact** | Two layout densities — sized appropriately for any spot on your dashboard |
| **i18n** | English (default) and Hebrew built-in. RTL is fully supported; the time axis stays LTR per the universal convention |
| **Visual editor** | Every option, including entity selection, is configurable via `ha-form` — no YAML required |

---

## Screenshots

> _Add screenshots / GIFs in a future release._

---

## Features

- 📅 **Daily view** — 24-hour timeline, "now" marker, day-by-day navigation, list of today's blocks
- 🗓️ **Weekly view** — vertical 7-day grid (full) or 7 horizontal lanes (compact)
- 🔁 **Full / Compact** layouts with sensible defaults for `getCardSize` and `getGridOptions`
- ✏️ **Visual editor** — `ha-form` schema with `expandable` groups, fully translatable
- 🌐 **i18n** — English & Hebrew bundled; one JSON file adds another language
- ↔️ **RTL** — full right-to-left layout for Hebrew/Arabic with logical CSS properties
- 🎨 **Theme-aware** — every color sources from HA theme variables (overridable per card)
- 📱 **Responsive** — container queries adapt the card from ~280 px wide up to desktop
- ♿ **Accessible** — ARIA labels on every block, keyboard navigation, `prefers-reduced-motion`
- 🎬 **Tap / hold / double-tap** actions (standard HA `action` config)
- 🔄 **Live refresh** — re-fetches schedules on `schedule_updated` events

---

## Installation

### Via HACS (recommended)

This card is not (yet) in the HACS default store. Add it as a **custom repository**:

1. Open HACS → **Frontend** → ⋮ menu → **Custom repositories**
2. Add `https://github.com/yosef-chai/ha-schedule-card` with type **Lovelace**
3. Search for **Schedule Card** and install
4. Reload your browser

> Once the card stabilizes I'll submit it to the HACS default store.

### Manual

1. Download `ha-schedule-card.js` from the [latest release](https://github.com/yosef-chai/ha-schedule-card/releases/latest)
2. Copy it to `<config>/www/ha-schedule-card.js`
3. Add it as a Lovelace resource:
   ```yaml
   # configuration.yaml (or via the UI: Settings → Dashboards → Resources)
   resources:
     - url: /local/ha-schedule-card.js
       type: module
   ```
4. Hard-refresh your browser (Ctrl + Shift + R)

---

## Usage

Use the card picker — **Schedule Card** — or add it as YAML:

```yaml
type: custom:ha-schedule-card
entity: schedule.morning_lights
view: daily            # daily | weekly
layout: full           # full | compact
```

### Configuration options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | **required** | A `schedule.*` entity |
| `title` | string | _entity name_ | Header text override |
| `view` | `daily` \| `weekly` | `daily` | Initial view |
| `layout` | `full` \| `compact` | `full` | Density |
| `show_header` | boolean | `true` | Show icon + title + state badge |
| `show_state` | boolean | `true` | Show the current ON/OFF badge |
| `show_next_event` | boolean | `true` | Show "Until / From {time}" line |
| `show_legend` | boolean | `false` | Show color legend |
| `allow_view_switch` | boolean | `false` | Render Daily/Weekly toggle on card |
| `first_day_of_week` | `sunday` \| `monday` | `sunday` | Affects weekly view ordering |
| `time_format` | `auto` \| `24h` \| `12h` | `auto` | `auto` follows HA settings |
| `active_color` | color | `--primary-color` | Active blocks |
| `inactive_color` | color | `--divider-color` | Inactive background |
| `current_time_color` | color | `--error-color` | "Now" marker |
| `tap_action` | ActionConfig | `more-info` | Standard HA action |
| `hold_action` | ActionConfig | — | Standard HA action |
| `double_tap_action` | ActionConfig | — | Standard HA action |

### Examples

**Weekly compact** card for a sidebar:

```yaml
type: custom:ha-schedule-card
entity: schedule.heating
view: weekly
layout: compact
show_next_event: false
```

**Tap to navigate** to a heating panel:

```yaml
type: custom:ha-schedule-card
entity: schedule.heating
tap_action:
  action: navigate
  navigation_path: /lovelace/heating
```

**Branded with custom colors:**

```yaml
type: custom:ha-schedule-card
entity: schedule.morning_lights
active_color: "#f59e0b"
inactive_color: "#1f2937"
current_time_color: "#ef4444"
```

---

## Localization

| Language | Code | Status |
|----------|------|--------|
| English | `en` | ✅ Default — source of truth |
| Hebrew | `he` | ✅ Full translation + RTL |

The card auto-detects the active language from `hass.locale.language`
(falling back to `hass.language`), normalizes legacy codes (`iw` → `he`,
`he-IL` → `he`), and falls back to English on any missing key.

To add another language, see [`src/localize/README.md`](src/localize/README.md).
The CI script `scripts/check-i18n.mjs` enforces key parity with `en.json`
so partial translations cannot ship.

---

## Development

```bash
git clone https://github.com/yosef-chai/ha-schedule-card.git
cd ha-schedule-card
npm install

npm run watch        # rebuild on change → dist/ha-schedule-card.js
npm test             # unit tests (vitest) — 36 cases
npm run check        # lint + format + i18n + tests
npm run build        # production build
```

Convenience scripts for Windows:

- `build-ha.bat` — production build + gzip side-by-side
- `release.bat patch|minor|major ["notes"] [-y]` — bumps version, builds,
  commits, tags, pushes, and creates a GitHub release in one step

### Repository structure

```
src/
├── ha-schedule-card.ts         # Main card element + customCards registration
├── editor/                     # ha-form visual editor + schema
├── views/                      # Daily, Weekly, Timeline-bar
├── data/                       # WebSocket fetch + current-state computation
├── utils/                      # Time math, RTL, format, action-handler
├── styles/                     # Shared Lit styles
└── localize/                   # en.json, he.json, t() helper
```

---

## How it works (technical notes)

- The schedule integration **does not** expose its time blocks via
  `hass.states[entity].attributes`. The card uses
  `hass.callWS({ type: "schedule/list" })` to retrieve the full
  week structure and matches by entity id.
- The card subscribes to the `schedule_updated` event to re-fetch when
  the helper is changed through the HA UI.
- The "now" marker re-renders once per minute via a single interval
  (`requestUpdate()`); Lit handles DOM diffing.
- Time blocks ending at `24:00:00` are supported as a special end-of-day
  marker; touching blocks (10:00 → 12:00, 12:00 → 14:00) are merged before
  rendering, matching HA's runtime behavior.

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| Card shows "Entity not found" | The selected entity id no longer exists | Re-open the card editor and pick a current `schedule.*` entity |
| Card is blank with no error | Old cache of the JS file | Hard-refresh (Ctrl + Shift + R) and clear HA's cache via Developer Tools |
| Time labels look wrong | HA "Time format" setting | Either change HA → Profile → Time format, or override with `time_format` in the card config |
| Weekly view text overlaps on a narrow card | Card is below ~320 px | Use `layout: compact`, or place the card in a wider column |

---

## License

[MIT](LICENSE) · 2026 yosef-chai

---

## כרטיס לוחות זמנים

כרטיס Lovelace מותאם אישית להום אסיסטנט להצגה ויזואלית של ישויות `schedule.*`
כפס זמן יומי של 24 שעות, עם תצוגות **יומית/שבועית** ו**מלאה/קומפקטית**.

### תכונות

- 📅 **תצוגה יומית** — פס זמן 24 שעות, סמן "עכשיו", רשימת הבלוקים של היום, ניווט בין ימים
- 🗓️ **תצוגה שבועית** — שבעה ימים בעמודות אנכיות (מלאה) או 7 שורות אופקיות (קומפקטית)
- 🔁 **מלאה / קומפקטית** — שתי דחיסויות, התאמה לכל גודל כרטיס
- ✏️ **עורך ויזואלי מלא** — כל ההגדרות דרך ממשק `ha-form`
- 🌐 **תמיכת שפות** — אנגלית (ברירת מחדל) + עברית
- ↔️ **RTL מלא** — בעברית הפריסה מתהפכת לימין-לשמאל; ציר הזמן נשאר LTR (מוסכמה אוניברסלית)
- 🎨 מבוסס משתני CSS של HA — מתאים לכל ערכת נושא
- 📱 **רספונסיבי** עם container queries
- ♿ נגיש — ARIA, ניווט מקלדת, `prefers-reduced-motion`

### התקנה מהירה

ב-HACS → Frontend → ⋮ → "Custom repositories" — הוספת מאגר מותאם אישית עם
ה-URL של הפרויקט, סוג **Lovelace**. לאחר ההתקנה: רענון הדפדפן, ובחירת
**Schedule Card** מבוחר הכרטיסים.

```yaml
type: custom:ha-schedule-card
entity: schedule.תאורת_בוקר
view: daily
layout: full
```

### תרומה לתרגום

מבנה התרגום נמצא תחת `src/localize/`. תרגום עברי מלא קיים, ושפות נוספות
יוכלו להתווסף ע"י קובץ JSON אחד נוסף ועדכון של `src/localize/index.ts`.
ראו [`src/localize/README.md`](src/localize/README.md) לפרטים.

### תרומה לקוד

```bash
git clone https://github.com/yosef-chai/ha-schedule-card.git
cd ha-schedule-card
npm install
npm run watch     # פיתוח חי
npm test          # בדיקות יחידה
npm run build     # build לפרודקשן
```

Issues ו-Pull Requests יתקבלו בברכה ב-[GitHub](https://github.com/yosef-chai/ha-schedule-card).
