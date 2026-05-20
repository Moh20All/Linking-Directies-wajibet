"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, BookOpen, Percent } from "lucide-react";
import { DashboardOverview } from "@/services/masterService";
import { useLanguage } from "@/context/language-context"


interface StatsCardsProps {
  data: DashboardOverview;
}

export default function StatsCards({ data }: StatsCardsProps) {
  const { pedagogy, finance, attendance } = data;
  const { t, isRTL } = useLanguage()


  const stats = [
    {
      title: "Total Students",
      value: pedagogy.studentCount.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Teachers",
      value: pedagogy.teacherCount.toLocaleString(),
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Net Profit (All Time)",
      value: finance.netProfit.toLocaleString("fr-DZ", {
        style: "currency",
        currency: "DZD",
        minimumFractionDigits: 2,
      }),
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Worker Attendance (30d)",
      value: `${attendance.workerPercentage}%`,
      icon: Percent,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t.real_time_school_data}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
