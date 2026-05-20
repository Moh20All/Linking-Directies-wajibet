import api from "@/lib/api";
import { isAxiosError } from "axios";

export interface School {
  _id: string;
  information: {
    name: string;
    type: string;
    max_students: number;
    location: { x: number; y: number };
  };
  derivationKey: string;
  substatus: boolean;
  subscriptions: {
    status: string;
    plan?: {
      name: string;
      price: number;
      duration: string;
      startingDate?: string; // Add dates if available
      endingDate?: string;
      reason?: string;
    } | null;
    history: Array<{
      name: string;
      price: number;
      duration: string;
      startingDate?: string;
      endingDate?: string;
      reason?: string;
      status?: string;
    }>;
  };
  auth: {
    email: string;
  };
  createdAt: string;
}



const API_BASE_URL = "/admin";

const getAuthHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export interface SchoolFilters {
    name?: string;
    type?: string;
    email?: string;
    derivationKey?: string;
    substatus?: boolean;
    subscriptionStatus?: string;
    planName?: string;
    planDuration?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export const getSchools = async (token: string, filters?: SchoolFilters): Promise<School[]> => {
  try {
    const params = new URLSearchParams();
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, value.toString());
            }
        });
    }

    const res = await api.get(`${API_BASE_URL}/schools?${params.toString()}`, getAuthHeaders(token));
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
     if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error || "Failed to fetch schools.");
    }
    throw new Error("Network error fetching schools.");
  }
};

export const getSchoolById = async (token: string, id: string): Promise<School> => {
  try {
    const res = await api.get(`${API_BASE_URL}/schools/${id}`, getAuthHeaders(token));
    return res.data;
  } catch (error) {
     if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error || "Failed to fetch school details.");
    }
    throw new Error("Network error fetching school details.");
  }
};

export const updateSubscription = async (
  token: string,
  id: string,
  payload: { 
      action: "activate" | "deactivate" | "update_plan"; 
      reason?: string; 
      status?: "INACTIVE" | "HOLD" | "DELETION";
      plan?: { name: string; price: number; duration: "Monthly" | "Yearly"; startingDate?: string; endingDate?: string; } 
  }
): Promise<School> => {
  try {
    let apiPayload: any = {};

    if (payload.action === "activate") {
        apiPayload = {
            substatus: true,
            status: "ACTIVE",
            plan: payload.plan
        };
    } else if (payload.action === "deactivate") {
        apiPayload = {
            substatus: false,
            status: payload.status || "INACTIVE",
            reason: payload.reason
        };
    } else if (payload.action === "update_plan") {
        apiPayload = {
            plan: payload.plan
        };
    }

    const res = await api.patch(
      `${API_BASE_URL}/schools/${id}/subscription`,
      apiPayload,
      getAuthHeaders(token)
    );
    return res.data.school;
  } catch (error) {
     if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error || "Failed to update subscription.");
    }
    throw new Error("Network error updating subscription.");
  }
};
export const updateMaxStudents = async (token: string, id: string, max_students: number): Promise<School> => {
    try {
        const res = await api.patch(
            `${API_BASE_URL}/schools/${id}/max-students`,
            { max_students },
            getAuthHeaders(token)
        );
        return res.data.school;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.error || "Failed to update capacity.");
        }
        throw new Error("Network error updating capacity.");
    }
};

export interface CreateSchoolPayload {
  name: string;
  email: string;
  password?: string; // Optional in interface if we keep fallback, but user wants to add it. Let's make it optional but prioritized.
  schoolType?: "primaire" | "cem" | "lycee";
  derivationKey: string;
  initialSubscription?: {
    active: boolean;
    plan?: {
        name: string;
        price: number;
        duration: "Monthly" | "Yearly";
    };
  };
}

export const createSchool = async (token: string, payload: CreateSchoolPayload): Promise<School> => {
    try {
        const creationPayload = {
            information: {
                name: payload.name,
                type: payload.schoolType || "primaire",
                max_students: 200, // Default
                location: { x: 0, y: 0 } // Default
            },
            derivationKey: payload.derivationKey,
            auth: {
                email: payload.email,
                password: payload.password || "defaultPassword123" 
            },
            initialSubscription: payload.initialSubscription // Pass through to new backend logic
        };

        const res = await api.post(`${API_BASE_URL}/schools`, creationPayload, getAuthHeaders(token));
        
        return res.data.school;

    } catch (error: any) {
        if (isAxiosError(error) && error.response) {
            // Pass through specific error messages (e.g. "Derivation key already taken")
            throw new Error(error.response.data?.error || "Failed to create school.");
        }
        throw new Error("Network error creating school.");
    }
};
