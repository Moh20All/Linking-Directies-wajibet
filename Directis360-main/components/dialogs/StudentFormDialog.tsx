"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Edit, Eye, EyeOff, AlertCircle } from "lucide-react";
import countriesData from "@/data/countriesData.json";
import type { NewStudentData } from "@/services/staffPedagogyService";
import { useLanguage } from "@/context/language-context";


// Minimal Student interface for props.
interface Student {
  username: string;
  full_name: string;
  phone_number: string;
  email: string;
  nationality: string;
  birthDate: Date;
  birthCity: string;
  sex: "MALE" | "FEMALE";
}

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewStudentData) => Promise<void>;
  student: Student | null;
  isSubmitting: boolean;
  formError: string | null;
}

const initialFormData: NewStudentData = {
  username: "",
  full_name: "",
  phone_number: "",
  email: "",
  password: "",
  nationality: "",
  birthDate: "",
  birthCity: "",
  sex: "" as "MALE" | "FEMALE",
};

export function StudentFormDialog({
  open,
  onOpenChange,
  student,
  onSubmit,
  isSubmitting,
  formError,
}: StudentFormDialogProps) {
  const [formData, setFormData] = useState<NewStudentData>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const { t, isRTL } = useLanguage()


  const countries = useMemo(
    () => countriesData.slice().sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  useEffect(() => {
    if (open) {
      setShowPassword(false); // Reset password visibility on open
      if (student) {
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
      } else {
        setFormData(initialFormData);
      }
    }
  }, [student, open]);

  useEffect(() => {
    const country = countries.find((c) => c.name === formData.nationality);
    setCities(country ? Array.from(new Set(country.cities)).sort() : []);
    if (country && !country.cities.includes(formData.birthCity)) {
      setFormData((prev) => ({ ...prev, birthCity: "" }));
    }
  }, [formData.nationality, countries]);

  const handleInputChange = (field: keyof NewStudentData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const dialogTitle = student
    ? t.student_dialog_edit_title
    : t.student_dialog_add_title;
  const dialogDescription = student
    ? `Editing profile for @${student.username}`
    : t.student_dialog_add_desc;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl max-h-[95vh] p-0 flex flex-col rounded-3xl justify-between box-border overflow-hidden">
        <form onSubmit={handleFormSubmit} className="flex flex-col h-full">
          {/* Main Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Header */}
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 break-words flex items-center gap-2">
                {student ? (
                  <Edit className="w-5 h-5 text-gray-500" />
                ) : (
                  <UserPlus className="w-5 h-5 text-gray-500" />
                )}
                {dialogTitle}
              </DialogTitle>
              <DialogDescription className="text-gray-600 break-words">
                {dialogDescription}
              </DialogDescription>
            </DialogHeader>

            {/* Account Information Section */}
            <section>
              <h3 className="font-medium text-lg text-gray-900 mb-4">
                {t.student_dialog_section_account}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">{t.student_dialog_username}</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      disabled={!!student}
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <Label htmlFor="full_name">{t.student_dialog_full_name}</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) =>
                        handleInputChange("full_name", e.target.value)
                      }
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone_number">{t.student_dialog_phone}</Label>
                    <Input
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={(e) =>
                        handleInputChange("phone_number", e.target.value)
                      }
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t.student_dialog_email}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password">{t.student_dialog_password}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder={
                        student
                          ? t.student_dialog_password_placeholder_edit
                          : t.student_dialog_password_placeholder_new
                      }
                      required={!student}
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
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
            </section>

            {/* Personal Information Section */}
            <section>
              <h3 className="font-medium text-lg text-gray-900 mb-4">
                {t.student_dialog_section_personal}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nationality">{t.student_dialog_nationality}</Label>
                  <Select
                    value={formData.nationality}
                    onValueChange={(value) =>
                      handleInputChange("nationality", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.student_dialog_select_country} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {countries.map((country) => (
                        <SelectItem key={country.name} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="birthCity">{t.student_dialog_birth_city}</Label>
                  <Select
                    value={formData.birthCity}
                    onValueChange={(value) =>
                      handleInputChange("birthCity", value)
                    }
                    disabled={!cities.length}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.student_dialog_select_city} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="birthDate">{t.student_dialog_birth_date}</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      handleInputChange("birthDate", e.target.value)
                    }
                    required
                    autoComplete="off"
                  />
                </div>
                <div>
                  <Label htmlFor="sex">{t.student_dialog_sex}</Label>
                  <Select
                    value={formData.sex}
                    onValueChange={(value: "MALE" | "FEMALE") =>
                      handleInputChange("sex", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.student_dialog_select_sex} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">{t.student_dialog_male}</SelectItem>
                      <SelectItem value="FEMALE">{t.student_dialog_female}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {formError && (
              <div className="text-red-600 text-sm flex items-center gap-2 bg-red-50 p-3 rounded-md">
                <AlertCircle className="w-4 h-4" />
                <p>{formError}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4 bg-gray-50 rounded-b-3xl">
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t.student_dialog_cancel}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting
                  ? "Saving..."
                  : student
                  ? "Update Student"
                  : "Add Student"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
