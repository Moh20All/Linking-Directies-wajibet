import api from "@/lib/api";
import { PedagogyAccessResponse } from "./staffPedagogyService"; // Reusing the same response type

const apiExtension = "/staff/assets";

export const checkAssetsAccess = async (
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
    console.error("Failed to check assets access", error);
    throw new Error("Network or server error while verifying assets access");
  }
};

export const revokeAssetsAccess = async (
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
    console.error("Failed to revoke assets access", error);
    if (error.response) {
      throw new Error(
        error.response.data?.error || "Failed to revoke assets access"
      );
    }
    throw new Error("Network error while revoking assets access");
  }
};
