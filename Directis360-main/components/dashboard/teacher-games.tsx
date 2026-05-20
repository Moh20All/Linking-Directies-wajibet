"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Gamepad2,
    Plus,
    Loader2,
    Trash2,
    Eye,
    Copy,
    RefreshCw,
    Search,
    AlertCircle,
    CheckCircle2,
    Sparkles,
    Link2,
    ExternalLink,
    Pencil,
    Play,
    BarChart3,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
    initWajibetSession,
    gamesApi,
    sessionsApi,
    getWajibetSession,
    clearWajibetSession,
    WajibetSession,
} from "@/services/wajibetService";
import GameEditor from "./game-editor";
import GameResults from "./game-results";
import HostLobby from "./host-lobby";

// ──────────── Types ────────────

interface GameTemplate {
    _id: string;
    name: string;
    status: string;
    iconUrl?: string;
    description?: string;
}

interface GameCreation {
    _id: string;
    name: string;
    template: GameTemplate | string;
    config: Record<string, any>;
    content: any[];
    createdAt: string;
    updatedAt: string;
    enginePath?: string;
}

// ──────────── Component ────────────

export default function TeacherGames() {
    const { getFreshToken } = useAuth();

    // Session states
    const [session, setSession] = useState<WajibetSession | null>(null);
    const [connecting, setConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);

    // Data states
    const [games, setGames] = useState<GameCreation[]>([]);
    const [templates, setTemplates] = useState<GameTemplate[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // View state: list, create, edit, or results
    const [view, setView] = useState<"list" | "create" | "edit" | "results" | "lobby">("list");
    const [editingGameId, setEditingGameId] = useState<string>("");
    const [createTemplateId, setCreateTemplateId] = useState<string>("");
    const [resultsGameId, setResultsGameId] = useState<string>("");
    const [resultsGameName, setResultsGameName] = useState<string>("");
    const [lobbyGameId, setLobbyGameId] = useState<string>("");
    const [lobbyGameName, setLobbyGameName] = useState<string>("");

    // Dialog states
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<GameCreation | null>(null);
    const [newGameName, setNewGameName] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<string>("");
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Host dialog states
    const [hostDialogOpen, setHostDialogOpen] = useState(false);
    const [hostingGameId, setHostingGameId] = useState("");
    const [hostRoomCode, setHostRoomCode] = useState("");
    const [hostSessionId, setHostSessionId] = useState("");
    const [hostLoading, setHostLoading] = useState(false);
    const [hostError, setHostError] = useState("");

    // ──── Connect to Wajibet ────
    const connectToWajibet = useCallback(async () => {
        setConnecting(true);
        setConnectionError(null);
        try {
            const directisToken = await getFreshToken();
            console.log("[Games] Got Directis token:", !!directisToken);
            if (!directisToken) {
                throw new Error("Not authenticated with Directis360");
            }
            const wajibetSession = await initWajibetSession(directisToken);
            console.log("[Games] Wajibet session established:", { userId: wajibetSession.user?._id, isNewUser: wajibetSession.isNewUser });
            setSession(wajibetSession);
        } catch (err: any) {
            console.error("[Games] Connection error:", err?.response?.data || err.message || err);
            setConnectionError(
                err?.response?.data?.message || err.message || "Failed to connect to Wajibet"
            );
        } finally {
            setConnecting(false);
        }
    }, [getFreshToken]);

    // ──── Load games data ────
    const loadGames = useCallback(async () => {
        if (!getWajibetSession()) return;
        setLoading(true);

        // Fetch templates independently — don't let a games error kill template loading
        try {
            const templatesData = await gamesApi.getTemplates();
            console.log("[Games] Raw templates response:", templatesData);
            console.log("[Games] Template statuses:", Array.isArray(templatesData) ? templatesData.map((t: any) => ({ name: t.name, status: t.status })) : "not an array");
            setTemplates(Array.isArray(templatesData) ? templatesData : []);
        } catch (err: any) {
            console.error("[Games] Templates fetch error:", err?.response?.status, err?.response?.data || err.message);
            if (err?.response?.status === 401) {
                clearWajibetSession();
                setSession(null);
                setConnectionError("Session expired. Please reconnect.");
                setLoading(false);
                return;
            }
        }

        // Fetch games independently
        try {
            const gamesData = await gamesApi.getMyGames();
            console.log("[Games] Raw games response:", gamesData);
            setGames(Array.isArray(gamesData) ? gamesData : []);
        } catch (err: any) {
            console.error("[Games] Games fetch error:", err?.response?.status, err?.response?.data || err.message);
            // Games fetch failing is non-fatal — templates still loaded above
            if (err?.response?.status === 401) {
                clearWajibetSession();
                setSession(null);
                setConnectionError("Session expired. Please reconnect.");
            }
        }

        setLoading(false);
    }, []);

    // Auto-connect on mount
    useEffect(() => {
        const existing = getWajibetSession();
        if (existing) {
            setSession(existing);
        } else {
            connectToWajibet();
        }
    }, [connectToWajibet]);

    // Load games after session is established
    useEffect(() => {
        if (session) {
            loadGames();
        }
    }, [session, loadGames]);

    // ──── Navigate to create view ────
    const handleStartCreate = () => {
        if (!selectedTemplate) return;
        setCreateTemplateId(selectedTemplate);
        setCreateDialogOpen(false);
        setSelectedTemplate("");
        setView("create");
    };

    // ──── Navigate to edit view ────
    const handleEditGame = (gameId: string) => {
        setEditingGameId(gameId);
        setView("edit");
    };

    // ──── Host game (navigate to lobby view) ────
    const handleHostGame = (gameId: string) => {
        const game = games.find((g) => g._id === gameId);
        setLobbyGameId(gameId);
        setLobbyGameName(game?.name || "Game");
        setView("lobby");
    };

    // ──── Return from editor to list ────
    const handleEditorSave = () => {
        setView("list");
        loadGames();
    };
    const handleEditorCancel = () => {
        setView("list");
    };

    // ──── Delete game ────
    const handleDeleteGame = async () => {
        if (!selectedGame) return;
        setDeleting(true);
        try {
            await gamesApi.deleteGame(selectedGame._id);
            setDeleteDialogOpen(false);
            setSelectedGame(null);
            await loadGames();
        } catch (err: any) {
            console.error("[Games] Delete error:", err);
        } finally {
            setDeleting(false);
        }
    };

    // ──── Copy play link ────
    const copyPlayLink = (gameId: string) => {
        const wajibetClientUrl = process.env.NEXT_PUBLIC_WAJIBET_CLIENT_URL || "http://localhost:5173";
        const link = `${wajibetClientUrl}/student/play-game/${gameId}`;
        navigator.clipboard.writeText(link);
    };

    // ──── Filtered games ────
    const filteredGames = games.filter((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ──── Not Connected State ────
    if (!session && !connecting) {
        return (
            <div className="space-y-6">
                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <Gamepad2 className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <CardTitle>Wajibet Games</CardTitle>
                                <CardDescription>
                                    Connect to Wajibet to create and manage interactive games
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {connectionError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {connectionError}
                            </div>
                        )}
                        <Button onClick={connectToWajibet} className="bg-orange-600 hover:bg-orange-700">
                            <Link2 className="w-4 h-4 mr-2" />
                            Connect to Wajibet
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // ──── Connecting State ────
    if (connecting) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                <p className="text-gray-600">
                    Connecting to Wajibet...
                </p>
                {session?.isNewUser && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        Setting up your game account...
                    </p>
                )}
            </div>
        );
    }

    // ──── Create / Edit views ────
    if (view === "create" && createTemplateId) {
        return (
            <GameEditor
                mode="create"
                templateId={createTemplateId}
                onSave={handleEditorSave}
                onCancel={handleEditorCancel}
            />
        );
    }
    if (view === "edit" && editingGameId) {
        return (
            <GameEditor
                mode="edit"
                gameId={editingGameId}
                onSave={handleEditorSave}
                onCancel={handleEditorCancel}
            />
        );
    }
    if (view === "results" && resultsGameId) {
        return (
            <GameResults
                gameId={resultsGameId}
                gameName={resultsGameName}
                onBack={handleEditorCancel}
            />
        );
    }
    if (view === "lobby" && lobbyGameId) {
        return (
            <HostLobby
                gameId={lobbyGameId}
                gameName={lobbyGameName}
                onBack={() => { setView("list"); setLobbyGameId(""); }}
            />
        );
    }

    // ──── Connected State (List View) ────
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Gamepad2 className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">My Games</h2>
                        <p className="text-sm text-gray-500">
                            {games.length} game{games.length !== 1 ? "s" : ""} created
                            {session?.isNewUser && (
                                <span className="ml-2 text-green-600">
                                    <CheckCircle2 className="w-3 h-3 inline mr-1" />
                                    Account linked!
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadGames}
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() => setCreateDialogOpen(true)}
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        New Game
                    </Button>
                </div>
            </div>

            {/* Search */}
            {games.length > 0 && (
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search games..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            )}

            {/* Loading */}
            {loading && games.length === 0 && (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 text-orange-500 animate-spin mr-2" />
                    <span className="text-gray-500">Loading games...</span>
                </div>
            )}

            {/* Empty State */}
            {!loading && games.length === 0 && (
                <Card className="border-dashed border-2 border-gray-200">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                            <Gamepad2 className="w-8 h-8 text-orange-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">
                            No games yet
                        </h3>
                        <p className="text-gray-500 text-sm mb-4 max-w-sm">
                            Create your first interactive game from a template to engage your
                            students!
                        </p>
                        <Button
                            className="bg-orange-600 hover:bg-orange-700"
                            onClick={() => setCreateDialogOpen(true)}
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Create Your First Game
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Games Grid */}
            {filteredGames.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredGames.map((game) => {
                        const templateName =
                            typeof game.template === "object"
                                ? game.template?.name
                                : "Unknown";
                        return (
                            <Card
                                key={game._id}
                                className="hover:shadow-md transition-shadow group"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-base truncate">
                                                {game.name}
                                            </CardTitle>
                                            <CardDescription className="text-xs mt-1">
                                                Template: {templateName}
                                            </CardDescription>
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="ml-2 bg-orange-50 text-orange-700 text-[10px]"
                                        >
                                            {game.content?.length || 0} items
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <span className="text-xs text-gray-400 block">
                                            {new Date(game.createdAt).toLocaleDateString()}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 h-8 text-xs"
                                                onClick={() => handleEditGame(game._id)}
                                            >
                                                <Pencil className="w-3.5 h-3.5 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700"
                                                onClick={() => handleHostGame(game._id)}
                                            >
                                                <Play className="w-3.5 h-3.5 mr-1" />
                                                Host
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-xs"
                                                title="View Results"
                                                onClick={() => {
                                                    setResultsGameId(game._id);
                                                    setResultsGameName(game.name);
                                                    setView("results");
                                                }}
                                            >
                                                <BarChart3 className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                title="Copy play link"
                                                onClick={() => copyPlayLink(game._id)}
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                                title="Delete game"
                                                onClick={() => {
                                                    setSelectedGame(game);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* ──── Create Game Dialog ──── */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-orange-500" />
                            Create New Game
                        </DialogTitle>
                        <DialogDescription>
                            Choose a template to get started.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <div>
                            <Label>Template</Label>
                            <div className="grid grid-cols-1 gap-2 mt-2 max-h-48 overflow-y-auto">
                                {templates
                                    .filter((t) => t.status === "active" || t.status === "published")
                                    .map((t) => (
                                        <button
                                            key={t._id}
                                            onClick={() => setSelectedTemplate(t._id)}
                                            className={`text-left p-3 rounded-lg border transition-all ${selectedTemplate === t._id
                                                ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            <span className="font-medium text-sm">{t.name}</span>
                                            {t.description && (
                                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                                    {t.description}
                                                </p>
                                            )}
                                        </button>
                                    ))}
                                {templates.filter((t) => t.status === "active").length === 0 && (
                                    <p className="text-sm text-gray-400 py-2 text-center">
                                        No templates available
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => setCreateDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-orange-600 hover:bg-orange-700"
                                onClick={handleStartCreate}
                                disabled={!selectedTemplate}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Continue
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ──── Delete Confirmation Dialog ──── */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Delete Game</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{" "}
                            <strong>&quot;{selectedGame?.name}&quot;</strong>? This cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteGame}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            ) : (
                                <Trash2 className="w-4 h-4 mr-1" />
                            )}
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Host dialog removed — now using HostLobby view */}
        </div>
    );
}
