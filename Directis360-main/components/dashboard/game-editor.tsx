"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Save,
    Loader2,
    Settings,
    FileText,
    AlertCircle,
} from "lucide-react";
import { gamesApi } from "@/services/wajibetService";

// ─── Types ───────────────────────────────────────────────────────────

interface GameEditorProps {
    mode: "create" | "edit";
    gameId?: string;
    templateId?: string;
    onSave: () => void;
    onCancel: () => void;
}

interface FieldSchema {
    label: string;
    type: string;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    default?: any;
    options?: string[];
    multiple?: boolean;
    placeholder?: string;
    rows?: number;
    accept?: string[];
    pattern?: string;
}

interface FormSchema {
    settings: Record<string, FieldSchema>;
    content?: {
        label: string;
        minItems?: number;
        itemSchema: Record<string, FieldSchema>;
    };
}

interface TemplateData {
    _id: string;
    name: string;
    description: string;
    formSchema: FormSchema;
    manifest?: any;
    status: string;
}

// ─── Component ───────────────────────────────────────────────────────

export default function GameEditor({
    mode,
    gameId,
    templateId,
    onSave,
    onCancel,
}: GameEditorProps) {
    const [template, setTemplate] = useState<TemplateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [gameName, setGameName] = useState("");

    // Form state
    const [settingsData, setSettingsData] = useState<Record<string, any>>({});
    const [contentItems, setContentItems] = useState<Record<string, any>[]>([]);
    const [autoMode, setAutoMode] = useState(false);

    // ─── Load data ─────────────────────────────────────────────────

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                if (mode === "edit" && gameId) {
                    // Fetch game creation (includes populated template)
                    const creation = await gamesApi.getGame(gameId);
                    // Fetch full template with formSchema
                    const tmpl = await gamesApi.getTemplateById(
                        creation.template?._id || creation.template
                    );
                    setTemplate(tmpl);
                    setGameName(creation.name || "");
                    setSettingsData(creation.config || {});
                    if (creation.config?.autoGenerate !== undefined) {
                        setAutoMode(!!creation.config.autoGenerate);
                    }
                    if (creation.content && creation.content.length > 0) {
                        setContentItems(creation.content);
                    } else {
                        setContentItems([buildEmptyItem(tmpl.formSchema)]);
                    }
                } else if (mode === "create" && templateId) {
                    const tmpl = await gamesApi.getTemplateById(templateId);
                    setTemplate(tmpl);
                    // Initialize with defaults
                    const defaults: Record<string, any> = {};
                    if (tmpl.formSchema?.settings) {
                        Object.entries(tmpl.formSchema.settings).forEach(
                            ([key, field]: [string, any]) => {
                                if (field.default !== undefined) defaults[key] = field.default;
                            }
                        );
                    }
                    setSettingsData(defaults);
                    setContentItems([buildEmptyItem(tmpl.formSchema)]);
                }
            } catch (err: any) {
                console.error("[GameEditor] Load error:", err);
                setError(
                    err?.response?.data?.message || err?.message || "Failed to load data"
                );
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [mode, gameId, templateId]);

    // ─── Helpers ───────────────────────────────────────────────────

    function buildEmptyItem(schema: FormSchema): Record<string, any> {
        const item: Record<string, any> = {};
        if (schema?.content?.itemSchema) {
            Object.entries(schema.content.itemSchema).forEach(
                ([key, def]: [string, any]) => {
                    if (def.type === "number") item[key] = def.default ?? 0;
                    else if (def.type === "boolean") item[key] = def.default ?? false;
                    else item[key] = def.default ?? "";
                }
            );
        }
        return item;
    }

    // ─── Settings handlers ─────────────────────────────────────────

    const handleSettingsChange = (field: string, value: any) => {
        setSettingsData((prev) => ({ ...prev, [field]: value }));
        if (field === "autoGenerate") {
            setAutoMode(!!value);
        }
    };

    // ─── Content handlers ──────────────────────────────────────────

    const handleContentChange = (index: number, field: string, value: any) => {
        setContentItems((prev) => {
            const items = [...prev];
            items[index] = { ...items[index], [field]: value };
            return items;
        });
    };

    const addContentItem = () => {
        if (!template) return;
        setContentItems((prev) => [...prev, buildEmptyItem(template.formSchema)]);
    };

    const removeContentItem = (index: number) => {
        setContentItems((prev) => prev.filter((_, i) => i !== index));
    };

    // ─── Save ──────────────────────────────────────────────────────

    const handleSave = async () => {
        if (!template) return;
        setSaving(true);
        setError("");

        // Filter empty content items in manual mode
        let finalContent = contentItems;
        if (!autoMode) {
            finalContent = contentItems.filter((item) =>
                Object.values(item).some(
                    (v) => v !== "" && v !== undefined && v !== 0 && v !== false
                )
            );
        } else {
            finalContent = [];
        }

        const payload = {
            template: template._id,
            config: { ...settingsData, autoGenerate: autoMode },
            content: finalContent,
            name: gameName.trim() || undefined,
        };

        try {
            if (mode === "create") {
                await gamesApi.createGame(payload);
            } else if (mode === "edit" && gameId) {
                await gamesApi.updateGame(gameId, payload);
            }
            onSave();
        } catch (err: any) {
            console.error("[GameEditor] Save error:", err);
            setError(
                err?.response?.data?.message || err?.message || "Failed to save"
            );
        } finally {
            setSaving(false);
        }
    };

    // ─── Render: Loading ───────────────────────────────────────────

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <span className="ml-3 text-gray-600">Loading game data...</span>
            </div>
        );
    }

    if (!template) {
        return (
            <div className="text-center py-20">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-600 font-medium">{error || "Template not found"}</p>
                <Button variant="outline" onClick={onCancel} className="mt-4">
                    Go Back
                </Button>
            </div>
        );
    }

    const hasContentSchema = !!template.formSchema?.content;
    const hasAutoSetting = !!template.formSchema?.settings?.autoGenerate;
    const showContentSection = hasContentSchema && (!hasAutoSetting || !autoMode);

    // ─── Render: Editor ────────────────────────────────────────────

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {mode === "create" ? "Create Game" : "Edit Game"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Template: {template.name}
                        </p>
                    </div>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-purple-600 hover:bg-purple-700"
                >
                    {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    {saving ? "Saving..." : "Save Game"}
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {/* Game Name */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-500" />
                        Game Name
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value)}
                        placeholder="Enter a name for your game..."
                        className="text-lg"
                    />
                </CardContent>
            </Card>

            {/* Settings Section */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="h-5 w-5 text-indigo-500" />
                        Game Settings
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-5 md:grid-cols-2">
                        {Object.entries(template.formSchema.settings).map(
                            ([key, field]: [string, any]) => {
                                // Hide questionCount when not in auto mode
                                if (key === "questionCount" && !autoMode) return null;

                                return (
                                    <SettingsField
                                        key={key}
                                        fieldKey={key}
                                        field={field}
                                        value={settingsData[key]}
                                        autoMode={autoMode}
                                        onChange={(val) => handleSettingsChange(key, val)}
                                    />
                                );
                            }
                        )}
                    </div>
                    {hasAutoSetting && (
                        <p className="mt-4 text-xs text-gray-500">
                            <strong>Auto Mode:</strong> System generates questions
                            automatically. <strong>Manual Mode:</strong> Uncheck Auto Generate
                            to enter your own content below.
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Content Section */}
            {showContentSection && (
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-green-500" />
                                {template.formSchema.content!.label || "Content Items"}
                                <Badge variant="secondary" className="ml-2">
                                    {contentItems.length} items
                                </Badge>
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={addContentItem}
                                className="gap-1"
                            >
                                <Plus className="h-4 w-4" />
                                Add Item
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {contentItems.map((item, index) => (
                            <ContentItemCard
                                key={index}
                                index={index}
                                item={item}
                                itemSchema={template.formSchema.content!.itemSchema}
                                canRemove={contentItems.length > 1}
                                onChange={handleContentChange}
                                onRemove={removeContentItem}
                            />
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Bottom Save Bar */}
            <div className="flex justify-between items-center pt-4 border-t">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-purple-600 hover:bg-purple-700"
                >
                    {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    {saving ? "Saving..." : "Save Game"}
                </Button>
            </div>
        </div>
    );
}

// ─── SettingsField Sub-Component ─────────────────────────────────────

function SettingsField({
    fieldKey,
    field,
    value,
    autoMode,
    onChange,
}: {
    fieldKey: string;
    field: FieldSchema;
    value: any;
    autoMode: boolean;
    onChange: (val: any) => void;
}) {
    // AutoGenerate toggle
    if (fieldKey === "autoGenerate") {
        return (
            <div className="flex items-center gap-3 col-span-2">
                <Switch
                    id="auto-generate"
                    checked={!!autoMode}
                    onCheckedChange={(checked) => onChange(checked)}
                />
                <Label htmlFor="auto-generate" className="font-medium">
                    {field.label}
                </Label>
            </div>
        );
    }

    // Boolean
    if (field.type === "boolean") {
        return (
            <div className="flex items-center gap-3">
                <Switch
                    id={`setting-${fieldKey}`}
                    checked={!!value}
                    onCheckedChange={(checked) => onChange(checked)}
                />
                <Label htmlFor={`setting-${fieldKey}`}>{field.label}</Label>
            </div>
        );
    }

    // Enum / Select
    if (field.type === "enum" || field.type === "select") {
        const isMultiple = Array.isArray(field.default) || field.multiple === true;
        if (isMultiple) {
            const currentArr = Array.isArray(value) ? value : [];
            return (
                <div>
                    <Label className="mb-2 block">{field.label}</Label>
                    <div className="flex flex-wrap gap-2">
                        {(field.options || []).map((opt) => {
                            const active = currentArr.includes(opt);
                            return (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                        const next = active
                                            ? currentArr.filter((o: string) => o !== opt)
                                            : [...currentArr, opt];
                                        onChange(next);
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${active
                                            ? "bg-purple-600 text-white border-purple-600"
                                            : "bg-white text-gray-600 border-gray-300 hover:border-purple-300"
                                        }`}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        }
        return (
            <div>
                <Label className="mb-2 block">{field.label}</Label>
                <Select value={value || ""} onValueChange={onChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose..." />
                    </SelectTrigger>
                    <SelectContent>
                        {(field.options || []).map((opt) => (
                            <SelectItem key={opt} value={opt}>
                                {opt}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    }

    // Textarea
    if (field.type === "textarea") {
        return (
            <div className="col-span-2">
                <Label className="mb-2 block">{field.label}</Label>
                <Textarea
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    rows={field.rows || 4}
                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                />
            </div>
        );
    }

    // Number
    if (field.type === "number") {
        return (
            <div>
                <Label className="mb-2 block">{field.label}</Label>
                <Input
                    type="number"
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                />
            </div>
        );
    }

    // Range / Slider
    if (field.type === "range") {
        const v = value ?? field.default ?? field.min ?? 0;
        return (
            <div>
                <Label className="mb-2 block">
                    {field.label}:{" "}
                    <span className="font-bold text-purple-600">{v}</span>
                </Label>
                <input
                    type="range"
                    value={v}
                    onChange={(e) => onChange(Number(e.target.value))}
                    min={field.min ?? 0}
                    max={field.max ?? 100}
                    step={field.step ?? 1}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
            </div>
        );
    }

    // Color
    if (field.type === "color") {
        return (
            <div>
                <Label className="mb-2 block">{field.label}</Label>
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={value || "#000000"}
                        onChange={(e) => onChange(e.target.value)}
                        className="h-10 w-16 rounded border border-gray-200 cursor-pointer"
                    />
                    <Input
                        value={value || "#000000"}
                        onChange={(e) => onChange(e.target.value)}
                        className="font-mono text-sm"
                        placeholder="#000000"
                    />
                </div>
            </div>
        );
    }

    // Date / datetime / time
    if (
        ["date", "datetime-local", "datetime", "time", "month", "week"].includes(
            field.type
        )
    ) {
        const inputType =
            field.type === "datetime" ? "datetime-local" : field.type;
        return (
            <div>
                <Label className="mb-2 block">{field.label}</Label>
                <Input
                    type={inputType}
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    min={field.min as any}
                    max={field.max as any}
                />
            </div>
        );
    }

    // Default: text input
    return (
        <div>
            <Label className="mb-2 block">{field.label}</Label>
            <Input
                type="text"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            />
        </div>
    );
}

// ─── ContentItemCard Sub-Component ───────────────────────────────────

function ContentItemCard({
    index,
    item,
    itemSchema,
    canRemove,
    onChange,
    onRemove,
}: {
    index: number;
    item: Record<string, any>;
    itemSchema: Record<string, FieldSchema>;
    canRemove: boolean;
    onChange: (index: number, field: string, value: any) => void;
    onRemove: (index: number) => void;
}) {
    return (
        <div className="border rounded-lg p-4 bg-gray-50/50">
            {/* Item Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-purple-700">
                            {index + 1}
                        </span>
                    </div>
                    <span className="font-medium text-gray-700 text-sm">
                        Item {index + 1}
                    </span>
                </div>
                {canRemove && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(index)}
                        className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Item Fields */}
            <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(itemSchema).map(([key, field]: [string, any]) => {
                    // Image / imageArray - show placeholder (uploads not supported across federation)
                    if (field.type === "image" || field.type === "imageArray") {
                        return (
                            <div key={key}>
                                <Label className="mb-2 block text-sm">{field.label}</Label>
                                <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-400 text-xs">
                                    Image upload not available in this view.
                                    <br />
                                    Use Wajibet directly to add images.
                                </div>
                            </div>
                        );
                    }

                    // Enum / Select
                    if (
                        (field.type === "enum" || field.type === "select") &&
                        Array.isArray(field.options)
                    ) {
                        return (
                            <div key={key}>
                                <Label className="mb-2 block text-sm">{field.label}</Label>
                                <Select
                                    value={item[key] || ""}
                                    onValueChange={(val) => onChange(index, key, val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options.map((opt: string) => (
                                            <SelectItem key={opt} value={opt}>
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        );
                    }

                    // Boolean
                    if (field.type === "boolean") {
                        return (
                            <div key={key} className="flex items-center gap-2">
                                <Switch
                                    checked={!!item[key]}
                                    onCheckedChange={(checked) => onChange(index, key, checked)}
                                />
                                <Label className="text-sm">{field.label}</Label>
                            </div>
                        );
                    }

                    // Textarea
                    if (field.type === "textarea") {
                        return (
                            <div key={key} className="col-span-2">
                                <Label className="mb-2 block text-sm">{field.label}</Label>
                                <Textarea
                                    value={item[key] || ""}
                                    onChange={(e) => onChange(index, key, e.target.value)}
                                    rows={field.rows || 3}
                                    placeholder={
                                        field.placeholder ||
                                        `Enter ${field.label.toLowerCase()}`
                                    }
                                />
                            </div>
                        );
                    }

                    // Number
                    if (field.type === "number") {
                        return (
                            <div key={key}>
                                <Label className="mb-2 block text-sm">{field.label}</Label>
                                <Input
                                    type="number"
                                    value={item[key] ?? ""}
                                    onChange={(e) => onChange(index, key, e.target.value)}
                                    min={field.min}
                                    max={field.max}
                                    step={field.step}
                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                />
                            </div>
                        );
                    }

                    // Default: text
                    return (
                        <div key={key}>
                            <Label className="mb-2 block text-sm">{field.label}</Label>
                            <Input
                                type="text"
                                value={item[key] || ""}
                                onChange={(e) => onChange(index, key, e.target.value)}
                                placeholder={
                                    field.placeholder ||
                                    `Enter ${field.label.toLowerCase()}`
                                }
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
