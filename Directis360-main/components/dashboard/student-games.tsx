"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Gamepad2,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Play,
    Trophy,
    Clock,
    Users,
    ArrowRight,
    RefreshCw,
    Sparkles,
    Link2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
    initWajibetSession,
    studentApi,
    getWajibetSession,
    clearWajibetSession,
    WajibetSession,
} from "@/services/wajibetService";
import PlayerLobby from "./player-lobby";
import PlayGame from "./play-game";

// ──────────── Types ────────────

interface Assignment {
    _id: string;
    gameCreation: any; // populated game creation
    title?: string;
    dueDate?: string;
    status?: string;
    createdAt: string;
}

interface GameCreation {
    _id: string;
    name: string;
    template?: { name: string; slug: string };
    templateId?: string;
    createdAt: string;
}

// ──────────── Component ────────────

export default function StudentGames() {
    const { getFreshToken } = useAuth();

    // Wajibet connection
    const [session, setSession] = useState<WajibetSession | null>(null);
    const [connecting, setConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState("");

    // Data
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(false);

    // Join lobby
    const [roomCode, setRoomCode] = useState("");
    const [joinError, setJoinError] = useState("");
    const [joining, setJoining] = useState(false);

    // Play game
    const [playingGame, setPlayingGame] = useState<GameCreation | null>(null);
    const [playDialogOpen, setPlayDialogOpen] = useState(false);

    // View state: embedded lobby / playing
    const [view, setView] = useState<"main" | "lobby" | "playing">("main");
    const [lobbyRoomCode, setLobbyRoomCode] = useState("");
    const [playingGameId, setPlayingGameId] = useState("");
    const [playingRoomCode, setPlayingRoomCode] = useState<string | undefined>(undefined);
    const [playingAssignmentId, setPlayingAssignmentId] = useState<string | undefined>(undefined);

    // ──── Connect to Wajibet ────
    const connectToWajibet = useCallback(async () => {
        setConnecting(true);
        setConnectionError("");
        try {
            const token = await getFreshToken();
            if (!token) throw new Error("Not authenticated");
            const sess = await initWajibetSession(token);
            setSession(sess);
        } catch (err: any) {
            console.error("[StudentGames] Connection error:", err);
            setConnectionError(
                err?.response?.data?.message || err?.message || "Failed to connect"
            );
        } finally {
            setConnecting(false);
        }
    }, [getFreshToken]);

    // Auto-connect
    useEffect(() => {
        const existing = getWajibetSession();
        if (existing) {
            setSession(existing);
        } else {
            connectToWajibet();
        }
    }, [connectToWajibet]);

    // ──── Load assignments ────
    useEffect(() => {
        if (!session) return;
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await studentApi.getMyAssignmentsDetailed();
                setAssignments(Array.isArray(data) ? data : []);
            } catch (err: any) {
                console.error("[StudentGames] Load assignments error:", err);
                // If detailed fails, try basic
                try {
                    const data = await studentApi.getMyAssignments();
                    setAssignments(Array.isArray(data) ? data : []);
                } catch {
                    // silently fail - no assignments
                }
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [session]);

    // ──── Join lobby ────
    const handleJoinLobby = () => {
        if (!roomCode.trim()) return;
        setLobbyRoomCode(roomCode.trim().toUpperCase());
        setView("lobby");
    };

    // ──── Play a game ────
    const handlePlayGame = (game: GameCreation, aId?: string) => {
        setPlayingGameId(game._id);
        setPlayingAssignmentId(aId);
        setPlayingRoomCode(undefined);
        setView("playing");
    };

    // ──── Game started from lobby ────
    const handleGameStartedFromLobby = (gameCreationId: string) => {
        setPlayingGameId(gameCreationId);
        setPlayingRoomCode(lobbyRoomCode);
        setPlayingAssignmentId(undefined);
        setView("playing");
    };

    // ──── UI States ────

    // Not connected
    if (!session && !connecting) {
        return (
            <div className="space-y-6">
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6 text-center">
                        <Gamepad2 className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                        <h3 className="font-semibold text-lg mb-2">
                            Connect to Wajibet
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
                            Connect your account to access games assigned by your teachers.
                        </p>
                        {connectionError && (
                            <p className="text-sm text-red-600 mb-3 flex items-center justify-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {connectionError}
                            </p>
                        )}
                        <Button onClick={connectToWajibet}>
                            <Link2 className="w-4 h-4 mr-2" />
                            Connect
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Connecting
    if (connecting) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500">
                    Connecting to Wajibet...
                </span>
            </div>
        );
    }

    // ──── Connected UI ────

    // Embedded lobby view
    if (view === "lobby") {
        return (
            <PlayerLobby
                roomCode={lobbyRoomCode}
                onBack={() => { setView("main"); setRoomCode(""); }}
                onGameStarted={handleGameStartedFromLobby}
            />
        );
    }

    // Embedded play game view
    if (view === "playing" && playingGameId) {
        return (
            <PlayGame
                gameCreationId={playingGameId}
                assignmentId={playingAssignmentId}
                roomCode={playingRoomCode}
                onBack={() => setView("main")}
            />
        );
    }

    // Main view
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Gamepad2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Games
                        </h2>
                        <p className="text-sm text-gray-500">
                            Play games and join live sessions
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setLoading(true);
                        studentApi
                            .getMyAssignmentsDetailed()
                            .then((data) =>
                                setAssignments(
                                    Array.isArray(data) ? data : []
                                )
                            )
                            .catch(() => { })
                            .finally(() => setLoading(false));
                    }}
                >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Refresh
                </Button>
            </div>

            {/* Join Live Session */}
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg text-green-900 mb-1">
                                Join Live Session
                            </h3>
                            <p className="text-sm text-green-700 mb-4">
                                Enter the room code from your teacher to join a
                                live game session.
                            </p>
                            <div className="flex gap-2 max-w-md">
                                <Input
                                    placeholder="Enter room code"
                                    value={roomCode}
                                    onChange={(e) =>
                                        setRoomCode(
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter")
                                            handleJoinLobby();
                                    }}
                                    className="font-mono text-lg tracking-widest bg-white border-green-300 
                                               placeholder:text-gray-400 placeholder:tracking-normal placeholder:text-sm
                                               placeholder:font-sans uppercase"
                                    maxLength={12}
                                />
                                <Button
                                    onClick={handleJoinLobby}
                                    disabled={!roomCode.trim() || joining}
                                    className="bg-green-600 hover:bg-green-700 px-6"
                                >
                                    {joining ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            Join
                                            <ArrowRight className="w-4 h-4 ml-1" />
                                        </>
                                    )}
                                </Button>
                            </div>
                            {joinError && (
                                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {joinError}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Assigned Games */}
            <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Assigned Games
                </h3>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        <span className="ml-2 text-gray-500">
                            Loading games...
                        </span>
                    </div>
                ) : assignments.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6 text-center py-12">
                            <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">
                                No assigned games yet
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Games assigned by your teachers will appear
                                here.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {assignments.map((assignment) => {
                            const game = assignment.gameCreation;
                            if (!game) return null;
                            const gameName =
                                typeof game === "object"
                                    ? game.name
                                    : assignment.title || "Game";
                            const gameId =
                                typeof game === "object"
                                    ? game._id
                                    : game;
                            const templateName =
                                typeof game === "object" &&
                                    game.template
                                    ? game.template.name
                                    : "";
                            const dueDate = assignment.dueDate
                                ? new Date(
                                    assignment.dueDate
                                ).toLocaleDateString()
                                : null;

                            return (
                                <Card
                                    key={assignment._id}
                                    className="hover:shadow-md transition-shadow group"
                                >
                                    <CardContent className="pt-5 pb-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <Gamepad2 className="w-5 h-5 text-purple-600" />
                                            </div>
                                            {assignment.status && (
                                                <Badge
                                                    variant="secondary"
                                                    className={
                                                        assignment.status ===
                                                            "completed"
                                                            ? "bg-green-100 text-green-700"
                                                            : assignment.status ===
                                                                "active"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-gray-100 text-gray-600"
                                                    }
                                                >
                                                    {assignment.status}
                                                </Badge>
                                            )}
                                        </div>
                                        <h4 className="font-semibold text-gray-800 mb-1 truncate">
                                            {gameName}
                                        </h4>
                                        {templateName && (
                                            <p className="text-xs text-gray-500 mb-2">
                                                {templateName}
                                            </p>
                                        )}
                                        {dueDate && (
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                                                <Clock className="w-3 h-3" />
                                                Due: {dueDate}
                                            </div>
                                        )}
                                        <Button
                                            size="sm"
                                            className="w-full bg-purple-600 hover:bg-purple-700"
                                            onClick={() =>
                                                handlePlayGame(
                                                    {
                                                        _id: gameId,
                                                        name: gameName,
                                                        createdAt:
                                                            assignment.createdAt,
                                                    },
                                                    assignment._id
                                                )
                                            }
                                        >
                                            <Play className="w-4 h-4 mr-1" />
                                            Play Game
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
