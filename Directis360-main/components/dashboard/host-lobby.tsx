"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Loader2,
    Copy,
    Play,
    Square,
    Users,
    Trophy,
    ArrowLeft,
    Wifi,
    WifiOff,
    Clock,
    CheckCircle2,
} from "lucide-react";
import { useWajibetSocket } from "@/hooks/useWajibetSocket";
import { sessionsApi } from "@/services/wajibetService";

// ──────────── Types ────────────

interface Player {
    id: string;
    userId: string;
    name: string;
}

interface Rank {
    userId: string;
    name: string;
    score: number;
    correct: number;
    wrong: number;
    effectiveTimeMs: number;
    finishedAt?: string;
}

interface HostLobbyProps {
    gameId: string;
    gameName: string;
    onBack: () => void;
}

// ──────────── Component ────────────

export default function HostLobby({ gameId, gameName, onBack }: HostLobbyProps) {
    const { socket, connected } = useWajibetSocket();

    // State
    const [phase, setPhase] = useState<"setup" | "lobby" | "running" | "ended">("setup");
    const [sessionTitle, setSessionTitle] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [players, setPlayers] = useState<Player[]>([]);
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const [confirmEndOpen, setConfirmEndOpen] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);

    // ──── Socket event listeners ────
    useEffect(() => {
        if (!socket) return;

        const onRoomCreated = (newCode: string) => {
            setRoomCode(newCode);
            setPhase("lobby");
        };

        const onPlayerJoined = (updatedPlayers: Player[]) => {
            setPlayers(updatedPlayers);
        };

        const onGameStarted = () => {
            setPhase("running");
        };

        const onGameEnded = (data?: { sessionId?: string; ranks?: Rank[] }) => {
            setPhase("ended");
            // The server now sends final ranks with the game-ended event
            if (data?.ranks && Array.isArray(data.ranks) && data.ranks.length > 0) {
                setRanks(data.ranks);
            }
        };

        const onScoreboard = ({ ranks: r }: { ranks: Rank[] }) => {
            setRanks(Array.isArray(r) ? r : []);
        };

        socket.on("room-created", onRoomCreated);
        socket.on("player-joined", onPlayerJoined);
        socket.on("game-started", onGameStarted);
        socket.on("game-ended", onGameEnded);
        socket.on("live:scoreboard", onScoreboard);

        return () => {
            socket.off("room-created", onRoomCreated);
            socket.off("player-joined", onPlayerJoined);
            socket.off("game-started", onGameStarted);
            socket.off("game-ended", onGameEnded);
            socket.off("live:scoreboard", onScoreboard);
        };
    }, [socket]);

    // ──── Create lobby ────
    const handleCreateLobby = async () => {
        setCreating(true);
        setError("");
        try {
            const result = await sessionsApi.create({
                gameCreationId: gameId,
                title: sessionTitle.trim() || undefined,
                classIds: [],
                allowLateJoin: false,
                config: { strictProgress: false, timePenaltyPerWrongMs: 3000 },
            });

            const code = result.code || result.roomCode || "";
            const sId = result.sessionId || result._id || "";
            setRoomCode(code);
            setSessionId(sId);

            // Emit host-game to create the socket room
            if (socket && connected) {
                socket.emit("host-game", {
                    code,
                    sessionId: sId,
                    gameCreationId: gameId,
                });
            } else if (socket) {
                socket.once("connect", () => {
                    socket.emit("host-game", {
                        code,
                        sessionId: sId,
                        gameCreationId: gameId,
                    });
                });
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Failed to create session");
        } finally {
            setCreating(false);
        }
    };

    // ──── Start game ────
    const handleStartGame = () => {
        if (!socket || !roomCode) return;
        socket.emit("start-game", roomCode);
    };

    // ──── End game ────
    const handleEndGame = () => {
        if (!socket || !roomCode) return;
        socket.emit("end-game", roomCode);
        setConfirmEndOpen(false);
    };

    // ──── Copy code ────
    const copyCode = () => {
        navigator.clipboard.writeText(roomCode);
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
    };

    // ──── Render: Setup Phase ────
    if (phase === "setup") {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={onBack}>
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Host: {gameName}
                    </h2>
                </div>

                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Create Game Lobby</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Connection status */}
                        <div className="flex items-center gap-2 text-sm">
                            {connected ? (
                                <>
                                    <Wifi className="w-4 h-4 text-green-500" />
                                    <span className="text-green-600">Connected to game server</span>
                                </>
                            ) : (
                                <>
                                    <WifiOff className="w-4 h-4 text-amber-500" />
                                    <span className="text-amber-600">Connecting to game server...</span>
                                </>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Session Title (optional)
                            </label>
                            <Input
                                placeholder="e.g. Monday Quiz"
                                value={sessionTitle}
                                onChange={(e) => setSessionTitle(e.target.value)}
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-600">{error}</p>
                        )}

                        <Button
                            onClick={handleCreateLobby}
                            disabled={creating || !connected}
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                        >
                            {creating ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Play className="w-4 h-4 mr-2" />
                            )}
                            Create Lobby
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // ──── Render: Lobby / Running / Ended ────
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={onBack}>
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {gameName}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            {connected ? (
                                <Wifi className="w-3 h-3 text-green-500" />
                            ) : (
                                <WifiOff className="w-3 h-3 text-red-500" />
                            )}
                            <Badge
                                variant="secondary"
                                className={
                                    phase === "lobby"
                                        ? "bg-amber-100 text-amber-700"
                                        : phase === "running"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                }
                            >
                                {phase === "lobby"
                                    ? "Waiting for players"
                                    : phase === "running"
                                        ? "Game in progress"
                                        : "Game ended"}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {phase === "lobby" && (
                        <Button
                            onClick={handleStartGame}
                            disabled={players.length === 0}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Play className="w-4 h-4 mr-2" />
                            Start Game ({players.length} players)
                        </Button>
                    )}
                    {phase === "running" && (
                        <Button
                            variant="destructive"
                            onClick={() => setConfirmEndOpen(true)}
                        >
                            <Square className="w-4 h-4 mr-2" />
                            End Game
                        </Button>
                    )}
                </div>
            </div>

            {/* Room Code */}
            <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-indigo-600 mb-1">
                                Room Code
                            </p>
                            <p className="text-5xl font-bold font-mono tracking-widest text-indigo-900 select-all">
                                {roomCode}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Share this code with your students
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={copyCode}
                            className="border-indigo-300"
                        >
                            {codeCopied ? (
                                <CheckCircle2 className="w-4 h-4 mr-1 text-green-500" />
                            ) : (
                                <Copy className="w-4 h-4 mr-1" />
                            )}
                            {codeCopied ? "Copied!" : "Copy"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Two-column: Players + Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Players */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            Players ({players.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {players.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">
                                    Waiting for students to join...
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    They need to enter code{" "}
                                    <span className="font-mono font-bold">
                                        {roomCode}
                                    </span>
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {players.map((p, i) => (
                                    <div
                                        key={p.userId || i}
                                        className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                                    >
                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">
                                            {i + 1}
                                        </div>
                                        <span className="font-medium text-gray-800">
                                            {p.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Leaderboard (visible during running/ended) */}
                {(phase === "running" || phase === "ended") && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-amber-500" />
                                Live Leaderboard
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {ranks.length === 0 ? (
                                <div className="text-center py-8">
                                    <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">
                                        Scores will appear as students play...
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-80 overflow-y-auto">
                                    {ranks.map((r, i) => (
                                        <div
                                            key={r.userId || i}
                                            className={`flex items-center justify-between p-3 rounded-lg ${i === 0
                                                ? "bg-amber-50 border border-amber-200"
                                                : i === 1
                                                    ? "bg-gray-50 border border-gray-200"
                                                    : i === 2
                                                        ? "bg-orange-50 border border-orange-200"
                                                        : "bg-gray-50"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-bold text-gray-600 w-6 text-center">
                                                    {i === 0
                                                        ? "🥇"
                                                        : i === 1
                                                            ? "🥈"
                                                            : i === 2
                                                                ? "🥉"
                                                                : `${i + 1}`}
                                                </span>
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {r.name || "Player"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        ✓{r.correct} ✗{r.wrong}
                                                        {r.finishedAt && (
                                                            <span className="ml-2 text-green-600">
                                                                ✔ Finished
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-gray-800">
                                                    {r.score}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {r.effectiveTimeMs
                                                        ? `${(r.effectiveTimeMs / 1000).toFixed(1)}s`
                                                        : "—"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Confirm End Dialog */}
            <Dialog open={confirmEndOpen} onOpenChange={setConfirmEndOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>End Game?</DialogTitle>
                        <DialogDescription>
                            This will end the game for all players. Students who
                            haven&apos;t finished will lose their progress.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setConfirmEndOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleEndGame}>
                            End Game
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
