import api from "@/lib/api";
import { isAxiosError } from "axios";

// ===================================================================
// Type Definitions
// ===================================================================

/**
 * @interface StaffMemberPayload
 * @description Payload for creating a new staff member.
 */
export interface StaffMemberPayload {
  username: string;
  password?: string; // Optional on update
  full_name: string;
  phone_number: string;
  email: string;
}

/**
 * @interface StaffMember
 * @description Represents a staff member object returned from the API.
 */
export interface StaffMember extends Omit<StaffMemberPayload, "password"> {
  _id: string;
  fullUsername: string;
  role: "STAFF";
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * @interface TabPasswordsPayload
 * @description Payload for setting the passwords for different staff tabs.
 */
export interface TabPasswordsPayload {
  pedagogy?: string;
  finance?: string;
  attendance?: string;
  assets?: string;
}

/**
 * @interface AcademicPerformance
 * @description Academic performance metrics for a specific level/speciality.
 */
export interface AcademicPerformance {
  level: number;
  speciality: string;
  averageGrade: number;
  studentCount: number;
}

/**
 * @interface DashboardOverview
 * @description The main data structure for the headmaster's dashboard overview.
 */
export interface DashboardOverview {
  pedagogy: {
    studentCount: number;
    teacherCount: number;
    activeGroupCount: number;
    unassignedStudentCount: number;
  };
  finance: {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
  };
  academics: {
    level: number;
    speciality: string;
    studentCount: number;
    averageGrade: number;
  }[];
  attendance: {
    workerPercentage: number;
    workerBreakdown: Record<string, number>;
    studentAbsences: {
      absent?: number;
      late?: number;
    };
    studentAttendanceByGroup: {
      groupName: string;
      totalAbsences: number;
    }[];
  };
  topTeachers: {
    _id: string;
    full_name: string;
    groupCount: number;
  }[];
}

export interface SchoolSettings {
  information: {
    name: string;
    location: {
      x: number;
      y: number;
    };
    type: "primaire" | "cem" | "lycee";
  };
  derivationKey: string;
}

export type SchoolSettingsPayload = Partial<{
  name: string;
  location: {
    x?: number;
    y?: number;
  };
}>;

// ===================================================================
// Service Functions
// ===================================================================

const API_BASE_URL = "/head";

const getAuthHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/**
 * Fetches the comprehensive dashboard overview data for the headmaster.
 */
export const getDashboardOverview = async (
  token: string
): Promise<DashboardOverview> => {
  try {
    const res = await api.get(
      `${API_BASE_URL}/dashboard-overview`,
      getAuthHeaders(token)
    );
    return res.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to fetch dashboard overview."
      );
    }
    throw new Error("A network error occurred while fetching dashboard data.");
  }
};

/**
 * Creates a new staff member.
 */
export const createStaffMember = async (
  token: string,
  payload: StaffMemberPayload
): Promise<StaffMember> => {
  try {
    const res = await api.post(
      `${API_BASE_URL}/member`,
      payload,
      getAuthHeaders(token)
    );
    return res.data.member as StaffMember;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to create staff member."
      );
    }
    throw new Error(
      "A network error occurred while creating the staff member."
    );
  }
};

/**
 * Fetches a list of all members in the school.
 */
export const getAllMembers = async (token: string): Promise<Member[]> => {
  try {
    const res = await api.get(`${API_BASE_URL}/members`, getAuthHeaders(token));
    return res.data as Member[];
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to fetch school members."
      );
    }
    throw new Error("A network error occurred while fetching members.");
  }
};

/**
 * Fetches all groups for the school.
 */
export const getAllGroups = async (token: string): Promise<any[]> => {
  try {
    const res = await api.get(`${API_BASE_URL}/groups`, getAuthHeaders(token));
    return res.data;
  } catch (error) {
     if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to fetch groups."
      );
    }
    throw new Error("A network error occurred while fetching groups.");
  }
};

export const updateStaffMember = async (
  token: string,
  memberId: string,
  payload: Partial<StaffMemberPayload>
): Promise<StaffMember> => {
  try {
    const res = await api.put(
      `${API_BASE_URL}/member/${memberId}`,
      payload,
      getAuthHeaders(token)
    );
    return res.data.member as StaffMember;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to update staff member."
      );
    }
    throw new Error(
      "A network error occurred while updating the staff member."
    );
  }
};

/**
 * Sets or updates the passwords for the various staff-accessible tabs.
 */
export const setTabPasswords = async (
  token: string,
  payload: TabPasswordsPayload
): Promise<{ message: string; updated: object }> => {
  try {
    const res = await api.post(
      `${API_BASE_URL}/school/tabspwds`,
      payload,
      getAuthHeaders(token)
    );
    return res.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to set tab passwords."
      );
    }
    throw new Error("A network error occurred while updating passwords.");
  }
};

// School Settings
export const getSchoolSettings = async (
  token: string
): Promise<SchoolSettings> => {
  const res = await api.get(
    `${API_BASE_URL}/school/settings`,
    getAuthHeaders(token)
  );
  return res.data;
};

export const updateSchoolSettings = async (
  token: string,
  payload: SchoolSettingsPayload
): Promise<SchoolSettings> => {
  const res = await api.put(
    `${API_BASE_URL}/school/settings`,
    payload,
    getAuthHeaders(token)
  );
  return res.data.school;
};
