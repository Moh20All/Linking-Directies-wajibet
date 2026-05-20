import api from "@/lib/api";

export type SchoolType = "primaire" | "cem" | "lycee";

export interface LoginResult {
  accessToken: string;
  role: string;
  schoolType: SchoolType;
  subscriptionStatus?: boolean;
}

export interface UserProfile {
  school: any; // Consider creating a more specific type for the school object
  role: string;
  schoolType: SchoolType;
  accessTokenExpiresIn: number;
  user: {
    fullName?: string;
    phoneNumber?: string;
  };
}

/**
 * Logs in a user and returns the access token, role, and school type.
 */
export const login = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  const res = await api.post("/v1/auth/login", { email, password });
  return {
    accessToken: res.data.accessToken,
    role: res.data.role,
    schoolType: res.data.schoolType,
  };
};

/**
 * Logs out the current user by clearing server-side cookies.
 */
export const logout = async (): Promise<void> => {
  await api.post("/v1/auth/logout");
};

/**
 * Refreshes the session using the stored refresh token.
 * Returns new login data or null if the session is invalid.
 */
export const handshake = async (): Promise<LoginResult | null> => {
  try {
    const res = await api.post("/v1/auth/handshake");
    return {
      accessToken: res.data.accessToken,
      role: res.data.role,
      schoolType: res.data.schoolType,
    };
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      // Refresh token is invalid or expired
      return null;
    }
    // Any other error should still be thrown
    throw err;
  }
};

/**
 * Fetches the profile information for the currently authenticated user.
 */
export const getProfile = async (): Promise<UserProfile> => {
  const res = await api.get("/v1/auth/me");
  return {
    school: res.data.school,
    role: res.data.role,
    schoolType: res.data.schoolType,
    accessTokenExpiresIn: res.data.accessTokenExpiresIn,
    user: {
      fullName: res.data.full_name,
      phoneNumber: res.data.phone_number,
    },
  };
};
