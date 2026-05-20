import type { HomeAssistant } from "../types";
import en from "./en.json";
import he from "./he.json";

const LANGS = { en, he } as const;
export type LangCode = keyof typeof LANGS;
const DEFAULT_LANG: LangCode = "en";

/** Normalize an HA-supplied language code into one we ship. */
export function pickLang(hass?: HomeAssistant): LangCode {
  if (!hass) return DEFAULT_LANG;
  const raw = (hass.locale?.language ?? hass.language ?? DEFAULT_LANG).toLowerCase();
  if (raw === "iw" || raw.startsWith("he")) return "he";
  if (raw in LANGS) return raw as LangCode;
  const base = raw.split("-")[0]!;
  if (base in LANGS) return base as LangCode;
  return DEFAULT_LANG;
}

function drill(obj: unknown, key: string): string | undefined {
  return key
    .split(".")
    .reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as any)[k] : undefined), obj) as
    | string
    | undefined;
}

/**
 * Translate a key with optional `{placeholders}` substitution.
 * Falls back to English, then to the supplied `fallback`, then to the raw key.
 */
export function t(
  hass: HomeAssistant | undefined,
  key: string,
  vars?: Record<string, string | number>,
  fallback?: string,
): string {
  const lang = pickLang(hass);
  let str = drill(LANGS[lang], key) ?? drill(LANGS[DEFAULT_LANG], key) ?? fallback ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{${k}}`, String(v));
    }
  }
  return str;
}

import type { WeekdayKey } from "../types";

export function dayShort(hass: HomeAssistant | undefined, day: WeekdayKey): string {
  return t(hass, `days.short.${day}`);
}

export function dayLong(hass: HomeAssistant | undefined, day: WeekdayKey): string {
  return t(hass, `days.long.${day}`);
}
