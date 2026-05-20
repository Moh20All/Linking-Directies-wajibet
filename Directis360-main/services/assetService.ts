import api from "@/lib/api";
import { isAxiosError } from "axios";

const API_BASE_URL = "/staff/assets";

// ===================================================================
// Type Definitions
// ===================================================================

export interface Asset {
  _id: string;
  name: string;
  category: string;
  condition: "excellent" | "good" | "fair" | "poor" | "needs-repair";
  location: string;
  purchaseDate: string; // ISO String
  purchasePrice: number;
  currentValue: number;
  status: "active" | "inactive" | "maintenance" | "disposed";
  ownership: "school-owned" | "leased" | "donated" | "borrowed";
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  warranty?: string;
  notes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRecord {
  _id: string;
  assetId: string;
  assetName: string;
  type: "routine" | "repair" | "inspection";
  status: "scheduled" | "in-progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high" | "urgent";
  scheduledDate: string; // ISO String
  completedDate?: string; // ISO String
  cost?: number;
  description: string;
  technician?: string;
  notes?: string;
}

export type AssetPayload = Omit<Asset, "_id" | "createdAt" | "updatedAt">;
export type MaintenancePayload = Omit<MaintenanceRecord, "_id" | "assetName">;

export interface AssetOverviewStats {
  totalAssets: number;
  activeAssets: number;
  totalValue: number;
  depreciation: number;
  assetsNeedingMaintenance: number;
  conditionStats: Record<string, number>;
}

// ===================================================================
// Service Functions
// ===================================================================

const getAuthHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// --- Assets ---

export const getAssets = async (token: string): Promise<Asset[]> => {
  const res = await api.get(API_BASE_URL, getAuthHeaders(token));
  return res.data;
};

export const createAsset = async (
  token: string,
  payload: AssetPayload
): Promise<Asset> => {
  const res = await api.post(API_BASE_URL, payload, getAuthHeaders(token));
  return res.data;
};

export const updateAsset = async (
  token: string,
  id: string,
  payload: Partial<AssetPayload>
): Promise<Asset> => {
  const res = await api.put(
    `${API_BASE_URL}/${id}`,
    payload,
    getAuthHeaders(token)
  );
  return res.data;
};

export const deleteAsset = async (token: string, id: string): Promise<void> => {
  await api.delete(`${API_BASE_URL}/${id}`, getAuthHeaders(token));
};

// --- Maintenance ---

export const getMaintenanceRecords = async (
  token: string
): Promise<MaintenanceRecord[]> => {
  const res = await api.get(
    `${API_BASE_URL}/maintenance`,
    getAuthHeaders(token)
  );
  return res.data;
};

export const createMaintenanceRecord = async (
  token: string,
  payload: MaintenancePayload
): Promise<MaintenanceRecord> => {
  const res = await api.post(
    `${API_BASE_URL}/maintenance`,
    payload,
    getAuthHeaders(token)
  );
  return res.data;
};

export const updateMaintenanceRecord = async (
  token: string,
  id: string,
  payload: Partial<MaintenancePayload>
): Promise<MaintenanceRecord> => {
  const res = await api.put(
    `${API_BASE_URL}/maintenance/${id}`,
    payload,
    getAuthHeaders(token)
  );
  return res.data;
};

export const deleteMaintenanceRecord = async (
  token: string,
  id: string
): Promise<void> => {
  await api.delete(`${API_BASE_URL}/maintenance/${id}`, getAuthHeaders(token));
};

// --- Overview ---
export const getAssetsOverview = async (
  token: string
): Promise<AssetOverviewStats> => {
  try {
    const res = await api.get(
      `${API_BASE_URL}/overview`,
      getAuthHeaders(token)
    );
    return res.data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Failed to fetch asset overview"
      );
    }
    throw new Error(
      "A network error occurred while fetching the asset overview."
    );
  }
};
