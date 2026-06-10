import { getLocations } from "@/lib/content";
import { DAY_LABELS, formatTime } from "@/lib/hours";

/**
 * Interim homepage (Phase 0 skeleton): real brand, real NAP, real Toast
 * links — a shippable single page until the full DESIGN_SPEC homepage
 * lands in Phase 3.
 */
export default function HomePage() {
  const locations = getLocations();
  // All locations currently share one schedule; render from the first.
  const hours = locations[0]?.hours;

  return (
    <>
      <header className="bg-cream px-4 pt-12 pb-8 text-center sm:pt-16">
        <p className="text-sm tracking-widest uppercase text-terra-text">
          Taqueria · Est. 2001
        </p>
        <h1 className="font-display mt-2 text-[length:var(--text-display-xl)] leading-tight">
          Los Hermanos
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-charcoal-soft">
          Three brothers. One kitchen. Authentic Mexican food across metro
          Atlanta since 2001.
        </p>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16">
        <section aria-labelledby="locations-heading">
          <h2
            id="locations-heading"
            className="font-display text-center text-[length:var(--text-display-md)]"
          >
            Order from your taqueria
          </h2>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <li
                key={location.slug}
                className="flex flex-col rounded-lg border border-cream-dark bg-white p-5 shadow-sm"
              >
                <h3 className="font-display text-xl">{location.name}</h3>
                <address className="mt-2 text-sm not-italic leading-relaxed text-charcoal-soft">
                  {location.address.street}
                  <br />
                  {location.address.city}, {location.address.state}{" "}
                  {location.address.zip}
                </address>
                <a
                  className="mt-2 inline-block min-h-11 content-center text-sm font-medium text-terra-text underline-offset-2 hover:underline"
                  href={`tel:+1-${location.phone}`}
                >
                  {location.phone}
                </a>
                <a
                  className="bg-cta mt-auto inline-flex min-h-12 items-center justify-center rounded-md px-5 font-semibold text-white transition-opacity duration-[var(--duration-micro)] hover:opacity-90"
                  href={location.toastUrl}
                >
                  Order online
                  <span className="sr-only"> from {location.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {hours && (
          <section aria-labelledby="hours-heading" className="mt-14">
            <h2
              id="hours-heading"
              className="font-display text-center text-[length:var(--text-display-md)]"
            >
              Hours
            </h2>
            <table className="mx-auto mt-6 text-left">
              <tbody>
                {(
                  Object.entries(DAY_LABELS) as [
                    keyof typeof DAY_LABELS,
                    string,
                  ][]
                ).map(([key, label]) => {
                  const day = hours[key];
                  return (
                    <tr key={key}>
                      <th scope="row" className="pr-8 py-1 font-medium">
                        {label}
                      </th>
                      <td className="py-1 text-charcoal-soft">
                        {day
                          ? `${formatTime(day.open)} – ${formatTime(day.close)}`
                          : "Closed"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-3 text-center text-sm text-charcoal-soft">
              Hours may vary by location and on holidays.
            </p>
          </section>
        )}
      </main>

      <footer className="bg-charcoal px-4 py-10 text-cream">
        <div className="mx-auto max-w-5xl text-center text-sm leading-relaxed">
          <p className="font-display text-lg">Taqueria Los Hermanos</p>
          <p className="mt-2">
            Family-owned since 2001 · Tucker · Lilburn · Suwanee ·
            Lawrenceville · Dunwoody
          </p>
        </div>
      </footer>
    </>
  );
}
