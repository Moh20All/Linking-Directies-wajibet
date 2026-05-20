"use client";

import type React from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  GraduationCap,
  Building,
  BookOpen,
  Loader2,
  Save,
  FileDown,
  Eye,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/api";
import {
  getScheduleForGroup,
  saveScheduleForGroup,
  clearScheduleForGroup,
  ScheduleEntry,
} from "@/services/staffPedagogyService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useLanguage } from "@/context/language-context";

// --- Interfaces ---
interface Module {
  id: string;
  name: { name_en: string };
}
interface Group {
  _id: string;
  id: string;
  groupName: string;
  level: number;
  speciality: { name: string; id: string };
  studentCount: number;
  season: string;
}
interface Teacher {
  _id: string;
  full_name: string;
  modules: Array<{ id: string }>;
}

interface ScheduleManagementProps {
  groups: Group[];
  teachers: Teacher[];
  schoolType: "primaire" | "cem" | "lycee" | null;
  getFreshToken: () => Promise<string | null>;
}

const daysOfWeek = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];
const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const getCurrentSeason = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  if (month >= 8) {
    return `${(year % 100).toString().padStart(2, "0")}${((year + 1) % 100)
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${((year - 1) % 100).toString().padStart(2, "0")}${(year % 100)
      .toString()
      .padStart(2, "0")}`;
  }
};

