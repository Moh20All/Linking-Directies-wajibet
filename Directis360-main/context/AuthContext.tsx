"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import {
  login as loginApi,
  logout as logoutApi,
  handshake,
  SchoolType,
} from "@/services/authService";

interface AuthContextType {
  accessToken: string | null;
  role: string | null;
  schoolType: SchoolType | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getFreshToken: () => Promise<string | null>;
  authLoading: boolean;
  subscriptionStatus: boolean | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [schoolType, setSchoolType] = useState<SchoolType | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<boolean | undefined>(true);
  const [authLoading, setAuthLoading] = useState(true);

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginApi(email, password);
    setAccessToken(data.accessToken);
    setRole(data.role);
    setSchoolType(data.schoolType);
    setSubscriptionStatus(data.subscriptionStatus);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      setAccessToken(null);
      setRole(null);
      setSchoolType(null);
      setSubscriptionStatus(undefined);
      if (window.location.pathname !== "/login") {
        router.replace("/login");
      }
    }
  }, [router]);

  const getFreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const data = await handshake();
      if (!data || !data.accessToken) throw new Error("Session expired");
      setAccessToken(data.accessToken);
      setRole(data.role);
      setSchoolType(data.schoolType);
      setSubscriptionStatus(data.subscriptionStatus);
      return data.accessToken;
    } catch (err) {
      await logout();
      return null;
    }
  }, [logout]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await handshake();
        if (!data || !data.accessToken) throw new Error("No valid session");
        setAccessToken(data.accessToken);
        setRole(data.role);
        setSchoolType(data.schoolType);
        setSubscriptionStatus(data.subscriptionStatus);
      } catch (err) {
        setAccessToken(null);
        setRole(null);
        setSchoolType(null);
        setSubscriptionStatus(undefined);
      } finally {
        setAuthLoading(false);
      }
    };
    initAuth();
    // Intentionally not including logout in deps to prevent re-running on logout
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    // Refresh token a bit before it expires, not on a fixed long interval
    const interval = setInterval(getFreshToken, 1000 * 60 * 60 * 24 * 2.5); // ~2.5 days for a 3-day token
    return () => clearInterval(interval);
  }, [accessToken, getFreshToken]);

  useEffect(() => {
    if (subscriptionStatus === false && window.location.pathname !== "/no-active-subscription") {
       router.replace("/no-active-subscription");
       // Optionally block further render by keeping loading true or similar, but replace is usually fast enough.
    }
  }, [subscriptionStatus, router]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        role,
        schoolType,
        login,
        logout,
        getFreshToken,
        authLoading,
        subscriptionStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
