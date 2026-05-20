"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  DollarSign,
  Clock,
  Package,
  BarChart3,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Unlock,
} from "lucide-react";
import { useRouter } from "next/navigation"; // Import the useRouter hook

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useAuth } from "@/context/AuthContext";
import { getCurrentStaffProfile, StaffProfile } from "@/services/staffService";
import {
  getTabsStatus,
  verifyTabPassword,
  TabsStatus,
} from "@/services/staffTabsService";
import {
  checkPedagogyAccess,
  revokePedagogyAccess,
} from "@/services/staffPedagogyService";
import {
  checkFinanceAccess,
  revokeFinanceAccess,
} from "@/services/staffFinanceService";
import {
  checkAttendanceAccess,
  revokeAttendanceAccess,
} from "@/services/staffAttendanceService";
import {
  checkAssetsAccess,
  revokeAssetsAccess,
} from "@/services/staffAssetsService";
import { useLanguage } from "@/context/language-context";

const sidebarItems = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "pedagogy", label: "Pedagogy", icon: Users },
  { id: "finance", label: "Finance", icon: DollarSign },
  { id: "attendance", label: "Attendance", icon: Clock },
  { id: "assets", label: "Assets", icon: Package },
];

const accessCheckServices: Record<
  string,
  (token: string) => Promise<{ granted: boolean }>
> = {
  pedagogy: checkPedagogyAccess,
  finance: checkFinanceAccess,
  attendance: checkAttendanceAccess,
  assets: checkAssetsAccess,
};

const revokeAccessServices: Record<string, (token: string) => Promise<any>> = {
  pedagogy: revokePedagogyAccess,
  finance: revokeFinanceAccess,
  attendance: revokeAttendanceAccess,
  assets: revokeAssetsAccess,
};

