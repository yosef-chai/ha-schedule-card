/* eslint-disable no-console */
import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import {
  hasAction,
  handleAction as haHandleAction,
  type ActionHandlerEvent,
  type LovelaceCard,
} from "custom-card-helpers";

import {
  CARD_TYPE,
  CARD_VERSION,
  EDITOR_TYPE,
  LOADING_TIMEOUT_MS,
  NOW_TICK_MS,
  SCHEDULE_DOMAIN,
  WS_TIMEOUT_MS,
} from "./const";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms)),
  ]);
}
import type { HomeAssistant, LayoutMode, Schedule, ScheduleCardConfig, ViewMode } from "./types";
import { getSchedule } from "./data/schedule";
import { isCurrentlyActive, parseNextEvent } from "./data/current-state";
import { sharedStyles } from "./styles/shared-styles";
import { t } from "./localize";
import { direction } from "./utils/rtl";
import { formatTimeOfDay } from "./utils/format";
import { actionHandler } from "./utils/action-handler";

import "./views/daily-view";
import "./views/weekly-view";
import "./editor/ha-schedule-card-editor";

// Banner so developers can identify the running version.
/* eslint-disable @typescript-eslint/no-explicit-any */
(globalThis as any).__HSC_PRINTED__ ??= (() => {
  console.info(
    `%c  HA-SCHEDULE-CARD  %c  v${CARD_VERSION}  `,
    "color: white; background: #03a9f4; font-weight: 700",
    "color: #03a9f4; background: white; font-weight: 700",
  );
  return true;
})();

// Localized name + description for the card picker — chosen from the
// browser's UI language since hass isn't available at module-load time.
const _pickerLang = (() => {
  const nav = (globalThis.navigator?.language ?? "en").toLowerCase();
  if (nav === "iw" || nav.startsWith("he")) return "he";
  return "en";
})();
const _pickerStrings: Record<string, { name: string; description: string }> = {
  en: {
    name: "Schedule Card",
    description:
      "A 24-hour visual timeline of schedule.* entities with daily/weekly and full/compact views.",
  },
  he: {
    name: "כרטיס לוחות זמנים",
    description:
      "ציר זמן ויזואלי של 24 שעות לישויות schedule.* — עם תצוגות יומית/שבועית ומלאה/קומפקטית.",
  },
};

// Register the card with HA's picker.
(window as any).customCards = (window as any).customCards || [];
if (!(window as any).customCards.some((c: any) => c.type === CARD_TYPE)) {
  (window as any).customCards.push({
    type: CARD_TYPE,
    name: _pickerStrings[_pickerLang]!.name,
    description: _pickerStrings[_pickerLang]!.description,
    preview: true,
    documentationURL: "https://github.com/yosef-chai/ha-schedule-card",
  });
}

@customElement(CARD_TYPE)
export class ScheduleCard extends LitElement implements LovelaceCard {
  // ===== Static editor support =====

