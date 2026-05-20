"use client";

import TeacherDashboard from "@/components/dashboard/teacher-dashboard";
import { useAuth } from "@/context/AuthContext";
import { getTeacherProfile, TeacherProfile } from "@/services/teacherService";
import { useEffect, useState } from "react";

export default function TeacherPage() {
  const { getFreshToken } = useAuth();
  // const [teacherInfo, setTeacherInfo] = useState<TeacherProfile | null>(null);
  const [waiting, setWaiting] = useState(true);

  const fetchProfile = async () => {
    setWaiting(true);
    try {
      const token = await getFreshToken();
      if (token) {
        const response = await getTeacherProfile(token);
        // setTeacherInfo(response);
      }
    } catch (error) {
      console.error("Failed to fetch teacher profile:", error);
    } finally {
      setWaiting(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only run once on mount

  if (waiting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-purple-600 font-medium">
          Checking Access...
        </span>
      </div>
    );
  }

  return <TeacherDashboard />;
}
