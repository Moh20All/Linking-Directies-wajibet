"use client";

import type React from "react";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  UserPlus,
  Library,
  Briefcase,
  Activity,
  TrendingUp,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  getPedagogyStats,
  PedagogyStats,
} from "@/services/staffPedagogyService";
import { Action } from "@radix-ui/react-toast";
import { Button } from "../ui/button";
import { useLanguage } from "@/context/language-context";

// --- Interfaces ---
interface Student {
  _id: string;
  full_name: string;
  createdAt?: string;
}
interface Teacher {
  _id: string;
  full_name: string;
  createdAt?: string;
}
interface Group {
  _id: string;
  groupName: string;
  createdAt?: string;
}

interface PedagogyOverviewProps {
  students: Student[]; // Still needed for recent activity log
  teachers: Teacher[]; // Still needed for recent activity log
  groups: Group[]; // Still needed for recent activity log
  getFreshToken: () => Promise<string | null>;
  setActiveTab: React.Dispatch<
    React.SetStateAction<
      "students" | "teachers" | "groups" | "assignments" | "schedules"
    >
  >;
}

// --- Component ---
export default function PedagogyOverview({
  students,
  teachers,
  groups,
  getFreshToken,
  setActiveTab,
}: PedagogyOverviewProps) {
  const [stats, setStats] = useState<PedagogyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, isRTL } = useLanguage()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getFreshToken();
        if (!token) throw new Error("Authentication failed");
        const fetchedStats = await getPedagogyStats(token);
        setStats(fetchedStats);
      } catch (error) {
        console.error("Error fetching overview stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [getFreshToken]);

  const recentActivities = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const studentActivities = students
      .filter((s) => s.createdAt && new Date(s.createdAt) > sevenDaysAgo)
      .map((s) => ({
        type: "Student",
        message: `New student enrolled: ${s.full_name}`,
        time: s.createdAt!,
        icon: UserPlus,
      }));

    const teacherActivities = teachers
      .filter((t) => t.createdAt && new Date(t.createdAt) > sevenDaysAgo)
      .map((t) => ({
        type: "Teacher",
        message: `New teacher added: ${t.full_name}`,
        time: t.createdAt!,
        icon: GraduationCap,
      }));

    const groupActivities = groups
      .filter((g) => g.createdAt && new Date(g.createdAt) > sevenDaysAgo)
      .map((g) => ({
        type: "Group",
        message: `New group created: ${g.groupName}`,
        time: g.createdAt!,
        icon: Library,
      }));

    return [...studentActivities, ...teacherActivities, ...groupActivities]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 6);
  }, [students, teachers, groups]);

  const getCurrentSchoolSeason = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0 = Jan, 5 = June

    if (month >= 5) {
      // After May → new season
      return `${(year % 100).toString().padStart(2, "0")}${((year + 1) % 100)
        .toString()
        .padStart(2, "0")}`;
    } else {
      // Before June → same academic year
      return `${((year - 1) % 100).toString().padStart(2, "0")}${(year % 100)
        .toString()
        .padStart(2, "0")}`;
    }
  };

  const quickActions = [
    {
      title: t.po_action_add_student_title,
      description: t.po_action_add_student_desc,
      icon: UserPlus,
      Action: () => setActiveTab((old) => "students"),
    },
    {
      title: t.po_action_add_teacher_title,
      description: t.po_action_add_teacher_desc,
      icon: GraduationCap,
      Action: () => setActiveTab((old) => "teachers"),
    },
    {
      title: t.po_action_create_group_title,
      description: t.po_action_create_group_desc,
      icon: Library,
      Action: () => setActiveTab((old) => "groups"),
    },
    {
      title: t.po_action_assign_students_title,
      description: t.po_action_assign_students_desc,
      icon: Users,
      Action: () => setActiveTab((old) => "assignments"),
    },
  ];

  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
    orange: { bg: "bg-orange-100", text: "text-orange-600" },
  };

  if (isLoading || !stats) {
    return (
      <div className="fixed inset-0 bg-white/60 z-50 flex flex-col justify-center items-center backdrop-blur-sm">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="mt-4 text-sm text-gray-700">{t.po_loading_text}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: t.po_total_students,
      value: stats.totalStudents,
      change: `${stats.newStudents} new in last 30 days`,
      icon: Users,
      color: "blue",
    },
    {
      title: t.po_total_teachers,
      value: stats.totalTeachers,
      change: `${stats.assignedTeachers} with assignments`,
      icon: GraduationCap,
      color: "green",
    },
    {
      title: t.po_active_groups,
      value: stats.activeGroupsCount,
      change: `For season 20${getCurrentSchoolSeason().slice(
        0,
        2
      )}/20${getCurrentSchoolSeason().slice(2)}`,
      icon: Library,
      color: "purple",
    },
    {
      title: t.po_unassigned_students,
      value: stats.unassignedStudentsCount,
      change: t.po_unassigned_change,
      icon: UserPlus,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t.po_title}
          </h2>
          <p className="text-gray-600">
            {t.po_description}
          </p>
        </div>
        <Link href="/dashboard/staff">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.po_back_btn}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div
                className={`p-2 rounded-lg ${
                  colorClasses[stat.color as keyof typeof colorClasses].bg
                }`}
              >
                <stat.icon
                  className={`w-4 h-4 ${
                    colorClasses[stat.color as keyof typeof colorClasses].text
                  }`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {t.po_enrollment_title}
            </CardTitle>
            <CardDescription>
              {t.po_enrollment_description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{t.po_registered_label}</span>
                <span className="text-gray-500">
                  {stats.registeredStudentsCount} / {stats.totalStudents}
                </span>
              </div>
              <Progress
                value={
                  stats.totalStudents > 0
                    ? (stats.registeredStudentsCount / stats.totalStudents) *
                      100
                    : 0
                }
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{t.po_unassigned_label}</span>
                <span className="text-gray-500">
                  {stats.unassignedStudentsCount} / {stats.totalStudents}
                </span>
              </div>
              <Progress
                value={
                  stats.totalStudents > 0
                    ? (stats.unassignedStudentsCount / stats.totalStudents) *
                      100
                    : 0
                }
                className="h-2 [&>*]:bg-orange-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Library className="w-5 h-5" />
              {t.po_level_title}
            </CardTitle>
            <CardDescription>
              {t.po_level_description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.levelDistribution.length > 0 ? (
              stats.levelDistribution.map(({ level, count }) => (
                <div
                  key={level}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-600">{level}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                {t.po_no_students_group}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {t.po_top_teachers_title}
            </CardTitle>
            <CardDescription>
              {t.po_top_teachers_description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topTeachers.length > 0 ? (
              stats.topTeachers.map((teacher) => (
                <div
                  key={teacher.name}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-600 truncate">{teacher.name}</span>
                  <Badge variant="outline">{teacher.count} {t.po_groups_label}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                {t.po_no_teachers_group}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {t.po_recent_title}
            </CardTitle>
            <CardDescription>
              {t.po_recent_description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 rounded-full mt-1">
                      <activity.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.time).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">{t.po_no_activities}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t.po_quick_title}
            </CardTitle>
            <CardDescription>{t.po_quick_description}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <div
                key={action.title}
                onClick={action.Action}
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors border"
              >
                <action.icon className="w-6 h-6 text-gray-500 mb-2" />
                <h4 className="font-semibold text-gray-800">{action.title}</h4>
                <p className="text-xs text-gray-600">{action.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
