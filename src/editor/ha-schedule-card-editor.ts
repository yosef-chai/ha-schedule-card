import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fireEvent } from "custom-card-helpers";

import { EDITOR_TYPE } from "../const";
import type { HomeAssistant, ScheduleCardConfig } from "../types";
import { t } from "../localize";
import { direction } from "../utils/rtl";
import { buildSchema } from "./editor-schema";

@customElement(EDITOR_TYPE)
export class ScheduleCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: ScheduleCardConfig;

  public setConfig(config: ScheduleCardConfig): void {
    this._config = config;
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;
    return html`
      <div dir=${direction(this.hass)}>
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${buildSchema()}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          .localizeValue=${this._localizeValue}
          @value-changed=${this._valueChanged}
        ></ha-form>
      </div>
    `;
  }

  private _computeLabel = (schema: { name: string; type?: string }): string => {
    if (schema.type === "expandable") {
      return t(this.hass, `editor.sections.${schema.name}.title`);
    }
    // The implicit grid wrapper has no presentable label.
    if (schema.name.startsWith("_")) return "";
    return t(this.hass, `editor.fields.${schema.name}.label`);
  };

  private _computeHelper = (schema: { name: string }): string => {
    return t(this.hass, `editor.fields.${schema.name}.helper`, undefined, "");
  };

  private _localizeValue = (key: string): string => {
    // ha-form passes the option key as e.g. "ui.editor.fields.view.options.daily"
    // — but our schema doesn't carry a translation_key, so HA falls back to
    // calling localizeValue with the option's `value` field. We accept either
    // pattern: a dotted path or a bare value.
    if (key.includes(".")) return t(this.hass, key);
    return key;
  };

  private _valueChanged(ev: CustomEvent) {
    const value = ev.detail.value;
    fireEvent(this, "config-changed", { config: value });
  }

  static styles = css`
    :host {
      display: block;
    }
    ha-form {
      display: block;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-schedule-card-editor": ScheduleCardEditor;
  }
}
