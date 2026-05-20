"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  User,
  DollarSign,
  Bus,
  Bell,
  MessageSquare,
  BarChart3,
  Settings,
  GraduationCap,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { ParentProfile, ChildDashboard } from "@/services/parentService";
import ParentMeetings from "./parent-meetings";
import { useLanguage } from "@/context/language-context";

interface ParentDashboardProps {
  parentProfile: ParentProfile;
  childrenDashboards: ChildDashboard[];
  getFreshToken: any;
}

export default function ParentDashboard({
  parentProfile,
  childrenDashboards,
  getFreshToken,
}: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedChild, setSelectedChild] = useState<ChildDashboard | null>(
    null
  );
  const { t, isRTL } = useLanguage()
  // Dialog states for features not yet implemented with backend data
  const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(false);
  const [busTrackingOpen, setBusTrackingOpen] = useState(false);

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "child", label: "My Children", icon: User },
    // { id: "payments", label: "Payments", icon: DollarSign },
    { id: "meetings", label: "Meetings", icon: Bell },
    // { id: "community", label: "Community", icon: MessageSquare },
    // { id: "settings", label: "Settings", icon: Settings },
  ];

  const specialButton = (
      <Button
        className="w-full justify-start gap-3 bg-amber-400 hover:bg-amber-500 text-slate-900 border-2 border-slate-900 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)] active:translate-y-[1px] active:shadow-none transition-all"
        onClick={() => {}} 
      >
        <Bus className="w-5 h-5" />
        Live Bus Tracking
      </Button>
  );

  // Helper functions
  const calculateOverallAverage = (child: ChildDashboard): number => {
    if (!child.marks || !child.marks.trimesters.length) return 0;

    let totalPoints = 0;
    let totalCoefficients = 0;

    child.marks.trimesters.forEach((trimester) => {
      Object.values(trimester.modules).forEach((module) => {
        if (module.value > 0) {
          // Only count graded modules
          totalPoints += module.value * module.coefficient;
          totalCoefficients += module.coefficient;
        }
      });
    });

    return totalCoefficients > 0
      ? parseFloat((totalPoints / totalCoefficients).toFixed(2))
      : 0;
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return "bg-green-100 text-green-800 border-green-200";
    if (grade >= 14) return "bg-blue-100 text-blue-800 border-blue-200";
    if (grade >= 10) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar
          items={sidebarItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          specialMenuItem={specialButton}
        />

        <div className="flex-1">
          <Header title="Parent Dashboard" />

          <main className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">
                            {parentProfile?.full_name}
                          </CardTitle>
                          <CardDescription className="text-lg">
                            {t.parent_account}
                          </CardDescription>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge
                              variant="outline"
                              className="bg-purple-50 text-purple-700 border-purple-200"
                            >
                              {childrenDashboards.length} {t.children}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              {t.active_account}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t.children_overview}</CardTitle>
                    <CardDescription>
                      {t.quick_overview_of_your_children_academic_performance}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {childrenDashboards.map((child) => (
                        <Card
                          key={child.student._id}
                          className="border-l-4 border-l-blue-500"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-2xl">
                                {child.student.full_name.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold">
                                  {child.student.full_name}
                                </h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="outline">
                                    {child.group?.groupName || "No Group"}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      {t.overall_grade}
                                    </p>
                                    <div
                                      className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(
                                        calculateOverallAverage(child)
                                      )}`}
                                    >
                                      {calculateOverallAverage(child)}/20
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      {t.absences_lates}
                                    </p>
                                    <p className="text-lg font-bold">
                                      {child.attendance.absences} /{" "}
                                      {child.attendance.lates}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "child" && (
              <div className="space-y-6">
                {childrenDashboards.map((child) => (
                  <Card key={child.student._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{child.student.full_name}</CardTitle>
                          <CardDescription>
                            {child.group?.groupName ||
                              "Not assigned to a group"}
                          </CardDescription>
                        </div>
                        <Button onClick={() => setSelectedChild(child)}>
                          {t.view_full_details}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            {t.overall_average}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">
                            {calculateOverallAverage(child)} / 20
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">{t.absences}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-red-600">
                            {child.attendance.absences}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">{t.lates}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-yellow-600">
                            {child.attendance.lates}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">{t.teachers}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">
                            {child.group?.teachers.length || 0}
                          </p>
                        </CardContent>
                      </Card>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}


            {activeTab === "meetings" && (
              <ParentMeetings getFreshToken={getFreshToken} />
            )}

            {/* Placeholder Tabs */}
            {/* {["payments", "bus", "alerts", "community", "settings"].includes(
              activeTab
            ) && (
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{activeTab}</CardTitle>
                  <CardDescription>
                    This feature is currently under development.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12 text-gray-500">
                  <p>Coming soon!</p>
                </CardContent>
              </Card>
            )} */}
          </main>
        </div>
      </div>

      <Dialog
        open={selectedChild !== null}
        onOpenChange={() => setSelectedChild(null)}
      >
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {t.full_report_for} {selectedChild?.student.full_name}
            </DialogTitle>
            <DialogDescription>
              {selectedChild?.group?.groupName}
            </DialogDescription>
          </DialogHeader>
          {selectedChild && (
            <div className="flex-1 overflow-y-auto space-y-6 p-1 pr-4">
              {/* Grades Section */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.academic_marks}</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedChild.marks?.trimesters.map((trimester) => (
                    <div key={trimester.trimester} className="mb-4">
                      <h4 className="font-semibold mb-2">
                        {t.trimester} {trimester.trimester}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(trimester.modules).map(
                          ([moduleId, moduleData]) => (
                            <Card key={moduleId}>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">
                                  {moduleId}
                                </CardTitle>
                                <CardDescription>
                                  {t.coefficient}: {moduleData.coefficient}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p
                                  className={`text-xl font-bold ${
                                    getGradeColor(moduleData.value).split(
                                      " "
                                    )[1]
                                  }`}
                                >
                                  {moduleData.value}/20
                                </p>
                                <p className="text-xs text-gray-500">
                                  {t.dev1}: {moduleData.dev1}, {t.dev2}:{" "}
                                  {moduleData.dev2}, {t.exam}: {moduleData.exam}
                                </p>
                              </CardContent>
                            </Card>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Schedule Section */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.weekly_schedule}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedChild.schedule?.entries.reduce((acc, entry) => {
                      (acc[entry.day] = acc[entry.day] || []).push(entry);
                      return acc;
                    }, {} as Record<string, typeof selectedChild.schedule.entries>) &&
                      Object.entries(
                        selectedChild.schedule.entries.reduce((acc, entry) => {
                          (acc[entry.day] = acc[entry.day] || []).push(entry);
                          return acc;
                        }, {} as Record<string, typeof selectedChild.schedule.entries>)
                      ).map(([day, entries]) => (
                        <div key={day} className="p-4 border rounded shadow-md">
                          <h4 className="font-semibold mb-2">{day} </h4>
                          {entries.map((entry, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-start justify-center gap-2"
                            >
                              <div className="flex flex-col gap-2 text-xs">
                                <Badge variant={"outline"}>
                                  {entry.moduleId}
                                </Badge>
                                <Badge variant={"secondary"}>
                                  Prof:{" "}
                                  {selectedChild.group?.teachers.find(
                                    (t) => t.moduleId === entry.moduleId
                                  )?.teacherId.full_name || "Teacher"}
                                </Badge>
                              </div>

                              <div key={entry._id} className="text-xs">
                                <Badge>{entry.startTime}</Badge> -{" "}
                                <Badge>{entry.endTime}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Attendance Section */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.attendance_details}</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedChild.attendance.details.length > 0 ? (
                    selectedChild.attendance.details.map((detail, index) => (
                      <p key={index} className="text-sm">
                        {detail.date}:{" "}
                        <span
                          className={
                            detail.status === "absent"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }
                        >
                          {detail.status}
                        </span>{" "}
                        ({detail.remark || "No remark"})
                      </p>
                    ))
                  ) : (
                    <p>{t.no_absences_or_lates_recorded}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
