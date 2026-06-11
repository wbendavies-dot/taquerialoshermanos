"use client";

import { useEffect, useState } from "react";

import type { HolidayOverride, WeeklyHours } from "@/content/schema";
import { formatTime, getOpenStatus, type OpenStatus } from "@/lib/hours";

/**
 * Live open/closed status. Renders an empty reserved slot on the server
 * (build-time status would be stale and cause hydration mismatches) and
 * fills in after mount, re-checking each minute.
 */
export function OpenBadge({
  hours,
  overrides,
}: {
  hours: WeeklyHours;
  overrides: HolidayOverride[];
}) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus(hours, overrides, new Date()));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [hours, overrides]);

  return (
    <p className="min-h-5 text-sm" aria-live="off">
      {status?.isOpen && status.closesAt && (
        <>
          <span className="font-semibold text-terra-text">● Open</span>
          <span className="text-charcoal-soft">
            {" "}
            · closes {formatTime(status.closesAt)}
          </span>
        </>
      )}
      {status && !status.isOpen && (
        <>
          <span className="font-semibold text-charcoal-soft">○ Closed</span>
          {status.opensNext && (
            <span className="text-charcoal-soft">
              {" "}
              · opens {status.opensNext.isToday ? "today" : "next"} at{" "}
              {formatTime(status.opensNext.time)}
            </span>
          )}
        </>
      )}
    </p>
  );
}
