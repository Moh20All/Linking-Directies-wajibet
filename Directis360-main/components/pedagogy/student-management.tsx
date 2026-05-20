"use client";

import type React from "react";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
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
  RefreshCcw,
  Edit,
  Trash2,
  Search,
  Users,
  Eye,
  EyeOff,
  Phone,
  Mail,
  User,
  Calendar,
  MapPin,
  Globe,
  AlertCircle,
  LogIn,
  ArrowRightLeft,
  HelpCircle,
  Flag,
  Shield,
  BadgeMinus,
  Rotate3d,
} from "lucide-react";
import countriesData from "@/data/countriesData.json";

// API Service Functions
import {
  addStudent,
  deleteStudent,
  updateStudent,
  NewStudentData,
} from "@/services/staffPedagogyService";
import { useLanguage } from "@/context/language-context";


// --- INTERFACES ---
interface Student {
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
  createdAt?: Date;
  updatedAt?: Date;
}

interface StudentManagementProps {
  students: Student[];
  schoolType: "primaire" | "cem" | "lycee" | null;
  getFreshToken: () => Promise<string | null>;
  reloadData: () => Promise<void>;
}

const historyEventDetails = {
  REGISTERED: { Icon: LogIn, style: "bg-green-100 text-green-700" },
  TRANSFERRED: { Icon: ArrowRightLeft, style: "bg-orange-100 text-orange-700" },
  DEFAULT: { Icon: HelpCircle, style: "bg-gray-100 text-gray-700" },
};

