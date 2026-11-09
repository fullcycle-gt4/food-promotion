import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { authService } from '../services';

const KEY = 'fp:user';
const AuthContext = createContext(null);

const read = () => {
  for (const s of [localStorage, sessionStorage]) {
    const v = s.getItem(KEY);
    if (v) {
      try {
        return { user: JSON.parse(v), remember: s === localStorage };
      } catch {
        /* ignora */
      }
    }
  }
  return { user: null, remember: true };
};

export function AuthProvider({ children }) {
  const initial = useRef(read());
  const remember = useRef(initial.current.remember);
  const [user, setUserState] = useState(initial.current.user);

  const save = useCallback((u) => {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
    if (u) (remember.current ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(u));
    setUserState(u);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAdmin: user?.role === 'admin',
      async login(email, password, keep = true) {
        const u = await authService.login(email, password);
        remember.current = keep;
        save(u);
        return u;
      },
      async register(data) {
        const u = await authService.register(data);
        remember.current = true;
        save(u);
        return u;
      },
      logout: () => save(null),
      setUser: save,
    }),
    [user, save],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
