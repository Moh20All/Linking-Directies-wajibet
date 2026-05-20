"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Wrench,
  Search,
} from "lucide-react";
import {
  Asset,
  MaintenanceRecord,
  AssetOverviewStats,
} from "@/services/assetService";
import { useAuth } from "@/context/AuthContext";
import { getAssetsOverview } from "@/services/assetService";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";


interface AssetsOverviewProps {
  assets: Asset[];
  maintenanceRecords: MaintenanceRecord[];
}

export default function AssetsOverview({
  assets,
  maintenanceRecords,
}: AssetsOverviewProps) {
  const { getFreshToken } = useAuth();
  const [stats, setStats] = useState<AssetOverviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, isRTL } = useLanguage()


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getFreshToken();
        if (!token) return;
        const overviewStats = await getAssetsOverview(token);
        setStats(overviewStats);
      } catch (error) {
        console.error("Failed to fetch asset overview stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [getFreshToken]);

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // Recent activities (client-side processing for now)
  const recentActivities = [
    ...maintenanceRecords
      .filter((record) => record.completedDate)
      .sort(
        (a, b) =>
          new Date(b.completedDate!).getTime() -
          new Date(a.completedDate!).getTime()
      )
      .slice(0, 3)
      .map((record) => ({
        type: "maintenance",
        description: `Maintenance completed for ${record.assetName}`,
        date: record.completedDate!,
        status: "completed",
      })),
    ...assets
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 2)
      .map((asset) => ({
        type: "asset",
        description: `New asset added: ${asset.name}`,
        date: asset.createdAt,
        status: "added",
      })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalAssets} </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssets}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeAssets} {t.activeAssets}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalValue} </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              ${stats.depreciation.toLocaleString()} {t.depreciation}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.maintenanceAlerts}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.assetsNeedingMaintenance}
            </div>
            <p className="text-xs text-muted-foreground">{t.overdueTasks} </p>
          </CardContent>
        </Card>
      </div>

      {/* Asset Condition & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.assetConditionDistribution} </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.conditionStats).map(([condition, count]) => (
              <div key={condition} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm capitalize">{condition}</span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
                <Progress
                  value={(count / stats.totalAssets) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.recentActivities} </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === "maintenance" ? (
                        <Wrench className="h-4 w-4 text-blue-600 mt-1" />
                      ) : (
                        <Package className="h-4 w-4 text-green-600 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        activity.status === "completed"
                          ? "default"
                          : "secondary"
                      }
                      className="flex-shrink-0"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                {t.recentActivities}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
