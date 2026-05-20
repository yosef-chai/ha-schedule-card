import { describe, it, expect } from "vitest";
import {
  parseTimeToMinutes,
  minutesToPercent,
  isActiveAt,
  mergeAdjacentBlocks,
  minutesToHHMM,
  trimToHHMM,
  resolveBlock,
  nextTransitionMinutes,
} from "./time";

describe("parseTimeToMinutes", () => {
  it("handles HH:MM:SS", () => {
    expect(parseTimeToMinutes("00:00:00")).toBe(0);
    expect(parseTimeToMinutes("09:30:00")).toBe(9 * 60 + 30);
    expect(parseTimeToMinutes("23:59:00")).toBe(23 * 60 + 59);
  });

  it("treats 24:00:00 as end-of-day", () => {
    expect(parseTimeToMinutes("24:00:00")).toBe(24 * 60);
    expect(parseTimeToMinutes("24:00")).toBe(24 * 60);
  });

  it("handles HH:MM (no seconds)", () => {
    expect(parseTimeToMinutes("06:00")).toBe(360);
  });

  it("clamps invalid inputs", () => {
    expect(parseTimeToMinutes("")).toBe(0);
    expect(parseTimeToMinutes("garbage")).toBe(0);
  });
});

describe("minutesToPercent", () => {
  it("maps endpoints", () => {
    expect(minutesToPercent(0)).toBe(0);
    expect(minutesToPercent(1440)).toBe(100);
    expect(minutesToPercent(720)).toBe(50);
  });
});

describe("isActiveAt", () => {
  const blocks = [
    { from: "06:00:00", to: "09:00:00" },
    { from: "12:30:00", to: "17:30:00" },
  ];

  it("is true inside a block", () => {
    expect(isActiveAt(blocks, new Date(2026, 4, 20, 7, 0))).toBe(true);
    expect(isActiveAt(blocks, new Date(2026, 4, 20, 14, 15))).toBe(true);
  });

  it("is false outside any block", () => {
    expect(isActiveAt(blocks, new Date(2026, 4, 20, 5, 0))).toBe(false);
    expect(isActiveAt(blocks, new Date(2026, 4, 20, 12, 0))).toBe(false);
  });

  it("respects exclusive end", () => {
    expect(isActiveAt(blocks, new Date(2026, 4, 20, 9, 0))).toBe(false);
    expect(isActiveAt(blocks, new Date(2026, 4, 20, 17, 30))).toBe(false);
  });

  it("returns false for empty blocks", () => {
    expect(isActiveAt([], new Date())).toBe(false);
    expect(isActiveAt(undefined, new Date())).toBe(false);
  });
});

describe("mergeAdjacentBlocks", () => {
  it("merges touching blocks (10-12 + 12-14 → 10-14)", () => {
    const merged = mergeAdjacentBlocks([
      { from: "10:00:00", to: "12:00:00" },
      { from: "12:00:00", to: "14:00:00" },
    ]);
    expect(merged).toHaveLength(1);
    expect(merged[0]!.from).toBe("10:00:00");
    expect(merged[0]!.to).toBe("14:00:00");
  });

  it("keeps non-touching blocks separate", () => {
    const merged = mergeAdjacentBlocks([
      { from: "06:00:00", to: "09:00:00" },
      { from: "12:30:00", to: "17:30:00" },
    ]);
    expect(merged).toHaveLength(2);
  });

  it("sorts unordered input", () => {
    const merged = mergeAdjacentBlocks([
      { from: "20:00:00", to: "22:00:00" },
      { from: "06:00:00", to: "09:00:00" },
    ]);
    expect(merged[0]!.from).toBe("06:00:00");
    expect(merged[1]!.from).toBe("20:00:00");
  });

  it("handles 24:00:00 end-of-day marker", () => {
    const merged = mergeAdjacentBlocks([{ from: "22:00:00", to: "24:00:00" }]);
    expect(merged[0]!.to).toBe("24:00:00");
  });

  it("returns [] for empty input", () => {
    expect(mergeAdjacentBlocks([])).toEqual([]);
  });
});

describe("minutesToHHMM / trimToHHMM", () => {
  it("pads with zeros", () => {
    expect(minutesToHHMM(0)).toBe("00:00");
    expect(minutesToHHMM(65)).toBe("01:05");
    expect(minutesToHHMM(1440)).toBe("24:00");
  });

  it("strips seconds", () => {
    expect(trimToHHMM("09:30:00")).toBe("09:30");
    expect(trimToHHMM("24:00:00")).toBe("24:00");
  });
});

describe("resolveBlock", () => {
  it("computes percentages correctly", () => {
    const r = resolveBlock({ from: "06:00:00", to: "12:00:00" });
    expect(r.leftPct).toBe(25);
    expect(r.widthPct).toBe(25);
    expect(r.fromLabel).toBe("06:00");
    expect(r.toLabel).toBe("12:00");
  });

  it("handles end-of-day", () => {
    const r = resolveBlock({ from: "22:00:00", to: "24:00:00" });
    expect(r.widthPct).toBeCloseTo((2 / 24) * 100);
    expect(r.toLabel).toBe("24:00");
  });
});

describe("nextTransitionMinutes", () => {
  const blocks = [
    { from: "06:00:00", to: "09:00:00" },
    { from: "18:00:00", to: "22:00:00" },
  ];

  it("returns end-of-current-block when inside one", () => {
    const r = nextTransitionMinutes(blocks, 7 * 60);
    expect(r).toEqual({ atMin: 9 * 60, active: false });
  });

  it("returns start-of-next-block when outside", () => {
    const r = nextTransitionMinutes(blocks, 10 * 60);
    expect(r).toEqual({ atMin: 18 * 60, active: true });
  });

  it("returns null when no future transitions", () => {
    const r = nextTransitionMinutes(blocks, 23 * 60);
    expect(r).toBeNull();
  });

  it("returns null for empty blocks", () => {
    expect(nextTransitionMinutes(undefined, 0)).toBeNull();
    expect(nextTransitionMinutes([], 0)).toBeNull();
  });
});
