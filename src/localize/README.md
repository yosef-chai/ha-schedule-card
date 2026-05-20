# Localization

This directory holds the translation files for the card.

- `en.json` — **source of truth**. Every key the card uses must exist here.
- `he.json` — Hebrew translation (full).

## Adding a new language

1. Copy `en.json` to `<code>.json` (e.g. `de.json` for German).
2. Translate every value. Do not invent new keys.
3. Register the language in `src/localize/index.ts`:
   ```ts
   import xx from "./xx.json";
   const LANGS = { en, he, xx } as const;
   ```
4. If the language is right-to-left, add its ISO code to `RTL_LANG_CODES`
   in `src/utils/rtl.ts`.
5. Run `npm run check:i18n` — the CI script must pass (no missing keys).

The `t()` helper falls back to English if a key is missing in a target
language, so partial translations are safe but should not be merged.
