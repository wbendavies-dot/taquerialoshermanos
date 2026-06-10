"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Location } from "@/content/schema";

const STORAGE_KEY = "lh-location";

/**
 * "order"  — picking a location navigates to its Toast ordering page.
 * "choose" — picking a location only remembers it (Call/Directions flow).
 */
export type LocationDialogMode = "order" | "choose" | null;

interface SiteState {
  locations: Location[];
  /** The remembered location, if the visitor has chosen one. */
  selected: Location | null;
  selectLocation: (slug: string) => void;
  dialogMode: LocationDialogMode;
  openDialog: (mode: Exclude<LocationDialogMode, null>) => void;
  closeDialog: () => void;
}

const SiteStateContext = createContext<SiteState | null>(null);

export function SiteStateProvider({
  locations,
  children,
}: {
  locations: Location[];
  children: React.ReactNode;
}) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<LocationDialogMode>(null);

  // Hydrate the remembered location after mount (SSR renders the
  // no-selection state, so markup matches on first paint).
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && locations.some((l) => l.slug === stored)) {
      setSelectedSlug(stored);
    }
  }, [locations]);

  const selectLocation = useCallback(
    (slug: string) => {
      if (!locations.some((l) => l.slug === slug)) return;
      setSelectedSlug(slug);
      window.localStorage.setItem(STORAGE_KEY, slug);
    },
    [locations],
  );

  const openDialog = useCallback(
    (mode: Exclude<LocationDialogMode, null>) => setDialogMode(mode),
    [],
  );
  const closeDialog = useCallback(() => setDialogMode(null), []);

  const value = useMemo<SiteState>(
    () => ({
      locations,
      selected: locations.find((l) => l.slug === selectedSlug) ?? null,
      selectLocation,
      dialogMode,
      openDialog,
      closeDialog,
    }),
    [locations, selectedSlug, selectLocation, dialogMode, openDialog, closeDialog],
  );

  return (
    <SiteStateContext.Provider value={value}>
      {children}
    </SiteStateContext.Provider>
  );
}

export function useSiteState(): SiteState {
  const context = useContext(SiteStateContext);
  if (!context) {
    throw new Error("useSiteState must be used within SiteStateProvider");
  }
  return context;
}
