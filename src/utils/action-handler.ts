import { directive } from "lit/directive.js";
import { AsyncDirective } from "lit/async-directive.js";
import type { ElementPart, PartInfo } from "lit/directive.js";
import { PartType } from "lit/directive.js";
import { noChange } from "lit";

/**
 * A minimal action-handler directive compatible with HA's `@action` pattern.
 *
 * It dispatches a CustomEvent("action", { detail: { action: "tap" | "hold" | "double_tap" } })
 * on the host element. Long-press (hold) is detected after 500ms.
 */

export interface ActionHandlerOptions {
  hasHold?: boolean;
  hasDoubleClick?: boolean;
  disabled?: boolean;
}

interface InternalState {
  options: ActionHandlerOptions;
  cleanup: () => void;
}

const HOLD_THRESHOLD_MS = 500;
const DOUBLE_TAP_WINDOW_MS = 250;

class ActionHandlerDirective extends AsyncDirective {
  private _element?: HTMLElement;
  private _state?: InternalState;

  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error("actionHandler can only be used on an element binding");
    }
  }

  render(_options: ActionHandlerOptions = {}) {
    return noChange;
  }

  override update(part: ElementPart, [options = {}]: [ActionHandlerOptions]) {
    const el = part.element as HTMLElement;
    if (this._element !== el) {
      this._state?.cleanup();
      this._element = el;
      this._state = attach(el, options);
    } else if (this._state) {
      this._state.options = options;
    }
    return noChange;
  }

  override disconnected() {
    this._state?.cleanup();
    this._state = undefined;
  }
}

function attach(el: HTMLElement, options: ActionHandlerOptions): InternalState {
  const state: InternalState = { options, cleanup: () => undefined };

  let pressTimer: number | undefined;
  let isHolding = false;
  let lastTap = 0;
  let pendingTapTimer: number | undefined;

  const fire = (action: "tap" | "hold" | "double_tap") => {
    el.dispatchEvent(
      new CustomEvent("action", { detail: { action }, bubbles: true, composed: true }),
    );
  };

  const onDown = (ev: Event) => {
    if (state.options.disabled) return;
    isHolding = false;
    if (state.options.hasHold) {
      pressTimer = window.setTimeout(() => {
        isHolding = true;
        fire("hold");
      }, HOLD_THRESHOLD_MS);
    }
    // Prevent text selection on long-press only on touch
    if (ev.type === "touchstart") ev.preventDefault?.();
  };

  const onUp = () => {
    if (state.options.disabled) return;
    if (pressTimer !== undefined) {
      window.clearTimeout(pressTimer);
      pressTimer = undefined;
    }
    if (isHolding) {
      isHolding = false;
      return;
    }
    if (state.options.hasDoubleClick) {
      const now = Date.now();
      if (now - lastTap < DOUBLE_TAP_WINDOW_MS) {
        if (pendingTapTimer !== undefined) {
          window.clearTimeout(pendingTapTimer);
          pendingTapTimer = undefined;
        }
        lastTap = 0;
        fire("double_tap");
        return;
      }
      lastTap = now;
      pendingTapTimer = window.setTimeout(() => {
        pendingTapTimer = undefined;
        fire("tap");
      }, DOUBLE_TAP_WINDOW_MS);
    } else {
      fire("tap");
    }
  };

  const onCancel = () => {
    if (pressTimer !== undefined) {
      window.clearTimeout(pressTimer);
      pressTimer = undefined;
    }
    isHolding = false;
  };

  el.addEventListener("mousedown", onDown);
  el.addEventListener("touchstart", onDown, { passive: false });
  el.addEventListener("mouseup", onUp);
  el.addEventListener("touchend", onUp);
  el.addEventListener("mouseleave", onCancel);
  el.addEventListener("touchcancel", onCancel);

  state.cleanup = () => {
    el.removeEventListener("mousedown", onDown);
    el.removeEventListener("touchstart", onDown);
    el.removeEventListener("mouseup", onUp);
    el.removeEventListener("touchend", onUp);
    el.removeEventListener("mouseleave", onCancel);
    el.removeEventListener("touchcancel", onCancel);
    if (pressTimer !== undefined) window.clearTimeout(pressTimer);
    if (pendingTapTimer !== undefined) window.clearTimeout(pendingTapTimer);
  };

  return state;
}

export const actionHandler = directive(ActionHandlerDirective);
