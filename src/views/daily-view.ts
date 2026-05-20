import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "./timeline-bar";

import type { HomeAssistant, LayoutMode, Schedule, ScheduleCardConfig, WeekdayKey } from "../types";
import { dateToWeekdayKey } from "../utils/days";
import { dayLong, t } from "../localize";
import { dateToMinutes, mergeAdjacentBlocks, resolveBlock } from "../utils/time";
import { formatDateLong, formatHHMM } from "../utils/format";
import { nowAsPercent } from "../data/current-state";

@customElement("hsc-daily-view")
export class DailyView extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: ScheduleCardConfig;
  @property({ attribute: false }) public schedule!: Schedule;
  @property({ type: String }) public layout: LayoutMode = "full";
  @property({ attribute: false }) public nowTick = 0;
  @property({ attribute: false }) public entityState?: "on" | "off";

  /** Day offset from today; 0 = today, -1 = yesterday, +1 = tomorrow. */
  @state() private _offset = 0;

  /**
   * Only re-render when something visually relevant changed. Without this guard,
   * every hass-state churn (any entity in HA) would trigger a re-render here,
   * which is expensive and unnecessary — children get hass only for t() and
   * formatHHMM(), neither of which depend on the broader state map.
   *
   * If you add a new prop that should drive re-renders, add it to RENDER_KEYS.
   */
  private static readonly RENDER_KEYS = [
    "schedule",
    "config",
    "nowTick",
    "_offset",
    "layout",
    "entityState",
  ];
  protected shouldUpdate(changed: PropertyValues): boolean {
    for (const k of DailyView.RENDER_KEYS) if (changed.has(k)) return true;
    return false;
  }

  private _displayedDate(): Date {
    const d = new Date();
    d.setDate(d.getDate() + this._offset);
    return d;
  }

  private _displayedWeekday(): WeekdayKey {
    return dateToWeekdayKey(this._displayedDate());
  }

  protected render() {
    const date = this._displayedDate();
    const day = this._displayedWeekday();
    const isToday = this._offset === 0;
    const blocks = mergeAdjacentBlocks(this.schedule[day] ?? []);

    if (this.layout === "compact") return this._renderCompact(blocks, isToday);

    return html`
      <div class="daily">
        ${this._renderDayNav(date, isToday)}
        <hsc-timeline-bar
          .hass=${this.hass}
          .blocks=${blocks}
          .nowPercent=${isToday ? nowAsPercent() : undefined}
          show-scale
        ></hsc-timeline-bar>
        ${this._renderBlocksList(blocks, day)}
      </div>
    `;
  }

  private _renderCompact(blocks: typeof this.schedule.monday, isToday: boolean) {
    return html`
      <hsc-timeline-bar
        .hass=${this.hass}
        .blocks=${blocks}
        .nowPercent=${isToday ? nowAsPercent() : undefined}
        ?show-scale=${false}
        height="20px"
      ></hsc-timeline-bar>
    `;
  }

  private _renderDayNav(date: Date, isToday: boolean) {
    const dayName = formatDateLong(date, this.hass);
    return html`
      <div class="day-nav" role="group" aria-label=${t(this.hass, "view.daily")}>
        <button
          class="day-nav__prev"
          type="button"
          @click=${() => this._shift(-1)}
          aria-label=${t(this.hass, "nav.previous_day")}
        >
          <ha-icon icon="mdi:chevron-left"></ha-icon>
        </button>
        <span class="day-nav__title">
          ${isToday ? html`<strong>${t(this.hass, "days.today")}</strong> · ` : nothing}${dayName}
        </span>
        <button
          class="day-nav__next"
          type="button"
          @click=${() => this._shift(1)}
          aria-label=${t(this.hass, "nav.next_day")}
        >
          <ha-icon icon="mdi:chevron-right"></ha-icon>
        </button>
      </div>
    `;
  }

  private _renderBlocksList(blocks: typeof this.schedule.monday, day: WeekdayKey) {
    if (!blocks.length) {
      return html`<div class="empty">${t(this.hass, "header.no_blocks_today")}</div>`;
    }
    const now = new Date();
    const mins = dateToMinutes(now);
    const isToday = this._offset === 0;
    return html`
      <div class="blocks">
        <div class="blocks__title">
          ${isToday
            ? t(this.hass, "blocks.title")
            : t(this.hass, "blocks.title_for_day", { day: dayLong(this.hass, day) })}
        </div>
        <ul class="blocks__list">
          ${blocks.map((b) => {
            const r = resolveBlock(b);
            const inside = isToday && mins >= r.fromMin && mins < r.toMin;
            return html`
              <li class="blocks__row ${inside ? "is-now" : ""}">
                <span class="blocks__dot" aria-hidden="true"></span>
                <span class="blocks__time"
                  >${formatHHMM(r.fromLabel, this.hass, this.config)} –
                  ${formatHHMM(r.toLabel, this.hass, this.config)}</span
                >
              </li>
            `;
          })}
        </ul>
      </div>
    `;
  }

  private _shift(delta: number) {
    this._offset += delta;
  }

  static styles = css`
    :host {
      display: block;
    }
    .daily {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .day-nav {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.9rem;
      color: var(--hsc-text-secondary, var(--secondary-text-color));
    }
    .day-nav__title {
      flex: 1;
      text-align: center;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .day-nav button {
      background: transparent;
      border: none;
      color: inherit;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .day-nav button:hover {
      background: var(--divider-color);
    }
    .day-nav button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .day-nav ha-icon {
      --mdc-icon-size: 20px;
    }
    .empty {
      font-size: 0.85rem;
      color: var(--hsc-text-secondary, var(--secondary-text-color));
      text-align: center;
      padding: 8px 0;
    }
    .blocks__title {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--hsc-text-secondary, var(--secondary-text-color));
      margin-bottom: 4px;
    }
    .blocks__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 4px 12px;
    }
    .blocks__row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
    }
    .blocks__row.is-now {
      color: var(--hsc-now-color, var(--error-color));
      font-weight: 600;
    }
    .blocks__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--hsc-active-color, var(--primary-color));
      flex-shrink: 0;
    }
    .blocks__row.is-now .blocks__dot {
      background: var(--hsc-now-color, var(--error-color));
    }

    @container (max-width: 380px) {
      .blocks__title {
        font-size: 0.75rem;
      }
      .blocks__row {
        font-size: 0.8rem;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "hsc-daily-view": DailyView;
  }
}
