import { entries } from "remeda";

// Grid size and spacing as the area a customer would recognize. The width is
// (gridSize - 1) × spacing, and each point is one paid search per keyword.
export const LOCAL_AREAS = {
  neighborhood: {
    gridSize: 3,
    spacingKm: 1,
  },
  town: { gridSize: 3, spacingKm: 2 },
  city: { gridSize: 5, spacingKm: 2 },
  metro: {
    gridSize: 5,
    spacingKm: 5,
  },
} as const;
export type LocalArea = keyof typeof LOCAL_AREAS;

export function localAreaItems(t: (key: string) => string) {
  return entries(LOCAL_AREAS).map(([value]) => ({
    value,
    label: t(`local_seo.area_${value}`),
  }));
}

/** The area a tracker's grid matches, or null for a grid saved before areas
 *  replaced free-form grid settings. */
export function localAreaOf(grid: { gridSize: number; spacingKm: number }) {
  return (
    entries(LOCAL_AREAS).find(
      ([, area]) =>
        area.gridSize === grid.gridSize && area.spacingKm === grid.spacingKm,
    )?.[0] ?? null
  );
}
