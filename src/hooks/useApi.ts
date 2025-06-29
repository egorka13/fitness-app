import { Session } from '@supabase/supabase-js';
import { useState, useCallback } from 'react';

interface FetchOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export function useApi(
  session: Session | null,
  baseUrl = process.env.REACT_APP_BACKEND_URL
) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(
    async (url: string, options?: FetchOptions) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(baseUrl + url, {
          method: options?.method ?? 'GET',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
            ...(options?.headers ?? {}),
          },
          body: options?.body ? JSON.stringify(options.body) : undefined,
        });

        if (!res.ok) {
          const err = await res.json();
          throw err;
        }

        const json = await res.json();
        setData(json);
        return json;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [baseUrl]
  );

  const get = useCallback((url: string) => fetchData(url), [fetchData]);

  const post = useCallback(
    (url: string, body: any) => fetchData(url, { method: 'POST', body }),
    [fetchData]
  );

  const put = useCallback(
    (url: string, body: any) => fetchData(url, { method: 'PUT', body }),
    [fetchData]
  );

  const del = useCallback(
    (url: string) => fetchData(url, { method: 'DELETE' }),
    [fetchData]
  );

  return { data, error, loading, get, post, put, del };
}
