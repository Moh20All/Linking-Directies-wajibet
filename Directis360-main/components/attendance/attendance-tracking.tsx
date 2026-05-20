"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"; // 🔹 Import Progress
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  CalendarDays,
  ShieldAlert,
  Save,
  Loader2,
  Check,
  UserX,
} from "lucide-react";
import {
  AttendanceMember,
  AttendanceRecordPayload,
  getAttendanceForDate,
  saveAttendanceForDate,
} from "@/services/staffAttendanceService";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/language-context";

interface AttendanceTrackingProps {
  staffMembers: AttendanceMember[];
  getFreshToken: () => Promise<string | null>;
}

const getCurrentTime = () => new Date().toTimeString().slice(0, 5);

export default function AttendanceTracking({
  staffMembers,
  getFreshToken,
}: AttendanceTrackingProps) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const [dailyRecords, setDailyRecords] = useState<
    Map<string, AttendanceRecordPayload>
  >(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { t, isRTL } = useLanguage()

  // Effect to fetch attendance records when date changes
  useEffect(() => {
    const fetchRecords = async () => {
      const token = await getFreshToken();
      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }
      setIsLoading(true);
      try {
        const data = await getAttendanceForDate(token, selectedDate);
        const recordsMap = new Map<string, AttendanceRecordPayload>();
        if (data) {
          data.records.forEach((record) => {
            const memberId =
              typeof record.memberId === "string"
                ? record.memberId
                : record.memberId._id; // extract _id if it's an object
            recordsMap.set(memberId, { ...record, memberId });
          });
        }
        setDailyRecords(recordsMap);
      } catch (error) {
        console.error("Failed to fetch attendance records:", error);
        toast.error(t.tracking_fetch_error);
        setDailyRecords(new Map());
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecords();
  }, [selectedDate, getFreshToken]);

  const departments = useMemo(() => {
    const depts = [
      ...new Set(staffMembers.map((staff) => staff.department || "General")),
    ];
    return depts.sort();
  }, [staffMembers]);

  const filteredStaff = useMemo(() => {
    return staffMembers.filter((staff) => {
      const matchesSearch = staff.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDepartment =
        departmentFilter === "all" || staff.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [staffMembers, searchTerm, departmentFilter]);

  // 🔹 Calculate real-time stats for the tracking page
  const stats = useMemo(() => {
    const total = filteredStaff.length;
    // Count how many of the currently filtered staff have a record in the dailyRecords map
    const marked = filteredStaff.filter((staff) =>
      dailyRecords.has(staff._id)
    ).length;
    const unmarked = total - marked;
    const progress = total > 0 ? (marked / total) * 100 : 0;
    return { total, marked, unmarked, progress };
  }, [filteredStaff, dailyRecords]);

  const handleTimeChange = (memberId: string, time: string) => {
    const newRecords = new Map(dailyRecords);
    const existingRecord = newRecords.get(memberId);
    if (existingRecord) {
      newRecords.set(memberId, { ...existingRecord, attendanceTime: time });
      setDailyRecords(newRecords);
    }
  };

  const handleStatusChange = (
    memberId: string,
    memberName: string,
    status: AttendanceRecordPayload["status"]
  ) => {
    const newRecords = new Map(dailyRecords);
    const existingRecord = newRecords.get(memberId);

    if (existingRecord && existingRecord.status === status) {
      newRecords.delete(memberId);
    } else {
      newRecords.set(memberId, {
        memberId,
        memberName,
        status,
        attendanceTime:
          status === t.attendance_status_present || status === t.attendance_status_late
            ? existingRecord?.attendanceTime || getCurrentTime() // Preserve existing time if available
            : undefined,
      });
    }
    setDailyRecords(newRecords);
  };

  const handleSaveChanges = async () => {
    const token = await getFreshToken();
    if (!token) {
      toast.error(t.tracking_auth_missing);
      return;
    }

    setIsSaving(true);
    try {
      const recordsPayload = Array.from(dailyRecords.values());
      await saveAttendanceForDate(token, selectedDate, recordsPayload);
      toast.success(t.tracking_save_success);
    } catch (error) {
      console.error("Failed to save attendance:", error);
      toast.error(t.tracking_save_error);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (record: AttendanceRecordPayload | undefined) => {
    if (!record)
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
          {t.tracking_status_not_marked}
        </Badge>
      );
    // ... (rest of the function is unchanged)
    switch (record.status) {
      case "Present":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            {t.attendance_status_present}
          </Badge>
        );
      case "Absent":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            {t.attendance_status_absent}
          </Badge>
        );
      case "Late":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            {t.attendance_status_late}
          </Badge>
        );
      case "Justified Absence":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            {t.attendance_status_justified}
          </Badge>
        );
      case "Holiday":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            {t.attendance_status_holiday}
          </Badge>
        );
      case "Rest Day":
        return (
          <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">
            {t.attendance_status_rest}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{t.attendance_status_unknown}</Badge>;
    }
  };

  const statusOptions: AttendanceRecordPayload["status"][] = [
    "Present",
    "Absent",
    "Late",
    "Justified Absence",
    "Holiday",
    "Rest Day",
  ];
  const buttonVariants: Record<
    string,
    { className: string; icon: React.ReactNode }
  > = {
    Present: {
      className: "text-green-600 hover:bg-green-50 border-green-300",
      icon: <CheckCircle className="w-4 h-4 mr-1" />,
    },
    Absent: {
      className: "text-red-600 hover:bg-red-50 border-red-300",
      icon: <XCircle className="w-4 h-4 mr-1" />,
    },
    Late: {
      className: "text-yellow-600 hover:bg-yellow-50 border-yellow-300",
      icon: <AlertCircle className="w-4 h-4 mr-1" />,
    },
    "Justified Absence": {
      className: "text-blue-600 hover:bg-blue-50 border-blue-300",
      icon: <ShieldAlert className="w-4 h-4 mr-1" />,
    },
    Holiday: {
      className: "text-purple-600 hover:bg-purple-50 border-purple-300",
      icon: <CalendarDays className="w-4 h-4 mr-1" />,
    },
    "Rest Day": {
      className: "text-indigo-600 hover:bg-indigo-50 border-indigo-300",
      icon: <Clock className="w-4 h-4 mr-1" />,
    },
  };

  return (
    <div className="space-y-6">
      {/* 🔹 New Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t.tracking_daily_progress_title}</CardTitle>
          <CardDescription>
            {t.tracking_daily_progress_desc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Users className="mx-auto w-6 h-6 text-blue-600 mb-1" />
              <div className="text-2xl font-bold text-blue-800">
                {stats.total}
              </div>
              <div className="text-sm text-blue-700">{t.tracking_total_staff}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <Check className="mx-auto w-6 h-6 text-green-600 mb-1" />
              <div className="text-2xl font-bold text-green-800">
                {stats.marked}
              </div>
              <div className="text-sm text-green-700">{t.tracking_marked}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <UserX className="mx-auto w-6 h-6 text-gray-600 mb-1" />
              <div className="text-2xl font-bold text-gray-800">
                {stats.unmarked}
              </div>
              <div className="text-sm text-gray-700">{t.tracking_unmarked}</div>
            </div>
          </div>
          <div className="mt-4">
            <Label className="text-sm font-medium">
              {t.tracking_completion}: {stats.progress.toFixed(0)}%
            </Label>
            <Progress value={stats.progress} className="w-full mt-1" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t.tracking_attendance_title}</CardTitle>
          <CardDescription>
            {t.tracking_attendance_desc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="date" className="font-medium">
                {t.tracking_select_date}
              </Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full mt-1"
              />
            </div>
            <div>
              <Label htmlFor="search" className="font-medium">
                {t.tracking_search_staff}
              </Label>
              <Input
                id="search"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="department" className="font-medium">
                {t.tracking_department}
              </Label>
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger id="department" className="w-full mt-1">
                  <SelectValue placeholder="Filter..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.tracking_all_departments}</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end border-t pt-4">
            <Button
              onClick={handleSaveChanges}
              disabled={isSaving || isLoading}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {t.tracking_save_btn}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.tracking_staff_list} ({filteredStaff.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-gray-400" />
              <p className="mt-2">{t.tracking_loading_records} {selectedDate}...</p>
            </div>
          ) : filteredStaff.length > 0 ? (
            <div className="space-y-3">
              {filteredStaff.map((staff) => {
                const attendanceRecord = dailyRecords.get(staff._id);
                console.log("staff record : ", staff);
                return (
                  <div
                    key={staff._id}
                    className="border rounded-lg p-4 bg-white"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* ... unchanged JSX for staff member item ... */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{staff.name}</h3>
                        <p className="text-sm text-gray-500">
                          {staff.department}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center w-24">
                          <div className="text-xs text-gray-500 mb-1">
                            {t.tracking_status_label}
                          </div>
                          {getStatusBadge(attendanceRecord)}
                        </div>

                        {(attendanceRecord?.status === t.attendance_status_present ||
                          attendanceRecord?.status === t.attendance_status_late) && (
                          <div className="text-center flex gap-3 items-center">
                            <div className="text-xs text-gray-500 mb-1 text-nowrap">
                              {t.tracking_showing_time}
                            </div>
                            <Input
                              type="time"
                              value={
                                attendanceRecord.attendanceTime ||
                                getCurrentTime()
                              }
                              onChange={(e) =>
                                handleTimeChange(staff._id, e.target.value)
                              }
                              className="text-sm"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
                        {statusOptions.map((status) => {
                          const isActive = attendanceRecord?.status === status;
                          const variantInfo = buttonVariants[status];
                          return (
                            <Button
                              key={status}
                              size="sm"
                              variant={isActive ? "default" : "outline"}
                              onClick={() =>
                                handleStatusChange(
                                  staff._id,
                                  staff.name,
                                  status
                                )
                              }
                              className={
                                isActive
                                  ? status === t.attendance_status_present
                                    ? "bg-green-600 hover:bg-green-700"
                                    : status === t.attendance_status_absent
                                    ? "bg-red-600 hover:bg-red-700"
                                    : status === t.attendance_status_late
                                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                    : "bg-gray-600 hover:bg-gray-700"
                                  : variantInfo.className
                              }
                            >
                              {variantInfo.icon}
                              {status === t.attendance_status_justified
                                ? t.attendance_status_justified
                                : status}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium">{t.tracking_no_staff_found}</h3>
              <p className="text-gray-500">
                {t.tracking_no_staff_filter}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
