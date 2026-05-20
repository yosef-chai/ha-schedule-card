import type { HomeAssistant } from "../types";

const RTL_LANG_CODES = new Set([
  "ar",
  "he",
  "iw", // legacy code for Hebrew
  "fa",
  "ur",
  "ps",
  "dv",
  "sd",
  "ug",
  "yi",
]);

/** Returns true when the active HA locale is right-to-left. */
export function isRTL(hass?: HomeAssistant): boolean {
  if (!hass) return false;
  // 1. HA may expose this directly on translation metadata
  const meta = (hass as any).translationMetadata?.translations?.[hass.language ?? ""];
  if (meta && typeof meta.isRTL === "boolean") return meta.isRTL;

  // 2. Fall back to a language-code map
  const lang = (hass.locale?.language ?? hass.language ?? "en").toLowerCase();
  if (RTL_LANG_CODES.has(lang)) return true;
  const base = lang.split("-")[0]!;
  return RTL_LANG_CODES.has(base);
}

/** Returns "rtl" or "ltr" — convenient for `dir=` attributes. */
export function direction(hass?: HomeAssistant): "rtl" | "ltr" {
  return isRTL(hass) ? "rtl" : "ltr";
}
