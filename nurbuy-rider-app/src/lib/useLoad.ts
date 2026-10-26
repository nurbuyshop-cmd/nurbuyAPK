import { useCallback, useEffect, useRef, useState } from 'react';

type St<T> = { key: string; data?: T; error?: unknown };

/**
 * Loads data for a page once per key. Keeps the last data while reloading and on errors (like the website),
 * so a failed background refresh never blanks the page. reload() is for pull-to-refresh, retry and polling.
 */
export function useLoad<T>(key: string, fn: () => Promise<T>) {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });
  const [st, setSt] = useState<St<T>>({ key });

  useEffect(() => {
    let live = true;
    fnRef.current().then(
      (data) => {
        if (live) setSt({ key, data });
      },
      (error: unknown) => {
        if (live) setSt((s) => ({ key, data: s.key === key ? s.data : undefined, error }));
      },
    );
    return () => {
      live = false;
    };
  }, [key]);

  const reload = useCallback(async () => {
    try {
      const data = await fnRef.current();
      setSt({ key, data });
    } catch (error) {
      setSt((s) => ({ key, data: s.key === key ? s.data : undefined, error }));
    }
  }, [key]);

  const setData = useCallback((data: T) => setSt({ key, data }), [key]);

  const same = st.key === key;
  return { data: same ? st.data : undefined, error: same ? st.error : undefined, reload, setData };
}
