"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Calendar, MessageSquare, BarChart3, Settings, User, GraduationCap, Clock, CheckCircle, AlertCircle, TrendingUp, FileText, UserCheck, X, Save, Eye } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Sidebar from "@/components/layout/sidebar"
import Header from "@/components/layout/header"
import { useLanguage } from "@/context/language-context";



export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedGroup, setSelectedGroup] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [gradeModalOpen, setGradeModalOpen] = useState(false)
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [groupDetailsModalOpen, setGroupDetailsModalOpen] = useState(false)
  const [groupDates, setGroupDates] = useState<{[key: number]: string}>({})
  const { t, isRTL } = useLanguage()
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "groups", label: "My Groups", icon: Users },
    { id: "grades", label: "Grades", icon: BookOpen },
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "schedule", label: "Schedule", icon: Clock },
    { id: "community", label: "Community", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  // Sample data for demonstration
  const teacherInfo = {
    name: "Prof. Ahmed Benali",
    username: "a.benali",
    email: "ahmed.benali@school.edu.dz",
    phone: "+213 555 123 456",
    subjects: ["Mathematics", "Physics"],
    experience: "8 years",
    qualification: "Master in Mathematics"
  }

  const myGroups = [
    { id: 1, name: "1AS Science 1", level: "1AS", students: 32, subject: "Mathematics" },
    { id: 2, name: "2AS Math 2", level: "2AS", students: 28, subject: "Mathematics" },
    { id: 3, name: "3AS Math Elite", level: "3AS", students: 24, subject: "Physics" },
    { id: 4, name: "1AS Science 3", level: "1AS", students: 30, subject: "Mathematics" }
  ]

  const todaySchedule = [
    { time: "08:00 - 09:00", subject: "Mathematics", group: "1AS Science 1", room: "Room 101" },
    { time: "09:00 - 10:00", subject: "Physics", group: "3AS Math Elite", room: "Lab 201" },
    { time: "11:00 - 12:00", subject: "Mathematics", group: "2AS Math 2", room: "Room 105" },
    { time: "14:00 - 15:00", subject: "Mathematics", group: "1AS Science 3", room: "Room 103" }
  ]

  const weeklySchedule = {
    Sunday: [
      { time: "08:00 - 09:00", subject: "Mathematics", group: "1AS Science 1", room: "Room 101" },
      { time: "10:00 - 11:00", subject: "Physics", group: "3AS Math Elite", room: "Lab 201" }
    ],
    Monday: [
      { time: "09:00 - 10:00", subject: "Mathematics", group: "2AS Math 2", room: "Room 105" },
      { time: "11:00 - 12:00", subject: "Mathematics", group: "1AS Science 3", room: "Room 103" },
      { time: "14:00 - 15:00", subject: "Physics", group: "3AS Math Elite", room: "Lab 201" }
    ],
    Tuesday: [
      { time: "08:00 - 09:00", subject: "Mathematics", group: "1AS Science 1", room: "Room 101" },
      { time: "09:00 - 10:00", subject: "Mathematics", group: "2AS Math 2", room: "Room 105" }
    ]
  }

  const gradeSubjects = [
    {
      name: "Mathematics",
      groups: [
        { name: "1AS Science 1", students: 32, avgGrade: 14.2 },
        { name: "2AS Math 2", students: 28, avgGrade: 15.8 },
        { name: "1AS Science 3", students: 30, avgGrade: 13.5 }
      ]
    },
    {
      name: "Physics", 
      groups: [
        { name: "3AS Math Elite", students: 24, avgGrade: 16.3 }
      ]
    }
  ]

  // Sample student data for modals
  const sampleStudents = [
    { id: 1, name: "Ahmed Mansouri", constantObs: 15.5, dev1: 14.0, dev2: 16.0, exam: 15.0, final: 15.1, present: true },
    { id: 2, name: "Fatima Benali", constantObs: 17.0, dev1: 16.5, dev2: 18.0, exam: 17.5, final: 17.3, present: true },
    { id: 3, name: "Mohamed Khelifi", constantObs: 12.0, dev1: 11.5, dev2: 13.0, exam: 12.5, final: 12.3, present: false },
    { id: 4, name: "Amina Boudiaf", constantObs: 16.0, dev1: 15.0, dev2: 17.0, exam: 16.5, final: 16.1, present: true },
    { id: 5, name: "Yacine Hamdi", constantObs: 13.5, dev1: 14.0, dev2: 12.5, exam: 13.0, final: 13.3, present: true }
  ]

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return "bg-green-100 text-green-800 border-green-200"
    if (grade >= 14) return "bg-blue-100 text-blue-800 border-blue-200"
    if (grade >= 10) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const openGradeModal = (group: any) => {
    setSelectedGroup(group)
    setGradeModalOpen(true)
  }

  const openAttendanceModal = (group: any, date: string) => {
    setSelectedGroup(group)
    setSelectedDate(date)
    setAttendanceModalOpen(true)
  }

  const openReportModal = (group: any) => {
    setSelectedGroup(group)
    setReportModalOpen(true)
  }

  const openGroupDetailsModal = (group: any) => {
    setSelectedGroup(group)
    setGroupDetailsModalOpen(true)
  }

  const handleDateChange = (groupId: number, date: string) => {
    setGroupDates(prev => ({
      ...prev,
      [groupId]: date
    }))
  }

  const getGroupDate = (groupId: number) => {
    return groupDates[groupId] || new Date().toISOString().split('T')[0]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar items={sidebarItems} activeTab={activeTab} onTabChange={setActiveTab} />

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
                          <CardTitle className="text-2xl">{teacherInfo.name}</CardTitle>
                          <CardDescription className="text-lg">@{teacherInfo.username}</CardDescription>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="secondary">{teacherInfo.subjects.join(", ")}</Badge>
                            <Badge variant="outline">{teacherInfo.experience}</Badge>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{t.teacher_active_status}</Badge>
                    </div>
                  </CardHeader>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{t.teacher_total_groups1}</p>
                          <p className="text-3xl font-bold text-blue-600">{myGroups.length}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{t.teacher_total_students1}</p>
                          <p className="text-3xl font-bold text-green-600">
                            {myGroups.reduce((sum, group) => sum + group.students, 0)}
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
                          <p className="text-sm font-medium text-gray-600">{t.teacher_subjects1}</p>
                          <p className="text-3xl font-bold text-purple-600">{teacherInfo.subjects.length}</p>
                        </div>
                        <BookOpen className="w-8 h-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{t.teacher_today_classes}</p>
                          <p className="text-3xl font-bold text-orange-600">{todaySchedule.length}</p>
                        </div>
                        <Clock className="w-8 h-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Today's Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>{t.teacher_today_schedule}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {todaySchedule.map((class_, index) => (
                        <div key={index} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-blue-700">{class_.time}</Badge>
                            <Badge className="bg-blue-100 text-blue-800">{class_.room}</Badge>
                          </div>
                          <h4 className="font-semibold text-gray-900">{class_.subject}</h4>
                          <p className="text-sm text-gray-600">{class_.group}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "groups" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>{t.teacher_groups_tab_title}</span>
                    </CardTitle>
                    <CardDescription>{t.teacher_groups_tab_desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {myGroups.map((group) => (
                        <Card key={group.id} className="border-l-4 border-l-blue-500">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{group.name}</CardTitle>
                              <Badge variant="secondary">{group.level}</Badge>
                            </div>
                            <CardDescription>{group.subject}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{group.students} {t.teacher_groups_students_label}</span>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => openGroupDetailsModal(group)}>
                                {t.teacher_groups_view_details1}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "grades" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5" />
                      <span>{t.teacher_grades_tab_title}</span>
                    </CardTitle>
                    <CardDescription>{t.teacher_grades_tab_desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {gradeSubjects.map((subject, subjectIndex) => (
                        <div key={subjectIndex} className="space-y-4">
                          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                            {subject.name}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {subject.groups.map((group, groupIndex) => (
                              <Card key={groupIndex} className="border-l-4 border-l-green-500">
                                <CardHeader>
                                  <CardTitle className="text-lg">{group.name}</CardTitle>
                                  <CardDescription>{group.students} {t.teacher_groups_students_label}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-600">{t.teacher_grades_class_avg}:</span>
                                      <Badge className={getGradeColor(group.avgGrade)}>
                                        {group.avgGrade.toFixed(1)}/20
                                      </Badge>
                                    </div>
                                    <Progress value={(group.avgGrade / 20) * 100} className="h-2" />
                                    <div className="flex space-x-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="flex-1"
                                        onClick={() => openGradeModal(group)}
                                      >
                                        <FileText className="w-4 h-4 mr-1" />
                                        {t.teacher_grades_enter_btn}
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="flex-1"
                                        onClick={() => openReportModal(group)}
                                      >
                                        <TrendingUp className="w-4 h-4 mr-1" />
                                        {t.teacher_grades_view_report_btn}
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
                    <CardTitle className="flex items-center space-x-2">
                      <UserCheck className="w-5 h-5" />
                      <span>{t.teacher_attendance_tab_title}</span>
                    </CardTitle>
                    <CardDescription>{t.teacher_attendance_tab_desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {myGroups.map((group) => (
                        <Card key={group.id} className="border-l-4 border-l-purple-500">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{group.name}</CardTitle>
                              <Badge variant="secondary">{group.subject}</Badge>
                            </div>
                            <CardDescription>{group.students} {t.teacher_groups_students_label}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {/* Individual Date Selection for Each Group */}
                              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <Label htmlFor={`date-${group.id}`} className="text-sm font-medium text-gray-700 mb-2 block">
                                  {t.teacher_attendance_select_date}
                                </Label>
                                <Input
                                  id={`date-${group.id}`}
                                  type="date"
                                  value={getGroupDate(group.id)}
                                  onChange={(e) => handleDateChange(group.id, e.target.value)}
                                  className="w-full"
                                />
                                <p className="text-xs text-gray-600 mt-1">
                                  {t.teacher_attendance_selected_prefix} {new Date(getGroupDate(group.id)).toLocaleDateString()} {t.teacher_attendance_selected_suffix}
                                </p>
                              </div>

                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">{t.teacher_attendance_for_date}:</span>
                                  <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm font-medium">
                                      {Math.floor(group.students * 0.9)}/{group.students}
                                    </span>
                                  </div>
                                </div>
                                <Progress value={90} className="h-2" />
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1"
                                    onClick={() => openAttendanceModal(group, getGroupDate(group.id))}
                                  >
                                    <UserCheck className="w-4 h-4 mr-1" />
                                    {t.teacher_attendance_mark_btn}
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1"
                                    onClick={() => openReportModal(group)}
                                  >
                                    <BarChart3 className="w-4 h-4 mr-1" />
                                    {t.teacher_attendance_view_report_btn}
                                  </Button>
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

            {activeTab === "schedule" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>{t.teacher_schedule_tab_title}</span>
                    </CardTitle>
                    <CardDescription>{t.teacher_schedule_tab_desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(weeklySchedule).map(([day, classes]) => (
                        <div key={day} className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            {day}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {classes.map((class_, index) => (
                              <div key={index} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline" className="text-blue-700">{class_.time}</Badge>
                                  <Badge className="bg-blue-100 text-blue-800">{class_.room}</Badge>
                                </div>
                                <h4 className="font-semibold text-gray-900">{class_.subject}</h4>
                                <p className="text-sm text-gray-600">{class_.group}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "community" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>{t.teacher_community_title}</span>
                  </CardTitle>
                  <CardDescription>{t.teacher_community_desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t.teacher_community_coming}</h3>
                    <p className="text-gray-500">
                      {t.teacher_community_subdesc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="w-5 h-5" />
                      <span>{t.teacher_settings_title}</span>
                    </CardTitle>
                    <CardDescription>{t.teacher_settings_desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                          {t.teacher_settings_personal_info}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">{t.fullName}</Label>
                            <Input id="fullName" value={teacherInfo.name} disabled />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="username">{t.username}</Label>
                            <Input id="username" value={teacherInfo.username} disabled />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">{t.email}</Label>
                            <Input id="email" value={teacherInfo.email} disabled />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">{t.phone}</Label>
                            <Input id="phone" value={teacherInfo.phone} disabled />
                          </div>
                        </div>
                      </div>

                      {/* Professional Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                          {t.teacher_settings_professional_info}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="subjects">{t.teacher_subjects1}</Label>
                            <Input id="subjects" value={teacherInfo.subjects.join(", ")} disabled />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="experience">{t.experience}</Label>
                            <Input id="experience" value={teacherInfo.experience} disabled />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="qualification">{t.qualification}</Label>
                            <Input id="qualification" value={teacherInfo.qualification} disabled />
                          </div>
                        </div>
                      </div>

                      {/* Account Actions */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                          {t.teacher_settings_account_actions}
                        </h3>
                        <div className="flex space-x-4">
                          <Button variant="outline" disabled>
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {t.teacher_settings_change_password}
                          </Button>
                          <Button variant="outline" disabled>
                            <User className="w-4 h-4 mr-2" />
                            {t.teacher_settings_update_profile}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">
                          {t.teacher_settings_contact_admin}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Enter Grades Modal */}
      <Dialog open={gradeModalOpen} onOpenChange={setGradeModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>{t.teacher_modal_grades_title_prefix} {selectedGroup?.name}</span>
            </DialogTitle>
            <DialogDescription>
              {t.teacher_modal_grades_desc}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 p-3 bg-gray-50 rounded-lg font-semibold text-sm">
              <div>{t.teacher_modal_student_name}</div>
              <div className="text-center">{t.teacher_modal_const_obs}</div>
              <div className="text-center">{t.teacher_modal_dev1}</div>
              <div className="text-center">{t.teacher_modal_dev2}</div>
              <div className="text-center">{t.teacher_modal_exam}</div>
              <div className="text-center">{t.teacher_modal_final_grade}</div>
              <div className="text-center">{t.teacher_modal_actions}</div>
            </div>
            {sampleStudents.map((student) => (
              <div key={student.id} className="grid grid-cols-7 gap-2 p-3 border rounded-lg items-center">
                <div className="font-medium">{student.name}</div>
                <div>
                  <Input 
                    type="number" 
                    min="0" 
                    max="20" 
                    step="0.1"
                    defaultValue={student.constantObs}
                    className="text-center"
                  />
                </div>
                <div>
                  <Input 
                    type="number" 
                    min="0" 
                    max="20" 
                    step="0.1"
                    defaultValue={student.dev1}
                    className="text-center"
                  />
                </div>
                <div>
                  <Input 
                    type="number" 
                    min="0" 
                    max="20" 
                    step="0.1"
                    defaultValue={student.dev2}
                    className="text-center"
                  />
                </div>
                <div>
                  <Input 
                    type="number" 
                    min="0" 
                    max="20" 
                    step="0.1"
                    defaultValue={student.exam}
                    className="text-center"
                  />
                </div>
                <div>
                  <Badge className={getGradeColor(student.final)}>
                    {student.final.toFixed(1)}/20
                  </Badge>
                </div>
                <div className="flex justify-center">
                  <Button variant="outline" size="sm">
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setGradeModalOpen(false)}>
              {t.teacher_modal_cancel}
            </Button>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              {t.teacher_modal_save_all}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mark Attendance Modal */}
      <Dialog open={attendanceModalOpen} onOpenChange={setAttendanceModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5" />
              <span>{t.teacher_modal_attendance_title_prefix} {selectedGroup?.name}</span>
            </DialogTitle>
            <DialogDescription>
              {t.teacher_modal_attendance_desc}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-semibold">{t.teacher_modal_attendance_class}: {selectedGroup?.name}</p>
                <p className="text-sm text-gray-600">Date: {selectedDate ? new Date(selectedDate).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">{t.teacher_modal_attendance_subject}: {selectedGroup?.subject}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{t.teacher_modal_attendance_present}: {sampleStudents.filter(s => s.present).length}</p>
                <p className="text-sm text-gray-600">{t.teacher_modal_attendance_absent}: {sampleStudents.filter(s => !s.present).length}</p>
                <p className="text-sm text-gray-600">{t.teacher_modal_attendance_total}: {sampleStudents.length}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {sampleStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id={`student-${student.id}`}
                      defaultChecked={student.present}
                    />
                    <label htmlFor={`student-${student.id}`} className="font-medium cursor-pointer">
                      {student.name}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={student.present ? "default" : "destructive"}>
                      {student.present ? "Present" : "Absent"}
                    </Badge>
                    <Select defaultValue="present">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">{t.teacher_modal_attendance_present}</SelectItem>
                        <SelectItem value="absent">{t.teacher_modal_attendance_absent}</SelectItem>
                        <SelectItem value="late">{t.tracking_status_late} </SelectItem>
                        <SelectItem value="excused">{t.teacher_attendance_excused} </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t.teacher_attendance_notes_label}</Label>
              <Textarea 
                id="notes"
                placeholder="Add any notes about today's attendance..."
                className="min-h-[80px]"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setAttendanceModalOpen(false)}>
              {t.teacher_modal_cancel}
            </Button>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              {t.teacher_attendance_save_btn}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Report Modal */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>{t.teacher_modal_report_title_prefix} {selectedGroup?.name}</span>
            </DialogTitle>
            <DialogDescription>
              {t.teacher_modal_report_desc}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Class Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedGroup?.students || 0}</p>
                    <p className="text-sm text-gray-600">{t.teacher_modal_report_total_students}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedGroup?.avgGrade?.toFixed(1) || 0}</p>
                    <p className="text-sm text-gray-600">{t.teacher_modal_report_class_avg}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">92%</p>
                    <p className="text-sm text-gray-600">{t.teacher_modal_report_attendance_rate}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">85%</p>
                    <p className="text-sm text-gray-600">{t.teacher_modal_report_pass_rate}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>{t.teacher_modal_report_distribution}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t.teacher_groupdetails_distribution_excellent}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={25} className="w-32 h-2" />
                      <span className="text-sm font-medium">25%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t.teacher_groupdetails_distribution_good}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={40} className="w-32 h-2" />
                      <span className="text-sm font-medium">40%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t.teacher_groupdetails_distribution_average}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={25} className="w-32 h-2" />
                      <span className="text-sm font-medium">25%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t.teacher_groupdetails_distribution_needs}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={10} className="w-32 h-2" />
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>{t.teacher_modal_report_student_perf}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">{t.teacher_modal_student_name}</th>
                        <th className="text-center p-2">{t.teacher_modal_const_obs}</th>
                        <th className="text-center p-2">{t.teacher_modal_dev1}</th>
                        <th className="text-center p-2">{t.teacher_modal_dev2}</th>
                        <th className="text-center p-2">{t.teacher_modal_exam}</th>
                        <th className="text-center p-2">{t.teacher_modal_final_grade}</th>
                        <th className="text-center p-2">{t.teacher_modal_attendance}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleStudents.map((student) => (
                        <tr key={student.id} className="border-b">
                          <td className="p-2 font-medium">{student.name}</td>
                          <td className="text-center p-2">{student.constantObs.toFixed(1)}</td>
                          <td className="text-center p-2">{student.dev1.toFixed(1)}</td>
                          <td className="text-center p-2">{student.dev2.toFixed(1)}</td>
                          <td className="text-center p-2">{student.exam.toFixed(1)}</td>
                          <td className="text-center p-2">
                            <Badge className={getGradeColor(student.final)}>
                              {student.final.toFixed(1)}
                            </Badge>
                          </td>
                          <td className="text-center p-2">
                            <Badge variant={student.present ? "default" : "destructive"}>
                              {student.present ? "95%" : "78%"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setReportModalOpen(false)}>
              {t.teacher_modal_report_close}
            </Button>
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              {t.teacher_modal_report_export}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Group Details Modal */}
      <Dialog open={groupDetailsModalOpen} onOpenChange={setGroupDetailsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{t.teacher_modal_group_title_prefix} {selectedGroup?.name}</span>
            </DialogTitle>
            <DialogDescription>
              {t.teacher_modal_group_desc}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Group Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{selectedGroup?.students || 0}</p>
                    <p className="text-sm text-gray-600">{t.teacher_modal_group_students}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{selectedGroup?.subject || "N/A"}</p>
                    <p className="text-sm text-gray-600">{t.teacher_modal_group_subject}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <GraduationCap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">{selectedGroup?.level || "N/A"}</p>
                    <p className="text-sm text-gray-600">{t.teacher_modal_group_level}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-600">14.5</p>
                    <p className="text-sm text-gray-600">{t.teacher_grades_class_avg}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Group Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t.teacher_modal_group_info}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">{t.teacher_modal_group_name}:</span>
                      <span className="font-semibold">{selectedGroup?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">{t.teacher_modal_group_subject}:</span>
                      <Badge variant="secondary">{selectedGroup?.subject}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">{t.teacher_modal_group_level}:</span>
                      <Badge variant="outline">{selectedGroup?.level}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">{t.teacher_modal_group_year}:</span>
                      <span>2024-2025</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">{t.teacher_modal_group_students}:</span>
                      <span className="font-semibold">{selectedGroup?.students}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">{t.teacher_modal_group_active_students}:</span>
                      <span className="text-green-600 font-semibold">{selectedGroup?.students - 2}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">{t.teacher_modal_group_inactive_students}:</span>
                      <span className="text-red-600 font-semibold">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">{t.teacher_modal_group_room}:</span>
                      <span>{t.teacher_modal_group_room} 101</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>{t.teacher_modal_group_stats}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">{t.teacher_modal_group_grade_dist}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{t.teacher_groupdetails_distribution_excellent}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={30} className="w-24 h-2" />
                            <span className="text-sm font-medium">30%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{t.teacher_groupdetails_distribution_good}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={35} className="w-24 h-2" />
                            <span className="text-sm font-medium">35%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{t.teacher_groupdetails_distribution_average}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={25} className="w-24 h-2" />
                            <span className="text-sm font-medium">25%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{t.teacher_groupdetails_distribution_needs}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={10} className="w-24 h-2" />
                            <span className="text-sm font-medium">10%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">{t.teacher_modal_group_attendance_overview}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{t.teacher_modal_group_distribution_excellent1}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={40} className="w-24 h-2" />
                            <span className="text-sm font-medium">40%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{t.teacher_modal_group_distribution_good1}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={35} className="w-24 h-2" />
                            <span className="text-sm font-medium">35%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{t.teacher_modal_group_distribution_average1}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={20} className="w-24 h-2" />
                            <span className="text-sm font-medium">20%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{t.teacher_modal_group_distribution_needs1}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={5} className="w-24 h-2" />
                            <span className="text-sm font-medium">5%</span>
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
                <CardTitle>{t.teacher_modal_group_student_list}</CardTitle>
                <CardDescription>{t.teacher_modal_group_student_list_desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">#</th>
                        <th className="text-left p-3">{t.teacher_modal_student_name}</th>
                        <th className="text-center p-3">{t.Current_Grade}</th>
                        <th className="text-center p-3">{t.teacher_modal_attendance}</th>
                        <th className="text-center p-3">{t.tracking_status_label} </th>
                        <th className="text-center p-3">{t.teacher_modal_actions} </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleStudents.map((student, index) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{index + 1}</td>
                          <td className="p-3 font-medium">{student.name}</td>
                          <td className="text-center p-3">
                            <Badge className={getGradeColor(student.final)}>
                              {student.final.toFixed(1)}/20
                            </Badge>
                          </td>
                          <td className="text-center p-3">
                            <Badge variant={student.present ? "default" : "destructive"}>
                              {student.present ? "95%" : "78%"}
                            </Badge>
                          </td>
                          <td className="text-center p-3">
                            <Badge variant="outline" className="text-green-700 bg-green-50">
                              Active
                            </Badge>
                          </td>
                          <td className="text-center p-3">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              {t.teacher_modal_group_status_active}
                            </Button>
                          </td>
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
                <CardTitle>{t.teacher_modal_group_quick_actions} </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="flex items-center justify-center space-x-2" onClick={() => {
                    setGroupDetailsModalOpen(false)
                    openGradeModal(selectedGroup)
                  }}>
                    <FileText className="w-4 h-4" />
                    <span>{t.teacher_modal_group_enter_grades} </span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center space-x-2" onClick={() => {
                    setGroupDetailsModalOpen(false)
                    openAttendanceModal(selectedGroup, getGroupDate(selectedGroup?.id))
                  }}>
                    <UserCheck className="w-4 h-4" />
                    <span>{t.teacher_modal_group_mark_attendance} </span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center space-x-2" onClick={() => {
                    setGroupDetailsModalOpen(false)
                    openReportModal(selectedGroup)
                  }}>
                    <TrendingUp className="w-4 h-4" />
                    <span>{t.teacher_modal_group_view_report} </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setGroupDetailsModalOpen(false)}>
              {t.teacher_modal_group_close}
            </Button>
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              {t.teacher_modal_group_export}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
