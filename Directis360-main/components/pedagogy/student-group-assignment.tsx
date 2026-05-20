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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Users,
  UserPlus,
  UserMinus,
  Search,
  AlertCircle,
  CheckCircle,
  Loader2,
  Save,
  ArrowRightLeft,
  XCircle,
  Undo2,
} from "lucide-react";
import {
  getGroupStudentAssignments,
  GroupWithStudents,
  assignStudentsToGroupBulk,
  changeStudentGroup,
  unassignStudentFromGroup, // Import the new service function
} from "@/services/staffPedagogyService";
import { useLanguage } from "@/context/language-context";

interface Student {
  _id: string;
  full_name: string;
  email: string;
  registered: boolean;
  registeredGroupId: string | null;
  group?: {
    speciality: {
      id: string;
    };
  };
}

interface StudentGroupAssignmentProps {
  students: Student[];
  reloadData: () => Promise<void>;
  getFreshToken: () => Promise<string | null>;
}

type SaveStatus = "idle" | "loading" | "success" | "error";
type FilterMode = "unassigned" | "registered";

export default function StudentGroupAssignment({
  students,
  getFreshToken,
  reloadData,
}: StudentGroupAssignmentProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [groups, setGroups] = useState<GroupWithStudents[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [assignedStudents, setAssignedStudents] = useState<Student[]>([]);
  const { t, isRTL } = useLanguage()

  // Dialog states
  const [transferStudent, setTransferStudent] = useState<Student | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);

  const [unassignStudent, setUnassignStudent] = useState<Student | null>(null);
  const [isUnassigning, setIsUnassigning] = useState(false);
  const [unassignError, setUnassignError] = useState<string | null>(null);

  const [isSaveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  const [filterMode, setFilterMode] = useState<FilterMode>("unassigned");
  const [sourceGroupFilter, setSourceGroupFilter] = useState<string>("all");

  const originalAssignedIds = useMemo(() => {
    const group = groups.find((g) => g.id === selectedGroup);
    return new Set(group ? group.students.map((s) => s._id) : []);
  }, [groups, selectedGroup]);

  const { newAssignments, hasPendingChanges } = useMemo(() => {
    const newAssignments = assignedStudents.filter(
      (s) => !originalAssignedIds.has(s._id)
    );
    const hasPendingChanges = newAssignments.length > 0;
    return { newAssignments, hasPendingChanges };
  }, [assignedStudents, originalAssignedIds]);

  const fetchGroupAssignments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication token not found.");
      const response = await getGroupStudentAssignments(token);
      setGroups(response.groups || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupAssignments();
  }, []);

  const selectedGroupData = useMemo(
    () => groups.find((g) => g.id === selectedGroup),
    [groups, selectedGroup]
  );

  const compatibleGroups = useMemo(() => {
    if (!selectedGroupData) return [];
    return groups.filter(
      (g) =>
        g.id !== selectedGroupData.id &&
        g.level === selectedGroupData.level &&
        g.speciality.id === selectedGroupData.speciality.id
    );
  }, [groups, selectedGroupData]);

  const availableStudents = useMemo(() => {
    if (!selectedGroupData) return [];
    const assignedIds = new Set(assignedStudents.map((s) => s._id));
    let filtered = students.filter((student) => !assignedIds.has(student._id));
    if (filterMode === "unassigned") {
      filtered = filtered.filter((s) => !s.registeredGroupId);
    } else {
      const compatibleGroupIds = new Set(compatibleGroups.map((g) => g.id));
      if (sourceGroupFilter === "all") {
        filtered = filtered.filter(
          (s) =>
            s.registeredGroupId && compatibleGroupIds.has(s.registeredGroupId)
        );
      } else {
        filtered = filtered.filter(
          (s) => s.registeredGroupId === sourceGroupFilter
        );
      }
    }
    return filtered.filter(
      (student) =>
        student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [
    students,
    assignedStudents,
    searchTerm,
    filterMode,
    sourceGroupFilter,
    selectedGroupData,
    compatibleGroups,
  ]);

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 300);
    return () => clearTimeout(timer);
  }, [filterMode, sourceGroupFilter, searchTerm]);

  useEffect(() => {
    if (selectedGroupData) {
      const initialAssigned = students.filter((s) =>
        originalAssignedIds.has(s._id)
      );
      setAssignedStudents(initialAssigned);
    } else {
      setAssignedStudents([]);
    }
    setSourceGroupFilter("all");
  }, [selectedGroupData, students, originalAssignedIds]);

  const handleAssignClick = (student: Student) => {
    if (student.registeredGroupId) {
      setTransferStudent(student);
    } else {
      setAssignedStudents((prev) => [...prev, student]);
    }
  };

  const confirmTransfer = async () => {
    if (!transferStudent || !selectedGroupData) return;
    setIsTransferring(true);
    setTransferError(null);
    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication failed.");
      await changeStudentGroup(token, {
        studentId: transferStudent._id,
        newGroupId: selectedGroupData.id,
      });
      setTransferStudent(null);
      await reloadData();
      await fetchGroupAssignments();
    } catch (err) {
      setTransferError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred during transfer."
      );
    } finally {
      setIsTransferring(false);
    }
  };

  const handleRemoveClick = (student: Student) => {
    if (originalAssignedIds.has(student._id)) {
      setUnassignStudent(student);
    } else {
      setAssignedStudents((prev) => prev.filter((s) => s._id !== student._id));
    }
  };

  const confirmUnassign = async () => {
    if (!unassignStudent) return;
    setIsUnassigning(true);
    setUnassignError(null);
    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication failed.");
      await unassignStudentFromGroup(token, unassignStudent._id);
      setUnassignStudent(null);
      await reloadData();
      await fetchGroupAssignments();
    } catch (err) {
      setUnassignError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsUnassigning(false);
    }
  };

  const executeSaveChanges = async () => {
    setSaveStatus("loading");
    setSaveError(null);
    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication failed.");
      if (newAssignments.length > 0) {
        await assignStudentsToGroupBulk(token, {
          groupId: selectedGroup,
          studentIds: newAssignments.map((s) => s._id),
        });
      }
      setSaveStatus("success");
      setTimeout(async () => {
        setSaveConfirmOpen(false);
        setSaveStatus("idle");
        await reloadData();
        await fetchGroupAssignments();
      }, 1500);
    } catch (err) {
      setSaveStatus("error");
      setSaveError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    }
  };

  const currentMembers = useMemo(
    () => assignedStudents.filter((s) => originalAssignedIds.has(s._id)),
    [assignedStudents, originalAssignedIds]
  );

  const studentCurrentGroup = useMemo(() => {
    if (!transferStudent || !transferStudent.registeredGroupId) return null;
    return groups.find((g) => g.id === transferStudent.registeredGroupId);
  }, [transferStudent, groups]);

  const isSpecialtyChange = useMemo(() => {
    if (!studentCurrentGroup || !selectedGroupData) return false;
    return (
      studentCurrentGroup.speciality.id !== selectedGroupData.speciality.id
    );
  }, [studentCurrentGroup, selectedGroupData]);

  if (isLoading)
    return (
      <div className="fixed inset-0 bg-white/60 z-50 flex flex-col justify-center items-center backdrop-blur-sm">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="mt-4 text-sm text-gray-700">
          {t.sga_loading_message}
        </p>
      </div>
    );

  if (error)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t.sga_error_title}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.sga_select_group_title}</CardTitle>
          <CardDescription>
            {t.sga_select_group_desc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger>
              <SelectValue placeholder={t.sga_select_group_placeholder} />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.level} {group.level > 1 ? "éme" : "ére"} -{" "}
                  {group.speciality.name} ( {group.groupName} ) (
                  {group.studentCount} Students)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedGroupData ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users /> {t.sga_assigned_members_title} ({assignedStudents.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[450px] overflow-y-auto">
                {newAssignments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-500">
                      {t.sga_pending_assignments_title} ({newAssignments.length})
                    </h4>
                    <div className="space-y-2">
                      {newAssignments.map((student) => (
                        <div
                          key={student._id}
                          className="flex items-center justify-between p-2 border rounded-md bg-green-50 border-green-200"
                        >
                          <span className="font-medium text-green-800">
                            {student.full_name}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveClick(student)}
                          >
                            <Undo2 className="w-4 h-4 text-gray-600" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {currentMembers.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-500">
                      {t.sga_current_members_title} ({currentMembers.length})
                    </h4>
                    <div className="space-y-2">
                      {currentMembers.map((student) => (
                        <div
                          key={student._id}
                          className="flex items-center justify-between p-2 border rounded-md bg-white"
                        >
                          <span className="font-medium">
                            {student.full_name}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveClick(student)}
                          >
                            <UserMinus className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {currentMembers.length === 0 && newAssignments.length === 0 && (
                  <p className="text-sm text-gray-500">
                    {t.sga_no_students_msg}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus /> {t.sga_available_students_title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={filterMode}
                    onValueChange={(value) =>
                      setFilterMode(value as FilterMode)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">{t.sga_filter_unassigned}</SelectItem>
                      <SelectItem value="registered">{t.sga_filter_registered}</SelectItem>
                    </SelectContent>
                  </Select>
                  {filterMode === "registered" && (
                    <Select
                      value={sourceGroupFilter}
                      onValueChange={setSourceGroupFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.sga_filter_group_placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {t.sga_filter_all_compatible}
                        </SelectItem>
                        {compatibleGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.groupName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <Input
                  placeholder={t.sga_search_placeholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="space-y-2 max-h-[260px] overflow-y-auto relative">
                  {isFiltering && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                      <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                    </div>
                  )}
                  {availableStudents.map((student) => {
                    const isAssignedElsewhere = !!student.registeredGroupId;
                    const currentGroup = isAssignedElsewhere
                      ? groups.find((g) => g.id === student.registeredGroupId)
                      : null;
                    return (
                      <div
                        key={student._id}
                        className="flex items-center justify-between p-2 border rounded-md bg-white"
                      >
                        <div>
                          <p className="font-medium">{student.full_name}</p>
                          {isAssignedElsewhere && (
                            <p className="text-xs text-orange-600">
                              In: {currentGroup?.groupName || "N/A"}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant={
                            isAssignedElsewhere ? "secondary" : "default"
                          }
                          onClick={() => handleAssignClick(student)}
                        >
                          {isAssignedElsewhere ? (
                            <ArrowRightLeft className="w-4 h-4 mr-2" />
                          ) : (
                            <UserPlus className="w-4 h-4 mr-2" />
                          )}
                          {isAssignedElsewhere ? t.sga_transfer_btn : t.sga_assign_btn}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setSaveConfirmOpen(true)}
              disabled={!hasPendingChanges}
            >
              <Save className="w-4 h-4 mr-2" />
              {t.sga_save_assignments_btn}
            </Button>
          </div>
        </>
      ) : (
        <Card className="text-center py-12 bg-white border-dashed border-2 border-gray-300">
          <CardContent>
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <h3 className="font-semibold">{t.sga_empty_state_title} </h3>
            <p className="text-sm text-gray-500">
              {t.sga_empty_state_desc}
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={!!transferStudent}
        onOpenChange={(isOpen) => {
          if (!isTransferring) {
            setTransferStudent(null);
            setTransferError(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isSpecialtyChange
                ? t.sga_transfer_confirm_specialty_title
                : t.sga_transfer_confirm_title}
            </DialogTitle>
            <DialogDescription>
              {isSpecialtyChange ? (
                <>
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>
                      {t.sga_transfer_confirm_warning_title}
                    </AlertTitle>
                    <AlertDescription>
                      {t.sga_transfer_confirm_warning_desc}
                    </AlertDescription>
                  </Alert>
                  {t.sga_transfer_confirm_desc_prefix} {" "}
                  <span className="font-bold">
                    {transferStudent?.full_name}
                  </span>{" "}
                  {t.sga_transfer_confirm_desc_suffix} {" "}
                  <span className="font-bold">
                    {selectedGroupData?.groupName}
                  </span>
                  {t.sga_transfer_confirm_desc_suffix}
                </>
              ) : (
                <>
                  {t.sga_transfer_confirm_desc_prefix1} {" "}
                  <span className="font-bold">
                    {transferStudent?.full_name}
                  </span>{" "}
                  {t.sga_transfer_confirm_desc_suffix1} {" "}
                  <span className="font-bold">
                    {selectedGroupData?.groupName}
                  </span>
                  ? {t.sga_transfer_confirm_desc_suffix2}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {transferError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>{t.sga_transfer_failed_title}</AlertTitle>
              <AlertDescription>{transferError}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isTransferring}>
                {t.sga_transfer_cancel_btn}
              </Button>
            </DialogClose>
            <Button onClick={confirmTransfer} disabled={isTransferring}>
              {isTransferring && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {t.sga_transfer_confirm_btn}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!unassignStudent}
        onOpenChange={(isOpen) => {
          if (!isUnassigning) {
            setUnassignStudent(null);
            setUnassignError(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.sga_unassign_confirm_title}</DialogTitle>
            <DialogDescription>
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  {t.sga_unassign_warning_title}
                </AlertTitle>
                <AlertDescription>
                  {t.sga_unassign_warning_desc}
                </AlertDescription>
              </Alert>
              {t.sga_unassign_confirm_desc_prefix} {" "}
              <span className="font-bold">{unassignStudent?.full_name}</span>{t.sga_unassign_confirm_desc_suffix}
            </DialogDescription>
          </DialogHeader>
          {unassignError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>{t.sga_unassign_failed_title}</AlertTitle>
              <AlertDescription>{unassignError}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isUnassigning}>
                {t.sga_unassign_cancel_btn}
              </Button>
            </DialogClose>
            <Button onClick={confirmUnassign} disabled={isUnassigning}>
              {isUnassigning && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {t.sga_unassign_confirm_btn}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isSaveConfirmOpen}
        onOpenChange={(isOpen) => {
          if (saveStatus !== "loading") setSaveConfirmOpen(isOpen);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.sga_save_confirm_title}</DialogTitle>
            <DialogDescription>
              {t.sga_save_confirm_desc}
            </DialogDescription>
          </DialogHeader>
          {saveStatus === "idle" && (
            <div className="max-h-60 overflow-y-auto">
              {newAssignments.length > 0 && (
                <div>
                  <h4 className="font-semibold">{t.sga_save_new_assignments_title}</h4>
                  <ul className="list-disc pl-5 text-sm">
                    {newAssignments.map((s) => (
                      <li key={s._id}>{s.full_name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {saveStatus === "loading" && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="ml-4">{t.sga_save_loading_msg}</p>
            </div>
          )}
          {saveStatus === "success" && (
            <div className="flex items-center justify-center p-8 text-green-600">
              <CheckCircle className="w-8 h-8" />
              <p className="ml-4">{t.sga_save_success_msg}</p>
            </div>
          )}
          {saveStatus === "error" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>{t.sga_save_failed_title}</AlertTitle>
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            {saveStatus === "idle" && (
              <>
                <DialogClose asChild>
                  <Button variant="outline">{t.sga_save_cancel_btn}</Button>
                </DialogClose>
                <Button onClick={executeSaveChanges}>{t.sga_save_confirm_btn}</Button>
              </>
            )}
            {saveStatus === "error" && (
              <>
                <DialogClose asChild>
                  <Button variant="outline">{t.sga_save_close_btn}</Button>
                </DialogClose>
                <Button onClick={executeSaveChanges}>{t.sga_save_retry_btn}</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
