"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    ArrowLeft,
    Wifi,
    WifiOff,
    AlertCircle,
} from "lucide-react";
import { useWajibetSocket } from "@/hooks/useWajibetSocket";
import { getWajibetSession } from "@/services/wajibetService";

// ──────────── Props ────────────

interface PlayerLobbyProps {
    roomCode: string;
    onBack: () => void;
    onGameStarted: (gameCreationId: string) => void;
}

// ──────────── Component ────────────

export default function PlayerLobby({
    roomCode,
    onBack,
    onGameStarted,
}: PlayerLobbyProps) {
    const { socket, connected } = useWajibetSocket();
    const [error, setError] = useState("");
    const [joined, setJoined] = useState(false);

    // Join the room as soon as socket connects
    useEffect(() => {
        if (!socket || !connected) return;

        const session = getWajibetSession();
        if (!session) {
            setError("Not authenticated. Please refresh and try again.");
            return;
        }

        const playerName =
            [session.user.firstName, session.user.lastName]
                .filter(Boolean)
                .join(" ") || "Player";
        const userId = session.user._id;

        try {
            socket.emit("join-game", {
                roomCode,
                playerName,
                userId,
            });
            setJoined(true);
        } catch {
            setError("Failed to join room.");
        }
    }, [socket, connected, roomCode]);

    // Listen for server events
    useEffect(() => {
        if (!socket) return;

        const handleGameStarted = ({
            gameCreationId,
        }: {
            gameCreationId: string;
        }) => {
            onGameStarted(gameCreationId);
        };

        const handleJoinError = (msg: string) => {
            setError(msg || "Could not join this room.");
            setJoined(false);
        };

        socket.on("game-started", handleGameStarted);
        socket.on("join-error", handleJoinError);

        return () => {
            socket.off("game-started", handleGameStarted);
            socket.off("join-error", handleJoinError);
        };
    }, [socket, onGameStarted]);

    // ──── Error state ────
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="max-w-md w-full border-red-200">
                    <CardContent className="pt-6 text-center space-y-4">
                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
                        <h2 className="text-xl font-bold text-gray-800">
                            Join Failed
                        </h2>
                        <p className="text-sm text-red-600">{error}</p>
                        <Button onClick={onBack} variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // ──── Waiting state ────
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Card className="max-w-md w-full border-indigo-200">
                <CardContent className="pt-8 pb-8 text-center space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-gray-800">
                            You&apos;re In!
                        </h2>
                        <div className="flex items-center justify-center gap-2 text-sm">
                            {connected ? (
                                <>
                                    <Wifi className="w-4 h-4 text-green-500" />
                                    <span className="text-green-600">
                                        Connected
                                    </span>
                                </>
                            ) : (
                                <>
                                    <WifiOff className="w-4 h-4 text-amber-500" />
                                    <span className="text-amber-600">
                                        Connecting...
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Room code display */}
                    <div className="bg-indigo-50 p-4 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">Room Code</p>
                        <p className="text-4xl font-bold font-mono tracking-widest text-indigo-700">
                            {roomCode}
                        </p>
                    </div>

                    {/* Waiting indicator */}
                    <div className="flex items-center justify-center gap-3 text-gray-500">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>
                            Waiting for the teacher to start the game...
                        </span>
                    </div>

                    <Button onClick={onBack} variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Leave Lobby
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
