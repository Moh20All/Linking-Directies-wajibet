"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  Settings,
  Key,
  BarChart3,
  MessageSquare,
  Loader2,
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatsCards from "./stats-cards";
import AdminManagement from "../admin/admin-management";
import TabPasswordManager from "../admin/tab-password-manager";
import AnalyticsDashboard from "../analytics/analytics-dashboard";
import { useAuth } from "@/context/AuthContext";
import {
  getDashboardOverview,
  DashboardOverview,
} from "@/services/masterService";
import { useLanguage } from "@/context/language-context";

import SchoolSettings from "../settings/school-settings";
import TeacherCommunity from "./teacher-community";
import { getAllGroups } from "@/services/masterService";
// Helper to decode JWT manually to avoid external dependency issues if not installed
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return {};
  }
};

// Wrapper for Headmaster Community to fetch required data
const HeadmasterCommunity = ({ getFreshToken }: { getFreshToken: () => Promise<string | null> }) => {
  const [loading, setLoading] = useState(true);
  const [headmasterInfo, setHeadmasterInfo] = useState<any>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        const token = await getFreshToken();
        if (!token) return;

        // Decode token to get schoolId
        const decoded: any = parseJwt(token);
        
        const schoolId = decoded.schoolId || decoded.id; 

        // Fetch groups
        const groups = await getAllGroups(token);

        setHeadmasterInfo({
          _id: schoolId,
          full_name: "Headmaster",
          email: decoded.email || "headmaster@school.com", 
          role: "HEADMASTER",
          currentGroups: groups.map((g: any) => ({
             _id: g._id, 
             groupName: g.groupName, 
             groupId: g.groupId || g.id 
          })), 
        });
      } catch (err) {
        console.error("Failed to init community data", err);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [getFreshToken]);

  if (loading) return (
    <div className="flex items-center justify-center p-8">
       <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading Community...
    </div>
  );
  if (!headmasterInfo) return <div>Error loading community profile.</div>;

  return <TeacherCommunity getFreshToken={getFreshToken} teacherInfo={headmasterInfo} />;
};

export default function HeadmasterDashboard() {
  const { getFreshToken } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [overviewData, setOverviewData] = useState<DashboardOverview | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t, isRTL } = useLanguage()
  useEffect(() => {
    const fetchOverview = async () => {
      if (activeTab === "overview" && !overviewData) {
        setIsLoading(true);
        setError(null);
        try {
          const token = await getFreshToken();
          if (!token) throw new Error("Authentication failed.");
          const data = await getDashboardOverview(token);
          setOverviewData(data);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load dashboard data."
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "admins", label: "Admin Management", icon: Users },
    { id: "passwords", label: "Tab Passwords", icon: Key },
    // { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "community", label: "Community", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        if (isLoading) {
          return (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-lg">{t.loading_overview}</span>
            </div>
          );
        }
        if (error) {
          return (
            <div className="text-red-600 text-center p-8 bg-red-50 rounded-lg">
              <p>{t.error_loading_dashboard}: {error}</p>
            </div>
          );
        }
        if (overviewData) {
          return (
            <div className="space-y-6">
              <StatsCards data={overviewData} />
              <AnalyticsDashboard data={overviewData} />
            </div>
          );
        }
        return null;

      case "admins":
        return <AdminManagement />;
      case "passwords":
        return <TabPasswordManager />;
      case "community":
        return <HeadmasterCommunity getFreshToken={getFreshToken} />;
      case "settings":
        return <SchoolSettings />;
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t.coming_soon}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                {t.this_section_is_under_construction}
              </p>
            </CardContent>
          </Card>
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
          <Header title="Headmaster Dashboard" />
          <main className="p-6">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
}
