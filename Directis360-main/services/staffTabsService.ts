import api from "@/lib/api";

export interface TabsStatus {
  pedagogy: boolean;
  finance: boolean;
  attendance: boolean;
  assets: boolean;
}

// Get password protection status for each tab
export const getTabsStatus = async (token: string): Promise<TabsStatus> => {
  try {
    const res = await api.get("/v1/auth/tabs/status", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as TabsStatus;
  } catch (err: any) {
    console.error(
      "Failed to fetch tab status:",
      err?.response?.data || err.message
    );

    // Return all false so UI won't break if server fails
    return {
      pedagogy: false,
      finance: false,
      attendance: false,
      assets: false,
    };
  }
};

// Verify password for a specific tab
export const verifyTabPassword = async (
  token: string,
  tab: string,
  password: string
): Promise<{ valid: boolean; error?: string }> => {
  try {
    const res = await api.post(
      `/staff/${tab}/verify-password`,
      { password },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { valid: res.data.valid === true };
  } catch (err: any) {
    console.error(
      `Failed to verify password for tab "${tab}":`,
      err?.response?.data || err.message
    );

    // Provide clear error message to the UI
    let message = "Something went wrong while verifying the password.";
    if (err?.response?.status === 401) {
      message = "Invalid or expired token.";
    } else if (err?.response?.status === 400) {
      message = err?.response?.data?.error || "Incorrect password.";
    } else if (err?.response?.status === 404) {
      message = "Tab not found.";
    }

    return { valid: false, error: message };
  }
};
