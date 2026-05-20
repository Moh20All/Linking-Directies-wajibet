"use client";

import type React from "react";
import { useEffect, useState, useMemo } from "react";
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
import api from "@/lib/api";
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
  UserPlus,
  Edit,
  Trash2,
  Search,
  GraduationCap,
  Eye,
  EyeOff,
  X,
  Phone,
  Mail,
  User,
  Calendar,
  AlertCircle,
  RefreshCcw,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SCHOOL_STRUCTURE } from "@/data/school-structure";
import {
  addTeacher,
  NewTeacherData,
  AddTeacherResponse,
  updateTeacher,
} from "@/services/staffPedagogyService";
import { useLanguage } from "@/context/language-context";

// --- Interfaces ---
interface TeacherModule {
  id: string;
  hoursPerWeek: number;
}

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
  fullUsername?: string;
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

interface TeacherManagementProps {
  schoolType: "primaire" | "cem" | "lycee" | null;
  teachers: Teacher[];
  getFreshToken: () => Promise<string | null>;
  reloadData: () => Promise<void>;
}

// --- Component ---
export default function TeacherManagement({
  schoolType,
  teachers,
  getFreshToken,
  reloadData,
}: TeacherManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showPassword, setShowPassword] = useState(false);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isLoadingFetch, setIsLoadingFetch] = useState(false);
  const [isLoadingSubmiting, setIsLoadingSubmiting] = useState(false);
  // ## Individual State for Each Form Field
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const { t, isRTL } = useLanguage();

  const [modules, setModules] = useState<any | null>(null);

  async function fetchModules() {
    try {
      const response = await api.get(`/help/structure/modules/${schoolType}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch modules:", error);
    }
  }

  const handleReloadData = async () => {
    await reloadData();
  };

  useEffect(() => {
    const loadModules = async () => {
      if (schoolType && !modules) {
        setIsLoadingFetch((old) => true);
        const data = await fetchModules();
        setModules((old: any) => data);
        setIsLoadingFetch((old) => false);
      }
    };
    loadModules();
  }, []);

  const getAvailableSubjects = (): string[] => {
    if (!schoolType) return [];
    const subjects = new Set<string>();
    const schoolData = SCHOOL_STRUCTURE[schoolType];
    schoolData.specialities.forEach((speciality) => {
      speciality.levels.forEach((level) => {
        level.modules.forEach((module) => {
          subjects.add(module.name.name_en);
        });
      });
    });
    return Array.from(subjects).sort();
  };

  const availableSubjects = getAvailableSubjects();

  const handleEdit = (teacher: Teacher) => {
    // Set the teacher to be edited
    setEditingTeacher(teacher);

    // Populate the form fields with the teacher's data
    setUsername(teacher.username);
    setFullName(teacher.full_name);
    setEmail(teacher.email);
    setPhoneNumber(teacher.phone_number || "");
    setNationalId(teacher.national_ID);
    setSelectedSubjects(teacher.modules.map((module) => module.id));

    // Open the dialog
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingSubmiting((old) => true);
    // Common payload structure
    const teacherPayload: NewTeacherData = {
      username,
      password, // required for creation
      full_name: fullName,
      phone_number: phoneNumber,
      national_ID: nationalId,
      email,
      modules: selectedSubjects.map((subject) => ({
        id: subject,
        hoursPerWeek: 0,
      })),
      // optionally include currentGroups if you add UI for it
      currentGroups: [],
    };

    try {
      const token = await getFreshToken();
      if (!token) {
        throw new Error("No valid session token. Please log in again.");
      }

      if (editingTeacher) {
        // --- UPDATE LOGIC (still local simulation) ---
        // Currently not implemented on backend

        console.log("Updating Teacher Data:", teacherPayload);
        const response = await updateTeacher(
          token,
          editingTeacher._id,
          teacherPayload
        );
        console.log("Teacher updated successfully:", response.teacher);
        // Reload teacher data in parent after successful creation
        await reloadData();
      } else {
        // --- CREATE LOGIC ---
        const response: AddTeacherResponse = await addTeacher(
          token,
          teacherPayload
        );
        console.log("Teacher created successfully:", response.teacher);

        // Reload teacher data in parent after successful creation
        await reloadData();
      }

      handleCloseDialog();
    } catch (err) {
      console.error("Error saving teacher:", err);
      alert(err instanceof Error ? err.message : "Failed to save teacher");
    } finally {
      setIsLoadingSubmiting((old) => false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTeacher(null);
    // Reset all individual states
    setUsername("");
    setFullName("");
    setPhoneNumber("");
    setNationalId("");
    setEmail("");
    setPassword("");
    setSelectedSubjects([]);
    setShowPassword(false);
  };

  // --- Subject Management Handlers ---
  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const removeSubject = (subject: string) => {
    setSelectedSubjects((prev) => prev.filter((s) => s !== subject));
  };

  // --- Other handlers and filtering logic ---
  const handleView = (teacher: Teacher) => {
    setViewingTeacher(teacher);
    setIsViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    setViewingTeacher(null);
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      teacher.full_name.toLowerCase().includes(searchTermLower) ||
      teacher.username.toLowerCase().includes(searchTermLower) ||
      teacher.email.toLowerCase().includes(searchTermLower) ||
      teacher.modules.some((module) =>
        module.id.toLowerCase().includes(searchTermLower)
      )
    );
  });

  const sortedHistory = useMemo(
    () =>
      viewingTeacher
        ? [...viewingTeacher.teachingHistory].sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        : [],
    [viewingTeacher]
  );

  if (!schoolType) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t.tm_title}
            </h2>
            <p className="text-gray-600">
              {t.tm_desc}
            </p>
          </div>
        </div>
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>{t.tm_school_not_configured_alert_title}</strong> 
            {t.tm_school_not_configured_alert_desc_1} {t.tm_school_not_configured_alert_desc_2}
          </AlertDescription>
        </Alert>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t.tm_school_not_configured_card_title}
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {t.tm_school_not_configured_card_desc}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Main Component JSX ---
  return (
    <div className="space-y-6">
      {isLoadingFetch && (
        <div className="absolute inset-0 bg-white/60 z-10 flex flex-col justify-center items-center backdrop-blur-sm">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          <p className="mt-2 text-sm text-gray-700">{t.tm_loading_text}</p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t.tm_title}
          </h2>
          <p className="text-gray-600">
            {t.tm_desc_prefix} {" "}
            {schoolType.charAt(0).toUpperCase() + schoolType.slice(1)} {t.tm_desc_suffix}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="border-blue-600 text-blue-600 hover:text-blue-600"
            variant={"outline"}
            onClick={() => handleReloadData()}
            disabled={!schoolType}
          >
            <RefreshCcw className="w-4 h-4" />
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsDialogOpen(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {t.tm_add_btn}
          </Button>
        </div>
      </div>

      {/* School Type Indicator */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          {t.tm_school_type_label} {" "}
          {schoolType.charAt(0).toUpperCase() + schoolType.slice(1)}
        </Badge>
        {modules && (
          <Badge variant="outline" className="text-xs">
            {modules.length} {t.tm_subjects_available_label}
          </Badge>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.tm_search_filter_title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={t.tm_search_placeholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t.tm_filter_placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.tm_filter_all}</SelectItem>
                <SelectItem value="active">{t.tm_filter_active}</SelectItem>
                <SelectItem value="inactive">{t.tm_filter_inactive}</SelectItem>
                <SelectItem value="on-leave">{t.tm_filter_on_leave}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Teachers Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            {t.tm_teachers_title} ({filteredTeachers.length})
          </CardTitle>
          <CardDescription>
            {t.tm_teachers_desc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTeachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher) => (
                <div
                  key={teacher._id}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {teacher.full_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          @{teacher.username}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{teacher.phone_number}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{t.tm_card_id}: {teacher.national_ID}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {t.tm_card_joined}:{" "}
                        {new Date(teacher.createdAt ?? "").toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      {t.tm_card_modules_label} ({teacher.modules.length})
                    </Label>
                    {modules && (
                      <div className="flex flex-wrap gap-1">
                        {teacher.modules.slice(0, 3).map((module) => (
                          <Badge
                            key={module.id}
                            variant="default"
                            className="text-xs"
                          >
                            {
                              modules.find((m: any) => m.id === module.id)?.name
                                .name_en
                            }
                          </Badge>
                        ))}
                        {teacher.modules.length > 3 && (
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            title={teacher.modules
                              .slice(3)
                              .map((module) => {
                                const found = modules.find(
                                  (m: any) => m.id === module.id
                                );
                                return found?.name.name_en;
                              })
                              .join(", ")}
                          >
                            {t.tm_card_more_label} {teacher.modules.length - 3} {t.tm_card_more_label1}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(teacher)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {t.tm_card_view_btn}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(teacher)} // <-- WIRED UP EDIT BUTTON
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      {t.tm_card_edit_btn}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      // onClick={() => handleDelete(teacher._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{t.tm_no_teachers_title}</p>
              <p className="text-sm text-gray-400">
                {teachers.length === 0
                  ? t.tm_no_teachers_desc_empty
                  : t.tm_no_teachers_desc_has_teachers}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Teacher Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTeacher ? t.tm_dialog_edit_title : t.tm_dialog_add_title}
            </DialogTitle>
            <DialogDescription>
              {editingTeacher
                ? `Update information for ${editingTeacher.full_name}`
                : `Fill this form to add a new teacher to your school`}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Subject Assignment */}
            <div className="space-y-4">
              {/* <h3 className="font-medium text-gray-900">Assign Subjects</h3>
              {selectedSubjects.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Subjects ({selectedSubjects.length})</Label>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                    {selectedSubjects.map((subject) => (
                      <Badge
                        key={subject}
                        variant="default"
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => removeSubject(subject)}
                      >
                        {
                          modules.find((m: any) => m.id === subject)?.name
                            .name_en
                        }
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:text-gray-200 hover:bg-transparent"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )} */}
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">{t.tm_form_basic_info}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">{t.tm_username}</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g., ahmed.benali"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full_name">{t.tm_full_name}</Label>
                  <Input
                    id="full_name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Ahmed Ben Ali"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone_number">{t.tm_phone_number}</Label>
                  <Input
                    id="phone_number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g., +213123456789"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="national_ID">{t.tm_national_id}</Label>
                  <Input
                    id="national_ID"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="e.g., 123456789"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t.tm_email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., ahmed.benali@school.dz"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.tm_password}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      editingTeacher
                        ? t.tm_password_placeholder_edit
                        : t.tm_password_placeholder_new
                    }
                    required={!editingTeacher} // Only required when creating
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {/* Subject selector */}
              <div className="space-y-3">
                {modules && (
                  <div className="flex justify-between w-full px-2 text-sm font-medium text-gray-700">
                    <p>
                      {t.tm_subjects_selected_label} ( {selectedSubjects.length} {t.tm_of_total} {" "}
                      {modules.length} {t.tm_subjects_available_label} )
                    </p>
                  </div>
                )}
                {modules && (
                  <div className="overflow-y-auto border rounded-lg p-3">
                    <div className="flex flex-wrap gap-2">
                      {modules.map((subject: any) => (
                        <Badge
                          className="cursor-pointer px-2 py-1"
                          onClick={() => handleSubjectToggle(subject.id)}
                          variant={
                            selectedSubjects.includes(subject.id)
                              ? "default"
                              : "outline"
                          }
                        >
                          {subject.name.name_en}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                {t.tm_cancel_btn}
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingTeacher ? t.tm_update_teacher_btn : t.tm_add_teacher_btn}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Teacher Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={handleCloseViewDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.tm_view_title}</DialogTitle>
            <DialogDescription>
              {t.tm_view_desc_part1} {viewingTeacher?.full_name}
            </DialogDescription>
          </DialogHeader>

          {viewingTeacher && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">
                  {t.tm_view_assigned_subjects} ({viewingTeacher.modules.length})
                </h3>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {viewingTeacher.modules.map((subject) => (
                    <Badge key={subject.id} variant="default">
                      {
                        modules.find((m: any) => m.id === subject.id)?.name
                          .name_en
                      }
                    </Badge>
                  ))}
                </div>
              </div>
              {/* Basic Information */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">{t.tm_view_basic_info}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      {t.tm_username}
                    </Label>
                    <p className="text-sm">{viewingTeacher.fullUsername}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      {t.tm_full_name}
                    </Label>
                    <p className="text-sm">{viewingTeacher.full_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      {t.tm_phone_number}
                    </Label>
                    <p className="text-sm">{viewingTeacher.phone_number}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      {t.tm_national_id}
                    </Label>
                    <p className="text-sm">{viewingTeacher.national_ID}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      {t.tm_email}
                    </Label>
                    <p className="text-sm">{viewingTeacher.email}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      {t.tm_created_date}
                    </Label>
                    <p className="text-sm">
                      {new Date(
                        viewingTeacher.createdAt ?? ""
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Teaching History */}

              <h3 className="font-medium text-gray-900">{t.tm_view_teaching_history}</h3>
              {modules && (
                <div className="max-h-56 overflow-y-auto border p-3 px-4 rounded-xl flex flex-col justify-start">
                  {sortedHistory.length > 0 ? (
                    <ul className="space-y-4">
                      {sortedHistory.map((entry, index) => (
                        <li key={index} className="flex items-start gap-3">
                          {/* Icon Column */}
                          <div className="mt-0.5">
                            {entry.reason === "assigned" ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>

                          {/* Content Column */}
                          <div className="flex-1">
                            <span className="text-sm text-gray-800">
                              <span
                                className={`font-semibold ${
                                  entry.reason === "assigned"
                                    ? "text-green-700"
                                    : "text-red-700"
                                }`}
                              >
                                {entry.reason === "assigned"
                                  ? "Assigned to"
                                  : "Removed from"}
                              </span>
                              {entry.moduleId
                                ? entry.reason === "assigned"
                                  ? " teach"
                                  : " teaching"
                                : " teaching group "}
                              {entry.moduleId && (
                                <Badge
                                  variant="default"
                                  className="mx-1 text-xs"
                                >
                                  {modules.find(
                                    (m: any) => m.id === entry.moduleId
                                  )?.name.name_en ?? entry.moduleId}
                                </Badge>
                              )}
                              {entry.moduleId && "in "}
                              <Badge
                                variant="secondary"
                                className="font-medium"
                              >
                                {entry.groupId}
                              </Badge>
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5 block">
                              {new Date(entry.timestamp).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex h-32 items-center justify-center">
                      <p className="text-sm text-gray-500">
                        {t.tm_view_history_no_data}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseViewDialog}>
              {t.tm_close_btn}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
