import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/auth.service";
import { setHttpAuthToken } from "../services/http";
import { AuthUser, LoginPayload, RegisterPayload } from "../types/auth";

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isLoadingAuth: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const TOKEN_KEY = "smart_leads_token";

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  const persistToken = useCallback((nextToken: string | null) => {
    setToken(nextToken);
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
      return;
    }
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  useEffect(() => {
    setHttpAuthToken(token);
    if (!token) {
      setUser(null);
      setIsLoadingAuth(false);
      return;
    }

    let active = true;
    setIsLoadingAuth(true);

    authService
      .getMe()
      .then((nextUser) => {
        if (active) {
          setUser(nextUser);
        }
      })
      .catch(() => {
        if (active) {
          persistToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoadingAuth(false);
        }
      });

    return () => {
      active = false;
    };
  }, [persistToken, token]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const result = await authService.login(payload);
      persistToken(result.token);
      setUser(result.user);
      setHttpAuthToken(result.token);
    },
    [persistToken],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const result = await authService.register(payload);
      persistToken(result.token);
      setUser(result.user);
      setHttpAuthToken(result.token);
    },
    [persistToken],
  );

  const logout = useCallback(() => {
    persistToken(null);
    setUser(null);
    setHttpAuthToken(null);
  }, [persistToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isLoadingAuth,
      login,
      register,
      logout,
    }),
    [isLoadingAuth, login, logout, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

