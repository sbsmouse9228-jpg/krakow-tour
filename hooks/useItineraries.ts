import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';
import type { Itinerary, ItineraryWithStops } from '@/types/database';

export function useItineraries() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('itineraries')
      .select('*')
      .order('created_at')
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message);
        else setItineraries(data ?? []);
        setLoading(false);
      });
  }, []);

  return { itineraries, loading, error };
}

export function useItineraryDetail(id: string) {
  const [itinerary, setItinerary] = useState<ItineraryWithStops | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('itineraries')
      .select('*, itinerary_stops(*, place:places(*))')
      .eq('id', id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message);
        else setItinerary(data as ItineraryWithStops);
        setLoading(false);
      });
  }, [id]);

  return { itinerary, loading, error };
}
