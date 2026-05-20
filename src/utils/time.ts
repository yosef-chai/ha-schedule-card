import { MINUTES_IN_DAY } from "../const";
import type { ScheduleTimeRange } from "../types";

/**
 * Parse "HH:MM:SS" (or "HH:MM") to minutes-from-midnight.
 * Returns MINUTES_IN_DAY for the special "24:00:00" end-of-day marker.
 */
export function parseTimeToMinutes(time: string): number {
  if (!time) return 0;
  if (time === "24:00:00" || time === "24:00") return MINUTES_IN_DAY;
  const parts = time.split(":");
  const h = Number(parts[0] ?? 0);
  const m = Number(parts[1] ?? 0);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return 0;
  return Math.min(MINUTES_IN_DAY, Math.max(0, h * 60 + m));
}

/** Returns a value in [0, 100] representing position on a 24h axis. */
export function minutesToPercent(mins: number): number {
  return (Math.max(0, Math.min(MINUTES_IN_DAY, mins)) / MINUTES_IN_DAY) * 100;
}

/** Returns true if the given Date falls within any of the supplied blocks. */
export function isActiveAt(blocks: ScheduleTimeRange[] | undefined, date: Date): boolean {
  if (!blocks?.length) return false;
  const mins = date.getHours() * 60 + date.getMinutes();
  return blocks.some((b) => {
    const f = parseTimeToMinutes(b.from);
    const t = parseTimeToMinutes(b.to);
    return mins >= f && mins < t;
  });
}

/** Merges adjacent / touching blocks (e.g. 10:00→12:00 + 12:00→14:00 → 10:00→14:00). */
export function mergeAdjacentBlocks(blocks: ScheduleTimeRange[]): ScheduleTimeRange[] {
  if (!blocks?.length) return [];
  const sorted = [...blocks]
    .map((b) => ({ ...b, _f: parseTimeToMinutes(b.from), _t: parseTimeToMinutes(b.to) }))
    .sort((a, b) => a._f - b._f);

  const out: ScheduleTimeRange[] = [];
  let cur = { ...sorted[0]! };
  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i]!;
    if (next._f <= cur._t) {
      if (next._t > cur._t) {
        cur._t = next._t;
        cur.to = next.to;
      }
    } else {
      out.push({ from: cur.from, to: cur.to, data: cur.data });
      cur = { ...next };
    }
  }
  out.push({ from: cur.from, to: cur.to, data: cur.data });
  return out;
}

/** Format minutes-of-day back to "HH:MM" for accessibility labels. */
export function minutesToHHMM(mins: number): string {
  const clamped = Math.max(0, Math.min(MINUTES_IN_DAY, Math.round(mins)));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  if (h === 24) return "24:00";
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Strip seconds, leaving "HH:MM" — for display in labels. */
export function trimToHHMM(time: string): string {
  if (!time) return "";
  if (time === "24:00:00") return "24:00";
  const [h = "00", m = "00"] = time.split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
}

export interface ResolvedBlock {
  fromMin: number;
  toMin: number;
  leftPct: number;
  widthPct: number;
  fromLabel: string;
  toLabel: string;
}

/** Resolve a raw schedule block into the geometry needed for rendering. */
export function resolveBlock(b: ScheduleTimeRange): ResolvedBlock {
  const fromMin = parseTimeToMinutes(b.from);
  const toMin = parseTimeToMinutes(b.to);
  const leftPct = minutesToPercent(fromMin);
  const widthPct = Math.max(0, minutesToPercent(toMin) - leftPct);
  return {
    fromMin,
    toMin,
    leftPct,
    widthPct,
    fromLabel: trimToHHMM(b.from),
    toLabel: trimToHHMM(b.to),
  };
}

/** Minutes-from-midnight for a JavaScript Date in local time. */
export function dateToMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/** Returns minutes until the next block transition after `from`, or null if none. */
export function nextTransitionMinutes(
  blocks: ScheduleTimeRange[] | undefined,
  fromMin: number,
): { atMin: number; active: boolean } | null {
  if (!blocks?.length) return null;
  const merged = mergeAdjacentBlocks(blocks);
  // We're inside a block?
  for (const b of merged) {
    const f = parseTimeToMinutes(b.from);
    const t = parseTimeToMinutes(b.to);
    if (fromMin >= f && fromMin < t) {
      return { atMin: t, active: false };
    }
  }
  // Next upcoming block start (today)
  const upcoming = merged
    .map((b) => parseTimeToMinutes(b.from))
    .filter((m) => m > fromMin)
    .sort((a, b) => a - b);
  if (upcoming.length) return { atMin: upcoming[0]!, active: true };
  return null;
}