export default function ScheduleManagement({
  groups,
  teachers,
  schoolType,
  getFreshToken,
}: ScheduleManagementProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { t, isRTL } = useLanguage()

  const [groupSchedules, setGroupSchedules] = useState<{
    [key: string]: ScheduleEntry[];
  }>({});
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const [selectedGroupModules, setSelectedGroupModules] = useState<Module[]>(
    []
  );
  const [isLoadingModules, setIsLoadingModules] = useState(false);

  const [formData, setFormData] = useState({
    day: "",
    startTime: "",
    endTime: "",
    moduleId: "",
    teacherId: "",
    roomName: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const currentSeasonGroups = useMemo(() => {
    const season = getCurrentSeason();
    return groups.filter((group) => group.season === season);
  }, [groups]);

  const selectedGroupData = useMemo(
    () => groups.find((g) => g.id === selectedGroup),
    [groups, selectedGroup]
  );

  const fetchSchedule = useCallback(
    async (groupId: string) => {
      setIsScheduleLoading(true);
      try {
        const token = await getFreshToken();
        if (!token) throw new Error("Authentication failed");
        const response = await getScheduleForGroup(token, groupId);
        setGroupSchedules((prev) => ({ ...prev, [groupId]: response.entries }));
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      } finally {
        setIsScheduleLoading(false);
      }
    },
    [selectedGroup]
  );

  useEffect(() => {
    if (selectedGroup) {
      fetchSchedule(selectedGroup);
    }
  }, [selectedGroup, fetchSchedule]);

  useEffect(() => {
    const fetchGroupSpecificModules = async () => {
      if (selectedGroupData) {
        setIsLoadingModules(true);
        try {
          const { speciality, level } = selectedGroupData;
          const response = await api.get(
            `/help/structure/speciality/${speciality.id}/level/${level}`
          );
          setSelectedGroupModules(response.data.modules || []);
        } catch (error) {
          console.error("Failed to fetch group-specific modules:", error);
          setSelectedGroupModules([]);
        } finally {
          setIsLoadingModules(false);
        }
      } else {
        setSelectedGroupModules([]);
      }
    };
    fetchGroupSpecificModules();
  }, [selectedGroupData]);

  const handleSaveSchedule = async () => {
    if (!selectedGroup) return;
    setIsSaving(true);
    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication failed");
      const currentEntries = groupSchedules[selectedGroup] || [];
      const entriesToSave = currentEntries.map(({ _id, id, ...rest }) => rest);
      await saveScheduleForGroup(token, selectedGroup, entriesToSave);
      await fetchSchedule(selectedGroup);
    } catch (error) {
      console.error("Failed to save schedule:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearSchedule = async () => {
    if (!selectedGroup) return;
    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication failed");
      await clearScheduleForGroup(token, selectedGroup);
      setGroupSchedules((prev) => ({ ...prev, [selectedGroup]: [] }));
    } catch (error) {
      console.error("Failed to clear schedule:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!selectedGroup) return;

    const allEntries = Object.values(groupSchedules).flat();
    const newSession = { start: formData.startTime, end: formData.endTime };

    // Check for overlaps
    for (const existing of allEntries) {
      // Skip self when editing
      if (
        editingEntry &&
        (existing._id || existing.id) === (editingEntry._id || editingEntry.id)
      )
        continue;

      const existingSession = {
        start: existing.startTime,
        end: existing.endTime,
      };

      // Check for time overlap on the same day
      const hasTimeOverlap =
        newSession.start < existingSession.end &&
        existingSession.start < newSession.end;

      if (formData.day === existing.day && hasTimeOverlap) {
        if (existing.groupId === selectedGroup) {
          setFormError(
            t.sm_conflict_desc_group
          );
          return;
        }
        if (existing.teacherId === formData.teacherId) {
          const conflictingGroup =
            groups.find((g) => g.id === existing.groupId)?.groupName ||
            "another group";
          setFormError(
            `This teacher is already scheduled for a class in ${conflictingGroup} at this time.`
          );
          return;
        }
        if (existing.roomName === formData.roomName) {
          const conflictingGroup =
            groups.find((g) => g.id === existing.groupId)?.groupName ||
            "another group";
          setFormError(
            `This room is already booked for a class in ${conflictingGroup} at this time.`
          );
          return;
        }
      }
    }

    const currentEntries = groupSchedules[selectedGroup] || [];
    const newEntryData = { ...formData, groupId: selectedGroup };
    const updatedEntries = editingEntry
      ? currentEntries.map((e) =>
          (e._id || e.id) === (editingEntry._id || editingEntry.id)
            ? { ...e, ...newEntryData }
            : e
        )
      : [...currentEntries, { ...newEntryData, _id: `temp-${Date.now()}` }];
    setGroupSchedules((prev) => ({ ...prev, [selectedGroup]: updatedEntries }));
    handleCloseDialog();
  };

  const handleEdit = (entry: ScheduleEntry) => {
    setEditingEntry(entry);
    setFormData({
      day: entry.day,
      startTime: entry.startTime,
      endTime: entry.endTime,
      moduleId: entry.moduleId,
      teacherId: entry.teacherId,
      roomName: entry.roomName,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (entryId: string) => {
    const currentEntries = groupSchedules[selectedGroup] || [];
    setGroupSchedules((prev) => ({
      ...prev,
      [selectedGroup]: currentEntries.filter(
        (e) => (e._id || e.id) !== entryId
      ),
    }));
  };

  const handleOpenDialogForSlot = (day: string, startTime: string) => {
    const endTime =
      timeSlots[timeSlots.indexOf(startTime) + 1] ||
      `${parseTime(startTime) + 1}:00`;
    setFormData({
      day,
      startTime,
      endTime,
      moduleId: "",
      teacherId: "",
      roomName: "",
    });
    setEditingEntry(null);
    setIsDialogOpen(true);
  };

  const handleExportPDF = () => {
    if (!selectedGroupData) return;
    const doc = new jsPDF({ orientation: "landscape" });
    const scheduleEntries = groupSchedules[selectedGroup] || [];

    doc.setFontSize(18);
    doc.text("Class Schedule", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Group: ${selectedGroupData.groupName}`, 14, 32);
    doc.text(`Specialty: ${selectedGroupData.speciality.name}`, 14, 38);
    doc.text(`Level: ${selectedGroupData.level}`, 120, 32);
    doc.text(`Season: ${selectedGroupData.season}`, 120, 38);

    const uniqueTeachers = new Map<string, string[]>();
    scheduleEntries.forEach((entry) => {
      const teacherName = getTeacherName(entry.teacherId);
      const moduleName = getModuleName(entry.moduleId);
      if (!uniqueTeachers.has(teacherName)) {
        uniqueTeachers.set(teacherName, []);
      }
      if (!uniqueTeachers.get(teacherName)!.includes(moduleName)) {
        uniqueTeachers.get(teacherName)!.push(moduleName);
      }
    });

    const teacherTableBody = Array.from(uniqueTeachers.entries()).map(
      ([name, modules]) => [name, modules.join(", ")]
    );

    autoTable(doc, {
      startY: 48,
      head: [["Teaching Staff", "Subjects"]],
      body: teacherTableBody,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] },
    });

    const scheduleTableHead = [["Day", ...timeSlots]];
    const scheduleTableBody = daysOfWeek.map((day) => {
      const row: any[] = [day];
      const occupiedTimes: { [key: string]: boolean } = {};
      timeSlots.forEach((time, index) => {
        if (occupiedTimes[time]) return;
        const entry = scheduleEntries.find(
          (e) => e.day === day && e.startTime === time
        );
        if (entry) {
          const duration =
            parseTime(entry.endTime) - parseTime(entry.startTime);
          row.push({
            content: `${getModuleName(entry.moduleId)}\n${getTeacherName(
              entry.teacherId
            )}\n${entry.roomName}`,
            colSpan: duration,
            styles: {
              valign: "middle",
              fillColor: [235, 245, 251],
              textColor: [26, 82, 118],
              halign: "center",
            },
          });
          for (let i = 1; i < duration; i++) {
            const nextTimeSlot = timeSlots[index + i];
            if (nextTimeSlot) occupiedTimes[nextTimeSlot] = true;
          }
        } else {
          row.push("");
        }
      });
      return row;
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: scheduleTableHead,
      body: scheduleTableBody,
      theme: "grid",
      headStyles: { fillColor: [80, 80, 80] },
    });

    doc.save(`schedule_${selectedGroupData.groupName}.pdf`);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEntry(null);
    setFormData({
      day: "",
      startTime: "",
      endTime: "",
      moduleId: "",
      teacherId: "",
      roomName: "",
    });
    setFormError(null);
  };
  const handleInputChange = (field: string, value: string) => {
    if (field === "moduleId") {
      setFormData((prev) => ({ ...prev, teacherId: "", [field]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const availableTeachers = useMemo(() => {
    if (!formData.moduleId) return [];
    return teachers.filter((teacher) =>
      teacher.modules.some((module) => module.id === formData.moduleId)
    );
  }, [teachers, formData.moduleId]);

  const getModuleName = (id: string) =>
    selectedGroupModules.find((m) => m.id === id)?.name.name_en || id;
  const getTeacherName = (id: string) =>
    teachers.find((t) => t._id === id)?.full_name || "Unknown";
  const parseTime = (timeStr: string) => parseInt(timeStr.split(":")[0], 10);

  if (!groups.length && !teachers.length) {
    return (
      <div className="fixed inset-0 bg-white/60 z-50 flex flex-col justify-center items-center backdrop-blur-sm">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="mt-4 text-sm text-gray-700">{t.sm_loading_message}</p>
      </div>
    );
  }

  const tailwindColors = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "pink",
    "indigo",
    "orange",
    "teal",
    "rose",
  ];

  const getRandomTailwindColor = () => {
    const idx = Math.floor(Math.random() * tailwindColors.length);
    return tailwindColors[idx];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.sm_title}</CardTitle>
          <CardDescription>
            {t.sm_description_prefix}
             ({getCurrentSeason()}).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger>
              <SelectValue placeholder={t.sga_select_group_placeholder} />
            </SelectTrigger>
            <SelectContent>
              {currentSeasonGroups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.level > 1
                    ? `${group.level} éme `
                    : `${group.level} ére `}
                  {group.speciality.name} - ({group.groupName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      {selectedGroupData && (
        <Card className="relative">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {selectedGroupData.groupName} {t.sm_group_schedule_title_suffix}
                </CardTitle>
                <CardDescription>
                  {t.sm_level_label}: {selectedGroupData.level} | {t.sm_specialty_label}:{" "}
                  {selectedGroupData.speciality.name}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t.sm_clear_btn}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.sm_clear_dialog_title}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t.sm_clear_dialog_description}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t.sm_clear_dialog_cancel}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearSchedule}>
                        {t.sm_clear_dialog_confirm}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button onClick={handleSaveSchedule} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {t.sm_save_btn}
                </Button>
                <Button
                  onClick={() => setIsPreviewOpen(true)}
                  variant="outline"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t.sm_preview_btn}
                </Button>
                <Button onClick={handleExportPDF} variant="outline">
                  <FileDown className="w-4 h-4 mr-2" />
                  {t.sm_export_btn}
                </Button>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" /> {t.sm_add_class_btn}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {(isScheduleLoading || isLoadingModules) && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-lg">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-center">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-2 border-b border-gray-200 w-28 font-semibold">
                      {t.sm_pdf_time_head}
                    </th>
                    {daysOfWeek.map((day) => (
                      <th
                        key={day}
                        className="p-2 border-b border-gray-200 font-semibold"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((time) => {
                    const occupiedSlots: { [key: string]: boolean } = {};
                    (groupSchedules[selectedGroup] || []).forEach((entry) => {
                      const start = parseTime(entry.startTime);
                      const end = parseTime(entry.endTime);
                      for (let i = start; i < end; i++) {
                        const slotTime = `${i.toString().padStart(2, "0")}:00`;
                        if (slotTime !== entry.startTime) {
                          occupiedSlots[`${entry.day}-${slotTime}`] = true;
                        }
                      }
                    });
                    return (
                      <tr key={time}>
                        <td className="p-2 border font-semibold bg-gray-50">
                          {time}
                        </td>
                        {daysOfWeek.map((day) => {
                          if (occupiedSlots[`${day}-${time}`]) return null;
                          const entry = (
                            groupSchedules[selectedGroup] || []
                          ).find((e) => e.day === day && e.startTime === time);
                          if (entry) {
                            const duration =
                              parseTime(entry.endTime) -
                              parseTime(entry.startTime);
                            return (
                              <td
                                key={day}
                                className={`border p-0.5 align-center`}
                                rowSpan={duration}
                              >
                                <div className="bg-blue-50 border-l-4 border-blue-400 p-2 rounded-md flex-col justify-between text-left relative group shadow-sm hover:shadow-lg transition-shadow duration-300">
                                  <div>
                                    <p
                                      className="flex gap-1 items-center font-bold text-sm text-blue-800 leading-tight truncate"
                                      title={getModuleName(entry.moduleId)}
                                    >
                                      <BookOpen className="w-3 h-3" />
                                      <span className="flex justify-between w-full">
                                        <span>
                                          {getModuleName(entry.moduleId)}
                                        </span>
                                        <span>
                                          [{parseTime(entry.startTime)}:00 -{" "}
                                          {parseTime(entry.endTime)}:00]
                                        </span>
                                      </span>
                                    </p>
                                    <p className="flex gap-1 items-center text-xs text-blue-700 mt-1">
                                      <GraduationCap className="w-3 h-3" />
                                      <span>
                                        {getTeacherName(entry.teacherId)}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="flex justify-between items-end mt-1">
                                    <div className="text-xs text-blue-700 flex items-center gap-1.5">
                                      <Building className="w-3 h-3" />
                                      {entry.roomName}
                                    </div>
                                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => handleEdit(entry)}
                                      >
                                        <Edit className="w-4 h-4 text-blue-700" />
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                          >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              {t.sm_clear_dialog_title}
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              {t.sm_clear_dialog_description1}
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>
                                              {t.sm_cancel_btn}
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() =>
                                                handleDelete(
                                                  entry._id || entry.id
                                                )
                                              }
                                            >
                                              {t.sm_delete_btn}
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            );
                          }
                          return (
                            <td
                              key={day}
                              className="border align-middle h-24 transition-colors hover:bg-gray-50"
                            >
                              <button
                                className="w-full h-full flex items-center justify-center group"
                                onClick={() =>
                                  handleOpenDialogForSlot(day, time)
                                }
                              >
                                <Plus className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? t.sm_edit_class_title : t.sm_add_class_title}
            </DialogTitle>
            <DialogDescription>
              {t.sm_dialog_desc}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="day">{t.sm_day_label}</Label>
              <Select
                required
                value={formData.day}
                onValueChange={(v) => handleInputChange("day", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.sm_day_placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="moduleId">{t.sm_subject_label}</Label>
              <Select
                required
                value={formData.moduleId}
                onValueChange={(v) => handleInputChange("moduleId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.sm_subject_placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {selectedGroupModules.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">{t.sm_start_label}</Label>
              <Select
                required
                value={formData.startTime}
                onValueChange={(v) => handleInputChange("startTime", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.sm_start_placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">{t.sm_end_label}</Label>
              <Select
                required
                value={formData.endTime}
                onValueChange={(v) => handleInputChange("endTime", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.sm_end_placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((t) => (
                    <SelectItem
                      key={t}
                      value={t}
                      disabled={t <= formData.startTime}
                    >
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacherId">{t.sm_teacher_label}</Label>
              <Select
                required={true}
                value={formData.teacherId}
                onValueChange={(v) => handleInputChange("teacherId", v)}
                disabled={!formData.moduleId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !formData.moduleId
                        ? t.sm_teacher_placeholder_no_subject
                        : t.sm_teacher_placeholder
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableTeachers.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomName">{t.sm_room_label}</Label>
              <Input
                id="roomName"
                placeholder="e.g., Room 101, Lab A"
                value={formData.roomName}
                onChange={(e) => handleInputChange("roomName", e.target.value)}
                required
              />
            </div>
            {formError && (
              <div className="col-span-2">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t.sm_conflict_title}</AlertTitle>
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              </div>
            )}
            <DialogFooter className="col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                {t.sm_cancel_btn}
              </Button>
              <Button type="submit">
                {editingEntry ? t.sm_update_btn : t.sm_add_btn}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-6xl">
          <DialogHeader>
            <DialogTitle>
              {t.sm_preview_title_prefix} {selectedGroupData?.groupName}
            </DialogTitle>
            <DialogDescription>
              {t.sm_preview_desc}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto py-4">
            <table className="w-full border-collapse text-xs text-center">
              <thead className="bg-gray-200 font-semibold">
                <tr>
                  <th className="p-2 border">{t.sm_pdf_day_head}</th>
                  {timeSlots.map((time) => (
                    <th key={time} className="p-2 border">
                      {time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {daysOfWeek.map((day) => {
                  const occupiedTimes: { [key: string]: boolean } = {};
                  (groupSchedules[selectedGroup] || []).forEach((entry) => {
                    if (entry.day !== day) return;
                    const start = parseTime(entry.startTime);
                    const end = parseTime(entry.endTime);
                    for (let i = start; i < end; i++) {
                      const slotTime = `${i.toString().padStart(2, "0")}:00`;
                      if (slotTime !== entry.startTime)
                        occupiedTimes[slotTime] = true;
                    }
                  });
                  return (
                    <tr key={day}>
                      <td className="p-2 border font-semibold bg-gray-100">
                        {day}
                      </td>
                      {timeSlots.map((time) => {
                        if (occupiedTimes[time]) return null;
                        const entry = (
                          groupSchedules[selectedGroup] || []
                        ).find((e) => e.day === day && e.startTime === time);
                        const randomColor = "purple";
                        if (entry) {
                          const duration =
                            parseTime(entry.endTime) -
                            parseTime(entry.startTime);
                          return (
                            <td
                              key={time}
                              className="border p-2 align-middle bg-blue-50"
                              colSpan={duration}
                            >
                              <div className="flex flex-col gap-1 text-left">
                                <div
                                  className={`font-bold text-${randomColor}-800 flex items-center gap-1.5`}
                                >
                                  <BookOpen className="w-3.5 h-3.5" />
                                  {getModuleName(entry.moduleId)}
                                </div>
                                <div
                                  className={`text-${randomColor}-700 flex items-center gap-1.5`}
                                >
                                  <GraduationCap className="w-3.5 h-3.5" />
                                  {getTeacherName(entry.teacherId)}
                                </div>
                                <div
                                  className={`text-xs text-${randomColor}-600 flex items-center gap-1.5`}
                                >
                                  <Building className="w-3.5 h-3.5" />
                                  {entry.roomName}
                                </div>
                              </div>
                            </td>
                          );
                        }
                        return <td key={time} className="border"></td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              {t.sm_preview_close_btn}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
