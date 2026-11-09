import { useCallback, useEffect, useState } from 'react';

// Executa uma função assíncrona e expõe { data, loading, error, reload, setData }
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);

  const reload = useCallback(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    run()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, loading: false, error }));
    return () => {
      alive = false;
    };
  }, [run]);

  useEffect(() => reload(), [reload]);

  const setData = useCallback(
    (u) => setState((s) => ({ ...s, data: typeof u === 'function' ? u(s.data) : u })),
    [],
  );

  return { ...state, reload, setData };
}
