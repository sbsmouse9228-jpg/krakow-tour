import type { Place, PlaceCategory } from '@/types/database';

export function filterPlaces(
  places: Place[],
  query: string,
  category: PlaceCategory | 'all',
): Place[] {
  const normalizedQuery = query.trim().toLowerCase();

  return places.filter((place) => {
    if (category !== 'all' && place.category !== category) return false;
    if (!normalizedQuery) return true;

    const haystack = [place.name, place.name_local, place.address, ...(place.tags ?? [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}
