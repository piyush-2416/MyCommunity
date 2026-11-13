import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // refresh par check hone tak true

  // Page khulte hi cookie se pata karo ki login hai ya nahi
  useEffect(() => {
    let cancelled = false;
    client
      .get("/auth/me")
      .then((res) => {
        if (!cancelled) setUser(res.data.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await client.post("/auth/login", { email, password });
    setUser(res.data.user);
    return res.data.user;
  }, []);


const updateProfile = useCallback(async (data) => {
  const res = await client.put("/auth/me", data);
  setUser(res.data.user);
  return res.data.user;
}, []);
  const signup = useCallback(
    async (name, email, password, phone = "", role = "user", inviteCode = "") => {
      const res = await client.post("/auth/signup", {
        name,
        email,
        password,
        phone,
        role,
        inviteCode,
      });
      setUser(res.data.user);
      return res.data.user;
    },
    []
  );

  // Server ne logout kar diya (ya 401 diya) tabhi local logout hota hai
  const logout = useCallback(async () => {
    try {
      await client.post("/auth/logout");
    } catch (err) {
      if (err?.response?.status !== 401) throw err;
    }
    setUser(null);
  }, []);

  const value = useMemo(
  () => ({ user, loading, login, signup, logout, updateProfile }),
  [user, loading, login, signup, logout, updateProfile]
);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth ko AuthProvider ke andar use karo");
  return ctx;
}