"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Loader2,
    AlertCircle,
    Trophy,
    Users,
    Clock,
    BarChart3,
    Radio,
    Trash2,
} from "lucide-react";
import { gamesApi, sessionsApi } from "@/services/wajibetService";

// ─── Types ───────────────────────────────────────────────────────

interface GameResultsProps {
    gameId: string;
    gameName: string;
    onBack: () => void;
}

interface Result {
    _id: string;
    student: { name: string; _id: string };
    score: number;
    totalPossibleScore: number;
    createdAt: string;
    duration?: number;
}

interface LiveSession {
    _id: string;
    roomCode: string;
    status: string;
    playerCount: number;
    createdAt: string;
    endedAt?: string;
}

// ─── Component ───────────────────────────────────────────────────

export default function GameResults({
    gameId,
    gameName,
    onBack,
}: GameResultsProps) {
    const [tab, setTab] = useState<"results" | "sessions">("results");
    const [results, setResults] = useState<Result[]>([]);
    const [sessions, setSessions] = useState<LiveSession[]>([]);
    const [loadingResults, setLoadingResults] = useState(true);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [error, setError] = useState("");

    // ─── Load results ──────────────────────────────────────────

    useEffect(() => {
        const loadResults = async () => {
            setLoadingResults(true);
            try {
                const data = await gamesApi.getResults(gameId);
                setResults(Array.isArray(data) ? data : []);
            } catch (err: any) {
                console.error("[Results] Load error:", err);
            } finally {
                setLoadingResults(false);
            }
        };
        loadResults();
    }, [gameId]);

    // ─── Load live sessions ────────────────────────────────────

    useEffect(() => {
        const loadSessions = async () => {
            setLoadingSessions(true);
            try {
                const data = await sessionsApi.list();
                // Filter sessions for this game
                const filtered = (Array.isArray(data) ? data : []).filter(
                    (s: any) =>
                        s.gameCreation === gameId || s.gameCreation?._id === gameId
                );
                setSessions(filtered);
            } catch (err: any) {
                console.error("[Sessions] Load error:", err);
            } finally {
                setLoadingSessions(false);
            }
        };
        loadSessions();
    }, [gameId]);

    // ─── Stats ─────────────────────────────────────────────────

    const avgScore =
        results.length > 0
            ? Math.round(
                (results.reduce((sum, r) => sum + (r.score || 0), 0) /
                    results.length) *
                10
            ) / 10
            : 0;
    const avgTotal =
        results.length > 0
            ? Math.round(
                (results.reduce((sum, r) => sum + (r.totalPossibleScore || 0), 0) /
                    results.length) *
                10
            ) / 10
            : 0;
    const uniquePlayers = new Set(results.map((r) => r.student?._id)).size;

    // ─── Render ────────────────────────────────────────────────

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{gameName}</h2>
                    <p className="text-sm text-gray-500">Results & Live Sessions</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-5 pb-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Trophy className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Avg Score</p>
                            <p className="text-xl font-bold text-gray-800">
                                {avgScore}
                                <span className="text-sm text-gray-400 font-normal">
                                    {" "}
                                    / {avgTotal}
                                </span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-5 pb-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Unique Players</p>
                            <p className="text-xl font-bold text-gray-800">{uniquePlayers}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-5 pb-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Total Submissions</p>
                            <p className="text-xl font-bold text-gray-800">
                                {results.length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tab Switch */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
                <button
                    onClick={() => setTab("results")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === "results"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <BarChart3 className="h-4 w-4 inline mr-1.5" />
                    Results ({results.length})
                </button>
                <button
                    onClick={() => setTab("sessions")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === "sessions"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <Radio className="h-4 w-4 inline mr-1.5" />
                    Live Sessions ({sessions.length})
                </button>
            </div>

            {/* Results Tab */}
            {tab === "results" && (
                <Card>
                    <CardContent className="pt-5">
                        {loadingResults ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                <span className="ml-2 text-gray-500">Loading results...</span>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="text-center py-12">
                                <Trophy className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No results yet</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Results will appear here after students play this game.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3 font-semibold text-gray-600">
                                                Student
                                            </th>
                                            <th className="text-left p-3 font-semibold text-gray-600">
                                                Score
                                            </th>
                                            <th className="text-left p-3 font-semibold text-gray-600">
                                                Percentage
                                            </th>
                                            <th className="text-left p-3 font-semibold text-gray-600">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((result) => {
                                            const pct =
                                                result.totalPossibleScore > 0
                                                    ? Math.round(
                                                        (result.score / result.totalPossibleScore) * 100
                                                    )
                                                    : 0;
                                            return (
                                                <tr
                                                    key={result._id}
                                                    className="border-b last:border-b-0 hover:bg-gray-50"
                                                >
                                                    <td className="p-3 font-medium">
                                                        {result.student?.name || "Unknown"}
                                                    </td>
                                                    <td className="p-3">
                                                        {result.score} / {result.totalPossibleScore}
                                                    </td>
                                                    <td className="p-3">
                                                        <Badge
                                                            variant="secondary"
                                                            className={
                                                                pct >= 70
                                                                    ? "bg-green-100 text-green-700"
                                                                    : pct >= 50
                                                                        ? "bg-yellow-100 text-yellow-700"
                                                                        : "bg-red-100 text-red-700"
                                                            }
                                                        >
                                                            {pct}%
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3 text-gray-500">
                                                        {new Date(result.createdAt).toLocaleString()}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Sessions Tab */}
            {tab === "sessions" && (
                <Card>
                    <CardContent className="pt-5">
                        {loadingSessions ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                <span className="ml-2 text-gray-500">Loading sessions...</span>
                            </div>
                        ) : sessions.length === 0 ? (
                            <div className="text-center py-12">
                                <Radio className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">
                                    No live sessions yet
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Use the Host button to start a live session with students.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sessions.map((session) => (
                                    <div
                                        key={session._id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-3 h-3 rounded-full ${session.status === "active" ||
                                                        session.status === "waiting"
                                                        ? "bg-green-500 animate-pulse"
                                                        : "bg-gray-300"
                                                    }`}
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-sm">
                                                        {session.roomCode}
                                                    </span>
                                                    <Badge
                                                        variant="secondary"
                                                        className={
                                                            session.status === "active" ||
                                                                session.status === "waiting"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-100 text-gray-600"
                                                        }
                                                    >
                                                        {session.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        {session.playerCount || 0} players
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(session.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
