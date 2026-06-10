import type { Location } from "@/content/schema";

/** `tel:` href in E.164-ish form for US numbers. */
export function telHref(location: Location): string {
  return `tel:+1-${location.phone}`;
}

/** Google Maps directions deep link from the canonical address. */
export function directionsHref(location: Location): string {
  const { street, city, state, zip } = location.address;
  const destination = encodeURIComponent(
    `Taqueria Los Hermanos, ${street}, ${city}, ${state} ${zip}`,
  );
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}
