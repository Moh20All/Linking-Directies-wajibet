"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  BookOpen,
  Calendar,
  Clock,
  Trophy,
  FileText,
  Star,
  TrendingUp,
  CheckCircle,
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
  MessageSquare,
  BarChart3,
  Settings,
  Briefcase,
  UserCircle,
  Cake,
  Building,
  Gamepad2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getStudentDashboardData,
  StudentDashboardData,
  ScheduleEntry,
  ModuleMark,
} from "@/services/studentService";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { format } from "date-fns";
import StudentCommunity from "./student-community";
import StudentGames from "./student-games";
import { useLanguage } from "@/context/language-context";
// Helper component for loading state
const LoadingSpinner = ({ message }: { message: string }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-blue-600 font-medium">{message}</span>
  </div>
);

// Helper component for error state
const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-700">
    <UserCircle className="w-16 h-16 text-red-400 mb-4" />
    <h1 className="text-2xl font-bold mb-2">Could Not Load Data</h1>
    <p>{message}</p>
  </div>
);

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { getFreshToken } = useAuth();
  const [studentData, setStudentData] = useState<StudentDashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, isRTL } = useLanguage()
  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getFreshToken();
        if (token) {
          const data = await getStudentDashboardData(token);
          setStudentData(data);
        } else {
          setError("Authentication token not found.");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [getFreshToken]);

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "grades", label: "My Grades", icon: BookOpen },
    { id: "games", label: "Games", icon: Gamepad2 },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "group", label: "My Group", icon: Users },
    { id: "community", label: "Community", icon: MessageSquare },
    { id: "profile", label: "Profile", icon: User },
  ];

  const { overallAverage, trimesterAverages } = useMemo(() => {
    if (!studentData?.marks?.trimesters) {
      return { overallAverage: 0, trimesterAverages: {} };
    }

    let totalPoints = 0;
    let totalCoefficients = 0;
    const trimesterAvgs: { [key: number]: number } = {};

    studentData.marks.trimesters.forEach((trimester) => {
      let trimesterPoints = 0;
      let trimesterCoeffs = 0;
      Object.values(trimester.modules).forEach((mod) => {
        trimesterPoints += mod.value * mod.coefficient;
        trimesterCoeffs += mod.coefficient;
      });
      trimesterAvgs[trimester.trimester] =
        trimesterCoeffs > 0 ? trimesterPoints / trimesterCoeffs : 0;
      totalPoints += trimesterPoints;
      totalCoefficients += trimesterCoeffs;
    });

    const overallAvg =
      totalCoefficients > 0 ? totalPoints / totalCoefficients : 0;

    return {
      overallAverage: parseFloat(overallAvg.toFixed(2)),
      trimesterAverages: trimesterAvgs,
    };
  }, [studentData?.marks]);

  const weeklySchedule = useMemo(() => {
    const scheduleByDay: { [day: string]: ScheduleEntry[] } = {
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
    };
    studentData?.schedule?.entries.forEach((entry) => {
      if (scheduleByDay[entry.day]) {
        scheduleByDay[entry.day].push(entry);
      }
    });
    // Sort entries by startTime
    for (const day in scheduleByDay) {
      scheduleByDay[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return scheduleByDay;
  }, [studentData?.schedule]);

  const todaysSchedule = useMemo(() => {
    const today = format(new Date(), "EEEE"); // e.g., "Monday"
    return weeklySchedule[today] || [];
  }, [weeklySchedule]);

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return "text-green-600";
    if (grade >= 14) return "text-blue-600";
    if (grade >= 10) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeBadgeVariant = (
    grade: number
  ): "default" | "secondary" | "outline" | "destructive" => {
    if (grade >= 16) return "default";
    if (grade >= 14) return "secondary";
    if (grade >= 10) return "outline";
    return "destructive";
  };

  const getGradeBackgroundColor = (grade: number) => {
    if (grade >= 16) return "bg-green-50";
    if (grade >= 14) return "bg-blue-50";
    if (grade >= 10) return "bg-yellow-50";
    return "bg-red-50";
  };

  if (loading) {
    return <LoadingSpinner message="Loading Student Data..." />;
  }

  if (error || !studentData) {
    return (
      <ErrorDisplay message={error || "Student data could not be retrieved."} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar
          items={sidebarItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="flex-1">
          <Header title="Student Dashboard" />
          <main className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Welcome Header */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          {studentData.full_name}
                        </h1>
                        <p className="text-gray-600">{studentData.email}</p>
                        <div className="flex items-center gap-4 mt-2">
                          {studentData.group && (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700"
                            >
                              {studentData.group.groupName}
                            </Badge>
                          )}
                          {studentData.schoolType && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700"
                            >
                              {studentData.schoolType.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {t.studentdash_overview_grade}
                          </p>
                          <p
                            className={`text-2xl font-bold ${getGradeColor(
                              overallAverage
                            )}`}
                          >
                            {overallAverage > 0
                              ? `${overallAverage}/20`
                              : "N/A"}
                          </p>
                        </div>
                        <Trophy className="w-8 h-8 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {t.studentdash_overview_attendance}
                          </p>
                          <p className="text-2xl font-bold text-green-600">
                            N/A
                          </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {t.studentdash_overview_subjects}
                          </p>
                          <p className="text-2xl font-bold text-purple-600">
                            {studentData.group?.teachers?.length || 0}
                          </p>
                        </div>
                        <BookOpen className="w-8 h-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5" /> {t.studentdash_overview_recentgrades}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {studentData.marks?.trimesters?.[0] ? (
                          Object.values(studentData.marks.trimesters[0].modules)
                            .slice(0, 5)
                            .map((mod, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between"
                              >
                                <div>
                                  <p className="font-medium">
                                    {mod.moduleName.name_fr}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {t.Coeff}: {mod.coefficient}
                                  </p>
                                </div>
                                <Badge
                                  variant={getGradeBadgeVariant(mod.value)}
                                >
                                  {mod.value}/20
                                </Badge>
                              </div>
                            ))
                        ) : (
                          <p className="text-gray-500 text-sm">
                            {t.studentdash_overview_nogrades}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" /> {t.studentdash_overview_todaysschedule}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {todaysSchedule.length > 0 ? (
                          todaysSchedule.map((period, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="text-sm font-medium text-gray-600 min-w-[80px]">
                                {period.startTime}-{period.endTime}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">
                                  {period.moduleName.name_fr}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {period.roomName}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">
                            {t.studentdash_overview_noschedule}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Grades Tab */}
            {activeTab === "grades" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> {t.studentdash_grades_title}
                  </CardTitle>
                  <CardDescription>
                    {t.studentdash_grades_subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs
                    defaultValue={
                      studentData.marks?.trimesters[0]?.trimester.toString() ||
                      "1"
                    }
                  >
                    <TabsList>
                      {studentData.marks?.trimesters.map((t) => (
                        <TabsTrigger
                          key={t.trimester}
                          value={t.trimester.toString()}
                        >
                          {t.studentdash_grades_trimester_prefix} {t.trimester}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {studentData.marks?.trimesters.map((trimester) => (
                      <TabsContent
                        key={trimester.trimester}
                        value={trimester.trimester.toString()}
                        className="space-y-6 mt-4"
                      >
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {t.studentdash_grades_trimester_prefix} {trimester.trimester} {t.studentdash_grades_trimester_performance_prefix}
                              </h3>
                            </div>
                            <div className="text-right">
                              <p
                                className={`text-3xl font-bold ${getGradeColor(
                                  trimesterAverages[trimester.trimester] || 0
                                )}`}
                              >
                                {(
                                  trimesterAverages[trimester.trimester] || 0
                                ).toFixed(2)}
                                /20
                              </p>
                              <p className="text-sm text-gray-600">{t.studentdash_grades_average}</p>
                            </div>
                          </div>
                          <Progress
                            value={
                              ((trimesterAverages[trimester.trimester] || 0) /
                                20) *
                              100
                            }
                            className="h-2"
                          />
                        </div>
                        <div className="space-y-4">
                          {Object.values(trimester.modules).map(
                            (mod: ModuleMark, index) => (
                              <Card
                                key={index}
                                className="border-l-4 border-blue-500"
                              >
                                <CardContent className="p-6">
                                  <div className="flex items-center justify-between mb-4">
                                    <div>
                                      <h4 className="text-lg font-semibold">
                                        {mod.moduleName.name_fr}
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        {t.studentdash_grades_coeff}: {mod.coefficient}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <Badge
                                        variant={getGradeBadgeVariant(
                                          mod.value
                                        )}
                                        className="text-lg px-4 py-2"
                                      >
                                        {mod.value}/20
                                      </Badge>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {t.studentdash_grades_finalgrade}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div
                                      className={`p-3 rounded-lg ${getGradeBackgroundColor(
                                        mod.constant_observation
                                      )}`}
                                    >
                                      <p className="text-xs font-medium text-gray-600 mb-1">
                                        {t.studentdash_grades_obs}
                                      </p>
                                      <p
                                        className={`text-lg font-bold ${getGradeColor(
                                          mod.constant_observation
                                        )}`}
                                      >
                                        {mod.constant_observation}/20
                                      </p>
                                    </div>
                                    <div
                                      className={`p-3 rounded-lg ${getGradeBackgroundColor(
                                        mod.dev1
                                      )}`}
                                    >
                                      <p className="text-xs font-medium text-gray-600 mb-1">
                                        {t.studentdash_grades_dev1}
                                      </p>
                                      <p
                                        className={`text-lg font-bold ${getGradeColor(
                                          mod.dev1
                                        )}`}
                                      >
                                        {mod.dev1}/20
                                      </p>
                                    </div>
                                    <div
                                      className={`p-3 rounded-lg ${getGradeBackgroundColor(
                                        mod.dev2
                                      )}`}
                                    >
                                      <p className="text-xs font-medium text-gray-600 mb-1">
                                        {t.studentdash_grades_dev2}
                                      </p>
                                      <p
                                        className={`text-lg font-bold ${getGradeColor(
                                          mod.dev2
                                        )}`}
                                      >
                                        {mod.dev2}/20
                                      </p>
                                    </div>
                                    <div
                                      className={`p-3 rounded-lg ${getGradeBackgroundColor(
                                        mod.exam
                                      )}`}
                                    >
                                      <p className="text-xs font-medium text-gray-600 mb-1">
                                        {t.studentdash_grades_exam}
                                      </p>
                                      <p
                                        className={`text-lg font-bold ${getGradeColor(
                                          mod.exam
                                        )}`}
                                      >
                                        {mod.exam}/20
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          )}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Schedule Tab */}
            {activeTab === "schedule" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> {t.studentdash_schedule_title}
                  </CardTitle>
                  <CardDescription>
                    {t.studentdash_schedule_subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(weeklySchedule)
                      .filter(([, periods]) => periods.length > 0)
                      .map(([day, periods]) => (
                        <div key={day}>
                          <h3 className="font-semibold text-lg mb-4 text-blue-600">
                            {day}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {periods.map((period, index) => (
                              <Card
                                key={index}
                                className="border-l-4 border-blue-500"
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {period.startTime}-{period.endTime}
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {period.roomName}
                                    </Badge>
                                  </div>
                                  <h4 className="font-medium">
                                    {period.moduleName.name_fr}
                                  </h4>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Group Tab */}
            {activeTab === "group" && studentData.group && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" /> {t.studentdash_group_title}
                  </CardTitle>
                  <CardDescription>
                    {t.studentdash_group_subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-blue-900">
                            {studentData.group.groupName}
                          </h3>
                          <p className="text-blue-700">
                            {t.studentdash_group_level}: {studentData.group.level} • {t.studentdash_group_season}: 20
                            {studentData.group.season.slice(0, 2)}/20
                            {studentData.group.season.slice(2)}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800"
                        >
                          {studentData.group.speciality.name}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-semibold mb-3">
                        {t.studentdash_group_yourteachers}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {studentData.group.teachers.map(
                          ({ teacherId, moduleId }) => (
                            <Card
                              key={teacherId._id + moduleId}
                              className="flex items-center p-4 gap-4"
                            >
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-semibold">
                                  {teacherId.full_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {teacherId.modules.find(
                                    (m) => m.id === moduleId
                                  )?.id || "Subject"}
                                </p>
                              </div>
                            </Card>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "community" && (
              <StudentCommunity
                getFreshToken={getFreshToken}
                studentInfo={studentData}
              />
            )}

            {/* Games Tab */}
            {activeTab === "games" && (
              <StudentGames />
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCircle className="w-5 h-5" /> {t.studentdash_profile_title}
                  </CardTitle>
                  <CardDescription>
                    {t.studentdash_profile_subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      {t.studentdash_profile_personalinfo}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <InfoItem
                        icon={User}
                        label="Full Name"
                        value={studentData.full_name}
                      />
                      <InfoItem
                        icon={Mail}
                        label="Email Address"
                        value={studentData.email}
                      />
                      <InfoItem
                        icon={Phone}
                        label="Phone Number"
                        value={studentData.phone_number}
                      />
                      <InfoItem
                        icon={Cake}
                        label="Birth Date"
                        value={format(
                          new Date(studentData.birthDate),
                          "MMMM d, yyyy"
                        )}
                      />
                      <InfoItem
                        icon={MapPin}
                        label="City of Birth"
                        value={studentData.birthCity}
                      />
                      <InfoItem
                        icon={Globe}
                        label="Nationality"
                        value={studentData.nationality}
                      />
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      {t.studentdash_profile_academicinfo}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <InfoItem
                        icon={Building}
                        label="School Type"
                        value={studentData.schoolType?.toUpperCase() || "N/A"}
                      />
                      {studentData.group && (
                        <InfoItem
                          icon={Users}
                          label="Current Group"
                          value={studentData.group.groupName}
                        />
                      )}
                      {studentData.group && (
                        <InfoItem
                          icon={TrendingUp}
                          label="Level"
                          value={studentData.group.level.toString()}
                        />
                      )}
                      {studentData.group && (
                        <InfoItem
                          icon={BookOpen}
                          label="Speciality"
                          value={studentData.group.speciality.name}
                        />
                      )}
                    </div>
                  </div>

                  {/* Parent Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      {t.studentdash_profile_parentinfo}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {studentData.parentAccountIds?.mother ? (
                        <ParentCard
                          title="Mother's Information"
                          parent={studentData.parentAccountIds.mother}
                        />
                      ) : (
                        <p className="text-sm text-gray-500">
                          {t.studentdash_parent_notavail_mother}
                        </p>
                      )}
                      {studentData.parentAccountIds?.father ? (
                        <ParentCard
                          title="Father's Information"
                          parent={studentData.parentAccountIds.father}
                        />
                      ) : (
                        <p className="text-sm text-gray-500">
                          {t.studentdash_parent_notavail_father}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Sub-component for displaying profile items
const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
      <Icon className="w-5 h-5 text-gray-600" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

// Sub-component for displaying parent card
const ParentCard = ({
  title,
  parent,
}: {
  title: string;
  parent: { full_name: string; email: string; phone_number: string };
}) => (
  <Card className="bg-gray-50">
    <CardHeader>
      <CardTitle className="text-base">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center gap-3 text-sm">
        <User className="w-4 h-4 text-gray-500" />
        <span>{parent.full_name}</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <Mail className="w-4 h-4 text-gray-500" />
        <span>{parent.email}</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <Phone className="w-4 h-4 text-gray-500" />
        <span>{parent.phone_number}</span>
      </div>
    </CardContent>
  </Card>
);