  public static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_TYPE) as HTMLElement;
  }

  public static getStubConfig(): Partial<ScheduleCardConfig> {
    return {
      type: `custom:${CARD_TYPE}`,
      entity: "",
      view: "daily",
      layout: "full",
      show_header: true,
      show_state: true,
      show_next_event: true,
    };
  }

  // ===== Properties =====

  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: ScheduleCardConfig;
  @state() private _schedule?: Schedule;
  @state() private _scheduleError?: string;
  @state() private _viewOverride?: ViewMode;
  @state() private _nowTick = 0;
  @state() private _entityState?: "on" | "off";
  @state() private _loadStartedAt?: number;

  private _nowTimer?: number;
  private _scheduleUpdatedSub?: () => void;
  private _loadedForEntity?: string;
  /** Single-flight guard so concurrent reactivity tickles don't pile up loads. */
  private _loadingPromise?: Promise<void>;

  // ===== Lifecycle =====

  public setConfig(config: ScheduleCardConfig): void {
    if (!config) throw new Error(t(this.hass, "common.error_invalid_config"));
    if (config.entity && !config.entity.startsWith(`${SCHEDULE_DOMAIN}.`)) {
      throw new Error(t(this.hass, "common.error_not_a_schedule"));
    }
    this._config = {
      view: "daily",
      layout: "full",
      show_header: true,
      show_state: true,
      show_next_event: true,
      show_legend: false,
      allow_view_switch: false,
      first_day_of_week: "sunday",
      time_format: "auto",
      tap_action: { action: "more-info" },
      ...config,
    };
    this._viewOverride = undefined;
    if (this._loadedForEntity !== this._config.entity) {
      this._loadedForEntity = this._config.entity;
      this._schedule = undefined;
      this._scheduleError = undefined;
      this._loadStartedAt = undefined;
      if (this._config.entity) {
        void this._loadSchedule();
      }
    }
  }

  public getCardSize(): number {
    const layout = this._config?.layout ?? "full";
    const view = this._effectiveView();
    if (layout === "compact") return 1;
    return view === "weekly" ? 5 : 3;
  }

  /** Modern (2024.10+) grid/section layout hook. */
  public getLayoutOptions() {
    const layout = this._config?.layout ?? "full";
    const view = this._effectiveView();
    if (layout === "compact") {
      return { grid_columns: 12, grid_rows: 1, grid_min_rows: 1, grid_max_rows: 2 };
    }
    return { grid_columns: 12, grid_rows: view === "weekly" ? 5 : 3, grid_min_rows: 2 };
  }

  /** Legacy alias kept for any HA build that calls the older name. */
  public getGridOptions() {
    return this.getLayoutOptions();
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._nowTimer = window.setInterval(() => {
      this._nowTick = (this._nowTick + 1) % 1_000_000;
    }, NOW_TICK_MS);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._nowTimer !== undefined) {
      window.clearInterval(this._nowTimer);
      this._nowTimer = undefined;
    }
    this._scheduleUpdatedSub?.();
    this._scheduleUpdatedSub = undefined;
  }

  // ===== Data =====

  private async _loadSchedule(): Promise<void> {
    if (this._loadingPromise) return this._loadingPromise;
    this._loadingPromise = this._doLoadSchedule().finally(() => {
      this._loadingPromise = undefined;
    });
    return this._loadingPromise;
  }

  private async _doLoadSchedule(): Promise<void> {
    if (!this.hass || !this._config?.entity) return;
    this._scheduleError = undefined;
    this._loadStartedAt = Date.now();
    try {
      const found = await withTimeout(getSchedule(this.hass, this._config.entity), WS_TIMEOUT_MS);
      this._schedule = found;
    } catch (err: any) {
      console.error("[ha-schedule-card] failed to load schedule", err);
      const msg = String(err?.message ?? err);
      if (msg === "entity_not_in_response") {
        this._scheduleError = t(this.hass, "common.error_no_entity");
      } else {
        this._scheduleError = t(this.hass, "common.error_ws_failed", { message: msg });
      }
      this._schedule = undefined;
    } finally {
      this._loadStartedAt = undefined;
    }
  }

  private _subscribeToScheduleUpdated() {
    if (this._scheduleUpdatedSub || !this.hass?.connection) return;
    try {
      const subPromise = this.hass.connection.subscribeEvents(
        () => void this._loadSchedule(),
        "schedule_updated",
      );
      // Capture the eventual unsub fn so disconnectedCallback can await it.
      this._scheduleUpdatedSub = () => {
        void subPromise.then((unsub) => unsub()).catch(() => undefined);
      };
    } catch {
      /* not critical — manual refresh on hass change covers most cases */
    }
  }

  protected updated(changed: PropertyValues) {
    super.updated(changed);

    // Attempt subscription whenever hass appears (it may be undefined at
    // connectedCallback time). The guard inside is idempotent.
    if (changed.has("hass")) {
      this._subscribeToScheduleUpdated();
    }

    // Keep _entityState fresh so child views can react without depending on hass.
    if (changed.has("hass") && this._config?.entity) {
      const newState = this.hass?.states?.[this._config.entity]?.state === "on" ? "on" : "off";
      if (newState !== this._entityState) {
        this._entityState = newState;
      }
    }

    if (
      changed.has("hass") &&
      this.hass &&
      this._config?.entity &&
      !this._schedule &&
      !this._scheduleError &&
      !this._loadingPromise
    ) {
      void this._loadSchedule();
    }
  }

  // ===== Helpers =====

  private _effectiveView(): ViewMode {
    return this._viewOverride ?? this._config?.view ?? "daily";
  }

  private _effectiveLayout(): LayoutMode {
    return this._config?.layout ?? "full";
  }

  private _handleAction = (ev: ActionHandlerEvent) => {
    if (!this.hass || !this._config) return;
    haHandleAction(this, this.hass, this._config as any, ev.detail.action!);
  };

  // ===== Render =====

  protected render() {
    if (!this._config || !this.hass) return nothing;

    if (!this._config.entity) return this._renderEmpty();
    if (this._scheduleError) return this._renderError(this._scheduleError);

    if (!this._schedule) {
      const stateObj = this.hass.states?.[this._config.entity];
      if (!stateObj) return this._renderError(t(this.hass, "common.error_no_entity"));
      // Defensive render-side cap: if we've been "loading" for too long, surface
      // an error with Retry rather than spinning forever.
      if (this._loadStartedAt && Date.now() - this._loadStartedAt > LOADING_TIMEOUT_MS) {
        return this._renderError(t(this.hass, "common.error_loading_timeout"));
      }
      return this._renderLoading();
    }
    const stateObj = this.hass.states?.[this._config.entity];
    if (!stateObj) {
      return this._renderError(t(this.hass, "common.error_no_entity"));
    }

    const view = this._effectiveView();
    const layout = this._effectiveLayout();
    const rtl = direction(this.hass);
    const cardStyles = this._computeCardCssVars();

    return html`
      <ha-card
        dir=${rtl}
        style=${cardStyles}
        @action=${this._handleAction}
        .actionHandler=${actionHandler({
          hasHold: hasAction(this._config.hold_action as any),
          hasDoubleClick: hasAction(this._config.double_tap_action as any),
        })}
        role="region"
        aria-label=${this._cardAriaLabel(stateObj)}
      >
        <div class=${classMap({ root: true, compact: layout === "compact" })}>
          ${this._config.show_header !== false ? this._renderHeader(stateObj) : nothing}
          ${this._config.show_next_event && layout !== "compact"
            ? this._renderNextEvent(stateObj)
            : nothing}
          ${view === "daily"
            ? html`
                <hsc-daily-view
                  .hass=${this.hass}
                  .config=${this._config}
                  .schedule=${this._schedule}
                  .layout=${layout}
                  .nowTick=${this._nowTick}
                  .entityState=${this._entityState}
                ></hsc-daily-view>
              `
            : html`
                <hsc-weekly-view
                  .hass=${this.hass}
                  .config=${this._config}
                  .schedule=${this._schedule}
                  .layout=${layout}
                  .nowTick=${this._nowTick}
                  .entityState=${this._entityState}
                ></hsc-weekly-view>
              `}
          ${this._config.show_legend && layout !== "compact" ? this._renderLegend() : nothing}
        </div>
      </ha-card>
    `;
  }

  private _resolveColor(value: unknown): string | undefined {
    if (value == null || value === "none" || value === "") return undefined;
    if (Array.isArray(value)) return `rgb(${(value as number[]).join(",")})`;
    if (typeof value !== "string") return undefined;
    const s = value.trim();
    if (s.startsWith("#") || s.startsWith("rgb") || s.startsWith("hsl") || s.startsWith("var(")) {
      return s;
    }
    return `var(--${s}-color)`;
  }

  private _computeCardCssVars() {
    const c = this._config ?? ({} as ScheduleCardConfig);
    const styles: Record<string, string> = {};
    const active = this._resolveColor(c.active_color);
    const inactive = this._resolveColor(c.inactive_color);
    const now = this._resolveColor(c.current_time_color);
    if (active) styles["--card-active-color"] = active;
    if (inactive) styles["--card-inactive-color"] = inactive;
    if (now) styles["--card-now-color"] = now;
    return styleMap(styles);
  }

  private _cardAriaLabel(stateObj: { state: string }) {
    const title =
      this._config?.title ||
      (this.hass.states?.[this._config!.entity] as any)?.attributes?.friendly_name ||
      this._config!.entity;
    const state =
      stateObj.state === "on" ? t(this.hass, "header.state_on") : t(this.hass, "header.state_off");
    return `${title} — ${state}`;
  }

  private _renderHeader(stateObj: any) {
    const title = this._config?.title || stateObj.attributes?.friendly_name || this._config!.entity;
    const icon = stateObj.attributes?.icon || "mdi:calendar-clock";
    const isOn = isCurrentlyActive(this.hass, this._config!.entity, this._schedule);
    const stateLabel = isOn ? t(this.hass, "header.state_on") : t(this.hass, "header.state_off");

    return html`
      <div class="header">
        <ha-icon class="header__icon" .icon=${icon}></ha-icon>
        <div class="header__title">${title}</div>
        ${this._config!.show_state !== false
          ? html`
              <span class=${classMap({ header__badge: true, "is-on": isOn })}> ${stateLabel} </span>
            `
          : nothing}
        ${this._config!.allow_view_switch ? this._renderViewSwitch() : nothing}
      </div>
    `;
  }

  private _renderNextEvent(stateObj: any) {
    const nextRaw = stateObj.attributes?.next_event;
    const next = parseNextEvent(nextRaw);
    if (!next) return nothing;
    const isOn = isCurrentlyActive(this.hass, this._config!.entity, this._schedule);
    const time = formatTimeOfDay(next, this.hass, this._config);
    const key = isOn ? "header.until" : "header.from";
    const msg = t(this.hass, key, { time });
    return html`
      <div class="next-event">
        <ha-icon icon="mdi:clock-outline"></ha-icon>
        <span>${t(this.hass, "header.next_event")}: ${msg}</span>
      </div>
    `;
  }

  private _renderLegend() {
    return html`
      <div class="legend" aria-hidden="true">
        <span class="legend__item"
          ><span class="legend__swatch is-active"></span>${t(this.hass, "legend.active")}</span
        >
        <span class="legend__item"
          ><span class="legend__swatch is-inactive"></span>${t(this.hass, "legend.inactive")}</span
        >
        <span class="legend__item"
          ><span class="legend__swatch is-now"></span>${t(this.hass, "legend.current_time")}</span
        >
      </div>
    `;
  }

  private _renderViewSwitch() {
    const view = this._effectiveView();
    return html`
      <div class="view-switch" role="group">
        <button
          type="button"
          aria-pressed=${view === "daily"}
          aria-label=${t(this.hass, "view.switch_to_daily")}
          @click=${() => (this._viewOverride = "daily")}
        >
          ${t(this.hass, "view.daily")}
        </button>
        <button
          type="button"
          aria-pressed=${view === "weekly"}
          aria-label=${t(this.hass, "view.switch_to_weekly")}
          @click=${() => (this._viewOverride = "weekly")}
        >
          ${t(this.hass, "view.weekly")}
        </button>
      </div>
    `;
  }

  private _renderLoading() {
    return html`
      <ha-card>
        <div class="root loading">
          <ha-spinner size="small"></ha-spinner>
          <span class="loading-label">${t(this.hass, "common.loading")}</span>
        </div>
      </ha-card>
    `;
  }

  private _renderEmpty() {
    return html`
      <ha-card>
        <div class="root empty">
          <ha-icon class="empty__icon" icon="mdi:calendar-clock"></ha-icon>
          <div class="empty__text">${t(this.hass, "common.empty_pick_entity")}</div>
          <div class="empty__hint">${t(this.hass, "common.empty_pick_entity_hint")}</div>
        </div>
      </ha-card>
    `;
  }

  private _renderError(message: string) {
    return html`
      <ha-card>
        <div class="root">
          <div class="error" role="alert">${message}</div>
          <button
            class="retry"
            type="button"
            @click=${() => {
              this._scheduleError = undefined;
              this._loadStartedAt = undefined;
              void this._loadSchedule();
            }}
          >
            ${t(this.hass, "common.retry")}
          </button>
        </div>
      </ha-card>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        --schedule-card-direction: inherit;
      }
      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 20px 16px;
      }
      .retry {
        margin-block-start: 8px;
        background: transparent;
        border: 1px solid var(--divider-color);
        border-radius: var(--hsc-radius, 6px);
        color: var(--primary-text-color);
        padding: 4px 12px;
        font-size: 0.85rem;
        cursor: pointer;
      }
      .retry:hover {
        background: var(--divider-color);
      }
      .retry:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
      .loading-label {
        color: var(--secondary-text-color);
      }
      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 20px 16px;
        text-align: center;
      }
      .empty__icon {
        --mdc-icon-size: 36px;
        color: var(--secondary-text-color);
        opacity: 0.6;
      }
      .empty__text {
        font-weight: 500;
      }
      .empty__hint {
        font-size: 0.85rem;
        color: var(--secondary-text-color);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-schedule-card": ScheduleCard;
  }
}
