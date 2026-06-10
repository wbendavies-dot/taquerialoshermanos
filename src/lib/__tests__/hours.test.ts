import { describe, expect, it } from "vitest";

import type { WeeklyHours } from "@/content/schema";
import { formatTime, getOpenStatus, localClock } from "@/lib/hours";

/** Standard Los Hermanos week. */
const week: WeeklyHours = {
  sun: { open: "11:30", close: "21:00" },
  mon: { open: "11:00", close: "21:00" },
  tue: { open: "11:00", close: "21:00" },
  wed: { open: "11:00", close: "21:00" },
  thu: { open: "11:00", close: "21:00" },
  fri: { open: "11:00", close: "22:00" },
  sat: { open: "11:00", close: "22:00" },
};

/** Build a UTC Date for an Eastern local time (June = EDT = UTC-4). */
function edt(date: string, time: string): Date {
  return new Date(`${date}T${time}:00-04:00`);
}
/** January = EST = UTC-5. */
function est(date: string, time: string): Date {
  return new Date(`${date}T${time}:00-05:00`);
}

describe("localClock", () => {
  it("resolves Eastern weekday/time during daylight saving", () => {
    // 2026-06-10 is a Wednesday.
    const clock = localClock(edt("2026-06-10", "13:30"));
    expect(clock).toEqual({ date: "2026-06-10", day: "wed", minutes: 810 });
  });

  it("resolves Eastern weekday/time during standard time", () => {
    // 2026-01-05 is a Monday.
    const clock = localClock(est("2026-01-05", "08:15"));
    expect(clock).toEqual({ date: "2026-01-05", day: "mon", minutes: 495 });
  });

  it("normalizes midnight to 0 minutes", () => {
    const clock = localClock(edt("2026-06-10", "00:00"));
    expect(clock.minutes).toBe(0);
  });
});

describe("getOpenStatus boundaries", () => {
  it("is open exactly at opening time", () => {
    const status = getOpenStatus(week, [], edt("2026-06-10", "11:00"));
    expect(status).toEqual({ isOpen: true, closesAt: "21:00" });
  });

  it("is closed one minute before opening, opening later today", () => {
    const status = getOpenStatus(week, [], edt("2026-06-10", "10:59"));
    expect(status.isOpen).toBe(false);
    expect(status.opensNext).toEqual({
      day: "wed",
      time: "11:00",
      isToday: true,
    });
  });

  it("is closed exactly at closing time, next opening tomorrow", () => {
    const status = getOpenStatus(week, [], edt("2026-06-10", "21:00"));
    expect(status.isOpen).toBe(false);
    expect(status.opensNext).toEqual({
      day: "thu",
      time: "11:00",
      isToday: false,
    });
  });

  it("uses Friday late close", () => {
    // 2026-06-12 is a Friday.
    const status = getOpenStatus(week, [], edt("2026-06-12", "21:30"));
    expect(status).toEqual({ isOpen: true, closesAt: "22:00" });
  });

  it("uses Sunday late open", () => {
    // 2026-06-14 is a Sunday.
    const status = getOpenStatus(week, [], edt("2026-06-14", "11:15"));
    expect(status.isOpen).toBe(false);
    expect(status.opensNext?.time).toBe("11:30");
  });
});

describe("getOpenStatus holiday overrides", () => {
  it("treats an override closure as closed all day", () => {
    const status = getOpenStatus(
      week,
      [{ date: "2026-12-25", label: "Christmas Day", hours: null }],
      est("2026-12-25", "13:00"),
    );
    expect(status.isOpen).toBe(false);
  });

  it("uses override hours instead of weekly hours", () => {
    const status = getOpenStatus(
      week,
      [
        {
          date: "2026-12-24",
          label: "Christmas Eve",
          hours: { open: "11:00", close: "15:00" },
        },
      ],
      est("2026-12-24", "16:00"),
    );
    expect(status.isOpen).toBe(false);
  });

  it("skips an overridden closure when finding the next opening", () => {
    // 2026-12-24 8pm, Christmas Day closed -> next open Dec 26.
    const status = getOpenStatus(
      week,
      [{ date: "2026-12-25", label: "Christmas Day", hours: null }],
      est("2026-12-24", "22:00"),
    );
    expect(status.isOpen).toBe(false);
    expect(status.opensNext?.day).toBe("sat");
  });
});

describe("formatTime", () => {
  it("formats 24h times for display", () => {
    expect(formatTime("11:00")).toBe("11:00 AM");
    expect(formatTime("11:30")).toBe("11:30 AM");
    expect(formatTime("21:00")).toBe("9:00 PM");
    expect(formatTime("00:15")).toBe("12:15 AM");
    expect(formatTime("12:00")).toBe("12:00 PM");
  });
});
