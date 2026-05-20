import { css } from "lit";

/**
 * Shared CSS variables and base styles for every view of the card.
 * All colors are sourced from HA theme variables so the card always
 * blends with the active theme.
 */
export const sharedStyles = css`
  :host {
    --hsc-active-color: var(--card-active-color, var(--primary-color));
    --hsc-inactive-color: var(--card-inactive-color, var(--divider-color));
    --hsc-now-color: var(--card-now-color, var(--error-color));
    --hsc-text-color: var(--primary-text-color);
    --hsc-text-secondary: var(--secondary-text-color);
    --hsc-radius: 6px;
    --hsc-gap: 8px;
    display: block;
    container-type: inline-size;
  }

  ha-card {
    display: block;
    overflow: hidden;
  }

  .root {
    padding: var(--hsc-padding, 12px 16px);
    color: var(--hsc-text-color);
  }

  .root.compact {
    padding: 8px 12px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: var(--hsc-gap);
    margin-bottom: 8px;
  }

  .header__icon {
    --mdc-icon-size: 24px;
    color: var(--hsc-active-color);
    flex-shrink: 0;
  }

  .header__title {
    font-size: var(--ha-card-header-font-size, 1.1rem);
    font-weight: 500;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .header__badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 0.78rem;
    background: var(--hsc-inactive-color);
    color: var(--primary-text-color);
    flex-shrink: 0;
  }

  .header__badge.is-on {
    background: var(--hsc-active-color);
    color: var(--text-primary-color, #fff);
  }

  .next-event {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    color: var(--hsc-text-secondary);
    margin: 4px 0 8px;
  }

  .next-event ha-icon {
    --mdc-icon-size: 16px;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 8px;
    font-size: 0.75rem;
    color: var(--hsc-text-secondary);
  }

  .legend__item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .legend__swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    display: inline-block;
  }

  .legend__swatch.is-active {
    background: var(--hsc-active-color);
  }

  .legend__swatch.is-inactive {
    background: var(--hsc-inactive-color);
  }

  .legend__swatch.is-now {
    background: var(--hsc-now-color);
  }

  .view-switch {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-inline-start: auto;
  }

  .view-switch button {
    background: transparent;
    border: 1px solid var(--divider-color);
    border-radius: var(--hsc-radius);
    color: var(--hsc-text-color);
    padding: 2px 8px;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .view-switch button[aria-pressed="true"] {
    background: var(--hsc-active-color);
    color: var(--text-primary-color, #fff);
    border-color: transparent;
  }

  .error {
    padding: 16px;
    color: var(--error-color);
  }

  /* === RTL refinements === */
  :host([dir="rtl"]) .view-switch ha-icon-button ha-icon,
  :host([dir="rtl"]) .day-nav__prev ha-icon,
  :host([dir="rtl"]) .day-nav__next ha-icon {
    transform: scaleX(-1);
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }

  /* Container queries — collapse less-important UI on narrow cards */
  @container (max-width: 360px) {
    .header__title {
      font-size: 1rem;
    }
    .legend {
      gap: 8px;
    }
  }
`;
