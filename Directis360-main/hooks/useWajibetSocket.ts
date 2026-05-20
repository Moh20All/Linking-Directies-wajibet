"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { getWajibetSession } from "@/services/wajibetService";

const WAJIBET_API =
    process.env.NEXT_PUBLIC_WAJIBET_API_URL || "http://localhost:5000";

/**
 * Custom hook that creates and manages a socket.io connection to Wajibet's
 * real-time game server.
 *
 * It uses the cached Wajibet JWT for authentication and emits an `identify`
 * event on connect so the server knows who we are.
 */
export function useWajibetSocket() {
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const session = getWajibetSession();
        if (!session) return;

        const s = io(WAJIBET_API, {
            auth: { token: session.token },
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
        });

        s.on("connect", () => {
            setConnected(true);
            // Tell the server who we are
            s.emit("identify", {
                role: session.user.role,
                userId: session.user._id,
            });
        });

        s.on("disconnect", () => setConnected(false));
        s.on("connect_error", (err) =>
            console.warn("[WajibetSocket] connection error:", err.message)
        );

        socketRef.current = s;

        return () => {
            s.disconnect();
            socketRef.current = null;
            setConnected(false);
        };
    }, []);

    return { socket: socketRef.current, connected };
}

/**
 * Convenience wrapper: get the Wajibet API base URL for building iframe src
 * URLs and similar.
 */
export function getWajibetApiUrl(): string {
    return WAJIBET_API;
}
