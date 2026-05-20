"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Package,
  Plus,
  BarChart3,
  Settings,
  Grid3X3,
  Wrench,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import AssetsOverview from "@/components/assets/assets-overview";
import InventoryManagement from "@/components/assets/inventory-management";
import AssetCategories from "@/components/assets/asset-categories";
import AssetsSettings from "@/components/assets/assets-settings";
import MaintenanceTracking from "@/components/assets/maintenance-tracking";
import { useAuth } from "@/context/AuthContext";
import {
  getAssets,
  getMaintenanceRecords,
  Asset,
  MaintenanceRecord,
} from "@/services/assetService";
import { useLanguage } from "@/context/language-context";

export default function AssetsDashboard() {
  const { getFreshToken } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<
    MaintenanceRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, isRTL } = useLanguage()
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "categories", label: "Categories", icon: Grid3X3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication failed.");

      const [assetsData, maintenanceData] = await Promise.all([
        getAssets(token),
        getMaintenanceRecords(token),
      ]);
      console.log("assets data", assetsData);
      setAssets(assetsData);
      setMaintenanceRecords(maintenanceData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  }, [getFreshToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBackToStaff = () => {
    window.location.href = "/dashboard/staff";
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="ml-2">{t.loading_asset_data}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-600">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p>{t.error}: {error}</p>
          <Button onClick={fetchData} className="mt-4">
            {t.retry}
          </Button>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <AssetsOverview
            fetchData={fetchData}
            assets={assets}
            maintenanceRecords={maintenanceRecords}
          />
        );
      case "inventory":
        return (
          <InventoryManagement
            fetchData={fetchData}
            assets={assets}
            setAssets={setAssets}
          />
        );
      case "maintenance":
        return (
          <MaintenanceTracking
            assets={assets}
            maintenanceRecords={maintenanceRecords}
            setMaintenanceRecords={setMaintenanceRecords}
          />
        );
      case "categories":
        return <AssetCategories assets={assets} />;
      case "settings":
        return <AssetsSettings />;
      default:
        return null;
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
          <Header title="Assets Dashboard" />

          <main className="p-6">
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={handleBackToStaff}
                className="mb-4 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back_to_staff_roles}
              </Button>
            </div>

            <div className="h-[calc(100vh-150px)]">{renderContent()}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
