"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Users,
  UserPlus,
  GraduationCap,
  Calendar,
  BarChart3,
  Settings,
  Building,
  UserCheck,
  Loader2,
  HeartHandshake,
  Bell, // New Icon
} from "lucide-react";

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import PedagogyOverview from "@/components/pedagogy/pedagogy-overview";
import StudentManagement from "@/components/pedagogy/student-management";
import TeacherManagement from "@/components/pedagogy/teacher-management";
import GroupManagement from "@/components/pedagogy/group-management";
import StudentGroupAssignment from "@/components/pedagogy/student-group-assignment";
import ScheduleManagement from "@/components/pedagogy/schedule-management";
import ParentManagement from "@/components/pedagogy/parent-management"; // New Import
import PedagogySettings from "@/components/pedagogy/pedagogy-settings";
import { useLanguage } from "@/context/language-context";

import {
  getStudents,
  getGroups,
  getTeachers,
} from "@/services/staffPedagogyService";
import MeetingsManagement from "../pedagogy/meetings-management";

// --- Data Interfaces (dates are now strings!) ---
export interface StudentInterface {
  _id: string;
  username: string;
  full_name: string;
  phone_number: string;
  email: string;
  fullUsername: string;
  role: "STUDENT";
  schoolId: string;
  nationality: string;
  birthDate: Date;
  birthCity: string;
  sex: "MALE" | "FEMALE";
  registered: boolean;
  registeredGroupId: string | null;
  groupHistory: Array<{
    groupId?: string;
    season?: string;
    reason?: string;
    date?: Date;
  }>;
  parentAccountIds: {
    // Important for linking
    mother: string | null;
    father: string | null;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

interface TeacherModule {
  id: string;
  hoursPerWeek: number;
}
// ... (rest of the interfaces remain the same) ...
interface TeacherCurrentGroup {
  groupId: string;
  moduleId: string;
}

interface TeacherHistory {
  groupId: string;
  moduleId?: string;
  reason: "assigned" | "removed";
  timestamp: Date;
}

interface Teacher {
  _id: string;
  username: string;
  full_name: string;
  email: string;
  phone_number?: string;
  national_ID: string;
  modules: TeacherModule[];
  currentGroups: TeacherCurrentGroup[];
  teachingHistory: TeacherHistory[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GetTeachersResponse {
  count: number;
  teachers: Teacher[];
}

interface Group {
  _id: string;
  id: string;
  level: number;
  speciality: {
    id: string;
    name: string;
    abbreviation?: string;
  };
  classNumber: number;
  season: string;
  groupName: string;
  schoolId: string;
  teachers: Array<{
    teacherId: string;
    moduleId: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

interface ScheduleEntry {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  group: string;
  teacher: string;
  room: string;
  duration: number;
}

interface PedagogySettingsData {
  generalSettings: {
    schoolStartTime: string;
    schoolEndTime: string;
    classDuration: string;
    breakDuration: string;
    maxStudentsPerGroup: string;
    enableParentNotifications: boolean;
    enableAttendanceTracking: boolean;
    enableGradeReports: boolean;
  };
  gradeSettings: {
    gradingSystem: string;
    passingGrade: string;
    enableMidtermExams: boolean;
    enableFinalExams: boolean;
    reportCardFrequency: string;
  };
  subjectSettings: {
    coreSubjects: string[];
    electiveSubjects: string[];
    enableSubjectWeighting: boolean;
    defaultSubjectWeight: string;
  };
  groupSettings: {
    autoGroupCreation: boolean;
    groupNamingPattern: string;
    enableMixedGradeGroups: boolean;
    maxGroupsPerTeacher: string;
  };
}

export default function PedagogyDashboard() {
  const { getFreshToken } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const { t, isRTL } = useLanguage()
  // const [schoolType, setSchoolType] = useState<
  //   "primaire" | "cem" | "lycee" | null
  // >("lycee");

  const { schoolType } = useAuth();

  const [students, setStudents] = useState<StudentInterface[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [schedule, setSchedule] = useState<{ [key: string]: ScheduleEntry[] }>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  });
  const [settings, setSettings] = useState<PedagogySettingsData>({
    generalSettings: {
      schoolStartTime: "08:00",
      schoolEndTime: "16:00",
      classDuration: "60",
      breakDuration: "15",
      maxStudentsPerGroup: "25",
      enableParentNotifications: true,
      enableAttendanceTracking: true,
      enableGradeReports: true,
    },
    gradeSettings: {
      gradingSystem: "20-point",
      passingGrade: "10",
      enableMidtermExams: true,
      enableFinalExams: true,
      reportCardFrequency: "quarterly",
    },
    subjectSettings: {
      coreSubjects: ["Mathematics", "Science", "English", "History"],
      electiveSubjects: ["Art", "Music", "Physical Education"],
      enableSubjectWeighting: false,
      defaultSubjectWeight: "1.0",
    },
    groupSettings: {
      autoGroupCreation: false,
      groupNamingPattern: "Grade {grade} - Section {section}",
      enableMixedGradeGroups: false,
      maxGroupsPerTeacher: "3",
    },
  });

  const [initialLoading, setInitialLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reloadData = useCallback(
    async (isInitial = false, type: string) => {
      if (isInitial) {
        setInitialLoading((old) => true);
      } else {
        setIsRefreshing((old) => true);
      }

      try {
        const token = await getFreshToken();
        if (!token) {
          throw new Error("Authentication expired. Please log in again.");
        }
        if (type === "students" || type === "all") {
          const studentsResponse = await getStudents(token);
          setStudents(
            studentsResponse.students.map((student: any) => ({
              ...student,
              updatedAt: student.updatedAt || new Date().toISOString(),
            }))
          );
        }
        if (type === "groups" || type === "all") {
          const groupsResponse = await getGroups(token);
          setGroups(
            groupsResponse.groupes.map((group: any) => ({
              ...group,
              createdAt: group.createdAt || new Date().toISOString(),
              updatedAt: group.updatedAt || new Date().toISOString(),
            }))
          );
        }
        if (type === "teachers" || type === "all") {
          const teachersResponse = await getTeachers(token);
          setTeachers(
            teachersResponse.teachers.map((group: any) => ({
              ...group,
              createdAt: group.createdAt || new Date().toISOString(),
              updatedAt: group.updatedAt || new Date().toISOString(),
            }))
          );
        }
      } catch (err: any) {
        setError(err.message || "Failed to load data.");
      } finally {
        if (isInitial) {
          setInitialLoading(false);
        } else {
          setIsRefreshing(false);
        }
      }
    },
    [getFreshToken]
  );

  useEffect(() => {
    reloadData(true, "all");
  }, []);

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "students", label: "Students", icon: Users },
    { id: "parents", label: "Parents", icon: HeartHandshake }, // New Item
    { id: "teachers", label: "Teachers", icon: GraduationCap },
    { id: "groups", label: "Groups", icon: UserPlus },
    { id: "assignments", label: "Student Assignment", icon: UserCheck },
    { id: "meetings", label: "Meetings", icon: Bell },
    { id: "schedules", label: "Schedules", icon: Calendar },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      {initialLoading && (
        <div className="absolute h-screen w-screen inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            {t.refreshing_data} ...
          </div>
        </div>
      )}
      <div className="max-h-screen bg-gray-50 box-border">
        <div className="flex">
          <Sidebar
            items={sidebarItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="flex-1 box-border">
            <Header title="Pedagogy Dashboard" isRefreshing={isRefreshing} />

            <main className="max-h-screen p-6">
              {activeTab === "overview" && (
                <PedagogyOverview
                  getFreshToken={getFreshToken}
                  students={students}
                  teachers={teachers}
                  groups={groups}
                  setActiveTab={setActiveTab}
                />
              )}
              {activeTab === "students" && (
                <StudentManagement
                  schoolType={schoolType}
                  students={students}
                  getFreshToken={getFreshToken}
                  reloadData={() => reloadData(false, "students")}
                />
              )}
              {activeTab === "parents" && ( // New Content
                <ParentManagement students={students} reloadData={reloadData} />
              )}
              {activeTab === "teachers" && (
                <TeacherManagement
                  schoolType={schoolType}
                  teachers={teachers}
                  getFreshToken={getFreshToken}
                  reloadData={() => reloadData(false, "teachers")}
                />
              )}
              {activeTab === "groups" && (
                <GroupManagement
                  schoolType={schoolType}
                  groups={groups}
                  setGroups={setGroups}
                  getFreshToken={getFreshToken}
                  reloadData={() => reloadData(false, "groups")}
                />
              )}
              {activeTab === "assignments" && (
                <StudentGroupAssignment
                  students={students}
                  getFreshToken={getFreshToken}
                  reloadData={() => reloadData(false, "students")}
                />
              )}

              {activeTab === "meetings" && (
                <MeetingsManagement getFreshToken={getFreshToken} />
              )}

              {activeTab === "schedules" && (
                <ScheduleManagement
                  schoolType={schoolType}
                  groups={groups}
                  teachers={teachers}
                  getFreshToken={getFreshToken}
                />
              )}
              {activeTab === "settings" && (
                <PedagogySettings
                  settings={settings}
                  setSettings={setSettings}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
