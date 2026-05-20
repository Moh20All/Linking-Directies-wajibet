"use client";

import type React from "react";
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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Grid3X3,
  Eye,
  Search,
  Package,
  Monitor,
  Armchair,
  FlaskConical,
  Dumbbell,
  Volume2,
  ChefHat,
  Wrench,
  Printer,
  Heart,
  Car,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";


export interface Asset {
  _id: string;
  name: string;
  category: string;
  condition: "excellent" | "good" | "fair" | "poor" | "needs-repair";
  location: string;
  purchaseDate: string;
  purchasePrice: number;
  // currentValue: number;
  status: "active" | "inactive" | "maintenance" | "disposed";
  assignedTo?: string;
  serialNumber?: string;
  notes?: string;
  ownership: "school-owned" | "leased" | "donated" | "borrowed";
}

interface CategoryData {
  name: string;
  assets: Asset[];
  totalValue: number;
  icon: React.ComponentType<{ className?: string }>;
}

export default function AssetCategories({ assets }: { assets: Asset[] }) {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<CategoryData[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { t, isRTL } = useLanguage()


  // Build categories whenever assets change
  useEffect(() => {
    if (assets && assets.length > 0) {
      const categoryMap = new Map<string, Asset[]>();
      assets.forEach((asset: Asset) => {
        if (!categoryMap.has(asset.category)) {
          categoryMap.set(asset.category, []);
        }
        categoryMap.get(asset.category)!.push(asset);
      });

      const categoryData: CategoryData[] = Array.from(categoryMap.entries())
        .map(([name, assets]) => ({
          name,
          assets,
          totalValue: assets.reduce(
            (sum, asset) => sum + asset.purchasePrice,
            0
          ),
          icon: getCategoryIcon(name),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setCategories(categoryData);
      setFilteredCategories(categoryData);
    } else {
      setCategories([]);
      setFilteredCategories([]);
    }
  }, [assets]);

  // Search filter
  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(
        (category) =>
          category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.assets.some((asset) =>
            asset?.name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);

  const getCategoryIcon = (
    categoryName: string
  ): React.ComponentType<{ className?: string }> => {
    const name = categoryName?.toLowerCase();
    if (name.includes("computer") || name.includes("it")) return Monitor;
    if (name.includes("furniture")) return Armchair;
    if (name.includes("laboratory")) return FlaskConical;
    if (name.includes("sports")) return Dumbbell;
    if (name.includes("audio") || name.includes("visual")) return Volume2;
    if (name.includes("kitchen")) return ChefHat;
    if (name.includes("maintenance") || name.includes("tools")) return Wrench;
    if (name.includes("office")) return Printer;
    if (name.includes("medical")) return Heart;
    if (name.includes("transportation")) return Car;
    if (name.includes("books") || name.includes("materials")) return BookOpen;
    return Package;
  };

  const handleViewCategory = (category: CategoryData) => {
    setSelectedCategory(category);
    setIsViewDialogOpen(true);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-orange-100 text-orange-800";
      case "needs-repair":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "disposed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOwnershipColor = (ownership: string) => {
    switch (ownership) {
      case "school-owned":
        return "bg-blue-100 text-blue-800";
      case "leased":
        return "bg-purple-100 text-purple-800";
      case "donated":
        return "bg-green-100 text-green-800";
      case "borrowed":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Grid3X3 className="h-5 w-5" />
            <span>{t.assetCategories} </span>
          </CardTitle>
          <CardDescription>
            {t.assetCategoriesDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t.searchCategoriesAssets}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories Grid */}
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card
                    key={category.name}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleViewCategory(category)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <IconComponent className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {category.name}
                            </CardTitle>
                            <p className="text-sm text-gray-500">
                              {category.assets.length} {t.items}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {t.totalValue}
                          </span>
                          <span className="text-lg font-bold text-blue-600">
                            DZD {category.totalValue.toLocaleString()}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{t.activeLabel} </span>
                            <span className="font-medium">
                              {
                                category.assets.filter(
                                  (a) => a.status === "active"
                                ).length
                              }
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span> {t.schoolOwnedLabel} </span>
                            <span className="font-medium">
                              {
                                category.assets.filter(
                                  (a) => a.ownership === "school-owned"
                                ).length
                              }
                            </span>
                          </div>
                        </div>
                        <div className="border-t pt-3">
                          <p className="text-xs text-gray-500 mb-2">
                            {t.recentItems}
                          </p>
                          <div className="space-y-1">
                            {category.assets.slice(0, 3).map((asset) => (
                              <div
                                key={asset._id}
                                className="text-xs text-gray-600 truncate"
                              >
                                • {asset.name}
                              </div>
                            ))}
                            {category.assets.length > 3 && (
                              <div className="text-xs text-gray-500">
                                +{category.assets.length - 3} {t.moreItems}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Grid3X3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t.noCategories}
              </h3>
              <p className="text-gray-500 mb-4">
                {categories.length === 0
                  ? t.noAssetsYet
                  : t.tryAdjustSearch}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedCategory && (
                <>
                  {(() => {
                    const Icon = selectedCategory.icon;
                    return <Icon className="h-6 w-6" />;
                  })()}
                  <span>{selectedCategory.name} Assets </span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory && (
                <>
                  {selectedCategory.assets.length} {t.categorySummary}
                  {selectedCategory.totalValue.toLocaleString()}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedCategory && (
            <div className="space-y-4">
              {/* Category Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {
                      selectedCategory.assets.filter(
                        (a) => a.status === "active"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">{t.summaryActive} </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {
                      selectedCategory.assets.filter(
                        (a) =>
                          a.condition === "excellent" || a.condition === "good"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">{t.summaryGoodCondition} </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {
                      selectedCategory.assets.filter(
                        (a) =>
                          a.condition === "poor" ||
                          a.condition === "needs-repair"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">{t.summaryNeedAttention} </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      selectedCategory.assets.filter(
                        (a) => a.ownership === "school-owned"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">{t.summarySchoolOwned} </div>
                </div>
              </div>

              {/* Assets List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCategory.assets.map((asset) => (
                  <Card
                    key={asset._id}
                    className="hover:shadow-sm transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">
                          {asset.name}
                        </CardTitle>
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            className={`text-xs ${getConditionColor(
                              asset.condition
                            )}`}
                          >
                            {asset.condition}
                          </Badge>
                          <Badge
                            className={`text-xs ${getStatusColor(
                              asset.status
                            )}`}
                          >
                            {asset.status}
                          </Badge>
                          <Badge
                            className={`text-xs ${getOwnershipColor(
                              asset.ownership
                            )}`}
                          >
                            {asset.ownership}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t.location} </span>
                          <span className="font-medium">{asset.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t.value} </span>
                          <span className="font-medium">
                            DZD {asset.purchasePrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t.purchaseDate} </span>
                          <span className="font-medium">
                            {new Date(asset.purchaseDate).toLocaleDateString()}
                          </span>
                        </div>
                        {asset.assignedTo && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t.assignedTo} </span>
                            <span className="font-medium">
                              {asset.assignedTo}
                            </span>
                          </div>
                        )}
                        {asset.serialNumber && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t.serial} </span>
                            <span className="font-medium font-mono text-xs">
                              #{asset.serialNumber}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
