import type { HomeAssistant, Schedule, WeeklyBlocks } from "../types";

/** The seven weekday keys we expect from `schedule.get_schedule`. */
const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const satisfies readonly (keyof WeeklyBlocks)[];

/**
 * Fetch a single schedule entity's full weekly time blocks using the official
 * `schedule.get_schedule` service (HA core 2024.x+). Works for both UI- and
 * YAML-defined schedules — no entity-registry lookup required.
 *
 * The service response is shaped as `{ [entity_id]: WeeklyBlocks }`. HA's WS
 * layer normally wraps it under `response`; we accept both shapes defensively.
 *
 * `name` and `icon` come from `hass.states[entity_id].attributes` since the
 * service does not return them.
 */
export async function getSchedule(hass: HomeAssistant, entityId: string): Promise<Schedule> {
  // custom-card-helpers types `callService` as `Promise<void>` (older signature).
  // The real HA frontend signature is
  //   callService(domain, service, data?, target?, notifyOnError?, returnResponse?)
  // and returns the service response when returnResponse=true. We cast through
  // `unknown` to bypass the stale type.
  const raw = (await (
    hass.callService as (
      domain: string,
      service: string,
      serviceData?: Record<string, unknown>,
      target?: { entity_id: string },
      notifyOnError?: boolean,
      returnResponse?: boolean,
    ) => Promise<unknown>
  )("schedule", "get_schedule", undefined, { entity_id: entityId }, false, true)) as {
    response?: Record<string, WeeklyBlocks>;
  } & Record<string, WeeklyBlocks | undefined>;

  const responseMap: Record<string, WeeklyBlocks | undefined> = raw?.response ?? raw;
  const entry = responseMap?.[entityId];
  if (!entry) {
    throw new Error("entity_not_in_response");
  }

  const blocks: WeeklyBlocks = WEEKDAYS.reduce((acc, day) => {
    acc[day] = entry[day] ?? [];
    return acc;
  }, {} as WeeklyBlocks);

  const attrs = hass.states?.[entityId]?.attributes as
    | { friendly_name?: string; icon?: string }
    | undefined;

  return {
    entity_id: entityId,
    name: attrs?.friendly_name,
    icon: attrs?.icon,
    ...blocks,
  };
}
