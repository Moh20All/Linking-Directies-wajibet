import api from "@/lib/api";

// ===================================================================
// Type Definitions
// ===================================================================

// Generic response for access checks
export interface AccessResponse {
  granted: boolean;
  message?: string;
  valid?: boolean; // For password verification
  error?: string;
}

// =====================
// Financial Profiles
// =====================

export interface BaseProfile {
  _id: string;
  schoolId: string;
  role: "STUDENT" | "TEACHER" | "STAFF";
  transactions: Transaction[] | string[];
  createdAt: string;
  updatedAt: string;
  lastPayment?: { date: string; amount: number; transactionId: string };
}

// Student profile
export interface StudentProfile extends BaseProfile {
  role: "STUDENT";
  studentId: { _id: string; full_name: string; email: string };
}

// Teacher profile
export interface TeacherProfile extends BaseProfile {
  role: "TEACHER";
  teacherId: { _id: string; full_name: string; email: string };
  salary?: number;
}

// Employee profile
export interface EmployeeProfile extends BaseProfile {
  role: "STAFF";
  name?: string;
  position?: string;
  salary?: number;
}

export type FinancialProfile =
  | StudentProfile
  | TeacherProfile
  | EmployeeProfile;

// =====================
// Transactions
// =====================

export interface Transaction {
  _id: string;
  schoolId: string;
  paymentProfileId: string | FinancialProfile;
  amount: number;
  type: "outflow" | "inflow" | "student_fees" | "salary";
  description?: string;
  paymentMethod: "cash" | "bank_transfer" | "credit_card" | "other";
  reference?: string;
  createdAt: string;
  updatedAt: string;

  // Discriminator fields (student payment)
  studentId?: string;
  nextPaymentDate?: string;
  paymentPlan?: "MONTHLY" | "QUARTERLY" | "YEARLY";
}

// =====================
// Payloads
// =====================

export interface CreateProfilePayload {
  memberId?: string; // Required for Student/Teacher
  role: "STUDENT" | "TEACHER" | "STAFF";
  profileData: Record<string, any>;
}

export interface CreateTransactionPayload {
  paymentProfileId?: string;
  amount: number;
  type: "outflow" | "inflow" | "salary";
  description?: string;
  paymentMethod?: "cash" | "bank_transfer" | "credit_card" | "other";
  reference?: string;
}

export interface CreateStudentPaymentPayload {
  studentId: string;
  amount: number;
  paymentPlan: "MONTHLY" | "QUARTERLY" | "YEARLY";
  description?: string;
  paymentMethod?: "cash" | "bank_transfer" | "credit_card" | "other";
}

// =====================
// Helpers
// =====================

export interface MemberStub {
  _id: string;
  full_name: string;
  email: string;
  role: "STUDENT" | "TEACHER";
}

export interface BulkCreateProfilePayload {
  memberId: string;
  role: "STUDENT" | "TEACHER";
}

export interface MissingProfilesResponse {
  students: MemberStub[];
  teachers: MemberStub[];
}

const apiExtension = "/staff/finance";
const getAuthHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// ===================================================================
// Authentication
// ===================================================================

export const checkFinanceAccess = async (
  token: string
): Promise<AccessResponse> => {
  try {
    const res = await api.get(apiExtension, getAuthHeaders(token));
    return { granted: true, message: res.data?.message };
  } catch (error: any) {
    if (
      error.response &&
      (error.response.status === 403 || error.response.status === 401)
    ) {
      return { granted: false };
    }
    console.error("Failed to check finance access", error);
    throw new Error("Network/server error verifying finance access");
  }
};

export const verifyFinancePassword = async (
  token: string,
  password: string
): Promise<AccessResponse> => {
  try {
    const res = await api.post(
      `${apiExtension}/verify-password`,
      { password },
      getAuthHeaders(token)
    );
    return res.data;
  } catch (error: any) {
    console.error("Failed to verify finance password", error);
    if (error.response) {
      return {
        granted: false,
        valid: false,
        error: error.response.data?.error || "Invalid credentials",
      };
    }
    throw new Error("Network error verifying password");
  }
};

