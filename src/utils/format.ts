import type { HomeAssistant, ScheduleCardConfig } from "../types";

function resolveLocale(hass?: HomeAssistant): string {
  return hass?.locale?.language ?? hass?.language ?? "en";
}

/** Determine whether the user wants 12-hour formatting. */
function uses12Hour(hass?: HomeAssistant, config?: ScheduleCardConfig): boolean {
  const mode = config?.time_format ?? "auto";
  if (mode === "24h") return false;
  if (mode === "12h") return true;
  // auto — follow HA preferences
  const haTimeFormat = (hass?.locale as any)?.time_format as string | undefined;
  if (haTimeFormat === "12") return true;
  if (haTimeFormat === "24") return false;
  // last resort — derive from locale
  try {
    const parts = new Intl.DateTimeFormat(resolveLocale(hass), {
      hour: "numeric",
    }).formatToParts(new Date());
    return parts.some((p) => p.type === "dayPeriod");
  } catch {
    return false;
  }
}

/** Format a time-of-day expressed as a Date object. */
export function formatTimeOfDay(
  date: Date,
  hass?: HomeAssistant,
  config?: ScheduleCardConfig,
): string {
  try {
    return new Intl.DateTimeFormat(resolveLocale(hass), {
      hour: "2-digit",
      minute: "2-digit",
      hour12: uses12Hour(hass, config),
    }).format(date);
  } catch {
    return date.toTimeString().slice(0, 5);
  }
}

/** Format an "HH:MM" string respecting the user's preference. */
export function formatHHMM(
  hhmm: string,
  hass?: HomeAssistant,
  config?: ScheduleCardConfig,
): string {
  if (!hhmm) return "";
  const [h, m = "00"] = hhmm.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m), 0, 0);
  // Special-case 24:00 — display literally; Intl won't render it.
  if (h === "24") return "24:00";
  return formatTimeOfDay(d, hass, config);
}

/** Format a date as "Tuesday, 20 May" or "יום שלישי, 20 במאי". */
export function formatDateLong(date: Date, hass?: HomeAssistant): string {
  try {
    return new Intl.DateTimeFormat(resolveLocale(hass), {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(date);
  } catch {
    return date.toDateString();
  }
}

/** Format a duration in minutes as e.g. "2h 15m" / "שעתיים ו-15 דק'". */
export function formatDurationMinutes(mins: number, hass?: HomeAssistant): string {
  const total = Math.max(0, Math.round(mins));
  const h = Math.floor(total / 60);
  const m = total % 60;
  try {
    // Modern Intl.DurationFormat — fall back gracefully if unavailable
    const DF = (Intl as any).DurationFormat;
    if (DF) {
      return new DF(resolveLocale(hass), { style: "short" }).format({
        hours: h,
        minutes: m,
      });
    }
  } catch {
    /* ignored */
  }
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}
