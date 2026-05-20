import { describe, it, expect } from "vitest";
import { isRTL, direction } from "./rtl";
import type { HomeAssistant } from "../types";

const mkHass = (lang: string, opts: Partial<HomeAssistant> = {}): HomeAssistant =>
  ({
    language: lang,
    locale: { language: lang } as any,
    ...opts,
  }) as HomeAssistant;

describe("isRTL", () => {
  it("detects Hebrew", () => {
    expect(isRTL(mkHass("he"))).toBe(true);
    expect(isRTL(mkHass("he-IL"))).toBe(true);
    expect(isRTL(mkHass("iw"))).toBe(true);
  });

  it("detects Arabic", () => {
    expect(isRTL(mkHass("ar"))).toBe(true);
    expect(isRTL(mkHass("ar-SA"))).toBe(true);
  });

  it("returns false for LTR languages", () => {
    expect(isRTL(mkHass("en"))).toBe(false);
    expect(isRTL(mkHass("de"))).toBe(false);
    expect(isRTL(mkHass("ja-JP"))).toBe(false);
  });

  it("falls back to false when hass is missing", () => {
    expect(isRTL(undefined)).toBe(false);
  });

  it("respects HA translation metadata when present", () => {
    const hass = mkHass("xx", {
      translationMetadata: { translations: { xx: { isRTL: true } } },
    } as any);
    expect(isRTL(hass)).toBe(true);
  });
});

describe("direction", () => {
  it("returns 'rtl' or 'ltr'", () => {
    expect(direction(mkHass("he"))).toBe("rtl");
    expect(direction(mkHass("en"))).toBe("ltr");
  });
});
