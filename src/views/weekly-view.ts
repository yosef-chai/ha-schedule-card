import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

import "./timeline-bar";

import type {
  HomeAssistant,
  LayoutMode,
  Schedule,
  ScheduleTimeRange,
  ScheduleCardConfig,
  WeekdayKey,
} from "../types";
import { dayShort, t } from "../localize";
import { dateToWeekdayKey, orderedWeekdays } from "../utils/days";
import { mergeAdjacentBlocks, minutesToPercent, resolveBlock } from "../utils/time";
import { nowAsPercent } from "../data/current-state";

@customElement("hsc-weekly-view")
export class WeeklyView extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: ScheduleCardConfig;
  @property({ attribute: false }) public schedule!: Schedule;
  @property({ type: String }) public layout: LayoutMode = "full";
  @property({ attribute: false }) public nowTick = 0;
  @property({ attribute: false }) public entityState?: "on" | "off";

  /**
   * Skip re-render on hass-only updates. Children consume hass for translation
   * helpers; the rest of the visual state comes from explicit props.
   */
  private static readonly RENDER_KEYS = ["schedule", "config", "nowTick", "layout", "entityState"];
  protected shouldUpdate(changed: PropertyValues): boolean {
    for (const k of WeeklyView.RENDER_KEYS) if (changed.has(k)) return true;
    return false;
  }

  private _days(): WeekdayKey[] {
    return orderedWeekdays(this.config.first_day_of_week ?? "sunday");
  }

  protected render() {
    if (this.layout === "compact") return this._renderCompact();
    return this._renderFull();
  }

  // ===== Full vertical-columns grid =====

  private _renderFull() {
    const today = dateToWeekdayKey(new Date());
    const days = this._days();
    const nowPct = nowAsPercent();

    return html`
      <div class="week-full" role="grid" aria-label=${t(this.hass, "a11y.week_region")}>
        <div class="week-full__axis" aria-hidden="true">
          ${[0, 6, 12, 18, 24].map(
            (h) => html`
              <span
                class="week-full__axis-tick"
                style=${styleMap({ insetBlockStart: `${(h / 24) * 100}%` })}
                >${String(h).padStart(2, "0")}</span
              >
            `,
          )}
        </div>
        <div class="week-full__cols">
          ${days.map((d) => this._renderColumn(d, d === today, nowPct))}
        </div>
      </div>
    `;
  }

  private _renderColumn(day: WeekdayKey, isToday: boolean, nowPct: number) {
    const blocks = mergeAdjacentBlocks(this.schedule[day] ?? []);
    const aria = t(this.hass, "a11y.day_column", {
      day: dayShort(this.hass, day),
      count: blocks.length,
    });
    return html`
      <div
        class=${classMap({
          "week-full__col": true,
          "is-today": isToday,
        })}
        role="gridcell"
        aria-label=${aria}
      >
        <div class="week-full__day-label">${dayShort(this.hass, day)}</div>
        <div class="week-full__col-bar">
          <div class="week-full__inactive" aria-hidden="true"></div>
          ${blocks.map((b) => this._renderVerticalBlock(b))}
          ${isToday
            ? html`
                <div
                  class="week-full__now"
                  style=${styleMap({ insetBlockStart: `${nowPct}%` })}
                  aria-hidden="true"
                ></div>
              `
            : nothing}
        </div>
      </div>
    `;
  }

  private _renderVerticalBlock(b: ScheduleTimeRange) {
    const r = resolveBlock(b);
    if (r.widthPct <= 0) return nothing;
    return html`
      <div
        class="week-full__block"
        style=${styleMap({
          insetBlockStart: `${r.leftPct}%`,
          height: `${r.widthPct}%`,
        })}
        title=${`${r.fromLabel} – ${r.toLabel}`}
      ></div>
    `;
  }

  // ===== Compact horizontal rows =====

  private _renderCompact() {
    const today = dateToWeekdayKey(new Date());
    const days = this._days();
    const nowPct = nowAsPercent();

    return html`
      <div class="week-compact" role="grid" aria-label=${t(this.hass, "a11y.week_region")}>
        ${days.map((d) => {
          const blocks = mergeAdjacentBlocks(this.schedule[d] ?? []);
          const isToday = d === today;
          return html`
            <div class=${classMap({ "week-compact__row": true, "is-today": isToday })} role="row">
              <span class="week-compact__label">${dayShort(this.hass, d)}</span>
              <hsc-timeline-bar
                .hass=${this.hass}
                .blocks=${blocks}
                .nowPercent=${isToday ? nowPct : undefined}
                ?show-scale=${false}
                height="12px"
              ></hsc-timeline-bar>
            </div>
          `;
        })}
        <div class="week-compact__scale" aria-hidden="true">
          ${[0, 6, 12, 18, 24].map(
            (h) => html`
              <span
                class="week-compact__scale-tick"
                style=${styleMap({ insetInlineStart: `${minutesToPercent(h * 60)}%` })}
                >${String(h).padStart(2, "0")}</span
              >
            `,
          )}
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    /* ===== Full ===== */
    .week-full {
      display: flex;
      gap: 6px;
      direction: ltr; /* axis + columns are LTR; text inside flips by parent dir */
      unicode-bidi: isolate;
    }
    .week-full__axis {
      position: relative;
      width: 22px;
      flex-shrink: 0;
      padding-block-start: 22px;
      font-size: 0.65rem;
      color: var(--hsc-text-secondary, var(--secondary-text-color));
    }
    .week-full__axis-tick {
      position: absolute;
      transform: translateY(-50%);
      inset-inline-start: 0;
      text-align: end;
      width: 100%;
    }
    .week-full__cols {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
      flex: 1;
      min-width: 0;
    }
    .week-full__col {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      min-width: 0;
    }
    .week-full__day-label {
      text-align: center;
      font-size: 0.75rem;
      color: var(--hsc-text-secondary, var(--secondary-text-color));
      margin-bottom: 4px;
      padding-block: 2px;
      border-radius: var(--hsc-radius, 6px);
    }
    .week-full__col.is-today .week-full__day-label {
      background: var(--hsc-active-color, var(--primary-color));
      color: var(--text-primary-color, #fff);
      font-weight: 600;
    }
    .week-full__col-bar {
      position: relative;
      flex: 1;
      min-height: 120px;
      border-radius: var(--hsc-radius, 6px);
      overflow: hidden;
    }
    .week-full__inactive {
      position: absolute;
      inset: 0;
      background: var(--hsc-inactive-color, var(--divider-color));
      opacity: 0.4;
    }
    .week-full__block {
      position: absolute;
      inset-inline-start: 0;
      inset-inline-end: 0;
      background: var(--hsc-active-color, var(--primary-color));
    }
    .week-full__col.is-today .week-full__block {
      box-shadow: inset 0 0 0 1px var(--hsc-active-color);
    }
    .week-full__now {
      position: absolute;
      inset-inline-start: 0;
      inset-inline-end: 0;
      height: 2px;
      transform: translateY(-1px);
      background: var(--hsc-now-color, var(--error-color));
      box-shadow: 0 0 4px var(--hsc-now-color, var(--error-color));
      z-index: 2;
    }

    @container (max-width: 480px) {
      .week-full__axis {
        width: 18px;
        font-size: 0.6rem;
      }
      .week-full__day-label {
        font-size: 0.7rem;
      }
      .week-full__col-bar {
        min-height: 90px;
      }
    }

    @container (max-width: 320px) {
      .week-full__axis {
        display: none;
      }
    }

    /* ===== Compact ===== */
    .week-compact {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .week-compact__row {
      display: grid;
      grid-template-columns: 22px 1fr;
      gap: 8px;
      align-items: center;
    }
    .week-compact__label {
      font-size: 0.75rem;
      color: var(--hsc-text-secondary, var(--secondary-text-color));
      text-align: center;
    }
    .week-compact__row.is-today .week-compact__label {
      color: var(--hsc-active-color, var(--primary-color));
      font-weight: 700;
    }
    .week-compact__scale {
      position: relative;
      direction: ltr;
      unicode-bidi: isolate;
      height: 14px;
      margin-inline-start: 30px;
      font-size: 0.6rem;
      color: var(--hsc-text-secondary, var(--secondary-text-color));
    }
    .week-compact__scale-tick {
      position: absolute;
      top: 0;
      transform: translateX(-50%);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "hsc-weekly-view": WeeklyView;
  }
}
