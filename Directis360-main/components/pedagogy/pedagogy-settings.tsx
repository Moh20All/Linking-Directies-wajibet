"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Users, BookOpen, Clock, CheckCircle } from "lucide-react"
import { getAllSubjects } from "@/data/school-structure"
import { useLanguage } from "@/context/language-context"

interface PedagogySettingsData {
  generalSettings: {
    schoolStartTime: string
    schoolEndTime: string
    classDuration: string
    breakDuration: string
    maxStudentsPerGroup: string
    enableParentNotifications: boolean
    enableAttendanceTracking: boolean
    enableGradeReports: boolean
  }
  gradeSettings: {
    gradingSystem: string
    passingGrade: string
    enableMidtermExams: boolean
    enableFinalExams: boolean
    reportCardFrequency: string
  }
  subjectSettings: {
    coreSubjects: string[]
    electiveSubjects: string[]
    enableSubjectWeighting: boolean
    defaultSubjectWeight: string
  }
  groupSettings: {
    autoGroupCreation: boolean
    groupNamingPattern: string
    enableMixedGradeGroups: boolean
    maxGroupsPerTeacher: string
  }
}

interface PedagogySettingsProps {
  settings: PedagogySettingsData
  setSettings: React.Dispatch<React.SetStateAction<PedagogySettingsData>>
}

