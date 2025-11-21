import { createContext, useContext, useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "https://custody-guardian-backend.onrender.com";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("cg_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("cg_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const persistSession = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    if (nextToken) {
      localStorage.setItem("cg_token", nextToken);
      localStorage.setItem("cg_user", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("cg_token");
      localStorage.removeItem("cg_user");
    }
  };

  const request = async (path, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }
    return data;
  };

  const login = async (credentials) => {
    setLoading(true);
    setError("");
    try {
      const data = await request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      persistSession(data.token, data.user);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerCitizen = async (payload) => {
    setLoading(true);
    setError("");
    try {
      const data = await request("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      persistSession(data.token, data.user);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => persistSession(null, null);

  useEffect(() => {
    setError("");
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      login,
      logout,
      registerCitizen,
      request,
    }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

