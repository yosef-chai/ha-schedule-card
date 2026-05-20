import type { FirstDayOfWeek, Schedule, ScheduleTimeRange, WeekdayKey } from "../types";

export const WEEKDAYS: readonly WeekdayKey[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

/** Returns the WeekdayKey for a given JS Date (Sunday=0). */
export function dateToWeekdayKey(date: Date): WeekdayKey {
  return WEEKDAYS[date.getDay()]!;
}

/** Returns the weekday keys ordered according to the user's preference. */
export function orderedWeekdays(firstDay: FirstDayOfWeek = "sunday"): WeekdayKey[] {
  const startIdx = firstDay === "monday" ? 1 : 0;
  return [...WEEKDAYS.slice(startIdx), ...WEEKDAYS.slice(0, startIdx)];
}

/** Safe getter — returns [] if blocks are missing from the schedule. */
export function blocksForDay(schedule: Schedule | undefined, day: WeekdayKey): ScheduleTimeRange[] {
  return schedule?.[day] ?? [];
}
