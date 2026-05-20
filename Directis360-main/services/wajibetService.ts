import axios from "axios";
import api from "@/lib/api";

// Wajibet API base URL
const WAJIBET_API = process.env.NEXT_PUBLIC_WAJIBET_API_URL || "http://localhost:5000";

// Separate axios instance for Wajibet API calls
const wajibetApi = axios.create({
    baseURL: WAJIBET_API,
    headers: { "Content-Type": "application/json" },
});

// --------------- Types ---------------

export interface WajibetUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    school: string;
    externalSource?: string;
}

export interface WajibetSession {
    token: string;
    user: WajibetUser;
    isNewUser: boolean;
    expiresAt: number;
}

// --------------- Session State ---------------

let cachedSession: WajibetSession | null = null;

/**
 * Initialize or retrieve a cached Wajibet session for the current Directis360 user.
 *
 * 1. Calls psAPI GET /api/wajibet/token to get a 60s exchange token
 * 2. Sends exchange token to Wajibet POST /api/auth/federated
 * 3. Receives Wajibet JWT + user info
 * 4. Caches the session for subsequent calls
 */
export async function initWajibetSession(directisToken: string): Promise<WajibetSession> {
    // Return cached session if still valid
    if (cachedSession && cachedSession.expiresAt > Date.now()) {
        return cachedSession;
    }

    // Step 1: Get exchange token from Directis360 psAPI
    const exchangeRes = await api.get("/wajibet/token", {
        headers: { Authorization: `Bearer ${directisToken}` },
    });

    const { exchangeToken, wajibetApiUrl } = exchangeRes.data;

    // Step 2: Exchange for Wajibet session
    const targetUrl = wajibetApiUrl || WAJIBET_API;
    const wajibetRes = await axios.post(`${targetUrl}/api/auth/federated`, {
        exchangeToken,
    });

    const { token, user, isNewUser } = wajibetRes.data;

    // Cache session (refresh at 2.5 days, token lasts 3 days)
    cachedSession = {
        token,
        user,
        isNewUser,
        expiresAt: Date.now() + 2.5 * 24 * 60 * 60 * 1000,
    };

    return cachedSession;
}

/**
 * Get the current Wajibet token. Throws if session not initialized.
 */
export function getWajibetToken(): string {
    if (!cachedSession || cachedSession.expiresAt <= Date.now()) {
        throw new Error("Wajibet session not initialized or expired");
    }
    return cachedSession.token;
}

/**
 * Get the current cached session without re-initializing.
 */
export function getWajibetSession(): WajibetSession | null {
    if (!cachedSession || cachedSession.expiresAt <= Date.now()) {
        return null;
    }
    return cachedSession;
}

/**
 * Clear the Wajibet session (call on user logout).
 */
export function clearWajibetSession(): void {
    cachedSession = null;
}

// --------------- API Helpers ---------------

/**
 * Make an authenticated GET request to Wajibet API.
 */
export async function wajibetGet<T = any>(endpoint: string): Promise<T> {
    const token = getWajibetToken();
    const res = await wajibetApi.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

/**
 * Make an authenticated POST request to Wajibet API.
 */
export async function wajibetPost<T = any>(endpoint: string, data?: any): Promise<T> {
    const token = getWajibetToken();
    const res = await wajibetApi.post(endpoint, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

/**
 * Make an authenticated PUT request to Wajibet API.
 */
export async function wajibetPut<T = any>(endpoint: string, data?: any): Promise<T> {
    const token = getWajibetToken();
    const res = await wajibetApi.put(endpoint, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

/**
 * Make an authenticated DELETE request to Wajibet API.
 */
export async function wajibetDelete<T = any>(endpoint: string): Promise<T> {
    const token = getWajibetToken();
    const res = await wajibetApi.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

// --------------- Game-Specific API ---------------

export const gamesApi = {
    /** Get all games created by the current teacher */
    getMyGames: () => wajibetGet("/api/creations"),

    /** Get game templates catalog */
    getTemplates: () => wajibetGet("/api/templates"),

    /** Get a single template by ID (includes full formSchema) */
    getTemplateById: (id: string) => wajibetGet(`/api/templates/${id}`),

    /** Create a new game from a template */
    createGame: (data: any) => wajibetPost("/api/creations", data),

    /** Get a specific game by ID */
    getGame: (id: string) => wajibetGet(`/api/creations/${id}`),

    /** Update a game */
    updateGame: (id: string, data: any) => wajibetPut(`/api/creations/${id}`, data),

    /** Delete a game */
    deleteGame: (id: string) => wajibetDelete(`/api/creations/${id}`),

    /** Get game results */
    getResults: (gameCreationId: string) => wajibetGet(`/api/results/${gameCreationId}`),

    /** Get single result detail */
    getResultDetail: (resultId: string) => wajibetGet(`/api/results/detail/${resultId}`),
};

// --------------- Live Sessions API ---------------

export const sessionsApi = {
    /** List all live sessions for the current teacher */
    list: () => wajibetGet("/api/live-sessions"),

    /** Get session details */
    getDetails: (id: string) => wajibetGet(`/api/live-sessions/${id}`),

    /** Get session summary with results */
    getSummary: (id: string) => wajibetGet(`/api/live-sessions/${id}/summary`),

    /** Create a new live session */
    create: (data: any) => wajibetPost("/api/live-sessions", data),

    /** End a live session */
    end: (id: string) => wajibetPost(`/api/live-sessions/${id}/end`, {}),

    /** Delete a live session */
    delete: (id: string) => wajibetDelete(`/api/live-sessions/${id}`),
};

// --------------- Student-Facing API ---------------

export const studentApi = {
    /** Get assignments assigned to the current student */
    getMyAssignments: () => wajibetGet("/api/assignments/my-assignments"),

    /** Get detailed assignments with game info */
    getMyAssignmentsDetailed: () => wajibetGet("/api/assignments/my-assignments/detailed"),

    /** Get a specific game creation by ID (for playing) */
    getGameCreation: (id: string) => wajibetGet(`/api/creations/${id}`),

    /** Submit a game result */
    submitResult: (data: any) => wajibetPost("/api/results", data),

    /** Get student's own results summary */
    getMyResultsSummary: () => wajibetGet("/api/results/me/summary"),

    /** Get student's recent results */
    getMyRecentResults: () => wajibetGet("/api/results/me/recent"),
};
