import api from "@/lib/api";
import { isAxiosError } from "axios";

// ===================================================================
// Type Definitions
// ===================================================================

// ✅ Teacher profile (as returned from /teacher/)
export interface TeacherProfile {
  _id: string;
  full_name: string;
  username: string;
  email: string;
  phone_number: string;
  modules: {
    _id: string;
    name: string;
    coefficient: number;
  }[];
  qualification?: string;
  experience?: string;
  schoolId: string;
  season: string;
  currentGroups: {
    groupId: string;
    groupName: string;
  }[];
}

// ✅ Marks structure (aligned with Mark schema)
export interface StudentMark {
  studentId: string;
  full_name: string;
  marks: {
    [moduleId: string]: {
      [trimester: string]: {
        coefficient: number;
        dev1?: number;
        dev2?: number;
        exam?: number;
        constant_observation?: number;
        value?: number;
      };
    };
  };
}

// ✅ Groups with student marks
export interface GroupWithMarks {
  _id: string; // group ObjectId
  name: string;
  level: string;
  students: StudentMark[];
  teachingModuleIds: string[];
}

// ✅ Schedule entry (backend returns array of entries per group)
export interface ScheduleEntry {
  _id: string;
  day: string; // "Monday", "Tuesday"...
  startTime: string; // e.g. "08:00"
  endTime: string; // e.g. "10:00"
  moduleId: string;
  moduleName: string;
  teacherId: string;
  roomName: string;
  groupId: string;
  groupName: string;
}

export interface WeeklySchedule {
  [day: string]: ScheduleEntry[];
}

// ✅ Attendance payloads
export interface AbsenteePayload {
  studentId: string;
  status: "absent" | "late";
  showingUpTime?: string | null;
  remark?: string | null;
  sessionId?: string | null;
}

export interface MarkAttendancePayload {
  groupId: string;
  moduleId: string;
  date: string; // ISO string (normalized by backend)
  absentees: AbsenteePayload[];
}

// ===================================================================
// Service Functions
// ===================================================================

const API_BASE_URL = "/teacher";

const getAuthHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/**
 * Fetches the profile of the currently authenticated teacher.
 */
export const getTeacherProfile = async (
  token: string
): Promise<TeacherProfile> => {
  try {
    const res = await api.get(`${API_BASE_URL}/`, getAuthHeaders(token));
    return res.data.teacher as TeacherProfile;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to fetch teacher profile"
      );
    }
    throw new Error(
      "A network error occurred while fetching the teacher profile."
    );
  }
};

/**
 * Fetches all groups assigned to the teacher, populated with student marks.
 */
export const getMyGroupsWithMarks = async (
  token: string
): Promise<GroupWithMarks[]> => {
  try {
    const res = await api.get(
      `${API_BASE_URL}/my-groups-with-marks`,
      getAuthHeaders(token)
    );
    return res.data as GroupWithMarks[];
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to fetch teacher's groups"
      );
    }
    throw new Error("A network error occurred while fetching groups.");
  }
};

/**
 * Fetches the weekly schedule for the authenticated teacher.
 */
export const getTeacherSchedule = async (
  token: string
): Promise<WeeklySchedule> => {
  try {
    const res = await api.get(
      `${API_BASE_URL}/schedule`,
      getAuthHeaders(token)
    );

    const weeklySchedule: WeeklySchedule = {
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
    };

    if (Array.isArray(res.data)) {
      res.data.forEach((scheduleDoc: any) => {
        scheduleDoc.entries.forEach((entry: any) => {
          const normalized: ScheduleEntry = {
            _id: entry._id,
            day: entry.day,
            startTime: entry.startTime,
            endTime: entry.endTime,
            moduleId: entry.module?._id || entry.moduleId,
            moduleName: entry.module?.name || "Unknown Subject",
            teacherId: entry.teacherId,
            roomName: entry.roomName,
            groupId: scheduleDoc.groupId,
            groupName: scheduleDoc.groupName || scheduleDoc.groupId,
          };

          if (weeklySchedule[entry.day]) {
            weeklySchedule[entry.day].push(normalized);
          }
        });
      });
    }
    return weeklySchedule;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error || "Failed to fetch schedule");
    }
    throw new Error("A network error occurred while fetching the schedule.");
  }
};

/**
 * Submits attendance data for a specific group, module, and date.
 */
export const markAttendance = async (
  token: string,
  payload: MarkAttendancePayload
): Promise<{ message: string }> => {
  try {
    const res = await api.post(
      `${API_BASE_URL}/attendance/mark`,
      payload,
      getAuthHeaders(token)
    );
    return res.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to mark attendance"
      );
    }
    throw new Error("A network error occurred while marking attendance.");
  }
};

