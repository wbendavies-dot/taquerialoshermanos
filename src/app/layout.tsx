import type { Metadata } from "next";
import { Alfa_Slab_One, Inter } from "next/font/google";

import { AnnouncementBar } from "@/components/chrome/AnnouncementBar";
import { BottomBar } from "@/components/chrome/BottomBar";
import { Footer } from "@/components/chrome/Footer";
import { Header } from "@/components/chrome/Header";
import { LocationDialog } from "@/components/chrome/LocationDialog";
import { SiteStateProvider } from "@/components/chrome/site-state";
import { getLocations } from "@/lib/content";

import "./globals.css";

/*
 * Interim brand faces (CLAUDE.md: display for headlines only, humanist sans
 * for UI/prices). Final commissioned display face may replace Alfa Slab One;
 * swap happens here and nowhere else.
 */
const display = Alfa_Slab_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-face",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.taquerialoshermanos.com"),
  title: "Authentic Mexican Food | Taqueria Los Hermanos | Metro Atlanta, GA",
  description:
    "Family-owned taqueria serving authentic Mexican food since 2001. Five locations across metro Atlanta: Tucker, Lilburn, Suwanee, Lawrenceville & Dunwoody. Order online for pickup.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locations = getLocations();

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <SiteStateProvider locations={locations}>
          <AnnouncementBar />
          <Header />
          {children}
          <Footer />
          <BottomBar />
          <LocationDialog />
        </SiteStateProvider>
      </body>
    </html>
  );
}
