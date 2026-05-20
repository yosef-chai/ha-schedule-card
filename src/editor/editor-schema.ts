import type { HaFormBaseSchema } from "../types";

/**
 * The ha-form schema describing every editor field.
 *
 * Notable choices:
 * - `entity` is filtered to the `schedule` domain so only schedule helpers
 *   are offered in the entity picker.
 * - All labels and option labels are intentionally absent — they are
 *   resolved at render time via `computeLabel` + `localizeValue`, which
 *   makes the editor fully translatable.
 */
export function buildSchema(): HaFormBaseSchema[] {
  return [
    {
      name: "entity",
      required: true,
      selector: { entity: { filter: { domain: "schedule" } } },
    },
    { name: "title", selector: { text: {} } },

    {
      name: "_view_layout_grid",
      type: "grid",
      schema: [
        {
          name: "view",
          required: true,
          selector: {
            select: {
              mode: "dropdown",
              options: [{ value: "daily" }, { value: "weekly" }],
            },
          },
        },
        {
          name: "layout",
          required: true,
          selector: {
            select: {
              mode: "dropdown",
              options: [{ value: "full" }, { value: "compact" }],
            },
          },
        },
      ],
    },

    {
      name: "display_options",
      type: "expandable",
      schema: [
        { name: "show_header", selector: { boolean: {} } },
        { name: "show_state", selector: { boolean: {} } },
        { name: "show_next_event", selector: { boolean: {} } },
        { name: "show_legend", selector: { boolean: {} } },
        { name: "allow_view_switch", selector: { boolean: {} } },
        {
          name: "first_day_of_week",
          selector: {
            select: {
              mode: "dropdown",
              options: [{ value: "sunday" }, { value: "monday" }],
            },
          },
        },
        {
          name: "time_format",
          selector: {
            select: {
              mode: "dropdown",
              options: [{ value: "auto" }, { value: "24h" }, { value: "12h" }],
            },
          },
        },
      ],
    },

    {
      name: "appearance",
      type: "expandable",
      schema: [
        {
          name: "_colors_grid",
          type: "grid",
          schema: [
            {
              name: "active_color",
              selector: { ui_color: { default_color: "primary", include_none: true } },
            },
            {
              name: "inactive_color",
              selector: { ui_color: { default_color: "disabled", include_none: true } },
            },
            {
              name: "current_time_color",
              selector: { ui_color: { default_color: "red", include_none: true } },
            },
          ],
        },
      ],
    },

    {
      name: "actions",
      type: "expandable",
      schema: [
        { name: "tap_action", selector: { ui_action: {} } },
        { name: "hold_action", selector: { ui_action: {} } },
        { name: "double_tap_action", selector: { ui_action: {} } },
      ],
    },
  ];
}