// ✅ Attendance report response
export interface AttendanceReportStudent {
  studentId: string;
  full_name: string;
  present: number;
  absent: number;
  late: number;
}

export interface AttendanceReport {
  groupId: string;
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  totalSessions: number;
  students: AttendanceReportStudent[];
}

/**
 * Fetches attendance report for a group (with optional date range).
 * @param token - The authentication token.
 * @param groupId - The group ID to fetch attendance for.
 * @param from - Optional start date (YYYY-MM-DD).
 * @param to - Optional end date (YYYY-MM-DD).
 */
export const getAttendanceReport = async (
  token: string,
  groupId: string,
  from?: string,
  to?: string
): Promise<AttendanceReport> => {
  try {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    const res = await api.get(`${API_BASE_URL}/attendance-report/${groupId}`, {
      ...getAuthHeaders(token),
      params,
    });

    return res.data as AttendanceReport;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to fetch attendance report"
      );
    }
    throw new Error(
      "A network error occurred while fetching attendance report."
    );
  }
};

/**
 * Updates a student's mark for a specific module, trimester, and group.
 */
export const updateStudentMark = async (
  token: string,
  payload: {
    groupId: string;
    moduleId: string;
    trimester: string; // "1", "2", or "3"
    studentId: string;
    updates: {
      dev1?: number;
      dev2?: number;
      exam?: number;
      constant_observation?: number;
    };
  }
): Promise<{
  message: string;
  studentId: string;
  moduleId: string;
  trimester: string;
  updated: {
    dev1: number;
    dev2: number;
    exam: number;
    constant_observation: number;
    value: number; // recalculated
  };
}> => {
  try {
    const res = await api.put(
      "/teacher/marks/update",
      payload,
      getAuthHeaders(token)
    );
    return res.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to update student mark"
      );
    }
    throw new Error("A network error occurred while updating student mark.");
  }
};

// ===================================================================
// Community Types
// ===================================================================

export interface CommunityFile {
  filename: string;
  path: string;
  mimetype: string;
}

export interface CommunityReply {
  _id: string;
  student?: { _id: string; full_name: string; email: string };
  teacher?: { _id: string; full_name: string; email: string };
  content: string;
  files: CommunityFile[];
  createdAt: string;
}

export interface CommunityGroup {
  _id: string;
  id: string;
  groupName: string;
}

export interface CommunityPost {
  _id: string;
  title: string;
  content: string;
  teacher?: { _id: string; full_name: string; email: string };
  school: string;
  groups: CommunityGroup[];
  files: CommunityFile[];
  replies: CommunityReply[];
  createdAt: string;
  updatedAt: string;
}

// ===================================================================
// Community API Functions
// ===================================================================

/**
 * Fetch all community posts for the authenticated teacher.
 */
export const getCommunityPosts = async (
  token: string
): Promise<CommunityPost[]> => {
  try {
    const res = await api.get(`/community/posts`, getAuthHeaders(token));
    return res.data as CommunityPost[];
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to fetch community posts"
      );
    }
    throw new Error("A network error occurred while fetching posts.");
  }
};
/**
 * Fetch all community posts for the authenticated teacher.
 */
export const getCommunityPostsStudents = async (
  token: string
): Promise<CommunityPost[]> => {
  try {
    const res = await api.get(
      `/community/posts/student`,
      getAuthHeaders(token)
    );
    return res.data as CommunityPost[];
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to fetch community posts"
      );
    }
    throw new Error("A network error occurred while fetching posts.");
  }
};

/**
 * Create a new community post (title + content + optional groups/files).
 */
// export const createCommunityPost = async (
//   token: string,
//   payload: {
//     title: string;
//     content: string;
//     groups?: string[]; // group IDs
//     files?: File[]; // file uploads
//   }
// ): Promise<CommunityPost> => {
//   try {
//     const formData = new FormData();
//     formData.append("title", payload.title);
//     formData.append("content", payload.content);
//     if (payload.groups) {
//       payload.groups.forEach((g) => formData.append("groups", g));
//     }
//     if (payload.files) {
//       payload.files.forEach((file) => formData.append("files", file));
//     }

//     const res = await api.post(`/community/posts`, formData, {
//       ...getAuthHeaders(token),
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     return res.data.post as CommunityPost;
//   } catch (error) {
//     if (isAxiosError(error) && error.response) {
//       throw new Error(
//         error.response.data?.error || "Failed to create community post"
//       );
//     }
//     throw new Error("A network error occurred while creating the post.");
//   }
// };

