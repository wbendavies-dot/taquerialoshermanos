import Link from "next/link";

import { getSiteSettings } from "@/lib/content";

/**
 * Server component. Renders nothing unless a real, unexpired announcement
 * exists in site.json — no invented promos (CLAUDE.md). Expiry is
 * evaluated at build time; rebuilds happen at least daily in production.
 */
export function AnnouncementBar() {
  const { announcement } = getSiteSettings();
  if (!announcement) return null;

  const today = new Date().toISOString().slice(0, 10);
  if (announcement.expiresOn < today) return null;

  const content = (
    <p className="mx-auto max-w-5xl px-4 py-2 text-center text-sm font-medium">
      {announcement.message}
    </p>
  );

  return (
    <div className="bg-terra text-white">
      {announcement.href ? (
        <Link href={announcement.href} className="block hover:underline">
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
}
