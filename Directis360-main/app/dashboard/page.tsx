"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type AccessState = "loading" | "granted" | "denied";

export default function DashboardPage() {
  const { role, getFreshToken, authLoading } = useAuth();
  const router = useRouter();
  const [accessState, setAccessState] = useState<AccessState>("loading");
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const fetchToken = async () => {
    setAccessState("loading");
    try {
      const token = await getFreshToken();
      if (!token) {
        setAccessState("denied");
        router.push("/login");
        return;
      }
      setAccessToken(token);
      setAccessState("granted");
    } catch (err) {
      console.error(err);
      setAccessState("denied");
      router.push("/login");
    }
  };

  // Fetch token
  useEffect(() => {
    if (!authLoading) {
      fetchToken();
    }
  }, [authLoading, router, getFreshToken]);

  // Handle role-based redirects
  useEffect(() => {
    if (accessState === "granted" && role) {
      switch (role) {
        case "HEADMASTER":
          router.push("/dashboard/headmaster");
          break;
        case "STAFF":
          router.push("/dashboard/staff");
          break;
        case "TEACHER":
          router.push("/dashboard/teacher");
          break;
        case "STUDENT":
          router.push("/dashboard/student");
          break;
        case "PARENT":
          router.push("/dashboard/parent");
          break;
        default:
          router.push("/login");
      }
    }
  }, [accessState, role, router]);

  if (authLoading || accessState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (accessState === "denied") {
    return null; // fallback if redirect fails
  }

  // While redirecting, render nothing (avoids UI flashing)
  return null;
}
