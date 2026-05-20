import api from "@/lib/api";
import { isAxiosError } from "axios";
import { Meeting } from "@/types/meeting";

// =============================================================
// Types
// =============================================================

export interface ChildInfo {
  _id: string;
  full_name: string;
  registeredGroupId: string;
}

export interface ParentInfo {
  _id: string;
  full_name: string;
  email: string;
  phone_number: string;
  children: ChildInfo[];
}

export interface TeacherMeetingsResponse {
  meetings: Meeting[];
  availableParents: ParentInfo[];
}

export interface TeacherChildInfo {
  child: ChildInfo;
  groupName: string;
  moduleId: string;
}

export interface TeacherInfo {
  _id: string;
  full_name: string;
  email: string;
  phone_number: string;
  children: TeacherChildInfo[]; // 👈 which children this teacher teaches
}

export interface ParentMeetingsResponse {
  meetings: Meeting[];
  availableTeachers: TeacherInfo[];
}

// =============================================================
// Helper
// =============================================================
const API_BASE_URL = "/meetings";

const getAuthHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// =============================================================
// Teacher Endpoints
// =============================================================
// Parent → Request a meeting with a teacher
export const requestMeetingParent = async (
  token: string,
  payload: {
    invitedId: string;
    cause: string;
    requestedDate: string;
    notes?: string;
  }
): Promise<Meeting> => {
  const res = await api.post(
    `${API_BASE_URL}/parent/request`,
    payload,
    getAuthHeaders(token)
  );
  return res.data;
};

// Parent → Get parent's meetings + available teachers (who teach their children)
export const getParentMeetings = async (
  token: string
): Promise<ParentMeetingsResponse> => {
  const res = await api.get(
    `${API_BASE_URL}/parent/my-meetings`,
    getAuthHeaders(token)
  );
  return res.data;
};

// Parent → Respond to meeting
export const respondMeetingParent = async (
  token: string,
  id: string,
  response: "accept" | "decline" | "reschedule"
): Promise<Meeting> => {
  const res = await api.patch(
    `${API_BASE_URL}/parent/respond/${id}`,
    { response },
    getAuthHeaders(token)
  );
  return res.data;
};
// =============================================================
// Parent Endpoints
// =============================================================

// Teacher → Request a meeting with a parent
export const requestMeeting = async (
  token: string,
  payload: {
    invitedId: string;
    cause: string;
    requestedDate: string;
    notes?: string; // 👈 added
  }
): Promise<Meeting> => {
  const res = await api.post(
    `${API_BASE_URL}/teacher/request`,
    payload,
    getAuthHeaders(token)
  );
  return res.data;
};

// Teacher → Get teacher's meetings + available parents
export const getTeacherMeetings = async (
  token: string
): Promise<TeacherMeetingsResponse> => {
  const res = await api.get(
    `${API_BASE_URL}/teacher/my-meetings`,
    getAuthHeaders(token)
  );
  return res.data;
};

// Teacher → Respond to meeting
export const respondMeeting = async (
  token: string,
  id: string,
  response: "accept" | "decline" | "reschedule"
): Promise<Meeting> => {
  const res = await api.patch(
    `${API_BASE_URL}/teacher/respond/${id}`,
    { response },
    getAuthHeaders(token)
  );
  return res.data;
};

// Parent → Reschedule meeting
export const rescheduleMeetingParent = async (
  token: string,
  id: string,
  payload: { newDate?: string; decline?: boolean }
): Promise<Meeting> => {
  const res = await api.patch(
    `${API_BASE_URL}/parent/reschedule/${id}`,
    payload,
    getAuthHeaders(token)
  );
  return res.data;
};

// Teacher → Reschedule meeting
export const rescheduleMeetingTeacher = async (
  token: string,
  id: string,
  payload: { newDate?: string; decline?: boolean }
): Promise<Meeting> => {
  const res = await api.patch(
    `${API_BASE_URL}/teacher/reschedule/${id}`,
    payload,
    getAuthHeaders(token)
  );
  return res.data;
};

// =============================================================
// Admin Endpoints
// =============================================================

// Admin → Get all meetings
export const getAllMeetingsAdmin = async (
  token: string
): Promise<Meeting[]> => {
  const res = await api.get(`${API_BASE_URL}/admin/all`, getAuthHeaders(token));
  return res.data;
};

// Admin → Confirm meeting
export const confirmMeetingAdmin = async (
  token: string,
  id: string
): Promise<Meeting> => {
  const res = await api.patch(
    `${API_BASE_URL}/admin/confirm/${id}`,
    {},
    getAuthHeaders(token)
  );
  return res.data;
};

// Admin → Decline meeting
export const declineMeetingAdmin = async (
  token: string,
  id: string
): Promise<Meeting> => {
  const res = await api.patch(
    `${API_BASE_URL}/admin/decline/${id}`,
    {},
    getAuthHeaders(token)
  );
  return res.data;
};

// Admin → Delete meeting
export const deleteMeetingAdmin = async (
  token: string,
  id: string
): Promise<{ success: boolean; message: string }> => {
  const res = await api.delete(
    `${API_BASE_URL}/admin/${id}`,
    getAuthHeaders(token)
  );
  return res.data;
};

// =============================================================
// Error Handling (optional helper)
// =============================================================
export const handleMeetingError = (error: unknown): never => {
  if (isAxiosError(error) && error.response) {
    throw new Error(error.response.data?.error || "Meeting request failed");
  }
  throw new Error("A network error occurred while processing the meeting.");
};