/**
 * Add a reply to a community post.
 */
export const addReplyToPost = async (
  token: string,
  postId: string,
  payload: { content: string; files?: File[] }
): Promise<CommunityPost> => {
  try {
    const formData = new FormData();
    formData.append("content", payload.content);
    if (payload.files) {
      payload.files.forEach((file) => formData.append("files", file));
    }

    const res = await api.post(`/community/posts/${postId}/reply`, formData, {
      ...getAuthHeaders(token),
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.post as CommunityPost;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error || "Failed to add reply");
    }
    throw new Error("A network error occurred while adding reply.");
  }
};

export const addReplyToPostStudent = async (
  token: string,
  postId: string,
  payload: { content: string; files?: File[] }
) => {
  try {
    let tempFiles: { filename: string; tempPath: string; mimetype: string }[] =
      [];

    // 1️⃣ Upload files to temp folder first
    if (payload.files?.length) {
      const uploadForm = new FormData();
      payload.files.forEach((file) => uploadForm.append("files", file));

      const uploadRes = await api.post("/community/uploads/temp", uploadForm, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      tempFiles = uploadRes.data.files; // get temp paths
    }

    // 2️⃣ Create the reply using temp file paths
    const replyPayload: any = { content: payload.content };
    if (tempFiles.length > 0) {
      replyPayload.tempFiles = tempFiles;
    }

    const res = await api.post(
      `/community/posts/${postId}/studentreply`,
      replyPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.post;
  } catch (err: any) {
    console.error("❌ addReplyToPostStudent Error:", err.response || err);
    throw err;
  }
};

export const createCommunityPost = async (
  token: string,
  payload: { title: string; content: string; groups?: string[]; files?: File[] }
) => {
  try {
    let tempFiles: { filename: string; tempPath: string; mimetype: string }[] =
      [];

    // 1️⃣ Upload files to temp first
    if (payload.files?.length) {
      const uploadForm = new FormData();
      payload.files.forEach((file) => uploadForm.append("files", file));

      const uploadRes = await api.post("/community/uploads/temp", uploadForm, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      tempFiles = uploadRes.data.files; // get temp paths
    }

    // 2️⃣ Create post using temp file paths
    const postPayload: any = {
      title: payload.title,
      content: payload.content,
    };

    if (payload.groups && payload.groups.length > 0) {
      postPayload.groups = payload.groups;
    }

    if (tempFiles.length > 0) {
      postPayload.tempFiles = tempFiles;
    }

    const res = await api.post("/community/posts", postPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (err: any) {
    console.error("❌ createCommunityPost Error:", err.response || err);
    throw err;
  }
};

export const addCommunityReply = async (
  token: string,
  postId: string,
  content: string,
  file?: File
) => {
  const formData = new FormData();
  formData.append("content", content);
  if (file) {
    formData.append("file", file);
  }

  const res = await api.post(`/community/posts/${postId}/reply`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const addCommunityReplyStudent = async (
  token: string,
  postId: string,
  content: string,
  file?: File
) => {
  try {
    var tempFilePath: string | null = null;

    // 1️⃣ Upload file to temp if provided
    if (file) {
      const tempForm = new FormData();
      tempForm.append("file", file);

      const uploadRes = await api.post(
        "/community/uploads/temp/student",
        tempForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // The backend should return the temp path
      tempFilePath = uploadRes.data.file?.tempPath;
      console.log("tempFiles : ", uploadRes.data.file?.tempPath);
    }

    // 2️⃣ Send the reply with temp file path
    const payload: any = { content };
    if (tempFilePath && file)
      payload.tempFile = {
        tempPath: tempFilePath,
        filename: file.name,
        mimetype: file.type,
      };
    console.log("replyPayload: ", payload);

    const res = await api.post(
      `/community/posts/${postId}/studentreply`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.post;
  } catch (err: any) {
    console.error("❌ addCommunityReplyStudent Error:", err.response || err);
    throw new Error(err.response?.data?.error || "Failed to add reply");
  }
};

export const updateCommunityPost = async (
  token: string,
  postId: string,
  payload: { title: string; content: string }
) => {
  const res = await api.put(`/community/posts/${postId}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const downloadFile = async (filePath: string) => {
  const res = await api.post(
    "/community/files/public-download",
    { filePath },
    {
      responseType: "blob", // important to handle file content
    }
  );

  const blob = new Blob([res.data]);
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filePath.split("\\").pop() || "file";
  document.body.appendChild(link);
  link.click();
  link.remove();
};
