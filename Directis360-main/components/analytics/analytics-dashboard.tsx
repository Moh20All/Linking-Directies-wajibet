"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Users,
  BarChart2,
  XCircle,
  Clock,
  ArrowRight,
  UserCheck,
  UserX,
  Star,
} from "lucide-react";
import { DashboardOverview } from "@/services/masterService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";



interface AnalyticsDashboardProps {
  data: DashboardOverview;
}

export default function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const router = useRouter();
  const { pedagogy, finance, academics, attendance, topTeachers } = data;
  const { t, isRTL } = useLanguage()


  const academicDataForChart = academics
    .map((item) => ({
      name: `${item.level} - ${item.speciality}`,
      "Average Grade": parseFloat(item.averageGrade.toFixed(2)),
      Students: item.studentCount,
    }))
    .sort((a, b) => b["Average Grade"] - a["Average Grade"]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Financial Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              {t.financialSummary}
            </CardTitle>
            <CardDescription>
              {t.financialSummaryDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800">
                {t.totalIncome}</p>
              <p className="text-xl font-bold text-green-600">
                {finance.totalIncome.toLocaleString("fr-DZ", {
                  style: "currency",
                  currency: "DZD",
                })}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm font-medium text-red-800">{t.totalExpenses}</p>
              <p className="text-xl font-bold text-red-600">
                {finance.totalExpenses.toLocaleString("fr-DZ", {
                  style: "currency",
                  currency: "DZD",
                })}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800">{t.netProfit}</p>
              <p className="text-xl font-bold text-blue-600">
                {finance.netProfit.toLocaleString("fr-DZ", {
                  style: "currency",
                  currency: "DZD",
                })}
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/staff/finance")}
            >
{t.goToFinanceDashboard}              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>

        {/* Academic Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-600" />
              {t.academicPerformanceTitle}            </CardTitle>
            <CardDescription>
            {t.academicPerformanceDesc}            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={academicDataForChart}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={0}
                  textAnchor="end"
                  // height={80:}
                  interval={0}
                />
                <YAxis yAxisId="left" orientation="left" stroke="#4f46e5" />
                <YAxis yAxisId="right" orientation="right" stroke="#22c55e" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="Average Grade" fill="#4f46e5" />
                <Bar yAxisId="right" dataKey="Students" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>

            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.level}</TableHead>
                    <TableHead>{t.speciality}</TableHead>
                    <TableHead className="text-right">{t.studentCount}</TableHead>
                    <TableHead className="text-right">{t.averageGrade}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {academics.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.level}</TableCell>
                      <TableCell className="font-medium">
                        {item.speciality}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.studentCount}
                      </TableCell>
                      <TableCell className="text-right font-bold text-indigo-600">
                        {item.averageGrade.toFixed(2)} / 20
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-1 space-y-6">
        {/* School Vitals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              {t.schoolVitals}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <p className="font-medium flex items-center gap-2">
                <UserCheck className="w-4 h-4" /> {t.activeGroups}
              </p>
              <Badge className="bg-purple-100 text-purple-800">
                {pedagogy.activeGroupCount}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <p className="font-medium flex items-center gap-2">
                <UserX className="w-4 h-4" /> {t.unassignedStudents}
              </p>
              <Badge
                variant={
                  pedagogy.unassignedStudentCount > 0
                    ? "destructive"
                    : "default"
                }
                className={
                  pedagogy.unassignedStudentCount === 0
                    ? "bg-green-100 text-green-800"
                    : ""
                }
              >
                {pedagogy.unassignedStudentCount}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-600" />
              {t.attendanceLast30Days}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-sm">{t.workerAttendance}</h4>
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                {Object.entries(attendance.workerBreakdown).map(
                  ([status, count]) => (
                    <div key={status} className="flex justify-between">
                      <span>{status}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  )
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm">
                {t.studentAbsenceHotspots}
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                {attendance.studentAttendanceByGroup.map((group) => (
                  <div
                    key={group.groupName}
                    className="flex justify-between items-center p-2 bg-red-50 rounded-md"
                  >
                    <span className="font-medium text-red-800">
                      {group.groupName}
                    </span>
                    <Badge variant="destructive">
                      {group.totalAbsences} {t.absences}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Teachers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              {t.topTeachers}
            </CardTitle>
            <CardDescription>{t.topTeachersDesc} </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.teacher} </TableHead>
                  <TableHead className="text-right">{t.groups}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topTeachers.map((teacher) => (
                  <TableRow key={teacher._id}>
                    <TableCell className="font-medium">
                      {teacher.full_name}
                    </TableCell>
                    <TableCell className="text-right">
                      {teacher.groupCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
