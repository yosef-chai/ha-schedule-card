export const CARD_VERSION = "0.1.0";

export const CARD_TYPE = "ha-schedule-card";
export const EDITOR_TYPE = "ha-schedule-card-editor";

export const SCHEDULE_DOMAIN = "schedule";

/** Minutes in a day — single source of truth for percent calculations. */
export const MINUTES_IN_DAY = 24 * 60;

/** Refresh cadence for the "now" marker, ms. */
export const NOW_TICK_MS = 60_000;

/** Hard WebSocket round-trip timeout for service / WS calls, ms. */
export const WS_TIMEOUT_MS = 15_000;

/** Render-side defensive cap: switch from "loading" to a retryable error after this duration. */
export const LOADING_TIMEOUT_MS = 30_000;