export default function StudentManagement({
  schoolType,
  students,
  getFreshToken,
  reloadData,
}: StudentManagementProps) {
  // --- LOCAL UI STATE ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegistered, setFilterRegistered] = useState("all");
  const [showPassword, setShowPassword] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { t, isRTL } = useLanguage();

  const [formData, setFormData] = useState<NewStudentData>({
    username: "",
    full_name: "",
    phone_number: "",
    email: "",
    password: "",
    nationality: "",
    birthDate: "",
    birthCity: "",
    sex: "" as "MALE" | "FEMALE",
  });

  const [cities, setCities] = useState<string[]>([]);
  const countries = useMemo(
    () => countriesData.slice().sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  useEffect(() => {
    const country = countries.find((c) => c.name === formData.nationality);
    setCities(country ? Array.from(new Set(country.cities)).sort() : []);
  }, [formData.nationality, countries]);

  // --- HANDLER FUNCTIONS ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const token = await getFreshToken();
    if (!token) {
      setFormError("Authentication session has expired. Please refresh.");
      setIsSubmitting(false);
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        sex: formData.sex.toUpperCase() as "MALE" | "FEMALE",
      };

      if (editingStudent) {
        if (!dataToSubmit.password) delete dataToSubmit.password;
        await updateStudent(token, editingStudent._id, dataToSubmit);
      } else {
        await addStudent(token, dataToSubmit);
      }

      await reloadData();
      handleCloseDialog();
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (studentId: string) => {
    // if (confirm("Are you sure you want to delete this student?")) {
    //   const token = await getFreshToken();
    //   if (!token) {
    //     alert("Authentication failed. Please refresh the page.");
    //     return;
    //   }
    //   try {
    //     await deleteStudent(token, studentId);
    //     await reloadData();
    //   } catch (err: any) {
    //     alert(`Error: ${err.message}`);
    //   }
    // }
  };

  const handleCloseViewDialog = () => setIsViewDialogOpen(false);

  const handleInputChange = useCallback(
    (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      username: student.username,
      full_name: student.full_name,
      phone_number: student.phone_number,
      email: student.email,
      password: "",
      nationality: student.nationality,
      birthDate: new Date(student.birthDate).toISOString().split("T")[0],
      birthCity: student.birthCity,
      sex: student.sex,
    });
    setIsDialogOpen(true);
  };

  const handleView = (student: Student) => {
    setViewingStudent(student);
    setIsViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingStudent(null);
    setFormError(null);
    setFormData({
      username: "",
      full_name: "",
      phone_number: "",
      email: "",
      password: "",
      nationality: "",
      birthDate: "",
      birthCity: "",
      sex: "" as "MALE" | "FEMALE",
    });
    setShowPassword(false);
  };

  const filteredStudents = useMemo(
    () =>
      students.filter((student) => {
        const matchesSearch =
          student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRegistered =
          filterRegistered === "all" ||
          (filterRegistered === "registered" && student.registered) ||
          (filterRegistered === "not-registered" && !student.registered);
        return matchesSearch && matchesRegistered;
      }),
    [students, searchTerm, filterRegistered]
  );

  const StudentCard = memo(function StudentCard({
    student,
    onView,
    onEdit,
    onDelete,
  }) {
    return (
      <>
        <div
          key={student._id}
          className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white flex flex-col"
        >
          <div className="flex-grow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{student.full_name}</h3>
                  <p className="text-sm text-gray-500">@{student.username}</p>
                </div>
              </div>
              <Badge variant={student.registered ? "default" : "secondary"}>
                {student.registered && student.group
                  ? `Registered (${student.group.groupName})`
                  : "Not Registered"}
              </Badge>
            </div>
            <div className="space-y-3 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />{" "}
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />{" "}
                <span>{student.phone_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />{" "}
                <span>
                  {t.sm_born_prefix} {new Date(student.birthDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-4 border-t mt-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(student)}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-1" /> {t.sm_view_btn}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(student)}
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-1" /> {t.sm_edit_btn}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(student._id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </>
    );
  });

  // --- RENDER ---

  return (
    <div className="space-y-6">
      {/* Header and Add Student Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t.sm_title1}
          </h2>
          <p className="text-gray-600">
            {t.sm_desc} {" "}
            {schoolType ? schoolType.toUpperCase() : "your school"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={"outline"}
            className="border-green-600 text-green-600 hover:text-green-600"
            onClick={() => reloadData()}
            disabled={!schoolType}
          >
            <RefreshCcw className="w-4 h-4" />
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setIsDialogOpen(true)}
            disabled={!schoolType}
          >
            <UserPlus className="w-4 h-4 mr-2" /> {t.sm_add_btn1}
          </Button>
        </div>
      </div>

      {/* Search and Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.sm_search_filter_title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                autoComplete="off"
                placeholder={t.sm_search_placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filterRegistered}
              onValueChange={setFilterRegistered}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t.sm_filter_placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.sm_filter_all}</SelectItem>
                <SelectItem value="registered">{t.sm_filter_registered}</SelectItem>
                <SelectItem value="not-registered">{t.sm_filter_not_registered}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" /> {t.sm_students_title} ({filteredStudents.length})
          </CardTitle>
          <CardDescription>{t.sm_students_desc}</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student._id}
                  student={student}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{t.sm_no_students_title}</p>
              <p className="text-sm text-gray-400">
                {students.length > 0
                  ? t.sm_no_students_desc_has_students
                  : t.sm_no_students_desc_empty}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Student Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingStudent ? t.sm_edit_dialog_title : t.sm_add_dialog_title}
            </DialogTitle>
            <DialogDescription>
              {t.sm_dialog_desc1}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">{t.sm_account_info_title}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">{t.sm_username}</Label>
                  <Input
                    autoComplete="off"
                    disabled={editingStudent}
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="full_name">{t.sm_full_name}</Label>
                  <Input
                    autoComplete="off"
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) =>
                      handleInputChange("full_name", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone_number">{t.sm_phone_number}</Label>
                  <Input
                    autoComplete="off"
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) =>
                      handleInputChange("phone_number", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t.sm_email}</Label>
                  <Input
                    autoComplete="off"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">{t.sm_password}</Label>
                <div className="relative">
                  <Input
                    autoComplete="off"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder={
                      editingStudent
                        ? t.sm_password_placeholder_edit
                        : t.sm_password_placeholder_new
                    }
                    required={!editingStudent}
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
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">
                {t.sm_personal_info_title}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Nationality */}
                <div>
                  <Label htmlFor="nationality">{t.sm_nationality} </Label>
                  <Select
                    value={formData.nationality}
                    onValueChange={(value) =>
                      handleInputChange("nationality", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.sm_select_country} />
                    </SelectTrigger>
                    <SelectContent
                      id="country-scroll"
                      className="max-h-60 overflow-auto"
                    >
                      {countries.map((country) => (
                        <SelectItem key={country.name} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sex">{t.sm_sex} </Label>
                  <Select
                    value={formData.sex}
                    onValueChange={(value: "MALE" | "FEMALE") =>
                      handleInputChange("sex", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.sm_select_sex} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">{t.sm_male} </SelectItem>
                      <SelectItem value="FEMALE">{t.sm_female} </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="birthDate">{t.sm_birth_date}</Label>
                  <Input
                    autoComplete="off"
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      handleInputChange("birthDate", e.target.value)
                    }
                    required
                  />
                </div>
                {/* City */}
                <div>
                  <Label htmlFor="birthCity">{t.sm_birth_city}</Label>
                  <Select
                    value={formData.birthCity}
                    onValueChange={(value) =>
                      handleInputChange("birthCity", value)
                    }
                    disabled={!cities.length}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.sm_select_city} />
                    </SelectTrigger>
                    <SelectContent
                      id="city-scroll"
                      className="max-h-60 overflow-auto"
                    >
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                {t.sm_cancel_btn1}
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                {editingStudent ? t.sm_update_student_btn : t.sm_add_student_btn}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={handleCloseViewDialog}>
        <DialogContent className="w-full max-w-2xl max-h-[95vh] p-0 flex flex-col rounded-3xl justify-between box-border overflow-hidden">
          {viewingStudent && (
            <div className="flex flex-col h-full">
              {/* Main Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Header */}
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-900 break-words flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    {viewingStudent.full_name}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 break-words flex items-center gap-2">
                    @{viewingStudent.username} —{" "}
                    {viewingStudent.registered && viewingStudent.group
                      ? `Registered (${viewingStudent.group.groupName})`
                      : "Not Registered"}
                  </DialogDescription>
                </DialogHeader>

                {/* Account Info */}
                <section>
                  <h3 className="font-medium text-lg text-gray-900 mb-4 flex items-center gap-2">
                    {t.sm_view_account_info}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <Label className="text-gray-500">{t.sm_full_name}</Label>
                        <p className="font-medium">
                          {viewingStudent.full_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <Label className="text-gray-500">{t.sm_username}</Label>
                        <p className="font-medium">{viewingStudent.username}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <Label className="text-gray-500">{t.sm_email}</Label>
                        <p className="font-medium break-words">
                          {viewingStudent.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <Label className="text-gray-500">{t.sm_phone_number}</Label>
                        <p className="font-medium">
                          {viewingStudent.phone_number}
                        </p>
                      </div>
                    </div>
                    {viewingStudent.parentAccountIds.mother && (
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <Label className="text-gray-500">
                            {t.sm_mother_phone_number} (
                            {viewingStudent.parentAccountIds.mother.full_name})
                          </Label>
                          <p className="font-medium">
                            {
                              viewingStudent.parentAccountIds.mother
                                .phone_number
                            }
                          </p>
                        </div>
                      </div>
                    )}
                    {viewingStudent.parentAccountIds.father && (
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <Label className="text-gray-500">
                            {t.sm_father_phone_number} (
                            {viewingStudent.parentAccountIds.father.full_name})
                          </Label>
                          <p className="font-medium">
                            {
                              viewingStudent.parentAccountIds.father
                                .phone_number
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Personal Info */}
                <section>
                  <h3 className="font-medium text-lg text-gray-900 mb-4 flex items-center gap-2">
                    {t.sm_view_personal_info}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <Label className="text-gray-500">{t.sm_birth_date}</Label>
                        <p className="font-medium">
                          {new Date(
                            viewingStudent.birthDate
                          ).toLocaleDateString()}{" "}
                          (
                          {Math.floor(
                            (Date.now() -
                              new Date(viewingStudent.birthDate).getTime()) /
                              (1000 * 60 * 60 * 24 * 365.25)
                          )}{" "}
                          {t.sm_years_old})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <Label className="text-gray-500">{t.sm_birth_city}</Label>
                        <p className="font-medium">
                          {viewingStudent.birthCity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Flag className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <Label className="text-gray-500">{t.sm_nationality}</Label>
                        <p className="font-medium">
                          {viewingStudent.nationality}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <Label className="text-gray-500">{t.sm_sex}</Label>
                        <p className="capitalize font-medium">
                          {viewingStudent.sex}
                        </p>
                      </div>
                    </div>
                    {viewingStudent.group && (
                      <div className="flex items-start gap-2">
                        <Globe className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <Label className="text-gray-500">{t.sm_speciality_label}</Label>
                          <p className="capitalize font-medium">
                            {`${viewingStudent.group.speciality.name} (${viewingStudent.group.speciality.abbreviation})`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Group History */}
                {Array.isArray(viewingStudent.groupHistory) &&
                  viewingStudent.groupHistory.length > 0 && (
                    <section>
                      <h3 className="font-medium text-gray-900 text-lg flex items-center gap-2">
                        {t.sm_view_group_history}
                      </h3>
                      <div className="space-y-4 text-sm max-h-48 overflow-y-auto pr-2 border rounded-lg p-3">
                        {viewingStudent.groupHistory
                          .slice()
                          .sort(
                            (a: any, b: any) =>
                              new Date(b.date).getTime() -
                              new Date(a.date).getTime()
                          )
                          .map((entry, idx) => (
                            <div
                              key={`history-${idx}`}
                              className="border-b last:border-0 pb-2"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <span className="font-semibold text-gray-800 flex items-center gap-2">
                                  {entry.reason === "REGISTRED" ? (
                                    <LogIn className=" text-green-500 w-4 h-4" />
                                  ) : entry.reason === "TRANSFERED" ||
                                    entry.reason === "TRANSFER" ? (
                                    <ArrowRightLeft className=" text-orange-300 w-4 h-4" />
                                  ) : entry.reason === "UNASSIGNED" ? (
                                    <BadgeMinus className=" text-red-500 w-4 h-4" />
                                  ) : entry.reason ===
                                    "TRANSFERRED_SPECIALTY" ? (
                                    <Rotate3d className=" text-purple-500 w-4 h-4" />
                                  ) : (
                                    <HelpCircle className=" text-gray-400 w-4 h-4" />
                                  )}
                                  {entry.groupId}
                                </span>
                                <span className="text-gray-500 text-sm flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(entry.date).toLocaleDateString()}
                                </span>
                              </div>
                              <span className="text-xs text-gray-600 ml-6">
                                {entry.reason}
                              </span>
                            </div>
                          ))}
                      </div>
                    </section>
                  )}
              </div>

              {/* Footer */}
              <div className="border-t p-4">
                <div className="flex items-center justify-end">
                  <Button variant="outline" onClick={handleCloseViewDialog}>
                    {t.sm_close_btn}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
