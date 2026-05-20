import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

import type { HomeAssistant, ScheduleTimeRange } from "../types";
import { t } from "../localize";
import { resolveBlock, minutesToPercent } from "../utils/time";
import { formatHHMM } from "../utils/format";

/**
 * A 24-hour horizontal timeline showing a single day's schedule blocks
 * with an optional "now" marker and configurable scale labels.
 *
 * The timeline geometry is always LTR (00:00 → 24:00) regardless of locale
 * — a deliberate decision per the spec.
 */
@customElement("hsc-timeline-bar")
export class TimelineBar extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public blocks: ScheduleTimeRange[] = [];
  @property({ type: Number, attribute: "now-percent" }) public nowPercent?: number;
  @property({ type: Boolean, attribute: "show-scale" }) public showScale = true;
  @property({ type: Boolean, attribute: "dense-scale" }) public denseScale = false;
  @property({ type: String, attribute: "height" }) public heightOverride?: string;

  /**
   * Hass only feeds t() for ARIA labels — never let hass churn re-render the bar.
   */
  private static readonly RENDER_KEYS = [
    "blocks",
    "nowPercent",
    "showScale",
    "denseScale",
    "heightOverride",
  ];
  protected shouldUpdate(changed: PropertyValues): boolean {
    for (const k of TimelineBar.RENDER_KEYS) if (changed.has(k)) return true;
    return false;
  }

  protected render() {
    const scaleHours = this.denseScale ? [0, 6, 12, 18, 24] : [0, 3, 6, 9, 12, 15, 18, 21, 24];

    return html`
      <div
        class="bar"
        style=${this.heightOverride ? styleMap({ height: this.heightOverride }) : nothing}
        role="img"
        aria-label=${t(this.hass, "a11y.timeline_region")}
      >
        <div class="bar__inactive" aria-hidden="true"></div>
        ${this.blocks.map((b) => this._renderBlock(b))}
        ${this.nowPercent !== undefined ? this._renderNow(this.nowPercent) : nothing}
      </div>
      ${this.showScale ? this._renderScale(scaleHours) : nothing}
    `;
  }

  private _renderBlock(block: ScheduleTimeRange) {
    const r = resolveBlock(block);
    if (r.widthPct <= 0) return nothing;
    const aria = t(this.hass, "a11y.active_block", {
      from: r.fromLabel,
      to: r.toLabel,
    });
    return html`
      <div
        class="bar__block"
        style=${styleMap({
          insetInlineStart: `${r.leftPct}%`,
          width: `${r.widthPct}%`,
        })}
        title=${`${r.fromLabel} – ${r.toLabel}`}
        role="img"
        aria-label=${aria}
      ></div>
    `;
  }

  private _renderNow(percent: number) {
    const clamped = Math.max(0, Math.min(100, percent));
    const now = new Date();
    const label = t(this.hass, "a11y.now_marker", {
      time: formatHHMM(`${now.getHours()}:${now.getMinutes()}`, this.hass),
    });
    return html`
      <div
        class="bar__now"
        style=${styleMap({ insetInlineStart: `${clamped}%` })}
        role="img"
        aria-label=${label}
      ></div>
    `;
  }

  private _renderScale(hours: number[]) {
    return html`
      <div class="scale" aria-hidden="true">
        ${hours.map((h) => {
          const pct = minutesToPercent(h * 60);
          const isEdge = h === 0 || h === 24;
          return html`
            <span
              class=${classMap({
                scale__tick: true,
                "scale__tick--edge": isEdge,
              })}
              style=${styleMap({ insetInlineStart: `${pct}%` })}
              >${String(h).padStart(2, "0")}</span
            >
          `;
        })}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      direction: ltr; /* timeline geometry is always LTR */
      unicode-bidi: isolate;
      width: 100%;
    }

    .bar {
      position: relative;
      width: 100%;
      height: var(--hsc-bar-height, 36px);
      border-radius: var(--hsc-radius, 6px);
      overflow: hidden;
      background: transparent;
    }

    .bar__inactive {
      position: absolute;
      inset: 0;
      background: var(--hsc-inactive-color);
      opacity: 0.45;
    }

    .bar__block {
      position: absolute;
      top: 0;
      bottom: 0;
      background: var(--hsc-active-color);
      border-radius: 2px;
      transition: background 200ms ease;
    }

    .bar__now {
      position: absolute;
      top: -2px;
      bottom: -2px;
      width: 2px;
      background: var(--hsc-now-color);
      box-shadow: 0 0 4px var(--hsc-now-color);
      pointer-events: none;
      z-index: 2;
    }

    .scale {
      position: relative;
      width: 100%;
      height: 14px;
      margin-top: 2px;
      font-size: 0.65rem;
      color: var(--hsc-text-secondary, var(--secondary-text-color));
    }

    .scale__tick {
      position: absolute;
      top: 0;
      transform: translateX(-50%);
      white-space: nowrap;
    }

    .scale__tick--edge {
      font-weight: 600;
    }

    @container (max-width: 360px) {
      .scale__tick {
        font-size: 0.6rem;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "hsc-timeline-bar": TimelineBar;
  }
}
