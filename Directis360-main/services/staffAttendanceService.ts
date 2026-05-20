import api from "@/lib/api";
import { PedagogyAccessResponse } from "./staffPedagogyService"; // Reusing the same response type

const apiExtension = "/staff/attendance";

// --- 🔹 UPDATED TYPE DEFINITIONS ---

export interface AttendanceMember {
  _id: string;
  name: string;
  department: string;
  role: "TEACHER" | "EMPLOYEE" | "OTHER";
}

// This payload reflects the final schema, including denormalized/optional fields.
export interface AttendanceRecordPayload {
  memberId: string;
  memberName: string;
  status:
    | "Present"
    | "Absent"
    | "Late"
    | "Justified Absence"
    | "Holiday"
    | "Rest Day";
  attendanceTime?: string;
  remarks?: string;
}

export interface DailyAttendance {
  _id: string;
  date: string;
  records: AttendanceRecordPayload[];
  createdAt: string;
  updatedAt: string;
}

// --- EXISTING AUTH FUNCTIONS ---

export const checkAttendanceAccess = async (
  token: string
): Promise<PedagogyAccessResponse> => {
  try {
    const res = await api.get(apiExtension, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { granted: true, message: res.data?.message };
  } catch (error: any) {
    if (
      error.response &&
      (error.response.status === 403 || error.response.status === 401)
    ) {
      return { granted: false };
    }
    console.error("Failed to check attendance access", error);
    throw new Error(
      "Network or server error while verifying attendance access"
    );
  }
};

export const revokeAttendanceAccess = async (
  token: string
): Promise<PedagogyAccessResponse> => {
  try {
    const res = await api.post(
      `${apiExtension}/revoke-access`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error: any) {
    console.error("Failed to revoke attendance access", error);
    if (error.response) {
      throw new Error(
        error.response.data?.error || "Failed to revoke attendance access"
      );
    }
    throw new Error("Network error while revoking attendance access");
  }
};

// --- EXISTING ATTENDANCE MANAGEMENT FUNCTIONS ---

/**
 * Fetches the list of all non-student members to display on the attendance sheet.
 */
export const getMembersForAttendance = async (
  token: string
): Promise<AttendanceMember[]> => {
  try {
    const res = await api.get<{ members: AttendanceMember[] }>(
      `${apiExtension}/members`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data.members;
  } catch (error: any) {
    console.error("Failed to fetch members for attendance:", error);
    throw new Error(error.response?.data?.error || "A network error occurred.");
  }
};

/**
 * Fetches the saved attendance record for a specific date.
 * @param date - The date in YYYY-MM-DD format.
 */
export const getAttendanceForDate = async (
  token: string,
  date: string
): Promise<DailyAttendance | null> => {
  try {
    const res = await api.get<{ attendance: DailyAttendance }>(
      `${apiExtension}/${date}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data.attendance;
  } catch (error: any) {
    // A 404 is expected if no record exists, so we handle it gracefully.
    if (error.response && error.response.status === 404) {
      return null;
    }
    console.error(`Failed to fetch attendance for ${date}:`, error);
    throw new Error(error.response?.data?.error || "A network error occurred.");
  }
};

/**
 * Saves or updates the entire attendance sheet for a specific date.
 * @param date - The date in YYYY-MM-DD format.
 * @param records - The full array of attendance records for that day.
 */
export const saveAttendanceForDate = async (
  token: string,
  date: string,
  records: AttendanceRecordPayload[]
): Promise<{ message: string; attendance: DailyAttendance }> => {
  try {
    const res = await api.post(
      `${apiExtension}/${date}`,
      { records },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error: any) {
    console.error(`Failed to save attendance for ${date}:`, error);
    throw new Error(error.response?.data?.error || "A network error occurred.");
  }
};

// --- 🔹 NEW GRANULAR RECORD MANAGEMENT FUNCTIONS ---

/**
 * Adds a single new attendance record to an existing daily document.
 * @param date - The date in YYYY-MM-DD format.
 * @param record - The new record to add.
 */
export const addAttendanceRecord = async (
  token: string,
  date: string,
  record: AttendanceRecordPayload
): Promise<DailyAttendance> => {
  try {
    const res = await api.post<{ attendance: DailyAttendance }>(
      `${apiExtension}/${date}/records`,
      record,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data.attendance;
  } catch (error: any) {
    console.error(`Failed to add record for ${date}:`, error);
    throw new Error(error.response?.data?.error || "A network error occurred.");
  }
};

/**
 * Updates a single attendance record within a daily document.
 * @param date - The date in YYYY-MM-DD format.
 * @param memberId - The ID of the member whose record is being updated.
 * @param updateData - The fields to update (e.g., status, remarks).
 */
export const updateAttendanceRecord = async (
  token: string,
  date: string,
  memberId: string,
  updateData: Partial<Omit<AttendanceRecordPayload, "memberId" | "memberName">>
): Promise<DailyAttendance> => {
  try {
    const res = await api.patch<{ attendance: DailyAttendance }>(
      `${apiExtension}/${date}/records/${memberId}`,
      updateData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data.attendance;
  } catch (error: any) {
    console.error(`Failed to update record for ${memberId} on ${date}:`, error);
    throw new Error(error.response?.data?.error || "A network error occurred.");
  }
};

/**
 * Deletes a single attendance record from a daily document.
 * @param date - The date in YYYY-MM-DD format.
 * @param memberId - The ID of the member whose record is being deleted.
 */
export const deleteAttendanceRecord = async (
  token: string,
  date: string,
  memberId: string
): Promise<{ message: string }> => {
  try {
    const res = await api.delete(
      `${apiExtension}/${date}/records/${memberId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error: any) {
    console.error(`Failed to delete record for ${memberId} on ${date}:`, error);
    throw new Error(error.response?.data?.error || "A network error occurred.");
  }
};
