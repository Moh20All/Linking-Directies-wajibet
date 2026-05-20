import api from "@/lib/api";
import { isAxiosError } from "axios";

// ===================================================================
// Type Definitions
// ===================================================================

// Simplified child info for the parent's main profile
interface ChildReference {
  _id: string;
  full_name: string;
  registeredGroupId: string | null;
}

// The authenticated parent's profile data
export interface ParentProfile {
  _id: string;
  full_name: string;
  email: string;
  phone_number: string;
  relationship: "mother" | "father";
  children: ChildReference[];
  // Include other fields from the Parent model as needed
  national_ID: string;
  profession?: string;
  address?: string;
}

// Detailed information for a single child's dashboard
// These types are based on the structure returned by the /children/dashboard route

interface StudentInfo {
  _id: string;
  full_name: string;
  username: string;
  email: string;
  phone_number: string;
  sex: "MALE" | "FEMALE";
  birthDate: string;
  // ... other student fields
}

interface TeacherInfo {
  _id: string;
  full_name: string;
  email: string;
  phone_number: string;
}

interface GroupInfo {
  _id: string;
  id: string;
  groupName: string;
  level: number;
  speciality: {
    id: string;
    name: string;
    abbreviation: string;
  };
  teachers: {
    teacherId: TeacherInfo;
    moduleId: string;
  }[];
}

interface ScheduleEntry {
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
  moduleId: string;
  roomName: string;
}

interface ScheduleInfo {
  _id: string;
  groupId: string;
  season: string;
  entries: ScheduleEntry[];
}

interface MarkModuleInfo {
  value: number;
  coefficient: number;
  dev1: number;
  dev2: number;
  exam: number;
  constant_observation: number;
}

interface MarkTrimester {
  trimester: number;
  modules: Record<string, MarkModuleInfo>;
}

interface MarksInfo {
  studentId: string;
  trimesters: MarkTrimester[];
}

interface AttendanceDetails {
  date: string;
  moduleId: string;
  status: "absent" | "late";
  showingUpTime?: string;
  remark?: string;
}

interface AttendanceSummary {
  absences: number;
  lates: number;
  details: AttendanceDetails[];
}

export interface ChildDashboard {
  student: StudentInfo;
  group: GroupInfo | null;
  schedule: ScheduleInfo | null;
  marks: MarksInfo | null;
  attendance: AttendanceSummary;
}

// ===================================================================
// Service Functions
// ===================================================================

const API_BASE_URL = "/parent";

const getAuthHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/**
 * Fetches the profile of the currently authenticated parent.
 */
export const getParentProfile = async (
  token: string
): Promise<ParentProfile> => {
  try {
    const res = await api.get(`${API_BASE_URL}/`, getAuthHeaders(token));
    return res.data as ParentProfile;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to fetch parent profile"
      );
    }
    throw new Error(
      "A network error occurred while fetching the parent profile."
    );
  }
};

/**
 * Fetches the complete dashboard data for each of the parent's children.
 */
export const getChildrenDashboard = async (
  token: string
): Promise<ChildDashboard[]> => {
  try {
    const res = await api.get(
      `${API_BASE_URL}/children/dashboard`,
      getAuthHeaders(token)
    );
    return res.data as ChildDashboard[];
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error ||
          "Failed to fetch children's dashboard data"
      );
    }
    throw new Error("A network error occurred while fetching dashboard data.");
  }
};