export default function StaffDashboard() {
  const { accessToken } = useAuth();
  const router = useRouter(); // Initialize the router
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [tabsStatus, setTabsStatus] = useState<TabsStatus | null>(null);
  const [unlockedTab, setUnlockedTab] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { t, isRTL } = useLanguage()
  // --- Data Fetching ---
  const fetchInitialData = useCallback(async () => {
    if (!accessToken) return;
    setIsInitialLoading(true);
    try {
      const [profileData, statusData] = await Promise.all([
        getCurrentStaffProfile(accessToken),
        getTabsStatus(accessToken),
      ]);
      setProfile(profileData);
      setTabsStatus(statusData);

      // Sequentially check for access to find the one active cookie
      for (const tabId of Object.keys(accessCheckServices)) {
        if (statusData[tabId as keyof TabsStatus]) {
          const checkService = accessCheckServices[tabId];
          if (checkService) {
            try {
              const res = await checkService(accessToken);
              if (res.granted) {
                setUnlockedTab(tabId);
                break; // Stop after finding the first unlocked tab
              }
            } catch (err) {
              // This is expected if the cookie isn't present
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to load initial dashboard data", err);
    } finally {
      setIsInitialLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // --- Event Handlers ---
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleNavigate = (tabId: string) => {
    router.push(`/dashboard/staff/${tabId}`);
  };

  const handleVerifySuccess = (tabId: string) => {
    setUnlockedTab(tabId);
  };

  const handleRevokeAccess = async () => {
    if (!accessToken || !unlockedTab) return;
    try {
      const revokeService = revokeAccessServices[unlockedTab];
      if (revokeService) {
        await revokeService(accessToken);
        setUnlockedTab(null);
      }
    } catch (err) {
      console.error(`Failed to revoke ${unlockedTab} access`, err);
    }
  };
  

  // --- Render Functions ---
  const renderTabContent = () => {
    const tabInfo = sidebarItems.find((item) => item.id === activeTab);
    if (!tabInfo) return null;

    if (activeTab === "overview") {
      const unlockedTabInfo = sidebarItems.find(
        (item) => item.id === unlockedTab
      );

      return (
        <div className="space-y-6">
          <Card className="shadow-sm border">
            <CardHeader>
              <CardTitle>{t.staff_overview_title}</CardTitle>
              <CardDescription>{t.staff_overview_desc}</CardDescription>
            </CardHeader>
            <CardContent>
              {!profile ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <p className="text-sm font-bold">{t.staff_overview_fullname}</p>
                    <p>{profile.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t.staff_overview_role}</p>
                    <p>{profile.role}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t.staff_overview_phone}</p>
                    <p>{profile.phone_number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t.staff_overview_school}</p>
                    <p>
                      {profile.school.information.name} (
                      {profile.school.information.type})
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {unlockedTab ? (
                  <Unlock className="text-green-600" />
                ) : (
                  <Lock className="text-gray-500" />
                )}
                {t.staff_active_tab_title}
              </CardTitle>
              <CardDescription>
                {t.staff_active_tab_desc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {unlockedTabInfo ? (
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <unlockedTabInfo.icon className="w-5 h-5 text-green-700" />
                    <p className="font-semibold text-green-800">
                      The{" "}
                      <span className="font-bold">{unlockedTabInfo.label}</span>{" "}
                      {t.staff_active_tab_unlocked}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    <Button
                      size="sm"
                      onClick={() => handleNavigate(unlockedTab!)}
                    >
                      {t.staff_active_tab_go}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleRevokeAccess}
                    >
                      {t.staff_active_tab_revoke}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">
                    {t.staff_active_tab_none}
                  </p>
                  <p className="text-sm text-gray-400">
                    {t.staff_active_tab_hint}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    // Handle all other dynamic tabs
    return (
      <TabContentWrapper
        tabId={activeTab}
        tabName={tabInfo.label}
        isLocked={
          tabsStatus ? tabsStatus[activeTab as keyof TabsStatus] : false
        }
        isUnlocked={unlockedTab === activeTab}
        onVerifySuccess={() => handleVerifySuccess(activeTab)}
        onRevoke={() => handleRevokeAccess()}
        onNavigate={handleNavigate}
        accessToken={accessToken}
      />
    );
  };

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 bg-white/60 z-50 flex flex-col justify-center items-center backdrop-blur-sm">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="mt-4 text-sm text-gray-700">{t.staff_dashboard_loading} </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar
          items={sidebarItems}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <div className="flex-1">
          <Header title="Staff Dashboard" />
          <main className="p-6 space-y-6">{renderTabContent()}</main>
        </div>
      </div>
    </div>
  );
}

// --- Reusable Child Component for Tab Content ---
interface TabContentWrapperProps {
  tabId: string;
  tabName: string;
  isLocked: boolean;
  isUnlocked: boolean;
  onVerifySuccess: () => void;
  onRevoke: () => void;
  onNavigate: (tabId: string) => void;
  accessToken: string | null;
}

function TabContentWrapper({
  tabId,
  tabName,
  isLocked,
  isUnlocked,
  onVerifySuccess,
  onRevoke,
  onNavigate,
  accessToken,
}: TabContentWrapperProps) {
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { t, isRTL } = useLanguage()

  const handleVerifyPassword = async () => {
    if (!accessToken) return;
    setVerifying(true);
    setPasswordError(null);
    try {
      const isValid = await verifyTabPassword(
        accessToken,
        tabId,
        passwordInput
      );
      if (isValid) {
        onVerifySuccess();
      } else {
        setPasswordError("Incorrect password.");
      }
    } catch (err: any) {
      setPasswordError(err.message || "Failed to verify password");
    } finally {
      setVerifying(false);
      setPasswordInput("");
    }
  };

  const renderContent = () => {
    const { t, isRTL } = useLanguage()
    if (!isLocked || isUnlocked) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <h3 className="text-xl font-semibold">{tabName} {t.staff_tab_access_granted_title}</h3>
          <p className="text-gray-500">
            {t.staff_tab_access_granted_desc} {tabName} {t.section}
          </p>
          <div className="flex gap-4">
            <Button onClick={() => onNavigate(tabId)}>
              {t.staff_tab_access_btn_go} {tabName} {t.dashboard}
            </Button>
            <Button variant="destructive" onClick={onRevoke}>
              {t.staff_active_tab_revoke}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-sm mx-auto space-y-3 py-8">
        <p className="text-gray-600 text-center">
          {t.staff_tab_locked_message}
        </p>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleVerifyPassword()}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {passwordError && (
          <p className="text-red-500 text-sm text-center">{passwordError}</p>
        )}
        <div className="flex justify-center">
          <Button
            onClick={handleVerifyPassword}
            disabled={verifying || !passwordInput}
          >
            {verifying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {verifying ? "Verifying..." : "Unlock"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <CardTitle>{tabName}</CardTitle>
        <CardDescription>
          {t.staff_tab_manage_tasks} {tabName.toLowerCase()} {t.staff_tab_related_tasks}
        </CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
