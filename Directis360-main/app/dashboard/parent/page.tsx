"use client";
import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
const ParentDashboard = dynamic(
  () => import("@/components/dashboard/parent-dashboard"),
  { ssr: false }
);
import { useAuth } from "@/context/AuthContext";
import {
  getParentProfile,
  getChildrenDashboard,
  ParentProfile,
  ChildDashboard,
} from "@/services/parentService";
import { Loader2, AlertTriangle } from "lucide-react";

export default function ParentPage() {
  const { getFreshToken } = useAuth();
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(
    null
  );
  const [childrenDashboards, setChildrenDashboards] = useState<
    ChildDashboard[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getFreshToken();
      if (!token)
        throw new Error("Authentication failed. Please log in again.");

      const [profileData, dashboardData] = await Promise.all([
        getParentProfile(token),
        getChildrenDashboard(token),
      ]);

      setParentProfile(profileData);
      setChildrenDashboards(dashboardData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  }, [getFreshToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
        <p className="ml-4 text-lg text-gray-700">
          Verifying Access & Loading Data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700">
        <AlertTriangle className="w-8 h-8 mr-4" />
        <div>
          <h2 className="text-xl font-bold">Failed to Load Dashboard</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!parentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>Could not find parent profile information.</p>
      </div>
    );
  }

  return (
    <ParentDashboard
      parentProfile={parentProfile}
      childrenDashboards={childrenDashboards}
      getFreshToken={getFreshToken}
    />
  );
}
