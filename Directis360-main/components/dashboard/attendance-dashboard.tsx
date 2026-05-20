"use client";

import { useEffect, useState } from "react";

import Link from "next/link"; // ✅ import Link
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock,
  BarChart3,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import Sidebar from "../layout/sidebar";
import Header from "../layout/header";
import AttendanceOverview from "../attendance/attendance-overview";
import AttendanceTracking from "../attendance/attendance-tracking";
import {
  getMembersForAttendance,
  AttendanceMember,
} from "../../services/staffAttendanceService";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/language-context";

// Mock auth hook - replace with your actual authentication context/hook

export default function AttendanceDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [staffMembers, setStaffMembers] = useState<AttendanceMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getFreshToken } = useAuth();
  const { t, isRTL } = useLanguage()
  useEffect(() => {
    const fetchStaff = async () => {
      const token = await getFreshToken();
      if (!token) {
        setError("Authentication token not found.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const members = await getMembersForAttendance(token);
        setStaffMembers(members);
      } catch (err) {
        setError("Failed to fetch staff members. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "tracking", label: "Attendance Tracking", icon: Clock },
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          <p className="ml-2">{t.loading_staff_members}</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col justify-center items-center h-64 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <p className="mt-2 text-red-700 font-semibold">{error}</p>
        </div>
      );
    }

    if (activeTab === "overview") {
      return (
        <AttendanceOverview
          staffMembers={staffMembers}
          getFreshToken={getFreshToken}
        />
      );
    }
    if (activeTab === "tracking") {
      return (
        <AttendanceTracking
          staffMembers={staffMembers}
          getFreshToken={getFreshToken}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar
          items={sidebarItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="flex-1">
          <Header title="Attendance Dashboard" />

          <main className="p-6">
            <div className="mb-6">
              <Link href="/dashboard/staff" passHref>
                <Button variant="outline" className="mb-4 bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t.back_to_staff_roles}
                </Button>
              </Link>
            </div>
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