export default function PedagogySettings({ settings, setSettings }: PedagogySettingsProps) {
  const allAvailableSubjects = getAllSubjects()
  const { t, isRTL } = useLanguage()

  const handleGeneralSettingsChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      generalSettings: {
        ...prev.generalSettings,
        [field]: value,
      },
    }))
  }

  const handleGradeSettingsChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      gradeSettings: {
        ...prev.gradeSettings,
        [field]: value,
      },
    }))
  }

  const handleSubjectSettingsChange = (field: string, value: string | boolean | string[]) => {
    setSettings((prev) => ({
      ...prev,
      subjectSettings: {
        ...prev.subjectSettings,
        [field]: value,
      },
    }))
  }

  const handleGroupSettingsChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      groupSettings: {
        ...prev.groupSettings,
        [field]: value,
      },
    }))
  }

  const handleSave = (section: string) => {
    // Handle save logic here - settings are already saved in state
    console.log(`Saving ${section} settings`)
    // Show success message
    alert(`${section} settings saved successfully!`)
  }

  const addSubject = (type: "core" | "elective") => {
    const subject = prompt(`Enter new ${type} subject:`)
    if (subject && !settings.subjectSettings[type === "core" ? "coreSubjects" : "electiveSubjects"].includes(subject)) {
      if (type === "core") {
        handleSubjectSettingsChange("coreSubjects", [...settings.subjectSettings.coreSubjects, subject])
      } else {
        handleSubjectSettingsChange("electiveSubjects", [...settings.subjectSettings.electiveSubjects, subject])
      }
    }
  }

  const removeSubject = (type: "core" | "elective", subject: string) => {
    if (type === "core") {
      handleSubjectSettingsChange(
        "coreSubjects",
        settings.subjectSettings.coreSubjects.filter((s) => s !== subject),
      )
    } else {
      handleSubjectSettingsChange(
        "electiveSubjects",
        settings.subjectSettings.electiveSubjects.filter((s) => s !== subject),
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t.ps_title}</h2>
        <p className="text-gray-600">
          {t.ps_description}
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">{t.ps_tab_general}</TabsTrigger>
          <TabsTrigger value="grading">{t.ps_tab_grading}</TabsTrigger>
          <TabsTrigger value="subjects">{t.ps_tab_subjects}</TabsTrigger>
          <TabsTrigger value="groups">{t.ps_tab_groups}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {t.ps_school_schedule_title}
              </CardTitle>
              <CardDescription>{t.ps_school_schedule_desc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolStartTime">{t.ps_start_time_label}</Label>
                  <Input
                    id="schoolStartTime"
                    type="time"
                    value={settings.generalSettings.schoolStartTime}
                    onChange={(e) => handleGeneralSettingsChange("schoolStartTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolEndTime">{t.ps_end_time_label}</Label>
                  <Input
                    id="schoolEndTime"
                    type="time"
                    value={settings.generalSettings.schoolEndTime}
                    onChange={(e) => handleGeneralSettingsChange("schoolEndTime", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="classDuration">{t.ps_class_duration_label}</Label>
                  <Input
                    id="classDuration"
                    type="number"
                    value={settings.generalSettings.classDuration}
                    onChange={(e) => handleGeneralSettingsChange("classDuration", e.target.value)}
                    min="30"
                    max="120"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breakDuration">{t.ps_break_duration_label}</Label>
                  <Input
                    id="breakDuration"
                    type="number"
                    value={settings.generalSettings.breakDuration}
                    onChange={(e) => handleGeneralSettingsChange("breakDuration", e.target.value)}
                    min="5"
                    max="60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxStudentsPerGroup">{t.ps_max_students_label}</Label>
                <Input
                  id="maxStudentsPerGroup"
                  type="number"
                  value={settings.generalSettings.maxStudentsPerGroup}
                  onChange={(e) => handleGeneralSettingsChange("maxStudentsPerGroup", e.target.value)}
                  min="10"
                  max="50"
                />
              </div>

              <Button onClick={() => handleSave("general")} className="bg-blue-600 hover:bg-blue-700">
                {t.ps_save_general_btn}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {t.ps_feature_title}
              </CardTitle>
              <CardDescription>{t.ps_feature_desc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.ps_parent_notif_label}</Label>
                  <p className="text-sm text-gray-500">{t.ps_parent_notif_desc}</p>
                </div>
                <Switch
                  checked={settings.generalSettings.enableParentNotifications}
                  onCheckedChange={(checked) => handleGeneralSettingsChange("enableParentNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.ps_attendance_label}</Label>
                  <p className="text-sm text-gray-500">{t.ps_attendance_desc}</p>
                </div>
                <Switch
                  checked={settings.generalSettings.enableAttendanceTracking}
                  onCheckedChange={(checked) => handleGeneralSettingsChange("enableAttendanceTracking", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.ps_grade_reports_label}</Label>
                  <p className="text-sm text-gray-500">{t.ps_grade_reports_desc}</p>
                </div>
                <Switch
                  checked={settings.generalSettings.enableGradeReports}
                  onCheckedChange={(checked) => handleGeneralSettingsChange("enableGradeReports", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grading" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {t.ps_grading_title}
              </CardTitle>
              <CardDescription>
                {t.ps_grading_desc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gradingSystem">{t.ps_system_label}</Label>
                  <Select
                    value={settings.gradeSettings.gradingSystem}
                    onValueChange={(value) => handleGradeSettingsChange("gradingSystem", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.ps_system_placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20-point">{t.ps_system_20point}</SelectItem>
                      <SelectItem value="letter">{t.ps_system_letter}</SelectItem>
                      <SelectItem value="percentage">{t.ps_system_percentage}</SelectItem>
                      <SelectItem value="pass-fail">{t.ps_system_passfail}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passingGrade">{t.ps_passing_label}</Label>
                  <Input
                    id="passingGrade"
                    value={settings.gradeSettings.passingGrade}
                    onChange={(e) => handleGradeSettingsChange("passingGrade", e.target.value)}
                    placeholder="e.g., 10/20, 60%, C"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportCardFrequency">{t.ps_report_frequency_label}</Label>
                <Select
                  value={settings.gradeSettings.reportCardFrequency}
                  onValueChange={(value) => handleGradeSettingsChange("reportCardFrequency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.ps_report_frequency_placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">{t.ps_report_frequency_monthly}</SelectItem>
                    <SelectItem value="quarterly">{t.ps_report_frequency_quarterly}</SelectItem>
                    <SelectItem value="semester">{t.ps_report_frequency_semester}</SelectItem>
                    <SelectItem value="annual">{t.ps_report_frequency_annual}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t.ps_midterm_label}</Label>
                    <p className="text-sm text-gray-500">{t.ps_midterm_desc}</p>
                  </div>
                  <Switch
                    checked={settings.gradeSettings.enableMidtermExams}
                    onCheckedChange={(checked) => handleGradeSettingsChange("enableMidtermExams", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t.ps_final_label}</Label>
                    <p className="text-sm text-gray-500">{t.ps_final_desc}</p>
                  </div>
                  <Switch
                    checked={settings.gradeSettings.enableFinalExams}
                    onCheckedChange={(checked) => handleGradeSettingsChange("enableFinalExams", checked)}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("grading")} className="bg-green-600 hover:bg-green-700">
                {t.ps_save_grading_btn}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {t.ps_subjects_title}
              </CardTitle>
              <CardDescription>{t.ps_subjects_desc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{t.ps_core_label}</Label>
                  <Button size="sm" onClick={() => addSubject("core")}>
                    <BookOpen className="w-4 h-4 mr-1" />
                    {t.ps_add_core_btn}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {settings.subjectSettings.coreSubjects.map((subject) => (
                    <Badge key={subject} variant="default" className="flex items-center gap-1">
                      {subject}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeSubject("core", subject)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{t.ps_elective_label}</Label>
                  <Button size="sm" variant="outline" onClick={() => addSubject("elective")}>
                    <BookOpen className="w-4 h-4 mr-1" />
                    {t.ps_add_elective_btn}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {settings.subjectSettings.electiveSubjects.map((subject) => (
                    <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                      {subject}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeSubject("elective", subject)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t.ps_weighting_label}</Label>
                    <p className="text-sm text-gray-500">
                      {t.ps_weighting_desc}
                    </p>
                  </div>
                  <Switch
                    checked={settings.subjectSettings.enableSubjectWeighting}
                    onCheckedChange={(checked) => handleSubjectSettingsChange("enableSubjectWeighting", checked)}
                  />
                </div>

                {settings.subjectSettings.enableSubjectWeighting && (
                  <div className="space-y-2">
                    <Label htmlFor="defaultSubjectWeight">{t.ps_default_weight_label}</Label>
                    <Input
                      id="defaultSubjectWeight"
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="10.0"
                      value={settings.subjectSettings.defaultSubjectWeight}
                      onChange={(e) => handleSubjectSettingsChange("defaultSubjectWeight", e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>{t.ps_available_subjects_label} ({allAvailableSubjects.length})</Label>
                <div className="max-h-32 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                  <div className="flex flex-wrap gap-1">
                    {allAvailableSubjects.map((subject) => (
                      <Badge key={subject} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSave("subjects")} className="bg-purple-600 hover:bg-purple-700">
                {t.ps_save_subjects_btn}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t.ps_groups_title}
              </CardTitle>
              <CardDescription>
                {t.ps_groups_desc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.ps_auto_create_label}</Label>
                  <p className="text-sm text-gray-500">{t.ps_auto_create_desc}</p>
                </div>
                <Switch
                  checked={settings.groupSettings.autoGroupCreation}
                  onCheckedChange={(checked) => handleGroupSettingsChange("autoGroupCreation", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="groupNamingPattern">{t.ps_group_pattern_label}</Label>
                <Input
                  id="groupNamingPattern"
                  value={settings.groupSettings.groupNamingPattern}
                  onChange={(e) => handleGroupSettingsChange("groupNamingPattern", e.target.value)}
                  placeholder="e.g., {grade} - Section {section}"
                />
                <p className="text-xs text-gray-500">
                  {t.ps_group_pattern_hint_prefix} {"{grade}"} {t.ps_group_pattern_hint_prefix1} {"{section}"} {t.ps_group_pattern_hint_suffix}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.ps_mixed_label}</Label>
                  <p className="text-sm text-gray-500">{t.ps_mixed_desc}</p>
                </div>
                <Switch
                  checked={settings.groupSettings.enableMixedGradeGroups}
                  onCheckedChange={(checked) => handleGroupSettingsChange("enableMixedGradeGroups", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxGroupsPerTeacher">{t.ps_max_groups_label}</Label>
                <Input
                  id="maxGroupsPerTeacher"
                  type="number"
                  value={settings.groupSettings.maxGroupsPerTeacher}
                  onChange={(e) => handleGroupSettingsChange("maxGroupsPerTeacher", e.target.value)}
                  min="1"
                  max="10"
                />
              </div>

              <Button onClick={() => handleSave("groups")} className="bg-orange-600 hover:bg-orange-700">
                {t.ps_save_groups_btn}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Settings Summary */}
      <Alert className="border-blue-200 bg-blue-50">
        <CheckCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>{t.ps_alert_status_prefix}</strong> {t.ps_alert_status_suffix}
        </AlertDescription>
      </Alert>
    </div>
  )
}
