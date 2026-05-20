"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Users,
  Calendar,
  Download,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import {
  AttendanceMember,
  DailyAttendance,
  getAttendanceForDate,
} from "@/services/staffAttendanceService";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/language-context";


interface AttendanceOverviewProps {
  staffMembers: AttendanceMember[];
  getFreshToken: () => Promise<string | null>;
}

export default function AttendanceOverview({
  staffMembers,
  getFreshToken,
}: AttendanceOverviewProps) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const { t, isRTL } = useLanguage()

  const [dailyAttendance, setDailyAttendance] =
    useState<DailyAttendance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  useEffect(() => {
    const fetchDailyData = async () => {
      const token = (await getFreshToken()) || "";
      setIsLoading(true);
      try {
        const data = await getAttendanceForDate(token, selectedDate);
        setDailyAttendance(data);
      } catch (error) {
        setDailyAttendance(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDailyData();
  }, [selectedDate]);

  const departments = useMemo(() => {
    const depts = [
      ...new Set(staffMembers.map((staff) => staff.department || "General")),
    ];
    return depts.sort();
  }, [staffMembers]);

  const stats = useMemo(() => {
    const filteredStaff =
      departmentFilter === "all"
        ? staffMembers
        : staffMembers.filter((staff) => staff.department === departmentFilter);

    const totalStaff = filteredStaff.length;
    const recordsForDate =
      dailyAttendance?.records.filter((record) =>
        filteredStaff.some((staff) => staff._id === record.memberId._id)
      ) || [];

    const present = recordsForDate.filter((r) => r.status === "Present").length;
    const absent = recordsForDate.filter((r) => r.status === "Absent").length;
    const late = recordsForDate.filter((r) => r.status === "Late").length;
    const justified = recordsForDate.filter(
      (r) => r.status === "Justified Absence"
    ).length;
    const holiday = recordsForDate.filter((r) => r.status === "Holiday").length;
    const restDay = recordsForDate.filter(
      (r) => r.status === "Rest Day"
    ).length;
    const unmarked = totalStaff - recordsForDate.length;

    const attendanceRate =
      totalStaff > 0
        ? (((present + late) / totalStaff) * 100).toFixed(1)
        : "0.0";

    return {
      totalStaff,
      present,
      absent,
      late,
      justified,
      holiday,
      restDay,
      unmarked,
      attendanceRate,
    };
  }, [staffMembers, dailyAttendance, departmentFilter]);

  const departmentStats = useMemo(() => {
    return departments
      .map((dept) => {
        const deptStaff = staffMembers.filter(
          (staff) => staff.department === dept
        );
        const deptRecords =
          dailyAttendance?.records.filter((record) =>
            deptStaff.some((staff) => staff._id === record.memberId._id)
          ) || [];

        const present = deptRecords.filter(
          (r) => r.status === "Present"
        ).length;
        const late = deptRecords.filter((r) => r.status === "Late").length;
        const total = deptStaff.length;
        const rate =
          total > 0 ? (((present + late) / total) * 100).toFixed(1) : "0.0";

        return {
          department: dept,
          total,
          present,
          absent: deptRecords.filter((r) => r.status === "Absent").length,
          late,
          justified: deptRecords.filter((r) => r.status === "Justified Absence")
            .length,
          rate,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [departments, staffMembers, dailyAttendance]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Present":
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case "Absent":
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
      case "Late":
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>;
      case "Justified Absence":
        return <Badge className="bg-blue-100 text-blue-800">Justified</Badge>;
      case "Holiday":
        return <Badge className="bg-purple-100 text-purple-800">Holiday</Badge>;
      case "Rest Day":
        return (
          <Badge className="bg-indigo-100 text-indigo-800">Rest Day</Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleExport = () => {
    if (!staffMembers || staffMembers.length === 0) {
      toast.error(t.attendance_pdf_no_data);
      return;
    }

    setIsExporting(true);
    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(16);
      doc.text(t.attendance_pdf_title, 14, 20);

      // Metadata
      doc.setFontSize(11);
      doc.text(`${t.attendance_pdf_date}: ${selectedDate}`, 14, 28);
      doc.text(
        `${t.attendance_pdf_department}: ${
          departmentFilter === "all" ? t.attendance_all_departments : departmentFilter
        }`,
        14,
        34
      );
      doc.text(`${t.attendance_pdf_generated}: ${new Date().toLocaleString()}`, 14, 40);

      // Table headers
      const headers = [
        [t.attendance_pdf_headers_name, t.attendance_pdf_headers_department, t.attendance_pdf_headers_role, t.attendance_pdf_headers_status, t.attendance_pdf_headers_time, t.attendance_pdf_headers_remarks],
      ];

      // 🔹 Apply filter to staff first
      const filteredStaff =
        departmentFilter === "all"
          ? staffMembers
          : staffMembers.filter(
              (staff) => staff.department === departmentFilter
            );

      // 🔹 Build table data including unmarked
      const data = filteredStaff.map((staff) => {
        const record = dailyAttendance?.records.find(
          (rec) => rec.memberId?._id === staff._id
        );

        const role = staff.role || "UNKNOWN";
        const name = staff.full_name || staff.name || "Unnamed";
        const department =
          role === "TEACHER" ? "Academic" : staff.department || "General";

        return [
          name,
          department,
          role,
          record ? record.status : "Unmarked", // include unmarked
          record?.attendanceTime || "",
          record?.remarks || "",
        ];
      });

      // Generate table
      autoTable(doc, {
        startY: 50,
        head: headers,
        body: data,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 133, 244] }, // blue header
      });

      // Save file
      doc.save(
        `attendance_${departmentFilter}_${selectedDate}.pdf`.replace(
          /\s+/g,
          "_"
        )
      );
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(t.attendance_pdf_export_error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t.attendance_overview_title}
          </CardTitle>
          <CardDescription>
            {t.attendance_overview_desc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="overview-date" className="font-medium">
                {t.attendance_select_date}
              </Label>
              <Input
                id="overview-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full max-w-xs mt-1"
              />
            </div>
            <div className="flex gap-2 items-end">
              <div>
                <Label htmlFor="dept-filter" className="font-medium">
                  {t.attendance_department_label}
                </Label>
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
                  <SelectTrigger
                    id="dept-filter"
                    className="w-full md:w-48 mt-1"
                  >
                    <SelectValue placeholder={t.tracking_filter_placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.attendance_all_departments}</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                className="bg-transparent"
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {isExporting ? "Exporting..." : "Export"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-gray-400" />
          <p className="mt-2">{t.attendance_loading}</p>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{t.attendance_daily_stats}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
                <StatCard title="Total" value={stats.totalStaff} color="blue" />
                <StatCard title="Present" value={stats.present} color="green" />
                <StatCard title="Absent" value={stats.absent} color="red" />
                <StatCard title="Late" value={stats.late} color="yellow" />
                <StatCard
                  title="Justified"
                  value={stats.justified}
                  color="blue"
                />
                <StatCard
                  title="Holiday/Rest"
                  value={stats.holiday + stats.restDay}
                  color="purple"
                />
                <StatCard
                  title="Unmarked"
                  value={stats.unmarked}
                  color="gray"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.attendance_department_breakdown}</CardTitle>
              </CardHeader>
              <CardContent>
                {departmentStats.length > 0 ? (
                  <div className="space-y-4">
                    {departmentStats.map((dept) => (
                      <div
                        key={dept.department}
                        className="border rounded-lg p-3 bg-white"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{dept.department}</h3>
                          <div className="text-right">
                            <div className="text-md font-bold text-blue-600">
                              {dept.rate}%
                            </div>
                            <div className="text-xs text-gray-500">{t.attendance_department_rate}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-5 gap-2 text-center text-xs">
                          <div title="Total">
                            <Users className="mx-auto w-4 h-4 text-blue-500" />
                            <span className="font-semibold">{dept.total}</span>
                          </div>
                          <div title="Present">
                            <CheckCircle className="mx-auto w-4 h-4 text-green-500" />
                            <span className="font-semibold">
                              {dept.present}
                            </span>
                          </div>
                          <div title="Absent">
                            <XCircle className="mx-auto w-4 h-4 text-red-500" />
                            <span className="font-semibold">{dept.absent}</span>
                          </div>
                          <div title="Late">
                            <AlertCircle className="mx-auto w-4 h-4 text-yellow-500" />
                            <span className="font-semibold">{dept.late}</span>
                          </div>
                          <div title="Justified">
                            <ShieldAlert className="mx-auto w-4 h-4 text-blue-500" />
                            <span className="font-semibold">
                              {dept.justified}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p>{t.attendance_no_department_data}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* 
            <Card>
              <CardHeader>
                <CardTitle>Records for Day</CardTitle>
              </CardHeader>
              <CardContent>
                {dailyAttendance && dailyAttendance.records.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {dailyAttendance.records.map((record, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                      >
                        <div className="font-medium text-sm">
                          {record.memberName}
                        </div>
                        {getStatusBadge(record.status)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No records found</p>
                  </div>
                )}
              </CardContent>
            </Card> */}

            <Card>
              <CardHeader>
                <CardTitle>{t.attendance_records_day}</CardTitle>
              </CardHeader>
              <CardContent>
                {dailyAttendance && dailyAttendance.records.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {dailyAttendance.records.map((record, index) => {
                      const role = record.memberId?.role || t.attendance_status_unknown;
                      const name =
                        record.memberName ||
                        record.memberId?.name ||
                        t.attendance_unmarked_member;
                      const department =
                        role === "TEACHER"
                          ? "Academic"
                          : record.memberId?.department || "General";

                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-sm">{name}</div>
                            <div className="text-xs text-gray-500">
                              {role} • {department}
                            </div>
                          </div>
                          {getStatusBadge(record.status)}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">{t.attendance_no_records}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) => (
  <Card className={`bg-${color}-50 border-${color}-200`}>
    <CardContent className="p-4">
      <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
      <div className={`text-sm text-${color}-600`}>{title}</div>
    </CardContent>
  </Card>
);
