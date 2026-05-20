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
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { Package, Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Asset,
  AssetPayload,
  updateAsset,
  deleteAsset,
  createAsset,
} from "@/services/assetService";
import { useLanguage } from "@/context/language-context";

interface InventoryManagementProps {
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  fetchData: () => void;
}

export default function InventoryManagement({
  fetchData,
  assets,
  setAssets,
}: InventoryManagementProps) {
  const { getFreshToken } = useAuth();
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    condition: "all",
    status: "all",
  });
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [dialogOpen, setDialogOpen] = useState<"view" | "edit" | "add" | null>(
    null
  );
  const [editingAsset, setEditingAsset] = useState<Partial<Asset> | null>(null);
  const { t, isRTL } = useLanguage()

  useEffect(() => {
    if (assets) {
      let results = assets.filter(
        (asset) =>
          asset?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset?.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filters.category !== "all") {
        results = results.filter(
          (asset) => asset.category === filters.category
        );
      }
      if (filters.condition !== "all") {
        results = results.filter(
          (asset) => asset.condition === filters.condition
        );
      }
      if (filters.status !== "all") {
        results = results.filter((asset) => asset.status === filters.status);
      }

      setFilteredAssets(results);
    }
  }, [searchTerm, filters, assets]);

  // Predefined categories
  const predefinedCategories = [
    "Furniture",
    "Electronics",
    "Vehicles",
    "Books",
    "Sports Equipment",
    "Lab Equipment",
    "IT Hardware",
    "Musical Instruments",
  ];

  const handleSave = async () => {
    if (!editingAsset) return;

    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Not authenticated");

      if (editingAsset._id) {
        const updated = await updateAsset(
          token,
          editingAsset._id,
          editingAsset
        );
        setAssets((prev) =>
          prev.map((a) => (a._id === updated._id ? updated : a))
        );
      } else {
        const newAsset = await createAsset(token, editingAsset as AssetPayload);
        setAssets((prev) => [...prev, newAsset]);
      }
      setDialogOpen(null);
    } catch (error) {
      console.error("Failed to save asset:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t.confirm_delete_asset)) {
      try {
        const token = await getFreshToken();
        if (!token) throw new Error("Not authenticated");
        await deleteAsset(token, id);
        setAssets((prev) => prev.filter((a) => a._id !== id));
      } catch (error) {
        console.error("Failed to delete asset:", error);
      }
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-green-100 text-green-700";
      case "good":
        return "bg-blue-100 text-blue-700";
      case "fair":
        return "bg-yellow-100 text-yellow-700";
      case "poor":
        return "bg-orange-100 text-orange-700";
      case "needs-repair":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t.inventory_title}
              </CardTitle>
              <CardDescription>
                {t.inventory_description}
              </CardDescription>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                variant={"outline"}
                onClick={() => {
                  fetchData();
                }}
              >
                {t.refresh}
              </Button>
              <Button
                onClick={() => {
                  setEditingAsset({});
                  setDialogOpen("add");
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> {t.add_asset}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Toolbar */}
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t.search_assets}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-60"
              />
            </div>

            <Select
              value={filters.category}
              onValueChange={(v) => setFilters((f) => ({ ...f, category: v }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t.asset_category} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all_categories}</SelectItem>
                {predefinedCategories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.condition}
              onValueChange={(v) => setFilters((f) => ({ ...f, condition: v }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t.asset_condition} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all_conditions}</SelectItem>
                <SelectItem value="excellent">{t.conditionExcellent} </SelectItem>
                <SelectItem value="good">{t.conditionGood} </SelectItem>
                <SelectItem value="fair">{t.conditionFair} </SelectItem>
                <SelectItem value="poor">{t.conditionPoor} </SelectItem>
                <SelectItem value="needs-repair">{t.conditionNeedsRepair} </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(v) => setFilters((f) => ({ ...f, status: v }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t.asset_status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all_statuses}</SelectItem>
                <SelectItem value="active">{t.statusActive} </SelectItem>
                <SelectItem value="inactive">{t.statusInactive} </SelectItem>
                <SelectItem value="maintenance">{t.statusMaintenance} </SelectItem>
                <SelectItem value="disposed">{t.statusDisposed} </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assets Grid */}
          {filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Package className="h-10 w-10 mb-2" />
              <p>{t.no_assets_found} {t.try_adjusting_filters}</p>
            </div>
          ) : (
            assets && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAssets.map((asset) => (
                  <Card key={asset._id} className="transition hover:shadow-lg">
                    <CardHeader className="flex flex-row justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-semibold">
                          {asset.name}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {asset.category} • {asset.location}
                        </CardDescription>
                      </div>
                      <Badge className={getConditionColor(asset.condition)}>
                        {asset.condition}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-1">
                        {t.value} DZD {asset?.purchasePrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        S/N: {asset.serialNumber || "N/A"}
                      </p>
                      <div className="mt-4 flex gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAsset(asset);
                            setDialogOpen("view");
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" /> {t.view}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingAsset(asset);
                            setDialogOpen("edit");
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" /> {t.edit}
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(asset._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> {t.delete}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog
        open={dialogOpen === "view"}
        onOpenChange={() => setDialogOpen(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedAsset?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <p>
              <strong>{t.asset_details_category}:</strong> {selectedAsset?.category}
            </p>
            <p>
              <strong>{t.asset_details_location}:</strong> {selectedAsset?.location}
            </p>
            <p>
              <strong>{t.asset_details_serial}:</strong> {selectedAsset?.serialNumber}
            </p>
            <p>
              <strong>{t.asset_details_purchase_date}:</strong>{" "}
              {selectedAsset?.purchaseDate.split("T")[0]}
            </p>
            <p>
              <strong>{t.asset_details_purchase_price}:</strong> ${selectedAsset?.purchasePrice}
            </p>
            <div>
              <strong>{t.asset_details_ownership}:</strong>{" "}
              <Badge>{selectedAsset?.ownership}</Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen === "add" || dialogOpen === "edit"}
        onOpenChange={() => setDialogOpen(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogOpen === "add" ? t.add_new_asset : "edit"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <Label>{t.asset_name}</Label>
              <Input
                placeholder={t.asset_name}
                value={editingAsset?.name || ""}
                onChange={(e) =>
                  setEditingAsset((a) => ({ ...a, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>{t.asset_category}</Label>
              <Select
                value={editingAsset?.category || ""}
                onValueChange={(v) =>
                  setEditingAsset((a) => ({ ...a, category: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.assetAdd_phSelectCategory} />
                </SelectTrigger>
                <SelectContent>
                  {predefinedCategories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t.asset_location}</Label>
              <Input
                placeholder={t.location}
                value={editingAsset?.location || ""}
                onChange={(e) =>
                  setEditingAsset((a) => ({ ...a, location: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>{t.asset_serial_number}</Label>
              <Input
                placeholder={t.asset_serial_number}
                value={editingAsset?.serialNumber || ""}
                onChange={(e) =>
                  setEditingAsset((a) => ({
                    ...a,
                    serialNumber: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>{t.asset_purchase_date}</Label>
              <Input
                type="date"
                value={
                  editingAsset?.purchaseDate?.toString().split("T")[0] || ""
                }
                onChange={(e) =>
                  setEditingAsset((a) => ({
                    ...a,
                    purchaseDate: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>{t.asset_purchase_price}</Label>
              <Input
                type="number"
                placeholder="0"
                value={editingAsset?.purchasePrice || ""}
                onChange={(e) =>
                  setEditingAsset((a) => ({
                    ...a,
                    purchasePrice: parseFloat(e.target.value),
                  }))
                }
              />
            </div>
            {/* <div>
              <Label>Current Value</Label>
              <Input
                type="number"
                placeholder="0"
                value={editingAsset?.currentValue || ""}
                onChange={(e) =>
                  setEditingAsset((a) => ({
                    ...a,
                    currentValue: parseFloat(e.target.value),
                  }))
                }
              />
            </div> */}
            <div>
              <Label>{t.asset_condition}</Label>
              <Select
                value={editingAsset?.condition || ""}
                onValueChange={(v) =>
                  setEditingAsset((a) => ({ ...a, condition: v as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.search_assets_details_condition} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">{t.condition_excellent} </SelectItem>
                  <SelectItem value="good">{t.condition_good} </SelectItem>
                  <SelectItem value="fair">{t.condition_fair} </SelectItem>
                  <SelectItem value="poor">{t.condition_poor} </SelectItem>
                  <SelectItem value="needs-repair">{t.condition_needs_repair} </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t.asset_status}</Label>
              <Select
                value={editingAsset?.status || ""}
                onValueChange={(v) =>
                  setEditingAsset((a) => ({ ...a, status: v as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.search_assets_details_status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t.status_active} </SelectItem>
                  <SelectItem value="inactive">{t.status_inactive} </SelectItem>
                  <SelectItem value="maintenance">{t.status_maintenance} </SelectItem>
                  <SelectItem value="disposed">{t.status_disposed} </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t.asset_details_ownership} </Label>
              <Select
                value={editingAsset?.ownership || ""}
                onValueChange={(v) =>
                  setEditingAsset((a) => ({ ...a, ownership: v as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.asset_ownership}/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="school-owned">{t.ownership_school_owned} </SelectItem>
                  <SelectItem value="leased">{t.ownership_leased} </SelectItem>
                  <SelectItem value="donated">{t.ownership_donated} </SelectItem>
                  <SelectItem value="borrowed">{t.ownership_borrowed} </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(null)}>
              {t.cancel}
            </Button>
            <Button onClick={handleSave}>{t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
