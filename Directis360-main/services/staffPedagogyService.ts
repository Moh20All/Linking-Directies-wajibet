import api from "@/lib/api";
import { isAxiosError } from "axios";
export interface PedagogyAccessResponse {
  granted: boolean;
  message?: string;
}

const apiExtension = "/staff/pedagogy";

export const checkPedagogyAccess = async (
  token: string
): Promise<PedagogyAccessResponse> => {
  try {
    const res = await api.get(`${apiExtension}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { granted: true, message: res.data?.message };
  } catch (error: any) {
    // If it's a 403 or 401 → just return granted: false
    if (
      error.response &&
      (error.response.status === 403 || error.response.status === 401)
    ) {
      return { granted: false };
    }

    console.error("Failed to check pedagogy access", error);
    // For actual network/server errors → still throw
    throw new Error("Network or server error while verifying pedagogy access");
  }
};

export const revokePedagogyAccess = async (
  token: string
): Promise<PedagogyAccessResponse> => {
  try {
    const res = await api.post(
      `${apiExtension}/revoke-access`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data as PedagogyAccessResponse;
  } catch (error: any) {
    console.error("Failed to revoke pedagogy access", error);

    if (error.response) {
      throw new Error(
        error.response.data?.error || "Failed to revoke pedagogy access"
      );
    }
    throw new Error("Network error while revoking pedagogy access");
  }
};

// This should be the same consistent interface used in your frontend components.
// Based on student.model.js and member.model.js
interface Student {
  _id: string;
  username: string;
  full_name: string;
  phone_number: string;
  email: string;
  fullUsername: string;
  role: "STUDENT";
  schoolId: string;
  parentAccountIds: {
    mother?: string;
    father?: string;
  };
  nationality: string;
  birthDate: Date;
  birthCity: string;
  sex: "MALE" | "FEMALE";
  registeredGroupId: string | null;
  registered: boolean;
  groupHistory: Array<{
    groupId?: string;
    season?: string;
    reason?: string;
    date?: Date;
  }>;
  createdAt?: Date;
}

export interface GetStudentsResponse {
  count: number;
  students: Student[];
}
/**
 * Fetches the list of all students for the school.
 * @param token - The authentication token for the staff member.
 * @returns A promise that resolves to an object containing the student count and an array of students.
 */
export const getStudents = async (
  token: string
): Promise<GetStudentsResponse> => {
  try {
    const res = await api.get(`${apiExtension}/students`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as GetStudentsResponse;
  } catch (error) {
    console.error("API call to get students failed", error);

    if (isAxiosError(error) && error.response) {
      // Throw the specific error message from the backend if available
      throw new Error(
        error.response.data?.error || "Failed to fetch students from server"
      );
    }
    // Throw a generic error for network issues or other problems
    throw new Error("A network error occurred while fetching students");
  }
};

export interface NewStudentData {
  username: string;
  password?: string;
  full_name: string;
  phone_number: string;
  email: string;
  nationality: string;
  birthDate: string | Date;
  birthCity: string;
  sex: "MALE" | "FEMALE";
  registeredGroupId?: string | null;
}
export interface AddStudentResponse {
  message: string;
  student: Student;
}

/**
 * Creates a new student in the database.
 * @param token - The authentication token for the staff member.
 * @param studentData - The data for the new student.
 * @returns A promise that resolves to an object containing a success message and the newly created student.
 */
export const addStudent = async (
  token: string,
  studentData: NewStudentData
): Promise<AddStudentResponse> => {
  try {
    const res = await api.post(`${apiExtension}/student`, studentData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as AddStudentResponse;
  } catch (error) {
    console.error("API call to add student failed", error);

    if (isAxiosError(error) && error.response) {
      // Throw the specific error message from the backend (e.g., "User already exists...")
      throw new Error(
        error.response.data?.error || "Failed to create student on the server"
      );
    }
    // Throw a generic error for network issues or other problems
    throw new Error("A network error occurred while creating the student");
  }
};
/**
 * Deletes a student from the database.
 * NOTE: The backend endpoint for this function is not yet created.
 */
export const deleteStudent = async (
  token: string,
  studentId: string
): Promise<{ message: string }> => {
  try {
    // This will be the actual API call once the endpoint exists
    // const res = await api.delete(`${apiExtension}/student/${studentId}`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // return res.data;

    // Placeholder for now
    console.log(`Simulating delete for student ID: ${studentId}`);
    return Promise.resolve({
      message: "Student deleted successfully (simulation).",
    });
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to delete student on the server"
      );
    }
    throw new Error("A network error occurred while deleting the student");
  }
};

/**
 * Updates a student in the database.
 * NOTE: The backend endpoint for this function is not yet created.
 */
export const updateStudent = async (
  token: string,
  studentId: string,
  studentData: Partial<NewStudentData>
): Promise<{ message: string; student: Student }> => {
  try {
    // Placeholder for now
    console.log(`Simulating update for student ID: ${studentId}`, studentData);
    // In a real scenario, you'd return the updated student from the API
    const updatedStudent = { _id: studentId, ...studentData } as Student;
    return Promise.resolve({
      message: "Student updated successfully (simulation).",
      student: updatedStudent,
    });
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to update student."
      );
    }
    throw new Error("A network error occurred while updating the student.");
  }
};

interface Group {
  _id: string;
  id: string; // generated ID: grp<season>-<groupName>
  level: number; // 1 to 12
  speciality: {
    id: string;
    name: string;
    abbreviation: string;
  };
  classNumber: number;
  season: string; // e.g. "2425"
  groupName: string; // e.g. "3-MATH-A"
  schoolId: string;
  teachers: Array<{
    teacherId: string;
    moduleId: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GetGroupsResponse {
  count: number;
  groupes: Group[];
}

/**
 * Fetches all groups.
 * @param token - The authentication token for the staff member.
 * @returns A promise that resolves to an object containing the group count and an array of groups.
 */
export const getGroups = async (token: string): Promise<GetGroupsResponse> => {
  try {
    const res = await api.get("/staff/pedagogy/groupes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as GetGroupsResponse;
  } catch (error) {
    console.error("API call to get groups failed", error);

    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error || "Failed to fetch groups ");
    }
    throw new Error("A network error occurred while fetching groups");
  }
};

export interface NewGroupData {
  level: number;
  speciality: {
    id: string;
  };
  classNumber: number;
}

export interface AddGroupResponse {
  message: string;
  group: Group; // reuse the Group interface we created earlier
}

/**
 * Creates a new group in the database.
 * @param token - The authentication token for the staff member.
 * @param groupData - The data for the new group.
 * @returns A promise that resolves to an object containing a success message and the newly created group.
 */
export const createNewGroupe = async (
  token: string,
  groupData: NewGroupData
): Promise<AddGroupResponse> => {
  try {
    const res = await api.post(`${apiExtension}/groupe`, groupData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as AddGroupResponse;
  } catch (error) {
    console.error("API call to create new group failed", error);

    if (isAxiosError(error) && error.response) {
      // Handle specific backend errors
      throw new Error(
        error.response.data?.error || "Failed to create new group on the server"
      );
    }

    // Generic network/server error
    throw new Error("A network error occurred while creating the group");
  }
};

/**
 * Deletes a group from the database.
 * @param token - The authentication token for the staff member.
 * @param groupId - The ID of the group to delete.
 * @returns A promise that resolves to an object containing a success message.
 */
export const deleteGroupe = async (
  token: string,
  groupId: string
): Promise<{ message: string }> => {
  try {
    const res = await api.delete(`${apiExtension}/groupe/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as { message: string };
  } catch (error) {
    console.error("API call to delete group failed", error);

    if (isAxiosError(error) && error.response) {
      // Throw specific backend error if available
      throw new Error(
        error.response.data?.error || "Failed to delete group on the server"
      );
    }
    // Generic network/server error
    throw new Error("A network error occurred while deleting the group");
  }
};

interface TeacherModule {
  id: string;
  hoursPerWeek: number;
}

interface TeacherCurrentGroup {
  groupId: string;
  moduleId: string;
}

interface TeacherHistory {
  groupId: string;
  moduleId?: string;
  reason: "assigned" | "removed";
  timestamp: Date;
}

export interface Teacher {
  _id: string;
  username: string;
  full_name: string;
  email: string;
  phone_number?: string;
  national_ID: string;
  modules: TeacherModule[];
  currentGroups: TeacherCurrentGroup[];
  teachingHistory: TeacherHistory[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GetTeachersResponse {
  count: number;
  teachers: Teacher[];
}
/**
 * Fetches the list of all teachers for the school.
 * @param token - The authentication token for the staff member.
 * @returns A promise that resolves to an object containing the teacher count and an array of teachers.
 */
export const getTeachers = async (
  token: string
): Promise<GetTeachersResponse> => {
  try {
    const res = await api.get(`${apiExtension}/teachers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as GetTeachersResponse;
  } catch (error) {
    console.error("API call to get teachers failed", error);

    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to fetch teachers from server"
      );
    }
    throw new Error("A network error occurred while fetching teachers");
  }
};

export interface NewTeacherData {
  username: string;
  password: string;
  full_name: string;
  phone_number: string;
  national_ID: string;
  email: string;
  modules: Array<{
    id: string;
    hoursPerWeek: number;
  }>;
  currentGroups?: Array<{
    groupId: string;
    moduleId: string;
  }>;
}

export interface AddTeacherResponse {
  message: string;
  teacher: Teacher; // reuse the Teacher interface from above
}

export const addTeacher = async (
  token: string,
  teacherData: NewTeacherData
): Promise<AddTeacherResponse> => {
  try {
    const res = await api.post(`${apiExtension}/teacher`, teacherData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as AddTeacherResponse;
  } catch (error) {
    console.error("API call to add teacher failed", error);

    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to create teacher on the server"
      );
    }
    throw new Error("A network error occurred while creating the teacher");
  }
};

export const updateTeacher = async (
  token: string,
  teacherId: string,
  teacherData: Partial<NewTeacherData>
): Promise<AddTeacherResponse> => {
  try {
    const res = await api.put(
      `${apiExtension}/teacher/${teacherId}`,
      teacherData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data as AddTeacherResponse;
  } catch (error) {
    console.error("API call to update teacher failed", error);

    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to update teacher on the server"
      );
    }
    throw new Error("A network error occurred while updating the teacher");
  }
};

/**
 * Represents a Group object that also includes its list of students.
 */
export interface GroupWithStudents extends Group {
  students: Student[];
  studentCount: number;
}

/**
 * Defines the shape of the API response for group-student assignments.
 */
export interface GetGroupAssignmentsResponse {
  count: number;
  groups: GroupWithStudents[];
}

/**
 * Fetches all groups for the current season, along with the list of students assigned to each group.
 * @param token - The authentication token for the staff member.
 * @returns A promise that resolves to an object containing the count and an array of groups with their assigned students.
 */
export const getGroupStudentAssignments = async (
  token: string
): Promise<GetGroupAssignmentsResponse> => {
  try {
    const res = await api.get(`${apiExtension}/groupStudentAssignments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as GetGroupAssignmentsResponse;
  } catch (error) {
    console.error("API call to get group-student assignments failed", error);

    if (isAxiosError(error) && error.response) {
      // Throw the specific error message from the backend if available
      throw new Error(
        error.response.data?.error ||
          "Failed to fetch group assignments from server"
      );
    }
    // Throw a generic error for network issues or other problems
    throw new Error(
      "A network error occurred while fetching group assignments"
    );
  }
};

export interface BulkAssignResponse {
  message: string;
  successCount: number;
  failureCount: number;
  success: any[];
  failed: any[];
}

/**
 * Assigns a list of students to a single group in bulk.
 * This is for students who are not currently in any group.
 */
export const assignStudentsToGroupBulk = async (
  token: string,
  data: { groupId: string; studentIds: string[] }
): Promise<BulkAssignResponse> => {
  if (data.studentIds.length === 0) {
    return {
      message: "No students were selected for assignment.",
      successCount: 0,
      failureCount: 0,
      success: [],
      failed: [],
    };
  }
  try {
    const res = await api.post(
      `${apiExtension}/student/group/bulk`,
      { groupId: data.groupId, students: data.studentIds },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data as BulkAssignResponse;
  } catch (error) {
    console.error("API call to bulk assign students failed", error);
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error ||
          "Failed to bulk assign students on the server"
      );
    }
    throw new Error("A network error occurred while bulk assigning students");
  }
};

export interface ChangeGroupResponse {
  message: string;
  student: {
    studentID: string;
    full_name: string;
    registeredGroupId: string;
    groupHistory: any[];
  };
}

/**
 * Changes a student's assigned group. Used for transfers.
 * @param token The authentication token.
 * @param data An object containing the studentId and the newGroupId.
 * @returns A promise resolving to the API response.
 */
export const changeStudentGroup = async (
  token: string,
  data: { studentId: string; newGroupId: string }
): Promise<ChangeGroupResponse> => {
  try {
    const res = await api.put(`${apiExtension}/student/group/change`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as ChangeGroupResponse;
  } catch (error) {
    console.error("API call to change student group failed", error);
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error ||
          "Failed to change student group on the server"
      );
    }
    throw new Error(
      "A network error occurred while changing the student's group"
    );
  }
};

export const unassignStudentFromGroup = async (
  token: string,
  studentId: string
): Promise<{ message: string; student: Student }> => {
  try {
    const res = await api.put(
      `${apiExtension}/student/group/unassign`,
      { studentId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to unassign student"
      );
    }
    throw new Error("A network error occurred while unassigning student");
  }
};

export interface ScheduleEntry {
  _id?: string; // Mongoose adds this automatically
  day: string;
  startTime: string;
  endTime: string;
  moduleId: string;
  teacherId: string;
  roomName: string;
}

export interface GetScheduleResponse {
  groupId: string;
  season: string;
  entries: ScheduleEntry[];
}

// --- Service Functions ---

/**
 * Fetches the schedule for a specific group for the current season.
 * @param token - The authentication token.
 * @param groupId - The ID of the group whose schedule is to be fetched.
 * @returns The schedule for the group.
 */
export const getScheduleForGroup = async (
  token: string,
  groupId: string
): Promise<GetScheduleResponse> => {
  try {
    const res = await api.get(`${apiExtension}/schedule/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error || "Failed to fetch schedule");
    }
    throw new Error("A network error occurred while fetching the schedule");
  }
};

/**
 * Creates or updates the entire schedule for a group for the current season.
 * @param token - The authentication token.
 * @param groupId - The ID of the group to update.
 * @param entries - The full array of schedule entries for the week.
 * @returns A success message and the updated schedule.
 */
export const saveScheduleForGroup = async (
  token: string,
  groupId: string,
  entries: Omit<ScheduleEntry, "_id" | "id">[]
): Promise<{ message: string; schedule: GetScheduleResponse }> => {
  try {
    const res = await api.put(
      `${apiExtension}/schedule/${groupId}`,
      { entries },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error || "Failed to save schedule");
    }
    throw new Error("A network error occurred while saving the schedule");
  }
};

/**
 * Deletes/clears the entire schedule for a group for the current season.
 * @param token - The authentication token.
 * @param groupId - The ID of the group whose schedule will be cleared.
 * @returns A success message.
 */
export const clearScheduleForGroup = async (
  token: string,
  groupId: string
): Promise<{ message: string }> => {
  try {
    const res = await api.delete(`${apiExtension}/schedule/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error || "Failed to clear schedule");
    }
    throw new Error("A network error occurred while clearing the schedule");
  }
};

export interface PedagogyStats {
  totalStudents: number;
  totalTeachers: number;
  activeGroupsCount: number;
  newStudents: number;
  assignedTeachers: number;
  registeredStudentsCount: number;
  unassignedStudentsCount: number;
  levelDistribution: { level: string; count: number }[];
  topTeachers: { name: string; count: number }[];
}

/**
 * Fetches aggregated statistics for the pedagogy overview dashboard.
 * @param token - The authentication token for the staff member.
 */
export const getPedagogyStats = async (
  token: string
): Promise<PedagogyStats> => {
  try {
    const res = await api.get(`${apiExtension}/overview-stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as PedagogyStats;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to fetch pedagogy statistics"
      );
    }
    throw new Error("A network error occurred while fetching statistics");
  }
};

// --- New Parent Interfaces ---
export interface Parent {
  _id: string;
  full_name: string;
  email: string;
  phone_number: string;
  username: string;
  fullUsername: string;
  national_ID: string;
  relationship: "mother" | "father";
  children: { _id: string; full_name: string }[];
  createdAt: string;
}

export interface GetParentsResponse {
  count: number;
  parents: Parent[];
}

export interface CreateParentPayload {
  username: string;
  password?: string;
  full_name: string;
  phone_number: string;
  email: string;
  national_ID: string;
  relationship: "mother" | "father";
  profession?: string;
  address?: string;
}

export interface LinkParentPayload {
  parentId: string;
  studentId: string;
  relationship: "mother" | "father";
}

export const getParents = async (
  token: string
): Promise<GetParentsResponse> => {
  try {
    const res = await api.get(`/staff/pedagogy/parents`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as GetParentsResponse;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error || "Failed to fetch parents");
    }
    throw new Error("A network error occurred while fetching parents.");
  }
};

/**
 * Creates a new parent account.
 */
export const createParent = async (
  token: string,
  payload: CreateParentPayload
): Promise<Parent> => {
  try {
    const res = await api.post(`/staff/pedagogy/parent`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.parent as Parent;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error || "Failed to create parent");
    }
    throw new Error(
      "A network error occurred while creating the parent account."
    );
  }
};

/**
 * Links a parent to a student.
 */
export const linkParentToStudent = async (
  token: string,
  payload: LinkParentPayload
): Promise<{ message: string }> => {
  try {
    const res = await api.post(`/staff/pedagogy/parent/link-student`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error || "Failed to link accounts");
    }
    throw new Error("A network error occurred while linking the accounts.");
  }
};
