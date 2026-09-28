import { useCallback, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';
import type { Place, PlaceCategory } from '@/types/database';

export function usePlaces(categories?: PlaceCategory[]) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase.from('places').select('*').order('name');
    if (categories && categories.length > 0) {
      query = query.in('category', categories);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setPlaces(data ?? []);
    }
    setLoading(false);
  }, [categories?.join(',')]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  return { places, loading, error, refetch: fetchPlaces };
}
