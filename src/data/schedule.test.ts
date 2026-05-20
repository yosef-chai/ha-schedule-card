import { describe, it, expect, vi } from "vitest";
import { getSchedule } from "./schedule";
import type { HomeAssistant, WeeklyBlocks } from "../types";

const emptyWeek = (): WeeklyBlocks => ({
  sunday: [],
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
});

const mkHass = (
  callService: ReturnType<typeof vi.fn>,
  states: Record<string, { attributes: Record<string, unknown> }> = {},
): HomeAssistant => ({ callService, states }) as unknown as HomeAssistant;

describe("getSchedule", () => {
  it("calls hass.callService with the correct 6 arguments", async () => {
    const cs = vi.fn().mockResolvedValue({ response: { "schedule.foo": emptyWeek() } });
    await getSchedule(mkHass(cs), "schedule.foo");
    expect(cs).toHaveBeenCalledOnce();
    expect(cs).toHaveBeenCalledWith(
      "schedule",
      "get_schedule",
      undefined,
      { entity_id: "schedule.foo" },
      false,
      true,
    );
  });

  it("maps a wrapped response to a Schedule with the correct days", async () => {
    const week: WeeklyBlocks = {
      ...emptyWeek(),
      monday: [{ from: "08:00:00", to: "10:00:00" }],
      friday: [{ from: "20:00:00", to: "23:00:00" }],
    };
    const cs = vi.fn().mockResolvedValue({ response: { "schedule.x": week } });
    const s = await getSchedule(mkHass(cs), "schedule.x");
    expect(s.entity_id).toBe("schedule.x");
    expect(s.monday).toEqual([{ from: "08:00:00", to: "10:00:00" }]);
    expect(s.friday).toEqual([{ from: "20:00:00", to: "23:00:00" }]);
    expect(s.sunday).toEqual([]);
  });

  it("pulls name and icon from hass.states[entity].attributes", async () => {
    const cs = vi.fn().mockResolvedValue({ response: { "schedule.x": emptyWeek() } });
    const hass = mkHass(cs, {
      "schedule.x": { attributes: { friendly_name: "Morning Lights", icon: "mdi:lamp" } },
    });
    const s = await getSchedule(hass, "schedule.x");
    expect(s.name).toBe("Morning Lights");
    expect(s.icon).toBe("mdi:lamp");
  });

  it("throws entity_not_in_response when the response does not contain the entity", async () => {
    const cs = vi.fn().mockResolvedValue({ response: {} });
    await expect(getSchedule(mkHass(cs), "schedule.missing")).rejects.toThrow(
      "entity_not_in_response",
    );
  });

  it("propagates underlying WebSocket errors", async () => {
    const cs = vi.fn().mockRejectedValue(new Error("connection lost"));
    await expect(getSchedule(mkHass(cs), "schedule.x")).rejects.toThrow("connection lost");
  });

  it("accepts an unwrapped response shape (no .response envelope)", async () => {
    const week: WeeklyBlocks = { ...emptyWeek(), tuesday: [{ from: "06:00:00", to: "07:00:00" }] };
    const cs = vi.fn().mockResolvedValue({ "schedule.x": week });
    const s = await getSchedule(mkHass(cs), "schedule.x");
    expect(s.tuesday).toEqual([{ from: "06:00:00", to: "07:00:00" }]);
  });

  it("defaults missing weekday entries to empty arrays", async () => {
    const cs = vi.fn().mockResolvedValue({
      response: { "schedule.x": { monday: [{ from: "08:00:00", to: "10:00:00" }] } },
    });
    const s = await getSchedule(mkHass(cs), "schedule.x");
    expect(s.tuesday).toEqual([]);
    expect(s.sunday).toEqual([]);
  });
});
