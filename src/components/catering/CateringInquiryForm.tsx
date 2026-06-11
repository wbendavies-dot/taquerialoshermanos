"use client";

import { useMemo, useState } from "react";

/**
 * Demo-stage inquiry form: no backend yet, so the submit action is a
 * live mailto: link that opens the visitor's email app with everything
 * pre-filled for the real catering inbox. The Phase 4 server pipeline
 * (store + auto-confirm + alert) replaces only the submit target —
 * the fields already match what the kitchen needs to quote.
 */

const EVENT_TYPES = [
  "Office / corporate",
  "Wedding",
  "Quinceañera",
  "Birthday party",
  "School / church",
  "Other",
] as const;

export function CateringInquiryForm({
  email,
  minimumGuests,
}: {
  email: string;
  minimumGuests: number;
}) {
  const [eventType, setEventType] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const ready = eventType !== "" && date !== "" && guests !== "" && name !== "";

  const mailtoHref = useMemo(() => {
    const subject = `Catering inquiry — ${eventType || "event"} on ${date || "(date)"}`;
    const body = [
      `Name: ${name}`,
      `Event type: ${eventType}`,
      `Date: ${date}`,
      `Guest count: ${guests}`,
      notes ? `Notes: ${notes}` : "",
      "",
      "(Sent from the Los Hermanos catering page)",
    ]
      .filter(Boolean)
      .join("\n");
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [email, eventType, date, guests, name, notes]);

  const inputClass =
    "min-h-12 w-full rounded-md border border-cream-dark bg-white px-3 text-base";

  return (
    <form
      aria-labelledby="inquiry-heading"
      onSubmit={(event) => event.preventDefault()}
      className="mx-auto mt-8 max-w-xl rounded-xl border border-cream-dark bg-white p-6"
    >
      <h3 id="inquiry-heading" className="font-display text-xl">
        Tell us about your event
      </h3>
      <p className="mt-1 text-sm text-charcoal-soft">
        Takes about two minutes. We cater events of {minimumGuests} guests
        or more.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Event type</span>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            required
            className={inputClass}
          >
            <option value="" disabled>
              Choose…
            </option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Event date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Guest count</span>
          <input
            type="number"
            min={minimumGuests}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            required
            placeholder={`${minimumGuests} or more`}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Your name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className={inputClass}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1 block text-sm font-medium">
          Anything else? (menu ideas, dietary needs, delivery address)
        </span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className={`${inputClass} py-2`}
        />
      </label>

      {ready ? (
        <a
          href={mailtoHref}
          className="bg-cta mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-md font-semibold text-white transition-opacity duration-[var(--duration-micro)] hover:opacity-90"
        >
          Email us this inquiry
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="mt-6 inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-md bg-charcoal-soft/40 font-semibold text-white"
        >
          Email us this inquiry
        </button>
      )}
      <p className="mt-2 text-center text-xs text-charcoal-soft">
        Opens your email app with everything filled in — send it and
        we&rsquo;ll get back to you.
      </p>
    </form>
  );
}
