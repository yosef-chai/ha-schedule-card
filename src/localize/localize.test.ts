import { describe, it, expect } from "vitest";
import { t, pickLang } from "./index";
import type { HomeAssistant } from "../types";

const mkHass = (lang: string): HomeAssistant =>
  ({ language: lang, locale: { language: lang } }) as HomeAssistant;

describe("pickLang", () => {
  it("resolves English by default", () => {
    expect(pickLang(undefined)).toBe("en");
    expect(pickLang(mkHass("en"))).toBe("en");
  });

  it("resolves Hebrew", () => {
    expect(pickLang(mkHass("he"))).toBe("he");
    expect(pickLang(mkHass("he-IL"))).toBe("he");
    expect(pickLang(mkHass("iw"))).toBe("he");
  });

  it("falls back to English for unknown languages", () => {
    expect(pickLang(mkHass("de"))).toBe("en");
    expect(pickLang(mkHass("ja-JP"))).toBe("en");
  });
});

describe("t", () => {
  it("translates English keys", () => {
    expect(t(mkHass("en"), "common.on")).toBe("On");
    expect(t(mkHass("en"), "view.daily")).toBe("Daily");
  });

  it("translates Hebrew keys", () => {
    expect(t(mkHass("he"), "common.on")).toBe("פעיל");
    expect(t(mkHass("he"), "view.daily")).toBe("יומית");
  });

  it("handles placeholders", () => {
    expect(t(mkHass("en"), "header.until", { time: "22:00" })).toBe("Until 22:00");
    expect(t(mkHass("he"), "header.until", { time: "22:00" })).toBe("עד 22:00");
  });

  it("falls back to English on missing key in non-default lang", () => {
    // forcing a missing-key path — both langs lack this; we should get the key back
    expect(t(mkHass("he"), "totally.nonexistent.key")).toBe("totally.nonexistent.key");
  });

  it("uses fallback string when supplied", () => {
    expect(t(mkHass("en"), "totally.nonexistent.key", undefined, "fallback")).toBe("fallback");
  });
});
