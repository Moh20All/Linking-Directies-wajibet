"use client";

import type React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Package, DollarSign, Hash, Info, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Asset, AssetPayload, createAsset } from "@/services/assetService";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/language-context";


interface AddAssetProps {
  onAssetAdded: (newAsset: Asset) => void;
}

const assetCategories = [
  "Mobilier Scolaire (Bureaux, Chaises, Tableaux)",
  "Équipement Informatique (Ordinateurs, Imprimantes, Projecteurs)",
  "Matériel de Laboratoire (Microscopes, Verrerie)",
  "Équipement Sportif (Ballons, Filets, Tapis)",
  "Audiovisuel (Télévisions, Caméras, Haut-parleurs)",
  "Instruments de Musique",
  "Livres et Manuels Scolaires",
  "Équipement de Cantine/Cuisine",
  "Outils de Maintenance",
  "Véhicules de Service",
  "Équipement de Sécurité (Extincteurs, Trousse de secours)",
  "Autre",
];

const locations = [
  "Bureau Principal",
  "Salle des Professeurs",
  "Salle d'Informatique",
  "Bibliothèque",
  "Gymnase",
  "Laboratoire de Sciences",
  "Salle d'Art",
  "Salle de Musique",
  "Cantine",
  "Magasin de Stockage",
  "Salle de Maintenance",
  "Salle de Classe 101",
  "Salle de Classe 102",
  "Salle de Classe 201",
  "Extérieur/Cour",
];

export default function AddAsset({ onAssetAdded }: AddAssetProps) {
  const { getFreshToken } = useAuth();
  const [open, setOpen] = useState(false);
  const { t, isRTL } = useLanguage()

  const [formData, setFormData] = useState<Partial<AssetPayload>>({
    name: "",
    category: "",
    location: "",
    condition: "excellent",
    status: "available",
    ownership: "school-owned",
    purchasePrice: 0,
    currentValue: 0,
  });
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    field: keyof AssetPayload,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      location: "",
      condition: "excellent",
      status: "available",
      ownership: "school-owned",
      purchasePrice: 0,
      currentValue: 0,
      serialNumber: "",
      purchaseDate: "",
      description: "",
    });
    setQuantity(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication Failed.");

      for (let i = 0; i < quantity; i++) {
        const payload: Partial<AssetPayload> = {
          ...formData,
          name: quantity > 1 ? `${formData.name} #${i + 1}` : formData.name,
          serialNumber:
            formData.serialNumber && quantity > 1
              ? `${formData.serialNumber}-${i + 1}`
              : formData.serialNumber,
          currentValue: formData.purchasePrice, // Initial current value is purchase price
        };
        const newAsset = await createAsset(token, payload);
        onAssetAdded(newAsset);
      }

      toast.success(
        `Successfully added ${quantity} asset${quantity > 1 ? "s" : ""}!`
      );
      resetForm();
      setOpen(false);
    } catch (err) {
      console.error("Error adding asset:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : t.assetAdd_toastErrorFallback
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCost =
    formData.purchasePrice && quantity > 0
      ? (formData.purchasePrice * quantity).toFixed(2)
      : null;

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        {t.addAsset}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{t.addNewAssets} </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {t.addAssetsDesc}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" /> {t.essentialInfo}
                </CardTitle>
                <CardDescription>
                  {t.essentialInfoDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.assetName} </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder={t.assetAdd_phName}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.category} </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => handleInputChange("category", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.assetAdd_phSelectCategory}/>
                      </SelectTrigger>
                      <SelectContent>
                        {assetCategories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t.location} </Label>
                    <Select
                      value={formData.location}
                      onValueChange={(v) => handleInputChange("location", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.assetAdd_phSelectLocation}/>
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">{t.quantity} </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max="999"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Number.parseInt(e.target.value) || 1)
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t.ownership} </Label>
                  <Select
                    value={formData.ownership}
                    onValueChange={(v) => handleInputChange("ownership", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="school-owned">{t.ownershipSchool} </SelectItem>
                      <SelectItem value="leased">{t.ownershipLeased} </SelectItem>
                      <SelectItem value="donated"> {t.ownershipDonated} </SelectItem>
                      <SelectItem value="borrowed"> {t.ownershipBorrowed} </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {quantity > 1 && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong> {t.multipleAssetsLabel} </strong> {quantity} {t.multipleAssetsDesc} (e.g. "{formData.name}{" "}
                      #1").
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-5 h-5" /> {t.optionalDetails}
                </CardTitle>
                <CardDescription>
                  {t.optionalDetailsDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serialNumber">{t.serialNumber} </Label>
                    <Input
                      id="serialNumber"
                      value={formData.serialNumber || ""}
                      onChange={(e) =>
                        handleInputChange("serialNumber", e.target.value)
                      }
                      placeholder="e.g., SN00123AD"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">{t.purchaseDate} </Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={formData.purchaseDate || ""}
                      onChange={(e) =>
                        handleInputChange("purchaseDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">
                      {t.purchasePrice}
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="purchasePrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.purchasePrice}
                        onChange={(e) =>
                          handleInputChange("purchasePrice", e.target.value)
                        }
                        placeholder="15000.00"
                        className="pl-10"
                      />
                    </div>
                    {totalCost && (
                      <p className="text-sm text-gray-600 mt-1">
                         {t.totalCost} {totalCost} DZD
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{t.description} </Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="e.g., Modèle i5, 8GB RAM, 256GB SSD"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                {t.cancel}
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.name ||
                  !formData.category ||
                  !formData.location
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t.adding}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" /> Add{" "}
                    {quantity > 1 ? `${quantity} Assets` : "Asset"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
