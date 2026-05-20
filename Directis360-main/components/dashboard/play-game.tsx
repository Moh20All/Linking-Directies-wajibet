"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    ArrowLeft,
    Maximize,
    Minimize,
    Trophy,
    X,
} from "lucide-react";
import { useWajibetSocket, getWajibetApiUrl } from "@/hooks/useWajibetSocket";
import { getWajibetSession, studentApi } from "@/services/wajibetService";

// ──────────── Types ────────────

interface Rank {
    userId: string;
    name: string;
    score: number;
    correct: number;
    wrong: number;
    effectiveTimeMs: number;
}

interface PlayGameProps {
    gameCreationId: string;
    /** If playing from an assignment */
    assignmentId?: string;
    /** If this is a live game from a room */
    roomCode?: string;
    onBack: () => void;
}

// ──────────── Component ────────────

export default function PlayGame({
    gameCreationId,
    assignmentId,
    roomCode,
    onBack,
}: PlayGameProps) {
    const { socket } = useWajibetSocket();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const session = getWajibetSession();
    const wajibetUrl = getWajibetApiUrl();

    // State
    const [gameCreation, setGameCreation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [resultSaved, setResultSaved] = useState(false);

    // ──── Fetch game creation data ────
    useEffect(() => {
        (async () => {
            try {
                const data = await studentApi.getGameCreation(gameCreationId);
                setGameCreation(data);
            } catch (err: any) {
                setError("Failed to load game. Please try again.");
                console.error("[PlayGame] Fetch error:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [gameCreationId]);

    // ──── Re-join socket room so live events work ────
    // When switching from PlayerLobby to PlayGame, a new socket is created.
    // We must re-join the game room so LIVE_ANSWER and scoreboard events work.
    useEffect(() => {
        if (!socket || !roomCode || !session?.user) return;
        const playerName = session.user.firstName
            ? `${session.user.firstName} ${session.user.lastName || ""}`.trim()
            : "Student";
        socket.emit("join-game", {
            roomCode,
            playerName,
            userId: session.user._id,
        });
        console.log("[PlayGame] Re-joined room:", roomCode, "as", playerName);
    }, [socket, roomCode, session?.user?._id]);

    // ──── Live scoreboard from socket ────
    useEffect(() => {
        if (!socket || !roomCode) return;
        const handleScoreboard = ({ ranks: r }: { ranks: Rank[] }) => {
            if (Array.isArray(r)) setRanks(r);
        };
        const handleGameEnded = (data?: { ranks?: Rank[] }) => {
            // When teacher ends the game, show final leaderboard
            if (data?.ranks && Array.isArray(data.ranks) && data.ranks.length > 0) {
                setRanks(data.ranks);
            }
            setShowLeaderboard(true);
        };
        socket.on("live:scoreboard", handleScoreboard);
        socket.on("game-ended", handleGameEnded);
        return () => {
            socket.off("live:scoreboard", handleScoreboard);
            socket.off("game-ended", handleGameEnded);
        };
    }, [socket, roomCode]);

    // ──── Handle messages from game engine iframe ────
    useEffect(() => {
        const handleGameMessage = async (event: MessageEvent) => {
            // Forward live answer progress to socket
            if (
                roomCode &&
                socket &&
                event.data?.type === "LIVE_ANSWER"
            ) {
                try {
                    const p = event.data.payload || {};
                    socket.emit("live:answer", {
                        roomCode,
                        userId: session?.user._id,
                        correct: !!p.correct,
                        deltaMs: Number(p.deltaMs) || 0,
                        scoreDelta: Number.isFinite(Number(p.scoreDelta))
                            ? Number(p.scoreDelta)
                            : undefined,
                        currentScore: Number.isFinite(Number(p.currentScore))
                            ? Number(p.currentScore)
                            : undefined,
                    });
                } catch { /* ignore */ }
            }

            // Forward live finish
            if (
                roomCode &&
                socket &&
                event.data?.type === "LIVE_FINISH"
            ) {
                try {
                    const p = event.data.payload || {};
                    socket.emit("live:finish", {
                        roomCode,
                        userId: session?.user._id,
                        totalTimeMs: Number.isFinite(Number(p.totalTimeMs))
                            ? Number(p.totalTimeMs)
                            : undefined,
                    });
                } catch { /* ignore */ }
            }

            // Game complete — submit result AND update live participant
            if (event.data?.type === "GAME_COMPLETE") {
                const payload = { ...event.data.payload };
                if (!payload.gameCreationId && gameCreation?._id)
                    payload.gameCreationId = gameCreation._id;
                if (assignmentId && !payload.assignmentId)
                    payload.assignmentId = assignmentId;

                // Save result via API
                try {
                    await studentApi.submitResult(payload);
                    setResultSaved(true);
                    setTimeout(() => setResultSaved(false), 8000);
                } catch (err: any) {
                    const msg =
                        err?.response?.data?.message ||
                        "Failed to save result.";
                    setSubmitError(msg);
                    setTimeout(() => setSubmitError(""), 4000);
                }

                // In a live session, emit live:finish with final stats so
                // the LiveParticipant gets updated and leaderboard shows results
                if (roomCode && socket) {
                    try {
                        const p = event.data.payload || {};
                        // Engine sends: score (correct count), totalPossibleScore, answers[]
                        const correctCount = Number(p.score) || 0;
                        const totalQ = Number(p.totalPossibleScore) || 0;
                        const wrongCount = totalQ > correctCount ? totalQ - correctCount : 0;
                        const totalTimeMs = Array.isArray(p.answers)
                            ? p.answers.reduce((sum: number, a: any) => sum + (a.timeMs || 0), 0)
                            : 0;
                        socket.emit("live:finish", {
                            roomCode,
                            userId: session?.user._id,
                            score: correctCount,
                            correct: correctCount,
                            wrong: wrongCount,
                            totalTimeMs,
                        });
                        console.log("[PlayGame] Emitted live:finish:", { correctCount, wrongCount, totalTimeMs });
                    } catch { /* ignore */ }
                }
            }
        };

        window.addEventListener("message", handleGameMessage);
        return () => window.removeEventListener("message", handleGameMessage);
    }, [socket, roomCode, session?.user._id, gameCreation?._id, assignmentId]);

    // ──── Send game data to iframe on load ────
    const handleIframeLoad = useCallback(() => {
        if (!iframeRef.current || !gameCreation) return;
        const payload = {
            ...gameCreation,
            questions: gameCreation.content,
            assignmentId,
            mode: "student",
            isTest: false,
            live: roomCode ? { roomCode } : undefined,
        };
        iframeRef.current.contentWindow?.postMessage(
            { type: "INIT_GAME", payload },
            "*"
        );
    }, [gameCreation, assignmentId, roomCode]);

    // ──── Fullscreen toggle ────
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // ──── Loading ────
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Loading game...</p>
                </div>
            </div>
        );
    }

    // ──── Error ────
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <p className="text-4xl">⚠️</p>
                    <p className="text-gray-700">{error}</p>
                    <Button onClick={onBack} variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    // Build iframe src: prefer template's enginePath (always current) over
    // gameCreation.enginePath which can become stale after engine rebuilds
    const enginePath =
        gameCreation?.template?.enginePath || gameCreation?.enginePath;
    const iframeSrc = enginePath
        ? `${wajibetUrl}${enginePath}/index.html`
        : null;

    console.log("[PlayGame] enginePath:", enginePath, "iframeSrc:", iframeSrc);

    return (
        <div className="flex flex-col h-[calc(100vh-120px)]">
            {/* Header */}
            <header className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Exit
                        </Button>
                        <h1 className="text-lg font-semibold text-gray-900">
                            {gameCreation?.name || "Game"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        {roomCode && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    setShowLeaderboard((v) => !v)
                                }
                            >
                                <Trophy className="w-4 h-4 mr-1" />
                                Leaderboard
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleFullscreen}
                        >
                            {isFullscreen ? (
                                <Minimize className="w-4 h-4" />
                            ) : (
                                <Maximize className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Submit result banners */}
            {submitError && (
                <div className="bg-red-50 border-b border-red-200 text-red-700 text-sm px-4 py-2">
                    {submitError}
                </div>
            )}
            {resultSaved && (
                <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-sm px-4 py-2">
                    Your result was saved! ✔
                </div>
            )}

            {/* Live Leaderboard panel */}
            {roomCode && showLeaderboard && (
                <div className="absolute top-20 right-4 z-30 w-80 max-w-[85vw] bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="px-4 py-3 border-b flex items-center justify-between">
                        <span className="font-semibold text-gray-900 text-sm">
                            Live Leaderboard
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowLeaderboard(false)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="max-h-96 overflow-auto p-2">
                        {ranks.length === 0 ? (
                            <p className="text-xs text-gray-500 px-2 py-3">
                                No progress yet.
                            </p>
                        ) : (
                            <ol className="space-y-1">
                                {ranks.map((r, i) => {
                                    const isMe =
                                        String(r.userId) ===
                                        session?.user._id;
                                    return (
                                        <li
                                            key={`${r.userId}-${i}`}
                                            className={`flex items-center justify-between px-3 py-2 rounded-md text-xs ${isMe
                                                ? "bg-indigo-50 border border-indigo-200"
                                                : "bg-gray-50 border border-gray-100"
                                                }`}
                                        >
                                            <span className="text-gray-800 truncate mr-2">
                                                {i + 1}. {r.name || "Player"}
                                            </span>
                                            <span className="text-gray-600 whitespace-nowrap">
                                                {r.score ?? 0} pts •{" "}
                                                {r.effectiveTimeMs
                                                    ? `${(
                                                        r.effectiveTimeMs /
                                                        1000
                                                    ).toFixed(1)}s`
                                                    : "0.0s"}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ol>
                        )}
                    </div>
                </div>
            )}

            {/* Game iframe */}
            <main className="flex-1 bg-gray-100 p-2">
                <div className="h-full bg-black rounded-lg overflow-hidden shadow-sm">
                    {iframeSrc ? (
                        <iframe
                            ref={iframeRef}
                            src={iframeSrc}
                            title="Game Engine"
                            className="w-full h-full border-0"
                            onLoad={handleIframeLoad}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center text-white bg-gray-900">
                            <div className="text-center">
                                <p className="text-4xl mb-4">🎮</p>
                                <p className="text-gray-300">
                                    Game engine not available
                                </p>
                                <p className="text-gray-500 text-sm mt-1">
                                    The game template may not be configured
                                    properly.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
