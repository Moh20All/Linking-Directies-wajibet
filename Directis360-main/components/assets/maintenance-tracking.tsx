"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Wrench,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  ClipboardList,
} from "lucide-react";
import {
  Asset,
  MaintenanceRecord,
  MaintenancePayload,
  createMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
} from "@/services/assetService";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/language-context";


interface MaintenanceTrackingProps {
  assets: Asset[];
  maintenanceRecords: MaintenanceRecord[];
  setMaintenanceRecords: React.Dispatch<
    React.SetStateAction<MaintenanceRecord[]>
  >;
}

export default function MaintenanceTracking({
  assets,
  maintenanceRecords,
  setMaintenanceRecords,
}: MaintenanceTrackingProps) {
  const { getFreshToken } = useAuth();
  const { t, isRTL } = useLanguage();
  const [filteredRecords, setFilteredRecords] = useState<MaintenanceRecord[]>(
    []
  );
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    priority: "all",
  });
  const [dialogOpen, setDialogOpen] = useState<"add" | "edit" | null>(null);
  const [editingRecord, setEditingRecord] =
    useState<Partial<MaintenanceRecord> | null>(null);

  useEffect(() => {
    let results = maintenanceRecords;
    if (filters.status !== "all") {
      results = results.filter((r) => r.status === filters.status);
    }
    if (filters.type !== "all") {
      results = results.filter((r) => r.type === filters.type);
    }
    if (filters.priority !== "all") {
      results = results.filter((r) => r.priority === filters.priority);
    }
    setFilteredRecords(results);
  }, [filters, maintenanceRecords]);

  const handleSave = async () => {
    if (!editingRecord) return;

    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Not authenticated");

      const payload = { ...editingRecord };
      console.log("schedle maintenance : ", payload);

      if (editingRecord._id) {
        const updated = await updateMaintenanceRecord(
          token,
          editingRecord._id,
          payload
        );
        setMaintenanceRecords((prev) =>
          prev.map((r) => (r._id === updated._id ? updated : r))
        );
      } else {
        const newRecord = await createMaintenanceRecord(
          token,
          payload as MaintenancePayload
        );
        setMaintenanceRecords((prev) => [...prev, newRecord]);
      }
      setDialogOpen(null);
    } catch (error) {
      console.error("Failed to save maintenance record:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t.sm_clear_dialog_title)) {
      try {
        const token = await getFreshToken();
        if (!token) throw new Error("Not authenticated");
        await deleteMaintenanceRecord(token, id);
        setMaintenanceRecords((prev) => prev.filter((r) => r._id !== id));
      } catch (error) {
        console.error("Failed to delete maintenance record:", error);
      }
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "scheduled":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <Clock className="h-4 w-4 mr-1" />,
        };
      case "in-progress":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <Wrench className="h-4 w-4 mr-1" />,
        };
      case "completed":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
        };
      case "overdue":
        return {
          color: "bg-red-100 text-red-800",
          icon: <AlertTriangle className="h-4 w-4 mr-1" />,
        };
      default:
        return { color: "bg-gray-100 text-gray-800", icon: null };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case "urgent":
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                <span>{t.maint_title}</span>
              </CardTitle>
              <CardDescription>
                {t.maint_desc}
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                setEditingRecord({});
                setDialogOpen("add");
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> {t.maint_new_btn}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Select
              value={filters.status}
              onValueChange={(v) => setFilters((f) => ({ ...f, status: v }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t.maint_filters_status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.maint_status_all} </SelectItem>
                <SelectItem value="scheduled">{t.maint_status_scheduled} </SelectItem>
                <SelectItem value="in-progress">{t.maint_status_inprogress} </SelectItem>
                <SelectItem value="completed">{t.maint_status_completed} </SelectItem>
                <SelectItem value="overdue">{t.maint_status_overdue} </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.type}
              onValueChange={(v) => setFilters((f) => ({ ...f, type: v }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t.maint_filters_type} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.maint_type_all} </SelectItem>
                <SelectItem value="routine">{t.maint_type_routine} </SelectItem>
                <SelectItem value="repair">{t.maint_type_repair} </SelectItem>
                <SelectItem value="inspection">{t.maint_type_inspection} </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.priority}
              onValueChange={(v) => setFilters((f) => ({ ...f, priority: v }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t.maint_filters_priority} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.maint_priority_all} </SelectItem>
                <SelectItem value="low">{t.maint_priority_low} </SelectItem>
                <SelectItem value="medium">{t.maint_priority_medium} </SelectItem>
                <SelectItem value="high">{t.maint_priority_high} </SelectItem>
                <SelectItem value="urgent">{t.maint_priority_urgent} </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Records Grid */}
          {filteredRecords.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              {t.maint_no_records}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecords.map((record) => {
                const status = getStatusStyle(record.status);
                return (
                  <Card
                    key={record._id}
                    className="hover:shadow-lg transition-all"
                  >
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          {record.assetId.name}
                        </span>
                        <Badge className={`${status.color} flex items-center`}>
                          {status.icon}
                          {record.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex justify-between items-center">
                        <span>
                          <Calendar className="h-4 w-4 inline-block mr-1" />
                          {new Date(record.scheduledDate).toLocaleDateString()}
                        </span>
                        {getPriorityBadge(record.priority)}
                      </CardDescription>
                      <CardDescription className="flex justify-end items-center">
                        <Badge className={`${status.color} flex items-center`}>
                          {status.icon}
                          {record.status}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {record.description}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingRecord(record);
                            setDialogOpen("edit");
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" /> {t.maint_btn_edit}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(record._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> {t.maint_btn_delete}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen === "add" || dialogOpen === "edit"}
        onOpenChange={() => setDialogOpen(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              {dialogOpen === "add"
                ? t.maint_schedule_title
                : t.maint_edit_title}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label>{t.maint_asset_label}</Label>
              <Select
                value={editingRecord?.assetId || ""}
                onValueChange={(v) =>
                  setEditingRecord((r) => ({ ...r, assetId: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.maint_asset_placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((a) => (
                    <SelectItem key={a._id} value={a._id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t.maint_date_label}</Label>
              <Input
                type="date"
                value={
                  editingRecord?.scheduledDate?.toString().split("T")[0] || ""
                }
                onChange={(e) =>
                  setEditingRecord((r) => ({
                    ...r,
                    scheduledDate: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>{t.maint_type_label}</Label>
              <Select
                value={editingRecord?.type || ""}
                onValueChange={(v) =>
                  setEditingRecord((r) => ({ ...r, type: v as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.maint_type_placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">{t.maint_type_routine} </SelectItem>
                  <SelectItem value="repair">{t.maint_type_repair} </SelectItem>
                  <SelectItem value="inspection">{t.maint_type_inspection} </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t.maint_priority_label}</Label>
              <Select
                value={editingRecord?.priority || ""}
                onValueChange={(v) =>
                  setEditingRecord((r) => ({ ...r, priority: v as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.maint_priority_placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t.maint_priority_low} </SelectItem>
                  <SelectItem value="medium">{t.maint_priority_medium} </SelectItem>
                  <SelectItem value="high">{t.maint_priority_high} </SelectItem>
                  <SelectItem value="urgent">{t.maint_priority_urgent} </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>{t.maint_description_label}</Label>
              <Textarea
                placeholder={t.maint_description_placeholder}
                value={editingRecord?.description || ""}
                onChange={(e) =>
                  setEditingRecord((r) => ({
                    ...r,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(null)}>
              {t.maint_btn_cancel}
            </Button>
            <Button onClick={handleSave}>{t.maint_btn_save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
