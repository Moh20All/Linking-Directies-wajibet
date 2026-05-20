import api from "@/lib/api";

export interface StaffProfile {
  full_name: string;
  role: string;
  phone_number: string;
  national_ID: string;
  school: {
    information: {
      name: string;
      type: string;
    };
  };
}

/**
 * Get staff profile using the provided access token.
 * Do not fetch token inside this service — pass it from useAuth().
 */
export const getCurrentStaffProfile = async (
  token: string
): Promise<StaffProfile> => {
  if (!token) {
    throw new Error("Access token is required");
  }

  const res = await api.get("/v1/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data as StaffProfile;
};
