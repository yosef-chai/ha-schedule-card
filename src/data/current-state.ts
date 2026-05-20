import type { HomeAssistant, Schedule } from "../types";
import { dateToWeekdayKey } from "../utils/days";
import {
  dateToMinutes,
  isActiveAt,
  nextTransitionMinutes,
  parseTimeToMinutes,
} from "../utils/time";

export interface NextEventInfo {
  /** Date object of the upcoming change. */
  date: Date;
  /** True if at that moment the schedule turns active; false if it turns off. */
  becomesActive: boolean;
}

/** Parse HA's `next_event` attribute — it's an ISO datetime string. */
export function parseNextEvent(attr: unknown): Date | undefined {
  if (!attr) return undefined;
  if (attr instanceof Date) return attr;
  if (typeof attr === "string") {
    const d = new Date(attr);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}

/** True if the schedule is currently active (we trust HA's state, falling back to a manual check). */
export function isCurrentlyActive(
  hass: HomeAssistant | undefined,
  entityId: string | undefined,
  schedule: Schedule | undefined,
  now: Date = new Date(),
): boolean {
  if (entityId && hass?.states?.[entityId]?.state) {
    return hass.states[entityId]!.state === "on";
  }
  if (!schedule) return false;
  return isActiveAt(schedule[dateToWeekdayKey(now)], now);
}

/** Resolve the next event purely from the schedule blocks (no day-rollover). */
export function nextEventFromBlocks(
  schedule: Schedule | undefined,
  now: Date = new Date(),
): NextEventInfo | undefined {
  if (!schedule) return undefined;
  const day = dateToWeekdayKey(now);
  const mins = dateToMinutes(now);
  const tr = nextTransitionMinutes(schedule[day], mins);
  if (!tr) return undefined;
  const at = new Date(now);
  at.setHours(0, 0, 0, 0);
  at.setMinutes(tr.atMin);
  return { date: at, becomesActive: tr.active };
}

/** Return the minutes-of-day for the "now" line on the timeline. */
export function nowAsPercent(date: Date = new Date()): number {
  const mins = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
  return (mins / 1440) * 100;
}

/** Helper: minutes-of-day for an HH:MM:SS string — re-exported for convenience. */
export const minutesOf = parseTimeToMinutes;
