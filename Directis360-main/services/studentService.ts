import api from "@/lib/api";
import { isAxiosError } from "axios";

// ===================================================================
// Type Definitions
// ===================================================================

/**
 * Information about a student's parent.
 */
export interface ParentInfo {
  _id: string;
  full_name: string;
  email: string;
  phone_number: string;
}

/**
 * Information about a teacher assigned to a group.
 */
export interface TeacherInfo {
  teacherId: {
    _id: string;
    full_name: string;
    email: string;
    phone_number: string;
    modules: { id: string; name: string }[];
  };
  moduleId: string;
}

/**
 * Detailed information about the student's group.
 */
export interface GroupInfo {
  _id: string;
  id: string;
  groupName: string;
  level: number;
  speciality: { id: string; name: string };
  teachers: TeacherInfo[];
  season: string;
  schoolId: string;
}

/**
 * A single entry in the weekly schedule.
 */
export interface ScheduleEntry {
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
  moduleId: string;
  moduleName: string;
  teacherId: string;
  roomName: string;
}

/**
 * The full schedule object for the student's group.
 */
export interface ScheduleInfo {
  _id: string;
  groupId: string;
  season: string;
  entries: ScheduleEntry[];
}

/**
 * Marks for a single module within a trimester.
 */
export interface ModuleMark {
  value: number;
  coefficient: number;
  isOptional: boolean;
  dev1: number;
  dev2: number;
  exam: number;
  constant_observation: number;
  moduleName: string;
}

/**
 * Marks for a single trimester, containing multiple modules.
 */
export interface TrimesterInfo {
  trimester: number;
  modules: { [moduleId: string]: ModuleMark };
}

/**
 * The complete marks object for the student.
 */
export interface MarksInfo {
  groupId: string;
  trimesters: TrimesterInfo[];
}

/**
 * The main data structure for the student dashboard, fetched from the /info endpoint.
 */
export interface StudentDashboardData {
  _id: string;
  full_name: string;
  email: string;
  phone_number: string;
  nationality: string;
  birthDate: string; // ISO date string
  birthCity: string;
  schoolType: string;
  sex: "MALE" | "FEMALE";
  registered: boolean;
  registeredGroupId: string | null;
  parentAccountIds: {
    mother: ParentInfo | null;
    father: ParentInfo | null;
  };
  group: GroupInfo | null;
  schedule: ScheduleInfo | null;
  marks: MarksInfo | null;
  schoolId: string;
}

// ===================================================================
// Service Functions
// ===================================================================

const API_BASE_URL = "/student";

const getAuthHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/**
 * Checks if the current user has student-level access.
 * @param token The authentication token.
 * @returns A boolean indicating if access is granted.
 */
export const checkStudentAccess = async (token: string): Promise<boolean> => {
  try {
    const res = await api.get(`${API_BASE_URL}/`, getAuthHeaders(token));
    return res.data?.granted === true;
  } catch (error) {
    console.error("Student access check failed:", error);
    return false;
  }
};

/**
 * Fetches the complete dashboard information for the currently authenticated student,
 * including profile, group, schedule, and marks.
 * @param token The authentication token.
 * @returns The comprehensive student dashboard data.
 */
export const getStudentDashboardData = async (
  token: string
): Promise<StudentDashboardData> => {
  try {
    const res = await api.get(`${API_BASE_URL}/info`, getAuthHeaders(token));
    return res.data as StudentDashboardData;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to fetch student dashboard data"
      );
    }
    throw new Error(
      "A network error occurred while fetching student dashboard data."
    );
  }
};
