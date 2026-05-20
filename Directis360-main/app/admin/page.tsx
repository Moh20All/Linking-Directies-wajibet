"use client";

import React, { useState, useEffect } from "react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLogin } from "@/components/admin/AdminLogin";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [_username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            setIsLoading(false);
            return;
        }

        const res = await fetch("http://localhost:12345/api/admin/health", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
             localStorage.removeItem("adminToken");
        }
      } catch (err) {
        console.error("Auth check failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (token: string, username: string) => {
      localStorage.setItem("adminToken", token);
      setUsername(username);
      setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    setUsername("");
  };

  if (isLoading) {
      // Optional: A global loading spinner for initial auth check
      return null;
  }

  // If logged in, show the Dashboard
  if (isLoggedIn) {
     const token = localStorage.getItem("adminToken") || "";
     return (
        <AdminDashboard 
            token={token} 
            onLogout={handleLogout} 
        />
     );
  }

  // Otherwise, show the New Login Component
  return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
}
