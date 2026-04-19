import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { verifyToken, isLoggedIn, logout as apiLogout, getStoredUser, login as apiLogin, register as apiRegister } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn()) {
      verifyToken()
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            localStorage.setItem("gain-live-user", JSON.stringify(data.user));
          }
        })
        .catch(() => {
          apiLogout();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (payload) => {
    const data = await apiLogin(payload);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (form) => {
    const data = await apiRegister(form);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user && isLoggedIn(),
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