export const revokeFinanceAccess = async (
  token: string
): Promise<AccessResponse> => {
  try {
    const res = await api.post(
      `${apiExtension}/revoke-access`,
      {},
      getAuthHeaders(token)
    );
    return res.data;
  } catch (error: any) {
    console.error("Failed to revoke finance access", error);
    if (error.response) {
      throw new Error(
        error.response.data?.error || "Failed to revoke finance access"
      );
    }
    throw new Error("Network error revoking finance access");
  }
};

// ===================================================================
// Profiles Service
// ===================================================================

export const getMembersWithoutProfile = async (
  token: string
): Promise<MissingProfilesResponse> => {
  const res = await api.get(
    `${apiExtension}/profiles/missing`,
    getAuthHeaders(token)
  );
  return res.data;
};

export const createFinancialProfile = async (
  token: string,
  payload: CreateProfilePayload
): Promise<FinancialProfile> => {
  const res = await api.post(
    `${apiExtension}/profiles`,
    payload,
    getAuthHeaders(token)
  );
  return res.data.profile;
};

export const createFinancialProfilesBulk = async (
  token: string,
  profiles: BulkCreateProfilePayload[]
): Promise<any> => {
  const res = await api.post(
    `${apiExtension}/profiles/bulk`,
    { profiles },
    getAuthHeaders(token)
  );
  return res.data;
};

export const getFinancialProfiles = async (
  token: string,
  role?: "STUDENT" | "TEACHER" | "STAFF"
): Promise<FinancialProfile[]> => {
  const params = role ? { role } : {};
  const res = await api.get(`${apiExtension}/profiles`, {
    ...getAuthHeaders(token),
    params,
  });
  return res.data;
};

export const getFinancialProfileById = async (
  token: string,
  profileId: string
): Promise<FinancialProfile> => {
  const res = await api.get(
    `${apiExtension}/profiles/${profileId}`,
    getAuthHeaders(token)
  );
  return res.data;
};

export const updateFinancialProfile = async (
  token: string,
  profileId: string,
  updates: Partial<FinancialProfile>
): Promise<FinancialProfile> => {
  const res = await api.put(
    `${apiExtension}/profiles/${profileId}`,
    updates,
    getAuthHeaders(token)
  );
  return res.data.profile;
};

export const deleteFinancialProfile = async (
  token: string,
  profileId: string
): Promise<{ message: string }> => {
  const res = await api.delete(
    `${apiExtension}/profiles/${profileId}`,
    getAuthHeaders(token)
  );
  return res.data;
};

// ===================================================================
// Transactions Service
// ===================================================================

export const createTransaction = async (
  token: string,
  payload: CreateTransactionPayload
): Promise<Transaction> => {
  const res = await api.post(
    `${apiExtension}/transactions`,
    payload,
    getAuthHeaders(token)
  );
  return res.data.transaction;
};

export const createStudentPayment = async (
  token: string,
  payload: CreateStudentPaymentPayload
): Promise<Transaction> => {
  const res = await api.post(
    `${apiExtension}/transactions/student-payment`,
    payload,
    getAuthHeaders(token)
  );
  return res.data.payment;
};

export const getTransactions = async (
  token: string,
  type?: string
): Promise<Transaction[]> => {
  const params = type ? { type } : {};
  const res = await api.get(`${apiExtension}/transactions`, {
    ...getAuthHeaders(token),
    params,
  });
  return res.data;
};

export const deleteTransaction = async (
  token: string,
  transactionId: string
): Promise<{ message: string }> => {
  const res = await api.delete(
    `${apiExtension}/transactions/${transactionId}`,
    getAuthHeaders(token)
  );
  return res.data;
};

// =====================
// Dashboard
// =====================

export interface DashboardOverallStats {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  incomeByType: Record<string, number>;
  expensesByType: Record<string, number>;
  profileCounts: {
    students: number;
    teachers: number;
    employees: number;
  };
}

export interface MonthlyData {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  net: number;
  transactionCount: number;
  incomeByType: Record<string, number>;
  expensesByType: Record<string, number>;
}

export interface DashboardStatsResponse {
  overall: DashboardOverallStats;
  monthlyData: MonthlyData[];
  latestTransactions: Transaction[];
  message?: string; // For the "no data" case
}
// ===================================================================
// Dashboard Service
// ===================================================================

export const getDashboardStats = async (
  token: string
): Promise<DashboardStatsResponse> => {
  const res = await api.get(
    `${apiExtension}/dashboard-stats`,
    getAuthHeaders(token)
  );
  return res.data;
};
