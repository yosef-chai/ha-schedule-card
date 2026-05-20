import type { HomeAssistant as HACoreType, LovelaceCardConfig } from "custom-card-helpers";

export interface HomeAssistant extends HACoreType {
  formatEntityState?: (stateObj: { state: string }, state?: string) => string;
  formatEntityAttributeValue?: (
    stateObj: { state: string },
    attribute: string,
    value?: unknown,
  ) => string;
}

/** A single time block within a day of a schedule. */
export interface ScheduleTimeRange {
  /** Inclusive start, HH:MM:SS */
  from: string;
  /** Exclusive end, HH:MM:SS — may be "24:00:00" meaning end-of-day */
  to: string;
  /** Optional custom data attached to the block. */
  data?: Record<string, string | number | boolean>;
}

export type WeekdayKey =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

/** Just the seven weekday arrays — matches the `schedule.get_schedule` service response shape. */
export interface WeeklyBlocks {
  sunday: ScheduleTimeRange[];
  monday: ScheduleTimeRange[];
  tuesday: ScheduleTimeRange[];
  wednesday: ScheduleTimeRange[];
  thursday: ScheduleTimeRange[];
  friday: ScheduleTimeRange[];
  saturday: ScheduleTimeRange[];
}

/**
 * The resolved schedule for a single entity. Built from a `schedule.get_schedule`
 * service response plus `hass.states[entity_id].attributes` for the human-facing
 * `name` and `icon` (which the service does not return).
 */
export interface Schedule extends WeeklyBlocks {
  entity_id: string;
  name?: string;
  icon?: string;
}

/** Standard HA action config (subset we need). */
export interface ActionConfig {
  action: "none" | "more-info" | "toggle" | "navigate" | "url" | "call-service" | "fire-dom-event";
  navigation_path?: string;
  url_path?: string;
  service?: string;
  service_data?: Record<string, unknown>;
  data?: Record<string, unknown>;
  target?: Record<string, unknown>;
  confirmation?: boolean | { text?: string };
}

export type ViewMode = "daily" | "weekly";
export type LayoutMode = "full" | "compact";
export type TimeFormat = "auto" | "24h" | "12h";
export type FirstDayOfWeek = "sunday" | "monday";

/** The user-facing card configuration. */
export interface ScheduleCardConfig extends LovelaceCardConfig {
  type: string;
  entity: string;

  view?: ViewMode;
  layout?: LayoutMode;

  title?: string;
  show_header?: boolean;
  show_state?: boolean;
  show_next_event?: boolean;
  show_legend?: boolean;

  first_day_of_week?: FirstDayOfWeek;
  time_format?: TimeFormat;
  allow_view_switch?: boolean;

  active_color?: string | [number, number, number];
  inactive_color?: string | [number, number, number];
  current_time_color?: string | [number, number, number];

  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

/** Minimal shape returned by ha-form schema entries — kept loose intentionally. */
export interface HaFormBaseSchema {
  name: string;
  required?: boolean;
  selector?: Record<string, unknown>;
  type?: string;
  schema?: HaFormBaseSchema[];
  title?: string;
}
