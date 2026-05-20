// components/dialogs/StudentViewDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Flag,
  Shield,
  Globe,
  ArrowRightLeft,
  LogIn,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

// You should import this from a shared types file
interface Student {
  createdAt: string; // ISO date string
  _id: string;
  username: string;
  full_name: string;
  phone_number: string;
  email: string;
  nationality: string;
  birthDate: Date;
  birthCity: string;
  sex: "MALE" | "FEMALE";
  registered: boolean;
  groupHistory: Array<{
    groupId?: string;
    season?: string;
    reason?: string;
    date?: Date;
  }>;
  group?: {
    id: string;
    level: number;
    speciality: {
      id: string;
      name: string;
      abbreviation: string;
    };
    classNumber: number;
    season: string;
    groupName: string;
    schoolId: string;
  };
}

interface StudentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <Icon className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
    <div>
      <Label className="text-gray-500">{label}</Label>
      <p className="font-medium break-words">{value}</p>
    </div>
  </div>
);

export function StudentViewDialog({
  open,
  onOpenChange,
  student,
}: StudentViewDialogProps) {
  if (!student) return null;
  const { t, isRTL } = useLanguage()
  const calculateAge = (birthDate: Date) => {
    return Math.floor(
      (Date.now() - new Date(birthDate).getTime()) /
        (1000 * 60 * 60 * 24 * 365.25)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
            {student.full_name}
          </DialogTitle>
          <DialogDescription className="pl-16 -mt-2">
            @{student.username} —{" "}
            <span className={`text-gray-600`}>
              {student.registered && student.group
                ? `Registered (${student.group.groupName})`
                : "Not Registered"}
            </span>
            —
            <span className="text-gray-600">
              {new Date(student.createdAt).toLocaleDateString()}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-8">
          {/* Account Info */}
          <section>
            <h3 className="font-semibold text-lg text-gray-800 mb-4 border-b pb-2">
              {t.student_dialog_section_account}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 text-sm">
              <InfoRow
                icon={User}
                label="Full Name"
                value={student.full_name}
              />
              <InfoRow
                icon={Shield}
                label="Username"
                value={student.username}
              />
              <InfoRow icon={Mail} label="Email" value={student.email} />
              <InfoRow
                icon={Phone}
                label="Phone"
                value={student.phone_number}
              />
            </div>
          </section>

          {/* Personal Info */}
          <section>
            <h3 className="font-semibold text-lg text-gray-800 mb-4 border-b pb-2">
              {t.student_dialog_section_personal}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 text-sm">
              <InfoRow
                icon={Calendar}
                label="Birth Date"
                value={`${new Date(
                  student.birthDate
                ).toLocaleDateString()} (${calculateAge(
                  student.birthDate
                )} years old)`}
              />
              <InfoRow
                icon={MapPin}
                label="Birth Place"
                value={`${student.birthCity}, ${student.nationality}`}
              />
              <InfoRow
                icon={User}
                label="Sex"
                value={
                  student.sex.charAt(0) + student.sex.slice(1).toLowerCase()
                }
              />
              {student.group?.speciality && (
                <InfoRow
                  icon={Globe}
                  label="Speciality"
                  value={`${student.group.speciality.name} (${student.group.speciality.abbreviation})`}
                />
              )}
            </div>
          </section>

          {/* Group History */}
          {Array.isArray(student.groupHistory) &&
            student.groupHistory.length > 0 && (
              <section>
                <h3 className="font-semibold text-lg text-gray-800 mb-4 border-b pb-2">
                  {t.student_dialog_group_history}
                </h3>
                <div className="space-y-4 text-sm max-h-48 overflow-y-auto pr-2">
                  {student.groupHistory
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.date ?? 0).getTime() -
                        new Date(a.date ?? 0).getTime()
                    )
                    .map((entry, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div>
                          {entry.reason === "REGISTERED" ? (
                            <LogIn className="w-4 h-4 text-green-500 mt-0.5" />
                          ) : (
                            <ArrowRightLeft className="w-4 h-4 text-orange-500 mt-0.5" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {entry.groupId} (Season {entry.season})
                          </p>
                          <p className="text-gray-500 text-xs">
                            {entry.reason} on{" "}
                            {entry.date
                              ? new Date(entry.date).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
           {t.teacher_modal_attendance_close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
