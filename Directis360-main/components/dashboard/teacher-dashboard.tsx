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
  BookOpen,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  User,
  GraduationCap,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  UserCheck,
  X,
  Save,
  Eye,
  Loader2,
  User2,
  Bell,
  Gamepad2,
} from "lucide-react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import TeacherCommunity from "./teacher-community";
import TeacherGames from "./teacher-games";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import {
  getTeacherProfile,
  getMyGroupsWithMarks,
  getTeacherSchedule,
  markAttendance,
  TeacherProfile,
  GroupWithMarks,
  WeeklySchedule,
  StudentMark,
  getAttendanceReport,
  updateStudentMark,
} from "@/services/teacherService";
// Assuming you have an auth hook that provides the token
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import TeacherMeetingsPage from "./teacher-meetings";
import { useLanguage } from "@/context/language-context";

type TeacherDashboardProps = {
  // getFreshToken: () => Promise<string | null>;
  // teacherInfo: TeacherProfile;
};

export default function TeacherDashboard({ }: // getFreshToken,
  // teacherInfo,
  TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedGroup, setSelectedGroup] = useState<GroupWithMarks | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [groupDetailsModalOpen, setGroupDetailsModalOpen] = useState(false);
  const [groupDates, setGroupDates] = useState<{ [key: string]: string }>({});
  const { t, isRTL } = useLanguage()

  // Data states
  const [teacherInfo, setTeacherInfo] = useState<TeacherProfile | null>(null);
  const [myGroups, setMyGroups] = useState<GroupWithMarks[]>([]);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTrimester, setSelectedTrimester] =
    useState<string>("trimester_1");

  const [softLoading, setSoftLoading] = useState(false);
  const { getFreshToken } = useAuth();
  const fetchData = async () => {
    const token = await getFreshToken();
    // console.log("fetching token ", token);
    if (!token) {
      setError("Authentication token not found.");
      setSoftLoading(true);
      if (loading) setLoading(false);
      return;
    }
    try {
      setSoftLoading(true);
      const [profile, groups, schedule] = await Promise.all([
        getTeacherProfile(token),
        getMyGroupsWithMarks(token),
        getTeacherSchedule(token),
      ]);
      // console.log(profile);
      // console.log(groups);
      // console.log(schedule);
      setTeacherInfo((old) => profile);
      setMyGroups((old) => groups);
      setWeeklySchedule((old) => schedule);
      setError(null);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      if (loading) setLoading(false);
      setSoftLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [loadingDialogue, setDialogueLoading] = useState(false);

  // const handleSelectingGroup = async (group: any) => {
  //   setDialogueLoading((old) => true);
  //   if (group) {
  //     try {
  //       const token = await getFreshToken();

  //       // fetch attendance report for this group
  //       const attendanceReport = await getAttendanceReport(
  //         token || "",
  //         group.groupId
  //       );

  //       // 🔗 merge attendance data into group.students
  //       const mergedStudents = group.students.map((student: any) => {
  //         const reportEntry = attendanceReport.students.find(
  //           (s) => s.studentId === student.studentId
  //         );

  //         return {
  //           ...student,
  //           attendance: {
  //             present: reportEntry?.present || 0,
  //             absent: reportEntry?.absent || 0,
  //             late: reportEntry?.late || 0,
  //           },
  //         };
  //       });
  //       // 📊 calculate totals
  //       const attendanceDistribution = mergedStudents.reduce(
  //         (acc, s) => {
  //           acc.present += s.attendance.present;
  //           acc.absent += s.attendance.absent;
  //           acc.late += s.attendance.late;
  //           return acc;
  //         },
  //         { present: 0, absent: 0, late: 0 }
  //       );

  //       // 🔗 build final enriched group object
  //       const enrichedGroup = {
  //         ...group,
  //         students: mergedStudents,
  //         attendanceSummary: {
  //           from: attendanceReport.from,
  //           to: attendanceReport.to,
  //           totalSessions: attendanceReport.totalSessions,
  //           attendanceDistribution,
  //         },
  //       };
  //       console.log("enriched group: ", enrichedGroup);
  //       setSelectedGroup((old) => enrichedGroup);
  //       setDialogueLoading((old) => false);
  //       return enrichedGroup;
  //     } catch (err) {
  //       console.error("Error selecting group:", err);
  //     }
  //   }
  //   setDialogueLoading((old) => false);
  //   return;
  // };

  const handleSelectingGroup = async (group: any) => {
    setDialogueLoading(true);
    if (group) {
      try {
        const token = await getFreshToken();
        if (!token) {
          setDialogueLoading(false);
          return group; // Return original group if no token
        }

        const attendanceReport = await getAttendanceReport(
          token,
          group.groupId
        );

        const mergedStudents = group.students.map((student: any) => {
          const reportEntry = attendanceReport.students.find(
            (s) => s.studentId === student.studentId
          );
          return {
            ...student,
            attendance: {
              present: reportEntry?.present || 0,
              absent: reportEntry?.absent || 0,
              late: reportEntry?.late || 0,
            },
          };
        });

        const attendanceDistribution = mergedStudents.reduce(
          (acc, s) => {
            acc.present += s.attendance.present;
            acc.absent += s.attendance.absent;
            acc.late += s.attendance.late;
            return acc;
          },
          { present: 0, absent: 0, late: 0 }
        );

        const enrichedGroup = {
          ...group,
          students: mergedStudents,
          attendanceSummary: {
            from: attendanceReport.from,
            to: attendanceReport.to,
            totalSessions: attendanceReport.totalSessions,
            attendanceDistribution,
          },
        };

        setSelectedGroup(enrichedGroup);
        setDialogueLoading(false);
        return enrichedGroup; // ✅ RETURN the final object
      } catch (err) {
        // console.error("Error selecting group:", err);
        setSelectedGroup(group); // Set the original group on error
      }
    }
    setDialogueLoading(false);
    return group; // Return original group if something went wrong
  };

  dayjs.extend(relativeTime);
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "groups", label: "My Groups", icon: Users },
    { id: "grades", label: "Grades", icon: BookOpen },
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "schedule", label: "Schedule", icon: Clock },
    { id: "games", label: "Games", icon: Gamepad2 },
    { id: "community", label: "Community", icon: MessageSquare },
    { id: "meetings", label: "Meetings", icon: Bell },
    { id: "profile", label: "Profile", icon: User2 },
  ];

  const [todaySchedule, setTodaySchedule] = useState();
  function getToday(): string {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const todayIndex = new Date().getDay(); // 0 (Sunday) - 6 (Saturday)
    return days[todayIndex];
  }

  useEffect(() => {
    if (weeklySchedule) {
      const today = getToday();
      setTodaySchedule(weeklySchedule[today] ?? []);
    }
  }, [weeklySchedule]);

  const [gradeSubjects, setGradesSubjects] = useState<any>();

  useEffect(() => {
    if (myGroups) {
      const moduleMap: Record<string, any> = {};

      myGroups.forEach((groupe) => {
        groupe.teachingModuleIds.forEach((moduleId) => {
          if (!moduleMap[moduleId]) {
            moduleMap[moduleId] = { moduleId, groups: [] };
          }

          // Collect students + marks for this module
          const studentsWithMarks = groupe.students.map((student) => ({
            studentId: student.studentId,
            full_name: student.full_name,
            marks: student.marks[moduleId] || {},
          }));

          // Stats
          let total = 0;
          let count = 0;

          const distribution = {
            excellent: 0,
            good: 0,
            average: 0,
            needsImprovement: 0,
          };

          studentsWithMarks.forEach((student) => {
            const moduleMarks = student.marks;

            // collect trimester values
            const trimesterValues = [
              "trimester_1",
              "trimester_2",
              "trimester_3",
            ].map((t) => moduleMarks?.[t]?.value ?? 0);

            const studentAvg =
              trimesterValues.length > 0
                ? trimesterValues.reduce((a, b) => a + b, 0) /
                trimesterValues.length
                : 0;

            if (studentAvg >= 0) {
              total += studentAvg;
              count++;

              if (studentAvg >= 16) {
                distribution.excellent++;
              } else if (studentAvg >= 14) {
                distribution.good++;
              } else if (studentAvg >= 10) {
                distribution.average++;
              } else {
                distribution.needsImprovement++;
              }
            }
          });

          const avgGrade = count > 0 ? total / count : 0;

          moduleMap[moduleId].groups.push({
            subject: moduleId,
            groupId: groupe.id,
            groupName: groupe.groupName,
            avgGrade,
            gradeDistribution: distribution,
            speciality: groupe.speciality,
            students: studentsWithMarks,
            season: groupe.season,
            level: groupe.level,
          });
        });
      });
      // console.log("Object : ", Object.values(moduleMap));
      setGradesSubjects(Object.values(moduleMap));
    }
  }, [myGroups, activeTab]);

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return "bg-green-100 text-green-800 border-green-200";
    if (grade >= 14) return "bg-blue-100 text-blue-800 border-blue-200";
    if (grade >= 10) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const openGradeModal = (group: GroupWithMarks) => {
    handleSelectingGroup(group);
    setGradeModalOpen((old) => true);
  };

  const [attendaceGroup, setAttendanceGroup] = useState();
  const [selectedSessionAttendance, setSelectedSessionAttendance] = useState();

  const openAttendanceModal = async (group: GroupWithMarks) => {
    setSelectedSessionAttendance(null);
    setMarkingAttendanceMessage((old) => null);

    setDialogueLoading((old) => true);
    setAttendanceModalOpen(true);
    // console.log("attendance data : ", group);
    const selectedGroupe = await handleSelectingGroup(group);

    // console.log("attendance data after enrichement: ", selectedGroupe);
    // console.log("weekly Schedules: ", weeklySchedule);

    // setSelectedDate(date);

    const groupSchedule = Object.values(weeklySchedule)
      .flat() // flatten all days into one array
      .filter((entry) => entry.groupId === group.groupId);

    const enrichedGroup = {
      ...selectedGroupe,
      weeklySchedule: groupSchedule,
    };

    // console.log("final attendance group:", enrichedGroup);
    setAttendanceGroup(enrichedGroup);
    // const viewingAttendance =
    setDialogueLoading((old) => false);
  };

  const openReportModal = (group: GroupWithMarks) => {
    handleSelectingGroup(group);
    true;
  };

  const openGroupDetailsModal = (group: GroupWithMarks) => {
    handleSelectingGroup(group);
    setGroupDetailsModalOpen(true);
  };

  const handleDateChange = (groupId: string, date: string) => {
    setGroupDates((prev) => ({
      ...prev,
      [groupId]: date,
    }));
  };

  const getGroupDate = (groupId: string) => {
    return groupDates[groupId] || new Date().toISOString().split("T")[0];
  };
  const [editableGrades, setEditableGrades] = useState<{
    [studentId: string]: any;
  }>({});
  useEffect(() => {
    // If a group is selected and the modal is open, populate the editableGrades state
    if (selectedGroup && gradeModalOpen) {
      const initialGrades = selectedGroup.students.reduce((acc, student) => {
        // Get the marks for the currently selected trimester
        const currentTrimesterMarks = student.marks[selectedTrimester] || {};
        acc[student.studentId] = {
          constant_observation: currentTrimesterMarks.constant_observation,
          dev1: currentTrimesterMarks.dev1,
          dev2: currentTrimesterMarks.dev2,
          exam: currentTrimesterMarks.exam,
        };
        return acc;
      }, {});
      setEditableGrades(initialGrades);
    }
  }, [selectedGroup, gradeModalOpen, selectedTrimester]); // Rerun when these change

  // 👇 3. HANDLE GRADE CHANGES FROM INPUTS
  const handleGradeInputChange = (
    studentId: string,
    gradeType: "constant_observation" | "dev1" | "dev2" | "exam",
    value: string
  ) => {
    // Parse the value, defaulting to 0 if it's not a valid number
    const numericValue = parseFloat(value);

    setEditableGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [gradeType]: isNaN(numericValue) ? undefined : numericValue, // Store number or undefined
      },
    }));
  };

  // const handleUpdateStudentMarks = async (
  //   groupId: string,
  //   moduleId: string,
  //   studentId: string,
  //   updates: {
  //     dev1?: number;
  //     dev2?: number;
  //     exam?: number;
  //     constant_observation?: number;
  //   }
  // ) => {
  //   setDialogueLoading((old) => true);
  //   try {
  //     const trimester = selectedTrimester.split("_")[1];
  //     const token = await getFreshToken();
  //     if (token) {
  //       console.log(groupId, moduleId, trimester, studentId, updates);
  //       const payload = {
  //         groupId,
  //         moduleId,
  //         trimester,
  //         studentId,
  //         updates,
  //       };
  //       const response = await updateStudentMark(token, payload);
  //       setGradeModalOpen((old) => false);
  //       openGradeModal(selectedGroup);
  //       console.log(response);

  //       await fetchData();
  //       // handleSelectingGroup(selectedGroup);
  //     }
  //   } catch (err) {
  //     setDialogueLoading((old) => false);
  //   }
  // };

  const handleUpdateStudentMarks = async (
    groupId: string,
    moduleId: string,
    studentId: string,
    updates: {
      dev1?: number;
      dev2?: number;
      exam?: number;
      constant_observation?: number;
    }
  ) => {
    setDialogueLoading(true); // Show loading state in the modal
    try {
      const trimester = selectedTrimester.split("_")[1];
      const token = await getFreshToken();
      if (token) {
        const payload = { groupId, moduleId, trimester, studentId, updates };

        // 1. Send the update to the server
        await updateStudentMark(token, payload);
        setGradeModalOpen((old) => false);
        // 2. Re-fetch all the data to ensure the entire app is in sync
        await fetchData();
      }
    } catch (err) {
      // console.error("Failed to update marks:", err);
      // Optionally, you can add a toast notification here for the user
    } finally {
      setDialogueLoading(false); // Hide loading state
    }
  };

  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [markingAttendanceMessage, setMarkingAttendanceMessage] =
    useState(null);
  const handleAttendanceMarking = async () => {
    setMarkingAttendance((old) => true);
    setMarkingAttendanceMessage((old) => null);
    const entries = attendaceGroup.students.filter(
      (s) => s.status === "absent" || s.status === "late"
    );
    // console.log("selected session :", selectedSessionAttendance);
    // console.log("entries : ", entries);
    const token = await getFreshToken();
    var absentees = [];
    if (token) {
      entries.forEach((s: any) => {
        absentees.push({
          studentId: s.studentId,
          status: s.status,
          showingUpTime: s.lateTime,
          remark: null,
          sessionId: selectedSessionAttendance._id,
        });
      });
      const date = new Date().toISOString().split("T")[0];
      let payload = {
        groupId: attendaceGroup.groupId,
        moduleId: attendaceGroup.subject,
        date: date,
        absentees: absentees,
      };

      // console.log("Final Payload : ", payload);

      try {
        const response = await markAttendance(token, payload);
        // console.log(response);
        setMarkingAttendance((old) => false);
        setMarkingAttendanceMessage({
          succ: true,
          msg: t.teacher_attendance_modal_success,
        });
      } catch (err) {
        // console.error("error while submiting attendance marks : ", err);
        setMarkingAttendanceMessage({
          succ: false,
          msg: t.teacher_attendance_modal_error,
        });
        setMarkingAttendance((old) => false);
      } finally {
        setMarkingAttendance((old) => false);
        // setAttendanceModalOpen(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <p className="ml-4 text-sm text-gray-700">
          {t.teacher_dashboard_loading}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700">
            {t.teacher_dashboard_failed_title}
          </h2>
          {/* <p className="text-gray-600 mt-2">{error}</p> */}
          <p className="text-gray-600 mt-2">{t.teacher_dashboard_failed_login}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {softLoading && (
        <>
          <div className="absolute z-50 h-full w-full bg-white/30 flex flex-col gap-2 justify-center items-center backdrop-blur-lg text-purple-500">
            <span>
              <Loader2 className="w-12 h-12 animate-spin" />
            </span>
            <span>{t.teacher_dashboard_refreshing}</span>
          </div>
        </>
      )}
      <div className="flex">
        <Sidebar
          items={sidebarItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="flex-1">
          <Header title="Teacher Dashboard" />

          <main className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Teacher Profile Header */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            {teacherInfo?.full_name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            @{teacherInfo?.username}
                          </CardDescription>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="secondary">
                              {teacherInfo?.modules
                                .map((module) => module.id)
                                .join(", ")}
                            </Badge>
                            {teacherInfo?.createdAt && (
                              <Badge variant="outline">
                                {teacherInfo?.createdAt
                                  ? `Since: ${dayjs(
                                    teacherInfo.createdAt
                                  ).fromNow(true)} ago`
                                  : "Experience: N/A"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => fetchData()}>{t.teacher_dashboard_refresh}</Button>
                      {/* <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge> */}
                    </div>
                  </CardHeader>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {t.teacher_total_groups}
                          </p>
                          <p className="text-3xl font-bold text-blue-600">
                            {myGroups.length}
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {t.teacher_total_students}
                          </p>
                          <p className="text-3xl font-bold text-green-600">
                            {myGroups.reduce(
                              (sum, group) => sum + group.students.length,
                              0
                            )}
                          </p>
                        </div>
                        <GraduationCap className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {t.teacher_subjects}
                          </p>
                          <p className="text-3xl font-bold text-purple-600">
                            {teacherInfo?.modules?.length || 0}
                          </p>
                        </div>
                        <BookOpen className="w-8 h-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        {weeklySchedule && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              {t.teacher_weeks_classes}
                            </p>
                            <p className="text-3xl font-bold text-orange-600">
                              {Object.values(weeklySchedule).reduce(
                                (total, day) => total + (day?.length || 0),
                                0
                              )}
                            </p>
                          </div>
                        )}
                        <Clock className="w-8 h-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        {weeklySchedule && todaySchedule && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              {t.teacher_todays_classes}
                            </p>
                            <p className="text-3xl font-bold text-red-600">
                              {todaySchedule.length}
                            </p>
                          </div>
                        )}
                        <Clock className="w-8 h-8 text-red-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Today's Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>{t.teacher_todays_schedule}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {todaySchedule.length > 0 ? (
                        todaySchedule.map((class_, index) => (
                          <div
                            key={index}
                            className="p-4 border border-blue-200 rounded-lg bg-blue-50"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge
                                variant="outline"
                                className="text-blue-700"
                              >
                                {class_.startTime} - {class_.endTime}
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-800">
                                {class_.roomName}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-gray-900">
                              {class_.moduleName.name_fr}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {class_.groupName}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">
                          {t.teacher_no_classes_today}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "groups" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between space-x-2">
                      <div className="flex gap-2">
                        <Users className="w-5 h-5" />
                        <span>{t.teacher_groups_tab}</span>
                      </div>
                      <Button onClick={() => fetchData()}>{t.teacher_dashboard_refresh}</Button>
                    </CardTitle>
                    <CardDescription>
                      {t.teacher_groups_manage}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {gradeSubjects.map((subject, subjectIndex) =>
                        subject.groups.map((group, index) => (
                          <Card
                            key={index}
                            className="border-l-4 border-l-blue-500"
                          >
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                  {group.groupName}
                                </CardTitle>
                                <div className="flex gap-2 items-center">
                                  <Badge variant="secondary">
                                    year {group.level}
                                  </Badge>
                                  <Badge variant="default">
                                    {group.speciality.abbreviation}
                                  </Badge>
                                </div>
                              </div>
                              <CardDescription>
                                {subject.moduleId}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Users className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">
                                    {group.students.length} {t.teacher_students}
                                  </span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openGroupDetailsModal(group)}
                                >
                                  {t.teacher_groups_view_details}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "grades" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between space-x-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        <span>{t.teacher_grades_manage}</span>
                      </div>
                      <Button onClick={() => fetchData()}>{t.teacher_dashboard_refresh}</Button>
                    </CardTitle>
                    <CardDescription>
                      {t.teacher_grades_description}
                    </CardDescription>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant={
                          selectedTrimester === "trimester_1"
                            ? "outline"
                            : "secondary"
                        }
                        disabled={selectedTrimester === "trimester_1"}
                        onClick={() => setSelectedTrimester("trimester_1")}
                      >
                        {t.teacher_grades_trimester1}
                      </Button>
                      <Button
                        variant={
                          selectedTrimester === "trimester_2"
                            ? "outline"
                            : "secondary"
                        }
                        disabled={selectedTrimester === "trimester_2"}
                        onClick={() => setSelectedTrimester("trimester_2")}
                      >
                        {t.teacher_grades_trimester2}
                      </Button>
                      <Button
                        variant={
                          selectedTrimester === "trimester_3"
                            ? "outline"
                            : "secondary"
                        }
                        disabled={selectedTrimester === "trimester_3"}
                        onClick={() => setSelectedTrimester("trimester_3")}
                      >
                        Trimester 3
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {gradeSubjects.map((subject, subjectIndex) => (
                        <div key={subjectIndex} className="space-y-4">
                          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                            {subject.moduleId}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {subject.groups.map((group, groupIndex) => (
                              <Card
                                key={groupIndex}
                                className="border-l-4 border-l-green-500"
                              >
                                <CardHeader>
                                  <CardTitle className="text-lg">
                                    {group.groupName}
                                  </CardTitle>
                                  <CardDescription>
                                    {group.students.length} {t.teacher_students}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-600">
                                        {t.teacher_grades_class_average}
                                      </span>
                                      <Badge
                                        className={getGradeColor(
                                          group.avgGrade
                                        )}
                                      >
                                        {group.avgGrade.toFixed(2)}/20
                                      </Badge>
                                    </div>
                                    <Progress
                                      value={(group.avgGrade / 20) * 100}
                                      className="h-2"
                                    />
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => openGradeModal(group)}
                                      >
                                        <FileText className="w-4 h-4 mr-1" />
                                        {t.teacher_grades_enter}
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() =>
                                          openGroupDetailsModal(group)
                                        }
                                      >
                                        <TrendingUp className="w-4 h-4 mr-1" />
                                        {t.teacher_grades_view_report}
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "attendance" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between space-x-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5" />
                        <span>{t.teacher_attendance_manage}</span>
                      </div>
                      <Button onClick={() => fetchData()}>Refresh</Button>
                    </CardTitle>
                    <CardDescription>
                      {t.teacher_attendance_description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <>
                      {gradeSubjects.map((subject, subjectIndex) => (
                        <div key={subjectIndex} className="space-y-4">
                          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                            {subject.moduleId}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 pb-4">
                            {subject.groups.map((group, index) => (
                              <Card
                                key={index}
                                className="border-l-4 border-l-purple-500"
                              >
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">
                                      {group?.groupName}
                                    </CardTitle>
                                    <Badge variant="secondary">
                                      {subject.moduleId}
                                    </Badge>
                                  </div>
                                  <CardDescription>{group?.id}</CardDescription>
                                  <CardDescription>
                                    {group?.students.length} {t.teacher_students}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    {/* <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                      <Label
                                        htmlFor={`date-${group.id}`}
                                        className="text-sm font-medium text-gray-700 mb-2 block"
                                      >
                                        Select Date for Attendance
                                      </Label>
                                      <Input
                                        id={`date-${group.id}`}
                                        type="date"
                                        value={getGroupDate(group.id)}
                                        onChange={(e) =>
                                          handleDateChange(
                                            group.id,
                                            e.target.value
                                          )
                                        }
                                        className="w-full"
                                      />
                                      <p className="text-xs text-gray-600 mt-1">
                                        Selected:{" "}
                                        {new Date(
                                          getGroupDate(group.id)
                                        ).toLocaleDateString()}
                                      </p>
                                    </div> */}
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() =>
                                          openAttendanceModal(
                                            group
                                            // getGroupDate(group.id)
                                          )
                                        }
                                      >
                                        <UserCheck className="w-4 h-4 mr-1" />
                                        {t.teacher_attendance_mark}
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() =>
                                          openGroupDetailsModal(group)
                                        }
                                      >
                                        <BarChart3 className="w-4 h-4 mr-1" />
                                        {t.teacher_grades_view_report}
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}
                    </>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between space-x-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span>{t.teacher_schedule_title}</span>
                      </div>
                      <Button onClick={() => fetchData()}>{t.teacher_dashboard_refresh}</Button>
                    </CardTitle>
                    <CardDescription>
                      {t.teacher_schedule_description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(weeklySchedule).map(
                        ([day, classes]) =>
                          classes.length > 0 && (
                            <div key={day} className="space-y-3">
                              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                {day}
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {classes.map((class_, index) => (
                                  <div
                                    key={index}
                                    className="p-4 border border-blue-200 rounded-lg bg-blue-50"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <Badge
                                        variant="outline"
                                        className="text-blue-700"
                                      >
                                        {class_.startTime} - {class_.endTime}
                                      </Badge>
                                      <Badge className="bg-blue-100 text-blue-800">
                                        {class_.roomName}
                                      </Badge>
                                    </div>
                                    <h4 className="font-semibold text-gray-900">
                                      {class_.moduleName.name_fr}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {class_.groupName}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Community and Profile tabs are placeholders */}
            {activeTab === "games" && <TeacherGames />}
            {activeTab === "community" && (
              <TeacherCommunity
                getFreshToken={getFreshToken}
                teacherInfo={teacherInfo}
              />
            )}
            {activeTab === "meetings" && (
              <TeacherMeetingsPage
                getFreshToken={getFreshToken}
              // teacherInfo={teacherInfo}
              />
            )}

            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Profile Header */}
                <Card>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="w-20 h-20 flex justify-center items-center text-lg rounded-full bg-purple-300/30 text-purple-500">
                      {teacherInfo.full_name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">
                        {teacherInfo.full_name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {teacherInfo.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {teacherInfo.phone_number}
                      </p>
                    </div>
                    <Button onClick={() => fetchData()}>{t.teacher_dashboard_refresh}</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p>
                        <span className="font-semibold">{t.teacher_username}:</span>{" "}
                        {teacherInfo.username}
                      </p>
                      <p>
                        <span className="font-semibold">{t.teacher_national_id}:</span>{" "}
                        {teacherInfo.national_ID}
                      </p>
                      <p className="text-gray-400">
                        {t.teacher_profile_contact_admin}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Modules */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" /> {t.teacher_profile_modules}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {teacherInfo.modules.length > 0 ? (
                      teacherInfo.modules.map((m: any, i: number) => (
                        <Badge key={i} variant="secondary">
                          {m.id}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        {t.teacher_profile_no_modules}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Current Groups */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" /> {t.teacher_profile_current_groups}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {teacherInfo.currentGroups.length > 0 ? (
                      <ul className="space-y-2">
                        {teacherInfo.currentGroups.map((g: any) => (
                          <li
                            key={g._id}
                            className="flex justify-between items-center p-2 rounded-lg border"
                          >
                            <span className="font-medium">{g.groupId}</span>
                            <Badge>{g.moduleId}</Badge>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        {t.teacher_profile_no_groups}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Teaching History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" /> {t.teacher_profile_history}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="max-h-64 overflow-auto px-2">
                      <ul className="space-y-3 flex justify-start flex-col gap-0">
                        {teacherInfo.teachingHistory.map((h: any) => (
                          <li
                            key={h._id}
                            className="flex flex-col border-l-2 pl-3 relative"
                          >
                            <span
                              className={`absolute -left-[7px] top-1 w-3 h-3 rounded-full ${h.reason === "assigned"
                                ? "bg-green-500"
                                : "bg-red-500"
                                }`}
                            ></span>
                            <p className="text-sm">
                              <span className="font-semibold">{h.groupId}</span>{" "}
                              – {h.moduleId || "N/A"}
                            </p>
                            <p
                              className={`text-xs ${h.reason === "assigned"
                                ? "text-green-600"
                                : "text-red-600"
                                }`}
                            >
                              {h.reason.toUpperCase()} –{" "}
                              {new Date(h.timestamp).toLocaleString()}
                            </p>
                            <Separator className="my-2" />
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Enter Grades Modal */}
      <Dialog open={gradeModalOpen} onOpenChange={setGradeModalOpen}>
        {!loadingDialogue && selectedGroup ? (
          <>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>{t.teacher_grades_enter} - {selectedGroup?.groupName}</span>
                </DialogTitle>
                <DialogDescription>
                  {t.teacher_modal_grades_description}{" "}
                  <span className="font-semibold">{selectedGroup.subject}</span>
                  . {t.teacher_modal_grades_module}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2 p-3 bg-gray-50 rounded-lg font-semibold text-sm">
                  <div>{t.teacher_student_name}</div>
                  <div className="text-center">{t.teacher_constant_observation}</div>
                  <div className="text-center">{t.dev1} </div>
                  <div className="text-center">{t.dev2}</div>
                  <div className="text-center">{t.exam}</div>
                  <div className="text-center">{t.studentdash_grades_finalgrade}</div>
                  <div className="text-center">{t.actions}</div>
                </div>
                {selectedGroup.students.map((student) => {
                  // Get the current grades for this student from our state
                  var currentGrades = editableGrades[student.studentId] || {};
                  var originalMarks = student.marks[selectedTrimester] || {
                    value: 0,
                  };

                  return (
                    <div
                      key={student.studentId} // Use a stable ID
                      className="grid grid-cols-7 gap-2 p-3 border rounded-lg items-center"
                    >
                      <div className="font-medium">{student.full_name}</div>

                      {/* 👇 4. UPDATE ALL INPUTS LIKE THIS */}
                      <div>
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.1"
                          placeholder="--"
                          className="text-center"
                          value={currentGrades.constant_observation ?? ""}
                          onChange={(e) =>
                            handleGradeInputChange(
                              student.studentId,
                              "constant_observation",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.1"
                          placeholder="--"
                          className="text-center"
                          value={currentGrades.dev1 ?? ""}
                          onChange={(e) =>
                            handleGradeInputChange(
                              student.studentId,
                              "dev1",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.1"
                          placeholder="--"
                          className="text-center"
                          value={currentGrades.dev2 ?? ""}
                          onChange={(e) =>
                            handleGradeInputChange(
                              student.studentId,
                              "dev2",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.1"
                          placeholder="--"
                          className="text-center"
                          value={currentGrades.exam ?? ""}
                          onChange={(e) =>
                            handleGradeInputChange(
                              student.studentId,
                              "exam",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="w-full flex justify-center items-center">
                        <Badge className={getGradeColor(originalMarks.value)}>
                          {originalMarks.value.toFixed(1)}/20
                        </Badge>
                      </div>
                      <div className="flex justify-center">
                        {/* 👇 5. WIRE UP THE SAVE BUTTON */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateStudentMarks(
                              selectedGroup.groupId,
                              selectedGroup.subject, // This is the moduleId
                              student.studentId,
                              currentGrades // Pass the updates from our state
                            )
                          }
                          disabled={loadingDialogue} // Optional: disable while saving
                        >
                          {loadingDialogue ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setGradeModalOpen(false)}
                >
                  Close
                </Button>
                {/* <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save All Grades
                </Button> */}
              </div>
            </DialogContent>
          </>
        ) : (
          <>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{t.teacher_modal_grades_loading}</span>
                </DialogTitle>
                <DialogDescription>
                  {t.teacher_modal_grades_description1}
                </DialogDescription>
              </DialogHeader>

              <div className="w-6xl h-[30vh] flex flex-col justify-center items-center gap-2">
                <Loader2 className="w-9 h-9 text-blue-500 animate-spin" />
                <span>{t.teacher_modal_loading} </span>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Group Details Modal */}
      <Dialog
        open={groupDetailsModalOpen}
        onOpenChange={setGroupDetailsModalOpen}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {loadingDialogue ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{t.Loading_Group_Details} </span>
                </DialogTitle>
                <DialogDescription>
                  {t.teacher_groupdetails_info}
                </DialogDescription>
              </DialogHeader>

              <div className="w-6xl h-[90vh] flex flex-col justify-center items-center gap-2">
                <Loader2 className="w-9 h-9 text-blue-500 animate-spin" />
                <span>{t.teacher_modal_loading} </span>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{t.teacher_groupdetails_title} - {selectedGroup?.groupName}</span>
                </DialogTitle>
                <DialogDescription>
                  {t.teacher_groupdetails_info}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Group Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-blue-600">
                          {selectedGroup?.students.length || 0}
                        </p>
                        <p className="text-sm text-gray-600">{t.teacher_groupdetails_students}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-600">
                          {selectedGroup?.subject || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">{t.teacher_groupdetails_subject}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <GraduationCap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-purple-600">
                          {selectedGroup?.level || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">{t.teacher_groupdetails_level}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-orange-600">
                          {selectedGroup?.avgGrade.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">{t.teacher_grades_class_average}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Group Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t.groupInformation} </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            {t.teacher_groupdetails_group_name}:
                          </span>
                          <span className="font-semibold">
                            {selectedGroup?.groupName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            {t.teacher_groupdetails_subject}:
                          </span>
                          <Badge variant="secondary">
                            {selectedGroup?.subject}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            {t.teacher_groupdetails_level}:
                          </span>
                          <Badge variant="outline">
                            {selectedGroup?.level}
                          </Badge>
                        </div>
                        {selectedGroup?.season && (
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              {t.teacher_groupdetails_academic_year}:
                            </span>
                            <span>
                              <Badge>
                                20{selectedGroup?.season.slice(0, 2)}/20
                                {selectedGroup?.season.slice(2)}
                              </Badge>
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            {t.teacher_groupdetails_students}:
                          </span>
                          <span className="font-semibold">
                            {selectedGroup?.students.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            {t.teacher_groupdetails_active_students}:
                          </span>
                          <span className="text-green-600 font-semibold">
                            {selectedGroup?.students.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t.teacher_groupdetails_statistics}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">
                            {t.teacher_groupdetails_grade_distribution}
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{t.teacher_groupdetails_distribution_excellent}</span>
                              <div className="flex items-center space-x-2">
                                <Progress
                                  value={
                                    (selectedGroup?.gradeDistribution[
                                      "excellent"
                                    ] /
                                      selectedGroup?.students.length) *
                                    100
                                  }
                                  className="w-24 h-2"
                                />
                                <span className="text-sm font-medium w-12 text-end">
                                  {(
                                    (selectedGroup?.gradeDistribution[
                                      "excellent"
                                    ] /
                                      selectedGroup?.students.length) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm">{t.teacher_groupdetails_distribution_good}</span>
                              <div className="flex items-center space-x-2">
                                <Progress
                                  value={
                                    (selectedGroup?.gradeDistribution["good"] /
                                      selectedGroup?.students.length) *
                                    100
                                  }
                                  className="w-24 h-2"
                                />
                                <span className="text-sm font-medium w-12 text-end">
                                  {(
                                    (selectedGroup?.gradeDistribution["good"] /
                                      selectedGroup?.students.length) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm">
                                {t.teacher_groupdetails_distribution_average}
                              </span>
                              <div className="flex items-center space-x-2">
                                <Progress
                                  value={
                                    (selectedGroup?.gradeDistribution[
                                      "average"
                                    ] /
                                      selectedGroup?.students.length) *
                                    100
                                  }
                                  className="w-24 h-2"
                                />
                                <span className="text-sm font-medium w-12 text-end">
                                  {(
                                    (selectedGroup?.gradeDistribution[
                                      "average"
                                    ] /
                                      selectedGroup?.students.length) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm">
                                {t.teacher_groupdetails_distribution_needs}
                              </span>
                              <div className="flex items-center space-x-2">
                                <Progress
                                  value={
                                    (selectedGroup?.gradeDistribution[
                                      "needsImprovement"
                                    ] /
                                      selectedGroup?.students.length) *
                                    100
                                  }
                                  className="w-24 h-2"
                                />
                                <span className="text-sm font-medium w-12 text-end">
                                  {(
                                    (selectedGroup?.gradeDistribution[
                                      "needsImprovement"
                                    ] /
                                      selectedGroup?.students.length) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">
                            {t.teacher_groupdetails_attendance_overview}
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{t.teacher_groupdetails_attendance_presence}</span>
                              <div className="flex items-center space-x-2">
                                <Progress
                                  value={
                                    (selectedGroup?.attendanceSummary
                                      .attendanceDistribution["present"] /
                                      (selectedGroup?.attendanceSummary
                                        .attendanceDistribution["present"] +
                                        selectedGroup?.attendanceSummary
                                          .attendanceDistribution["late"] +
                                        selectedGroup?.attendanceSummary
                                          .attendanceDistribution["absent"])) *
                                    100 || 0
                                  }
                                  className="w-24 h-2"
                                />
                                <span className="text-sm font-medium w-12 text-end">
                                  {(selectedGroup?.attendanceSummary
                                    .attendanceDistribution["present"] /
                                    (selectedGroup?.attendanceSummary
                                      .attendanceDistribution["present"] +
                                      selectedGroup?.attendanceSummary
                                        .attendanceDistribution["late"] +
                                      selectedGroup?.attendanceSummary
                                        .attendanceDistribution["absent"])) *
                                    100 || 0}
                                  %
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{t.teacher_groupdetails_attendance_lateness}</span>
                              <div className="flex items-center space-x-2">
                                <Progress
                                  value={
                                    (selectedGroup?.attendanceSummary
                                      .attendanceDistribution["late"] /
                                      (selectedGroup?.attendanceSummary
                                        .attendanceDistribution["present"] +
                                        selectedGroup?.attendanceSummary
                                          .attendanceDistribution["late"] +
                                        selectedGroup?.attendanceSummary
                                          .attendanceDistribution["absent"])) *
                                    100 || 0
                                  }
                                  className="w-24 h-2"
                                />
                                <span className="text-sm font-medium w-12 text-end">
                                  {(selectedGroup?.attendanceSummary
                                    .attendanceDistribution["late"] /
                                    (selectedGroup?.attendanceSummary
                                      .attendanceDistribution["present"] +
                                      selectedGroup?.attendanceSummary
                                        .attendanceDistribution["late"] +
                                      selectedGroup?.attendanceSummary
                                        .attendanceDistribution["absent"])) *
                                    100 || 0}
                                  %
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{t.teacher_groupdetails_attendance_absence}</span>
                              <div className="flex items-center space-x-2">
                                <Progress
                                  value={
                                    (selectedGroup?.attendanceSummary
                                      .attendanceDistribution["absent"] /
                                      (selectedGroup?.attendanceSummary
                                        .attendanceDistribution["present"] +
                                        selectedGroup?.attendanceSummary
                                          .attendanceDistribution["late"] +
                                        selectedGroup?.attendanceSummary
                                          .attendanceDistribution["absent"])) *
                                    100 || 0
                                  }
                                  className="w-24 h-2"
                                />
                                <span className="text-sm font-medium w-12 text-end">
                                  {(selectedGroup?.attendanceSummary
                                    .attendanceDistribution["absent"] /
                                    (selectedGroup?.attendanceSummary
                                      .attendanceDistribution["present"] +
                                      selectedGroup?.attendanceSummary
                                        .attendanceDistribution["late"] +
                                      selectedGroup?.attendanceSummary
                                        .attendanceDistribution["absent"])) *
                                    100 || 0}
                                  %
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Student List */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t.teacher_groupdetails_student_list}</CardTitle>
                    <CardDescription>
                      {t.teacher_groupdetails_student_list_desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3">#</th>
                            <th className="text-left p-3">{t.teacher_student_name}</th>
                            <th className="text-center p-3">{t.overall_grade} </th>
                            <th className="text-center p-3">{t.tabAttendance} </th>
                            <th className="text-center p-3">{t.asset_status} </th>
                            {/* <th className="text-center p-3">Actions</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {selectedGroup?.students.map((student, index) => (
                            <tr
                              key={index}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-3 font-medium">{index + 1}</td>
                              <td className="p-3 font-medium">
                                {student.full_name}
                              </td>
                              <td className="text-center">
                                <div className="flex justify-center items-center gap-2">
                                  <Badge
                                    className={getGradeColor(
                                      student.marks[
                                        "trimester_1"
                                      ].value.toFixed(1)
                                    )}
                                  >
                                    T1:{" "}
                                    {student.marks["trimester_1"].value.toFixed(
                                      1
                                    )}
                                    /20
                                  </Badge>
                                  <Badge
                                    className={getGradeColor(
                                      student.marks[
                                        "trimester_2"
                                      ].value.toFixed(1)
                                    )}
                                  >
                                    T2:{" "}
                                    {student.marks["trimester_2"].value.toFixed(
                                      1
                                    )}
                                    /20
                                  </Badge>
                                  <Badge
                                    className={getGradeColor(
                                      student.marks[
                                        "trimester_3"
                                      ].value.toFixed(1)
                                    )}
                                  >
                                    T3:{" "}
                                    {student.marks["trimester_3"].value.toFixed(
                                      1
                                    )}
                                    /20
                                  </Badge>
                                  <Badge
                                    className={getGradeColor(
                                      (student.marks["trimester_1"].value +
                                        student.marks["trimester_2"].value +
                                        student.marks["trimester_3"].value) /
                                      3
                                    )}
                                  >
                                    OA:{" "}
                                    {(
                                      (student.marks["trimester_1"].value +
                                        student.marks["trimester_2"].value +
                                        student.marks["trimester_3"].value) /
                                      3
                                    ).toFixed(1)}
                                    /20
                                  </Badge>
                                </div>
                              </td>
                              <td className="text-center p-3">
                                <Badge
                                  className={`${getGradeColor(
                                    (
                                      (student.attendance["present"] +
                                        student.attendance["late"]) /
                                      (student.attendance["present"] +
                                        student.attendance["late"] +
                                        student.attendance["absent"])
                                    ).toFixed(2) * 20
                                  )} hover:bg-gray-200`}
                                >
                                  {(
                                    (student.attendance["present"] +
                                      student.attendance["late"]) /
                                    (student.attendance["present"] +
                                      student.attendance["late"] +
                                      student.attendance["absent"])
                                  ).toFixed(2) * 100}
                                  %
                                </Badge>
                              </td>
                              <td className="text-center p-3">
                                <Badge
                                  variant="outline"
                                  className="text-green-700 bg-green-50"
                                >
                                  {t.status_active}
                                </Badge>
                              </td>
                              {/* <td className="text-center p-3">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t.teacher_groupdetails_quick_actions} </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="flex items-center justify-center space-x-2"
                        onClick={() => {
                          setGroupDetailsModalOpen(false);
                          openGradeModal(selectedGroup);
                        }}
                      >
                        <FileText className="w-4 h-4" />
                        <span>Enter Grades</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center justify-center space-x-2"
                        onClick={() => {
                          setGroupDetailsModalOpen(false);
                          openAttendanceModal(
                            selectedGroup,
                            getGroupDate(selectedGroup?.id)
                          );
                        }}
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>{t.teacher_attendance_modal_title} </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setGroupDetailsModalOpen(false)}
                >
                  {t.teacher_modal_grades_close}
                </Button>
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  {t.teacher_groupdetails_export}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Mark Attendance Modal */}
      <Dialog open={attendanceModalOpen} onOpenChange={setAttendanceModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {!loadingDialogue ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5" />
                  <span>{t.teacher_attendance_modal_title} - {attendaceGroup?.groupName}</span>
                </DialogTitle>
                <DialogDescription>
                  {t.teacher_attendance_modal_description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-semibold">
                      {t.teacher_groupdetails_class}: {attendaceGroup?.groupName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t.date}: {new Date().toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t.teacher_groupdetails_subject}: {attendaceGroup?.subject}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t.teacher_total_students}: {attendaceGroup?.students.length}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {attendaceGroup?.attendanceSummary.from} /{" "}
                      {attendaceGroup?.attendanceSummary.to}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t.tracking_status_present}:{" "}
                      {
                        attendaceGroup?.attendanceSummary
                          .attendanceDistribution["present"]
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      {t.tracking_status_absent}:{" "}
                      {
                        attendaceGroup?.attendanceSummary
                          .attendanceDistribution["absent"]
                      }
                    </p>
                  </div>
                </div>

                {attendaceGroup && (
                  <div className="space-y-3">
                    {/* {attendaceGroup?.students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                          id={`student-${student.id}`}
                          defaultChecked={student.present}
                        />
                          <label
                            htmlFor={`student-${student.id}`}
                            className="font-medium "
                          >
                            {student.full_name}
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              student.present ? "default" : "destructive"
                            }
                          >
                            {student.present ? "Present" : "Absent"}
                          </Badge>
                          <Select defaultValue="present">
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="present">Present</SelectItem>
                              <SelectItem value="absent">Absent</SelectItem>
                              <SelectItem value="late">Late</SelectItem>
                              <SelectItem value="excused">Excused</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))} */}
                    <div className="flex flex-wrap justify-start items-center gap-2">
                      <span className={"text-gray-500"}>{t.teacher_session}: </span>
                      {attendaceGroup.weeklySchedule.map((session, indx) => {
                        if (session.moduleId === attendaceGroup.subject)
                          return (
                            <Button
                              key={indx}
                              onClick={() => {
                                setSelectedSessionAttendance(session);
                              }}
                              // variant={
                              //   session._id === selectedSessionAttendance?._id
                              //     ? "outline"
                              //     : "default"
                              // }
                              disabled={
                                session._id === selectedSessionAttendance?._id
                              }
                              className={
                                session._id === selectedSessionAttendance?._id
                                  ? "cursor-not-allowed"
                                  : "cursor-pointer"
                              }
                            >
                              {session.day} {session.startTime} -{" "}
                              {session.endTime}
                            </Button>
                          );
                      })}
                    </div>
                    {attendaceGroup?.students.map((student, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        {/* Student name */}
                        <div className="flex items-center space-x-3">
                          <label className="font-medium">
                            {student.full_name}
                          </label>
                        </div>

                        {/* Attendance controls */}
                        {selectedSessionAttendance ? (
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                student.status === "absent" ||
                                  student.status === "late"
                                  ? "destructive"
                                  : // : student.status === "late"
                                  // ? "secondary"
                                  "default"
                              }
                              className={
                                student.status === "late"
                                  ? "bg-orange-600"
                                  : student.status === "absent"
                                    ? ""
                                    : "bg-green-600"
                              }
                            >
                              {student.status === "absent"
                                ? "Absent"
                                : student.status === "late"
                                  ? "Late"
                                  : "Present"}
                            </Badge>

                            {/* Buttons */}
                            <div className="flex space-x-1">
                              {(student.status === "late" ||
                                student.status === "absent") && (
                                  <Button
                                    size="sm"
                                    variant={"outline"}
                                    className={
                                      "border-green-600 text-green-600 hover:text-green-500"
                                    }
                                    onClick={() => {
                                      setAttendanceGroup((prev) => ({
                                        ...prev,
                                        students: prev.students.map((s, i) =>
                                          i === idx
                                            ? {
                                              ...s,
                                              // lateTime:
                                              //   s.status === "late"
                                              //     ? null
                                              //     : s.lateTime,
                                              status: null,
                                              lateTime: null,
                                            }
                                            : s
                                        ),
                                      }));
                                    }}
                                  >
                                    Present
                                  </Button>
                                )}
                              <Button
                                size="sm"
                                variant={
                                  student.status === "late"
                                    ? "destructive"
                                    : "outline"
                                }
                                className={
                                  student.status !== "late"
                                    ? "text-orange-600 border-orange-600 hover:text-orange-600 font-semibold"
                                    : "bg-orange-600 hover:bg-orange-400"
                                }
                                onClick={() => {
                                  setAttendanceGroup((prev) => ({
                                    ...prev,
                                    students: prev.students.map((s, i) =>
                                      i === idx
                                        ? {
                                          ...s,
                                          // lateTime:
                                          //   s.status === "late"
                                          //     ? null
                                          //     : s.lateTime,
                                          status: "late",
                                        }
                                        : s
                                    ),
                                  }));
                                }}
                              >
                                Late{" "}
                                {student.status === "late" && (
                                  <input
                                    type="time"
                                    className="rounded-md text-sm bg-transparent outline-none border-orange-600 text-white-600"
                                    value={student.lateTime || ""}
                                    onChange={(e) =>
                                      setAttendanceGroup((prev) => ({
                                        ...prev,
                                        students: prev.students.map((s, i) =>
                                          i === idx
                                            ? { ...s, lateTime: e.target.value }
                                            : s
                                        ),
                                      }))
                                    }
                                  />
                                )}
                                {/* <Clock /> */}
                              </Button>

                              {/* Show time input if late */}

                              <Button
                                size="sm"
                                variant={
                                  student.status === "absent"
                                    ? "destructive"
                                    : "outline"
                                }
                                className={
                                  student.status !== "absent" &&
                                  "text-red-600 border-red-600 hover:text-red-600 font-semibold"
                                }
                                onClick={() => {
                                  setAttendanceGroup((prev) => ({
                                    ...prev,
                                    students: prev.students.map((s, i) =>
                                      i === idx
                                        ? {
                                          ...s,
                                          status:
                                            s.status === "absent"
                                              ? null
                                              : "absent",
                                          lateTime: null,
                                        }
                                        : s
                                    ),
                                  }));
                                }}
                              >
                                {t.tracking_status_absent} <X />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className={"text-sm text-red-600/50"}>
                              {t.teacher_select_session}:
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes">{t.teacher_notes_optional} </Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes about today's attendance..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              <div className="flex justify-end items-center space-x-2 pt-4">
                {markingAttendanceMessage && (
                  <span
                    className={
                      markingAttendanceMessage.succ
                        ? "text-gray-500 text-sm"
                        : "text-red-500 text-sm"
                    }
                  >
                    {markingAttendanceMessage.msg}
                  </span>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setAttendanceModalOpen(false);
                    fetchData();
                  }}
                >
                  {t.teacher_modal_grades_close}
                </Button>
                <Button
                  disabled={
                    selectedSessionAttendance === null || markingAttendance
                  }
                  onClick={() => {
                    handleAttendanceMarking();
                  }}
                >
                  {markingAttendance ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2 " />
                  )}
                  {t.Save_Attendance}
                </Button>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5" />
                  <span>{t.Loading_Group_Details}</span>
                </DialogTitle>
                <DialogDescription>
                  {t.teacher_attendance_modal_description}
                </DialogDescription>
              </DialogHeader>
              <div className="w-6xl h-[50vh] flex flex-col justify-center items-center gap-2">
                <Loader2 className="w-9 h-9 text-blue-500 animate-spin" />
                <span>{t.teacher_modal_loading}</span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
