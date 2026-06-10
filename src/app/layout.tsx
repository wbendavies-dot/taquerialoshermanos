import type { Metadata } from "next";
import { Alfa_Slab_One, Inter } from "next/font/google";

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
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
