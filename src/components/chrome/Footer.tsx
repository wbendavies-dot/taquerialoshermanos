import { getLocations, getSiteSettings } from "@/lib/content";
import { telHref } from "@/lib/links";

/** Server component. NAP rendered only from the locations collection. */
export function Footer() {
  const locations = getLocations();
  const site = getSiteSettings();

  return (
    <footer className="bg-charcoal px-4 py-12 text-cream">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="font-display text-xl">Taqueria Los Hermanos</p>
          <p className="mt-1 text-sm text-cream/80">
            Family-owned · Est. 2001 · Metro Atlanta
          </p>
        </div>

        <ul className="mt-10 grid gap-8 text-sm sm:grid-cols-2 lg:grid-cols-5">
          {locations.map((location) => (
            <li key={location.slug}>
              <h2 className="font-display text-base">{location.name}</h2>
              <address className="mt-2 not-italic leading-relaxed text-cream/80">
                {location.address.street}
                <br />
                {location.address.city}, {location.address.state}{" "}
                {location.address.zip}
              </address>
              <a
                href={telHref(location)}
                className="mt-1 inline-block min-h-11 content-center underline-offset-2 hover:underline"
              >
                {location.phone}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-cream/20 pt-6 text-sm text-cream/80">
          <a
            href={site.instagramUrl}
            rel="noopener"
            className="min-h-11 content-center underline-offset-2 hover:underline"
          >
            Instagram · @taquerialoshermanos
          </a>
          <p>© {new Date().getFullYear()} Taqueria Los Hermanos</p>
        </div>
      </div>
    </footer>
  );
}
