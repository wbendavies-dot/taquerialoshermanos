import type { DayHours, HolidayOverride, WeeklyHours } from "@/content/schema";

export const RESTAURANT_TIME_ZONE = "America/New_York";

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
type DayKey = (typeof DAY_KEYS)[number];

interface LocalClock {
  /** YYYY-MM-DD in restaurant-local time. */
  date: string;
  day: DayKey;
  /** Minutes since local midnight. */
  minutes: number;
}

export interface OpenStatus {
  isOpen: boolean;
  /** "HH:MM" local close time when open. */
  closesAt?: string;
  /** Next opening when closed, e.g. { day: "mon", time: "11:00" }. */
  opensNext?: { day: DayKey; time: string; isToday: boolean };
}

function toMinutes(time: string): number {
  const [h = 0, m = 0] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Resolve the restaurant-local date, weekday, and time for a UTC instant. */
export function localClock(now: Date): LocalClock {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: RESTAURANT_TIME_ZONE,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((p) => p.type === type)?.value ?? "";

  const day = get("weekday").slice(0, 3).toLowerCase() as DayKey;
  // Intl can emit "24" for midnight with hour12: false; normalize to 0.
  const hour = Number(get("hour")) % 24;

  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    day,
    minutes: hour * 60 + Number(get("minute")),
  };
}

function hoursForDate(
  hours: WeeklyHours,
  overrides: HolidayOverride[],
  date: string,
  day: DayKey,
): DayHours {
  const override = overrides.find((o) => o.date === date);
  if (override !== undefined) {
    return override.hours;
  }
  return hours[day];
}

/**
 * Open/closed status for a location at a given instant. Pure function of
 * its inputs so boundary times are unit-testable with fixed dates.
 */
export function getOpenStatus(
  hours: WeeklyHours,
  overrides: HolidayOverride[],
  now: Date,
): OpenStatus {
  const clock = localClock(now);
  const today = hoursForDate(hours, overrides, clock.date, clock.day);

  if (
    today !== null &&
    clock.minutes >= toMinutes(today.open) &&
    clock.minutes < toMinutes(today.close)
  ) {
    return { isOpen: true, closesAt: today.close };
  }

  // Opens later today?
  if (today !== null && clock.minutes < toMinutes(today.open)) {
    return {
      isOpen: false,
      opensNext: { day: clock.day, time: today.open, isToday: true },
    };
  }

  // Scan forward up to a week for the next open day (override-aware).
  const todayIndex = DAY_KEYS.indexOf(clock.day);
  for (let offset = 1; offset <= 7; offset++) {
    const nextDay = DAY_KEYS[(todayIndex + offset) % 7] as DayKey;
    const nextDate = addDays(clock.date, offset);
    const nextHours = hoursForDate(hours, overrides, nextDate, nextDay);
    if (nextHours !== null) {
      return {
        isOpen: false,
        opensNext: { day: nextDay, time: nextHours.open, isToday: false },
      };
    }
  }

  return { isOpen: false };
}

/** Add days to a YYYY-MM-DD string without timezone drift. */
function addDays(date: string, days: number): string {
  const [y = 0, m = 1, d = 1] = date.split("-").map(Number);
  const result = new Date(Date.UTC(y, m - 1, d + days));
  return result.toISOString().slice(0, 10);
}

/** "21:00" -> "9:00 PM" for display. */
export function formatTime(time: string): string {
  const minutes = toMinutes(time);
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export const DAY_LABELS: Record<DayKey, string> = {
  sun: "Sunday",
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
};
