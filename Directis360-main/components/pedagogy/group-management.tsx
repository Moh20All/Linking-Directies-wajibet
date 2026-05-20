"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
  GraduationCap,
  Calendar,
  X,
  Eye,
  AlertCircle,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import {
  getGradesBySchoolType,
  getSubjectsByGradeAndSpeciality,
  getSpecialitiesBySchoolType,
} from "@/data/school-structure";
import { set } from "date-fns";
import { createNewGroupe, deleteGroupe } from "@/services/staffPedagogyService";
import { Span } from "next/dist/trace";
import { useLanguage } from "@/context/language-context";

interface Group {
  _id: string;
  id: string;
  level: number;
  speciality: {
    id: string;
    name: string;
    abbreviation?: string;
  };
  classNumber: number;
  season: string;
  groupName: string;
  schoolId: string;
  teachers: Array<{
    teacherId: string;
    moduleId: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

interface GroupManagementProps {
  schoolType: "primaire" | "cem" | "lycee" | null;
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  reloadData: () => Promise<void>;
  getFreshToken: () => Promise<string | null>;
}

export default function GroupManagement({
  schoolType,
  groups,
  setGroups,
  reloadData,
  getFreshToken,
}: GroupManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [startYear, setStartYear] = useState<string>("");
  const [endYear, setEndYear] = useState<string>("");
  const [filterSeasons, setFilterSeasons] = useState<string[]>([]);
  const { t, isRTL } = useLanguage()

  function generateSeasons(start: number, end: number): string[] {
    if (start > 2010 && end < 2030 && end > start) {
      const seasons: string[] = [];
      for (let y = start; y < end; y++) {
        const season = `${String(y).slice(-2)}${String(y + 1).slice(-2)}`;
        seasons.push(season);
      }
      return seasons;
    } else {
      return [];
    }
  }

  const [viewingGroup, setViewingGroup] = useState<Group | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [specialities, setSpecialities] = useState<any>([]);

  const [selectedSpeciality, setSelectedSpeciality] = useState<any | null>(
    null
  );
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  async function fetchSpecialities(type: string) {
    try {
      const response = await api.get(
        `/help/structure/specialities/${type.toLowerCase()}`
      );
      // const fetchedSpecialities = await fetchSpecialities(schoolType);
      setSpecialities((old: any) => response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch specialities:", error);
    }
  }

  // Usage
  useEffect(() => {
    if (schoolType) fetchSpecialities(schoolType);
  }, []);

  const [modules, setModules] = useState<object | null>(null);

  async function fetchModules(specialityId: string, level: number) {
    try {
      const response = await api.get(
        `/help/structure/speciality/${specialityId}/level/${level}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch modules:", error);
    }
  }
  function getCurrentSchoolSeason() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0 = Jan, 5 = June

    if (month >= 5) {
      // After May → new season
      return `${(year % 100).toString().padStart(2, "0")}${((year + 1) % 100)
        .toString()
        .padStart(2, "0")}`;
    } else {
      // Before June → same academic year
      return `${((year - 1) % 100).toString().padStart(2, "0")}${(year % 100)
        .toString()
        .padStart(2, "0")}`;
    }
  }

  const handleSpecialityChange = (selected: any) => {
    if (selected) {
      setIsLoadingFetch((old) => true);
      setSelectedSpeciality((old: any) => selected);
      setSelectedLevel(null);
      setModules(null);
      setIsLoadingFetch((old) => false);
    }
  };

  const handleLevelChange = async (selected: any) => {
    if (selectedSpeciality && selected) {
      setIsLoadingFetch((old) => true);
      setSelectedLevel((old) => selected);
      const modules = await fetchModules(selectedSpeciality._id, selected);
      setModules((old) => modules);
      setIsLoadingFetch((old) => false);
    }
  };

  // Usage
  // fetchModules(specialityId, level);

  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    speciality: "",
    capacity: "",
    subjects: [] as string[],
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteDialogue = (groupId: string) => {
    setGroupToDelete(groupId);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async (groupId: string) => {
    try {
      setIsDeleting(true);
      const token = await getFreshToken();
      if (!token) throw new Error("No token found");
      await deleteGroupe(token, groupId);
      await reloadData();
      setIsDeleteDialogOpen(false);
      setGroupToDelete(null);
    } catch (err) {
      console.error("error while deleting groupe: ", err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleView = async (group: Group) => {
    setIsViewDialogOpen((old) => true);

    setIsLoadingFetch((old) => true);
    setViewingGroup((old) => group);
    const fetchedModules = await fetchModules(group.speciality.id, group.level);
    setModules((old) => fetchedModules);
    setIsLoadingFetch((old) => false);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    setViewingGroup(null);
    setModules(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen((old) => false);
    setSelectedSpeciality(null);
    setSelectedLevel(null);
    setModules(null);
    setEditingGroup(null);
  };

  // Get available grades for filtering
  const getFilterGrades = () => {
    if (!schoolType) return [];
    return getGradesBySchoolType(schoolType);
  };

  // Filter groups based on search and filters
  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.groupName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesGrade =
      filterGrade === "all" || group.level.toString() === filterGrade;
    const matchesSpeciality =
      filterStatus === "all" || group.speciality.abbreviation === filterStatus;
    const currentSeason = getCurrentSchoolSeason();
    const matchesSeason =
      filterSeasons.length === 0
        ? group.season === currentSeason
        : filterSeasons.includes(group.season);

    return matchesSearch && matchesGrade && matchesSpeciality && matchesSeason;
    // use && to apply both filters together
  });

  useEffect(() => {
    if (!schoolType) {
      alert("Please configure the school type in the settings first.");
    }
  }, [schoolType]);
  const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(false);

  function generateSeasonOptions(): string[] {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Get current season (e.g. if 2025, season is "2526")
    const startYY = String(currentYear).slice(-2);
    const endYY = String(currentYear + 1).slice(-2);
    const currentSeason = `${startYY}${endYY}`;

    // Also add next season (e.g. "2627")
    const nextSeason = `${String(currentYear + 1).slice(-2)}${String(
      currentYear + 2
    ).slice(-2)}`;

    const seasons: string[] = [currentSeason, nextSeason];

    // Add previous 10 seasons
    for (let i = 1; i <= 10; i++) {
      const y = currentYear - i;
      const season = `${String(y).slice(-2)}${String(y + 1).slice(-2)}`;
      seasons.push(season);
    }

    return seasons;
  }

  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [seasonOptions, setSeasonOptions] = useState<string[]>([]);

  const handleOpenCreateGroupe = async () => {
    const seasonOptions = generateSeasonOptions();
    setSeasonOptions((old) => seasonOptions);
    setIsDialogOpen((old) => true);
    setIsLoadingFetch((old) => true);

    setIsLoadingFetch((old) => false);
  };
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function generateAbbreviation(name: string) {
    return name
      .split(/\s+/)
      .map((word) => {
        const validChar = [...word].find((ch) => /[A-Za-zÀ-ÿ]/.test(ch));
        return validChar ? validChar.toUpperCase() : "";
      })
      .join("");
  }
  const handleReloadData = async () => {
    await reloadData();
  };

  const handleCreateGroup = async () => {
    const token = await getFreshToken();
    const groupInfo = {
      level: selectedLevel,
      speciality: {
        id: selectedSpeciality._id,
      },
      classNumber: 2,
    };
    try {
      const newGroup = await createNewGroupe(token || "", groupInfo);
    } catch (err) {
      console.error("error while creating new group: ", err);
      throw err;
    } finally {
      return;
    }
  };
  const validateGroup = () => {
    if (!selectedSpeciality) return "Please select a speciality.";
    if (!selectedLevel) return "Please select a grade.";
    return null;
  };

  const handleSubmitGroup = async () => {
    const validationError = validateGroup();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsLoadingFetch(true);
    setErrorMessage(null);
    try {
      await handleCreateGroup();
      handleCloseDialog();
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to create group. Please try again."
      );
    } finally {
      await handleReloadData();
      setIsLoadingFetch(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t.gm_title}</h2>
          <p className="text-gray-600">
            {t.gm_subtitle_prefix} {" "}
            {schoolType ? schoolType.toUpperCase() : "your school"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="border-purple-600 text-purple-600 hover:text-purple-600"
            variant={"outline"}
            onClick={() => handleReloadData()}
            disabled={!schoolType}
          >
            <RefreshCcw className="w-4 h-4" />
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => handleOpenCreateGroupe()}
            disabled={!schoolType}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.gm_btn_create_group}
          </Button>
        </div>
      </div>

      {!schoolType && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">{t.gm_alert_no_school_type_title}</p>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              {t.gm_alert_no_school_type_desc}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.gm_filter_title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={t.gm_search_placeholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterGrade} onValueChange={setFilterGrade}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t.gm_filter_grade_placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {getFilterGrades().map((grade) => (
                  <SelectItem
                    key={grade}
                    value={grade}
                    onChange={(old) => setFilterGrade(grade)}
                  >
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t.gm_filter_status_placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.gm_filter_all_specialities}</SelectItem>
                {specialities?.map((speciality: any) => {
                  const fullName = speciality.name.name_fr;
                  const initials = generateAbbreviation(fullName);

                  return (
                    <SelectItem key={speciality._id} value={initials}>
                      {initials.length > 1 ? initials : fullName}
                      {/* {speciality._id} */}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Input
              type="number"
              placeholder={t.gm_filter_start_year_placeholder}
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className={`w-full md:w-48 ${
                startYear &&
                (parseInt(startYear, 10) < 2010 ||
                  parseInt(startYear, 10) > 2030)
                  ? "border-2 border-red-500 focus:outline-red-500 text-red-600"
                  : ""
              }`}
              min={2010}
              max={2030}
            />
            <Input
              type="number"
              placeholder={t.gm_filter_end_year_placeholder}
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              className={`w-full md:w-48 ${
                endYear &&
                (parseInt(endYear, 10) < 2010 || parseInt(endYear, 10) > 2030)
                  ? "border-2 border-red-500 focus:outline-red-500 text-red-600"
                  : ""
              }`}
              min={2010}
              max={2030}
            />
            <Button
              variant="default"
              className="p-4"
              onClick={() => {
                if (!startYear || !endYear) return;
                const s = parseInt(startYear, 10);
                const e = parseInt(endYear, 10);
                if (
                  isNaN(s) ||
                  isNaN(e) ||
                  e <= s ||
                  s < 2010 ||
                  s > 2030 ||
                  e < 2010 ||
                  e > 2030
                ) {
                  return alert("Invalid range");
                }
                setFilterSeasons(generateSeasons(s, e));
              }}
              disabled={!startYear || !endYear}
            >
              {t.gm_btn_apply_season}
            </Button>
            {filterSeasons.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => {
                  setStartYear("");
                  setEndYear("");
                  setFilterSeasons([]);
                }}
              >
                {t.gm_btn_clear}
              </Button>
            )}
          </div>

          <div className="w-full flex items-center gap-1">
            <span className="text-sm text-gray-500">
              {t.gm_filter_currently_showing}
            </span>
            <div className="flex flex-wrap gap-2">
              {filterSeasons.length > 0 ? (
                filterSeasons.map((season) => (
                  <Badge
                    key={season}
                    variant="secondary"
                    className="text-gray-500"
                  >
                    {season.slice(0, 2)}/{season.slice(2, 4)}
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary" className="text-gray-500">
                  {" "}
                  {getCurrentSchoolSeason().slice(0, 2)}/
                  {getCurrentSchoolSeason().slice(2, 4)}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <Card
              key={group.id}
              className="hover:shadow-lg transition-ease duration-200 flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{group.groupName}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Badge variant={"default"}>
                      {group.speciality.abbreviation}
                    </Badge>
                    <Badge variant={"outline"}>
                      {group.level} {group.level === 1 ? "ére" : "éme"}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4" />
                  <Badge variant="outline" className="text-xs">
                    {schoolType.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {group.season.slice(0, 2)}/{group.season.slice(2, 4)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {t.gm_label_room} : {group.classNumber}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span>{t.gm_label_speciality} : </span>
                  {group.speciality && (
                    <Badge variant="outline" className="text-xs w-auto">
                      {group.speciality.name}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span>{t.gm_label_teachers} : </span>
                  {group.speciality && (
                    <Badge variant="outline" className="text-xs w-auto">
                      {group.teachers.length > 1
                        ? `${group.teachers.length} teachers`
                        : `${group.teachers.length} teacher`}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {group.students.length}/{group.capacity} students
                    </span>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          (group.students.length / group.capacity) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div> */}

                {/* <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Subjects ({group.subjects.length}):
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {group.subjects.slice(0, 4).map((subject) => (
                      <Badge
                        key={subject}
                        variant="secondary"
                        className="text-xs"
                      >
                        {subject}
                      </Badge>
                    ))}
                    {group.subjects.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{group.subjects.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div> */}

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {t.gm_label_created}: {group.createdAt?.split("T")[0]}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(group)}
                    className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-300 hover:text-purple-700 duration-200 ease-in-out"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    {t.gm_btn_view}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteDialogue(group.id)}
                    className="text-red-600 border-red-300 hover:text-red-700 hover:bg-red-300 duration-200 ease-in-out"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t.gm_no_groups_title}
                </h3>
                <p className="text-gray-500 mb-4">
                  {groups.length === 0
                    ? t.gm_no_groups_desc_start
                    : t.gm_no_groups_desc_filter}
                </p>
                {groups.length === 0 && (
                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t.gm_no_groups_btn}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Add/Edit Group Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.gm_create_title}</DialogTitle>
            <DialogDescription>
              {`Create a new student group for ${
                schoolType?.toUpperCase() || "the school"
              }`}
            </DialogDescription>
          </DialogHeader>

          {isLoadingFetch && (
            <div className="absolute inset-0 bg-white/60 z-10 flex flex-col justify-center items-center backdrop-blur-sm">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
              <p className="mt-2 text-sm text-gray-700">{t.gm_loading}</p>
            </div>
          )}

          <form className="flex flex-col justify-between space-y-8">
            {/* Academic Information Section */}
            <div className="p-5 border rounded-xl bg-white shadow-sm flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                {t.gm_academic_info}
                <span className="text-xs font-normal text-gray-600 ml-2">
                  {t.gm_required_notice} (<span className="text-red-600">*</span>) {t.gm_required_notice_suffix}
                </span>
              </h3>

              {schoolType && (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 flex items-center justify-start gap-2">
                  <span className="text-sm text-purple-700">{t.gm_school_level}</span>
                  <Badge
                    variant="outline"
                    className="bg-purple-100 text-purple-800 flex"
                  >
                    {schoolType.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-purple-700">
                    ({t.gm_configured_by})
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schoolType === "lycee" ? (
                  <div className="space-y-2">
                    <Label htmlFor="speciality">
                      {t.gm_speciality_label}<span className="text-red-600">*</span>
                    </Label>
                    <Select
                      value={selectedSpeciality ? selectedSpeciality._id : ""}
                      onValueChange={(value) => {
                        const selected = specialities.find(
                          (s: any) => s._id === value
                        );
                        handleSpecialityChange(selected);
                      }}
                    >
                      <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:ring-purple-500">
                        <SelectValue placeholder="Please select speciality" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialities?.map((speciality: any) => (
                          <SelectItem
                            key={speciality._id}
                            value={speciality._id}
                          >
                            {speciality.name.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ):<div className="space-y-2">
                    <Label htmlFor="speciality">
                      {t.gm_speciality_label}<span className="text-red-600">*</span>
                    </Label>
                    <Select
                      value={selectedSpeciality ? selectedSpeciality._id : ""}
                      onValueChange={(value) => {
                        const selected = specialities.find(
                          (s: any) => s._id === value
                        );
                        handleSpecialityChange(selected);
                      }}
                    >
                      <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:ring-purple-500">
                        <SelectValue placeholder="Please select speciality" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialities?.map((speciality: any) => (
                          <SelectItem
                            key={speciality._id}
                            value={speciality._id}
                          >
                            {speciality.name.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>}

                <div className="space-y-2">
                  <Label htmlFor="grade">
                    {t.gm_level_label} <span className="text-red-600">*</span>
                    {!schoolType ||
                      (!selectedSpeciality && (
                        <span className="text-xs text-gray-500">
                          {" "}
                          ({t.gm_select_speciality_first})
                        </span>
                      ))}
                  </Label>
                  <Select
                    value={selectedLevel}
                    onValueChange={(value) => handleLevelChange(value)}
                    disabled={!schoolType || !selectedSpeciality}
                  >
                    <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:ring-purple-500 disabled:opacity-50">
                      <SelectValue
                        placeholder={
                          !selectedSpeciality
                            ? t.gm_select_speciality_first
                            : t.gm_select_level_placeholder
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedSpeciality?.levels.map((level: any) => (
                        <SelectItem key={level} value={level.toString()}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Room & season Details Section */}
            <div className="p-5 border rounded-xl bg-white shadow-sm flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                {t.gm_room_season_details}
              </h3>
              <div className="space-y-2">
                <Label htmlFor="season">
                  {t.gm_season_label} <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={selectedSeason}
                  onValueChange={(value) => setSelectedSeason(value)}
                >
                  <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:ring-purple-500">
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasonOptions.map((season) => (
                      <SelectItem key={season} value={season}>
                        20{season.slice(0, 2)}/20{season.slice(2, 4)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Subjects Section */}
            <div className="p-5 flex flex-col justify-between gap-2 border rounded-xl bg-white shadow-sm">
              {modules ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t.gm_subject_assignment}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      {modules.specialityName.name_en} - {modules.level}{" "}
                      {modules.level === 1 ? "ére" : "éme"}{" "}
                      {schoolType === "lycee"
                        ? "AS"
                        : schoolType === "cem"
                        ? "AM"
                        : "AP"}
                    </p>

                    <div className="max-h-48 overflow-y-auto border rounded-lg p-3 w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {modules.modules.map((subject: any, index: number) => (
                          <div
                            key={index}
                            className="flex flex-col px-2 py-3 gap-2 rounded-xl bg-gray-50 border hover:border-purple-400 shadow-sm hover:shadow-md transition-all cursor-pointer"
                          >
                            <h3 className="text-xs font-medium text-gray-800">
                              {subject.name.name_en}
                            </h3>
                            <div className="flex items-between space-x-2">
                              <span className="text-xs font-medium px-1 py-1 rounded-full bg-gray-100 text-gray-600">
                                Coef: {subject.coeficient}
                              </span>
                              <span
                                className={`text-xs font-medium px-1 py-1 rounded-full ${
                                  subject.obligatory
                                    ? "bg-red-100 text-red-600"
                                    : "bg-green-100 text-green-600"
                                }`}
                              >
                                {subject.obligatory ? "Obligatory" : "Optional"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-red-300 p-3 border rounded-lg bg-gray-50">
                  {t.gm_no_subjects_message}
                </p>
              )}
            </div>

            {/* Footer Actions */}
            {errorMessage && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMessage}
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-lg border-gray-300"
                onClick={handleCloseDialog}
              >
                {t.gm_btn_cancel}
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 rounded-lg"
                disabled={
                  !schoolType ||
                  isLoadingFetch ||
                  !selectedLevel ||
                  !selectedSpeciality
                }
                onClick={() => {
                  handleSubmitGroup();
                }}
              >
                {t.gm_btn_create}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Group Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={handleCloseViewDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.gm_view_title}</DialogTitle>
            <DialogDescription>
              {t.gm_view_desc_prefix} {viewingGroup?.groupName}
            </DialogDescription>
          </DialogHeader>
          {isLoadingFetch && (
            <div className="absolute inset-0 bg-white/60 z-10 flex flex-col justify-center items-center backdrop-blur-sm">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
              <p className="mt-2 text-sm text-gray-700">{t.gm_loading}</p>
            </div>
          )}
          {viewingGroup && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">{t.gm_basic_info}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      {t.gm_label_group_name}
                    </Label>
                    <p className="text-sm">{viewingGroup.groupName}</p>
                  </div>
                  {/* <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Capacity
                    </Label>
                    <p className="text-sm">
                      {viewingGroup.students.length}/{viewingGroup.capacity}{" "}
                      students
                    </p>
                  </div> */}
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      {t.gm_label_school_type}
                    </Label>
                    <p className="text-sm">{schoolType.toUpperCase()}</p>
                  </div>
                  {/* <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Grade
                    </Label>
                    <p className="text-sm">{viewingGroup.grade}</p>
                  </div> */}
                  {viewingGroup.speciality && (
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-500">
                        {t.gm_label_speciality}
                      </Label>
                      <p className="text-sm">{viewingGroup.speciality.name}</p>
                    </div>
                  )}
                  {/* <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Status
                    </Label>
                    <Badge
                      variant={
                        viewingGroup.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {viewingGroup.status}
                    </Badge>
                  </div> */}
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      {t.gm_label_created_date}
                    </Label>
                    <p className="text-sm">
                      {viewingGroup.createdAt?.split("T")[0]}
                    </p>
                  </div>
                </div>
                <section>
                  <h3 className="font-medium text-gray-900">
                    {t.gm_modules_teachers} {" "}
                    {modules && (
                      <span className="text-xs text-gray-400">
                        ({viewingGroup.teachers.length}/{modules.modulesCount}{" "}
                        {viewingGroup.teachers.length > 1
                          ? "teachers are assigned"
                          : "teacher is assigned"}
                        )
                      </span>
                    )}
                  </h3>
                  <div className="space-y-4 text-sm max-h-48 overflow-y-auto pr-2 border rounded-lg p-3">
                    {modules && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {modules.modules.map((module) => {
                          const isAssigned = viewingGroup.teachers.some(
                            (teacher) => teacher.moduleId === module.id
                          );
                          return (
                            <div
                              key={module.id}
                              className="flex justify-between items-center p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
                            >
                              <span className="text-xm font-medium text-gray-800">
                                {module.name?.name_en || module.id}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  isAssigned
                                    ? "bg-green-100 text-green-700 border border-green-200"
                                    : "bg-red-100 text-red-700 border border-red-200"
                                }`}
                              >
                                {isAssigned ? t.gm_teacher_assigned : t.gm_no_teacher}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Subjects */}
              {/* <div className="space-y-3">
                <h3 className="font-medium text-gray-900">
                  Assigned Subjects ({viewingGroup.subjects.length})
                </h3>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {viewingGroup.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div> */}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseViewDialog}>
              {t.gm_btn_close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Group Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.gm_delete_title}</DialogTitle>
            <DialogDescription>
              {t.gm_delete_warning}
              <ul className="list-inside mt-2 text-red-600">
                <li>{t.gm_delete_list1}</li>
                <li>{t.gm_delete_list2}</li>
                <li>{t.gm_delete_list3}</li>
              </ul>
              <p className="mt-2 text-sm text-gray-600">
                {t.gm_delete_irreversible}{" "}
                <span className="font-semibold text-red-600">
                  {t.gm_delete_irreversible_desc}
                </span>
                .
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              {t.gm_delete_cancel}
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => groupToDelete && handleDelete(groupToDelete)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t.gm_deleting}
                </>
              ) : (
                t.gm_delete_confirm
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
