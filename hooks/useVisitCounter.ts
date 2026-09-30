import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

export function useVisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    supabase.rpc('increment_visit_count').then(({ data, error }) => {
      if (!error && typeof data === 'number') setCount(data);
    });
  }, []);

  return count;
}
