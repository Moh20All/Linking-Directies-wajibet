"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Settings, Plus, Edit, Trash2, Download, Upload, AlertTriangle, CheckCircle, Save } from "lucide-react"
import { useLanguage } from "@/context/language-context";


interface AssetCategory {
  id: string
  name: string
  description: string
  depreciationRate: number
  maintenanceInterval: number // in months
  isActive: boolean
}

interface AssetsSettings {
  defaultDepreciationRate: number
  maintenanceReminderDays: number
  autoUpdateAssetValues: boolean
  enableMaintenanceAlerts: boolean
  enableLowValueAssetTracking: boolean
  lowValueThreshold: number
  enableBarcodeScanning: boolean
  defaultMaintenanceInterval: number
  enableAssetTransfers: boolean
  requireApprovalForDisposal: boolean
}

export default function AssetsSettings() {
  const [categories, setCategories] = useState<AssetCategory[]>([])
  const [settings, setSettings] = useState<AssetsSettings>({
    defaultDepreciationRate: 10,
    maintenanceReminderDays: 7,
    autoUpdateAssetValues: true,
    enableMaintenanceAlerts: true,
    enableLowValueAssetTracking: false,
    lowValueThreshold: 100,
    enableBarcodeScanning: false,
    defaultMaintenanceInterval: 12,
    enableAssetTransfers: true,
    requireApprovalForDisposal: true,
  })
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<AssetCategory | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    depreciationRate: 10,
    maintenanceInterval: 12,
  })
  const { t, isRTL } = useLanguage()


  useEffect(() => {
    // Load settings and categories from localStorage
    const savedSettings = localStorage.getItem("assets-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    const savedCategories = localStorage.getItem("asset-categories")
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    } else {
      // Initialize with default categories
      const defaultCategories: AssetCategory[] = [
        {
          id: "1",
          name: "Computers & IT",
          description: "Computers, laptops, servers, networking equipment",
          depreciationRate: 20,
          maintenanceInterval: 6,
          isActive: true,
        },
        {
          id: "2",
          name: "Furniture",
          description: "Desks, chairs, cabinets, storage",
          depreciationRate: 5,
          maintenanceInterval: 24,
          isActive: true,
        },
        {
          id: "3",
          name: "Laboratory Equipment",
          description: "Scientific instruments, lab tools",
          depreciationRate: 10,
          maintenanceInterval: 12,
          isActive: true,
        },
        {
          id: "4",
          name: "Audio/Visual",
          description: "Projectors, speakers, cameras, displays",
          depreciationRate: 15,
          maintenanceInterval: 12,
          isActive: true,
        },
      ]
      setCategories(defaultCategories)
      localStorage.setItem("asset-categories", JSON.stringify(defaultCategories))
    }
  }, [])

  const saveSettings = () => {
    localStorage.setItem("assets-settings", JSON.stringify(settings))
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const saveCategories = (updatedCategories: AssetCategory[]) => {
    setCategories(updatedCategories)
    localStorage.setItem("asset-categories", JSON.stringify(updatedCategories))
  }

  const handleAddCategory = () => {
    if (!newCategory.name) {
      alert(t.alertEnterCategoryName)
      return
    }

    const category: AssetCategory = {
      id: Date.now().toString(),
      name: newCategory.name,
      description: newCategory.description,
      depreciationRate: newCategory.depreciationRate,
      maintenanceInterval: newCategory.maintenanceInterval,
      isActive: true,
    }

    const updatedCategories = [...categories, category]
    saveCategories(updatedCategories)

    setNewCategory({
      name: "",
      description: "",
      depreciationRate: 10,
      maintenanceInterval: 12,
    })
    setIsAddCategoryOpen(false)
  }

  const handleEditCategory = (category: AssetCategory) => {
    setEditingCategory({ ...category })
    setIsEditCategoryOpen(true)
  }

  const handleSaveEditCategory = () => {
    if (!editingCategory) return

    const updatedCategories = categories.map((cat) => (cat.id === editingCategory.id ? editingCategory : cat))
    saveCategories(updatedCategories)
    setIsEditCategoryOpen(false)
    setEditingCategory(null)
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm(t.alertDeleteCategoryConfirm)) {
      const updatedCategories = categories.filter((cat) => cat.id !== categoryId)
      saveCategories(updatedCategories)
    }
  }

  const handleToggleCategoryStatus = (categoryId: string) => {
    const updatedCategories = categories.map((cat) =>
      cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat,
    )
    saveCategories(updatedCategories)
  }

  const exportData = () => {
    const assets = JSON.parse(localStorage.getItem("school-assets") || "[]")
    const maintenance = JSON.parse(localStorage.getItem("school-maintenance") || "[]")

    const exportData = {
      assets,
      maintenance,
      categories,
      settings,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `assets-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        if (data.assets) localStorage.setItem("school-assets", JSON.stringify(data.assets))
        if (data.maintenance) localStorage.setItem("school-maintenance", JSON.stringify(data.maintenance))
        if (data.categories) {
          setCategories(data.categories)
          localStorage.setItem("asset-categories", JSON.stringify(data.categories))
        }
        if (data.settings) {
          setSettings(data.settings)
          localStorage.setItem("assets-settings", JSON.stringify(data.settings))
        }

        alert(t.alertImportSuccess)
      } catch (error) {
        alert(t.alertImportError)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      {showSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">{t.settingsSaved} </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>{t.generalSettings} </span>
          </CardTitle>
          <CardDescription>{t.generalSettingsDesc} </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="depreciation-rate">{t.defaultDepRate} </Label>
              <Input
                id="depreciation-rate"
                type="number"
                min="0"
                max="100"
                value={settings.defaultDepreciationRate}
                onChange={(e) =>
                  setSettings({ ...settings, defaultDepreciationRate: Number.parseFloat(e.target.value) || 0 })
                }
              />
              <p className="text-xs text-gray-500 mt-1">{t.annualDepRateHint} </p>
            </div>

            <div>
              <Label htmlFor="maintenance-reminder">{t.maintenanceReminder} </Label>
              <Input
                id="maintenance-reminder"
                type="number"
                min="1"
                value={settings.maintenanceReminderDays}
                onChange={(e) =>
                  setSettings({ ...settings, maintenanceReminderDays: Number.parseInt(e.target.value) || 7 })
                }
              />
              <p className="text-xs text-gray-500 mt-1">{t.maintenanceReminderHint} </p>
            </div>

            <div>
              <Label htmlFor="low-value-threshold">{t.lowValueThreshold} </Label>
              <Input
                id="low-value-threshold"
                type="number"
                min="0"
                value={settings.lowValueThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, lowValueThreshold: Number.parseFloat(e.target.value) || 0 })
                }
              />
              <p className="text-xs text-gray-500 mt-1">{t.lowValueThresholdHint} </p>
            </div>

            <div>
              <Label htmlFor="maintenance-interval">{t.defaultMaintenanceInterval} </Label>
              <Input
                id="maintenance-interval"
                type="number"
                min="1"
                value={settings.defaultMaintenanceInterval}
                onChange={(e) =>
                  setSettings({ ...settings, defaultMaintenanceInterval: Number.parseInt(e.target.value) || 12 })
                }
              />
              <p className="text-xs text-gray-500 mt-1">{t.defaultMaintenanceIntervalHint} </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-update">{t.autoUpdateValues} </Label>
                <p className="text-sm text-gray-500">{t.autoUpdateValuesDesc} </p>
              </div>
              <Switch
                id="auto-update"
                checked={settings.autoUpdateAssetValues}
                onCheckedChange={(checked) => setSettings({ ...settings, autoUpdateAssetValues: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance-alerts">{t.maintenanceAlerts1} </Label>
                <p className="text-sm text-gray-500">{t.maintenanceAlertsDesc1} </p>
              </div>
              <Switch
                id="maintenance-alerts"
                checked={settings.enableMaintenanceAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, enableMaintenanceAlerts: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="low-value-tracking">{t.lowValueTracking} </Label>
                <p className="text-sm text-gray-500">{t.lowValueTrackingDesc} </p>
              </div>
              <Switch
                id="low-value-tracking"
                checked={settings.enableLowValueAssetTracking}
                onCheckedChange={(checked) => setSettings({ ...settings, enableLowValueAssetTracking: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="barcode-scanning">{t.barcodeScanning} </Label>
                <p className="text-sm text-gray-500">{t.barcodeScanningDesc} </p>
              </div>
              <Switch
                id="barcode-scanning"
                checked={settings.enableBarcodeScanning}
                onCheckedChange={(checked) => setSettings({ ...settings, enableBarcodeScanning: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="asset-transfers">{t.assetTransfers} </Label>
                <p className="text-sm text-gray-500">{t.assetTransfersDesc} </p>
              </div>
              <Switch
                id="asset-transfers"
                checked={settings.enableAssetTransfers}
                onCheckedChange={(checked) => setSettings({ ...settings, enableAssetTransfers: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="disposal-approval">{t.disposalApproval} </Label>
                <p className="text-sm text-gray-500">{t.disposalApprovalDesc} </p>
              </div>
              <Switch
                id="disposal-approval"
                checked={settings.requireApprovalForDisposal}
                onCheckedChange={(checked) => setSettings({ ...settings, requireApprovalForDisposal: checked })}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={saveSettings} className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>{t.saveSettings} </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Asset Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t.assetCategories} </CardTitle>
              <CardDescription>{t.assetCategoriesDesc1} </CardDescription>
            </div>
            <Button onClick={() => setIsAddCategoryOpen(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>{t.addCategory} </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <div className="space-y-4">
              {categories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{category.name}</h3>
                          <Badge variant={category.isActive ? "default" : "secondary"}>
                            {category.isActive ? t.active : t.inactive}
                          </Badge>
                        </div>

                        <p className="text-gray-700 mb-3">{category.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">{t.depRate} </span> {category.depreciationRate}%
                            {t.annually}
                          </div>
                          <div>
                            <span className="font-medium">{t.maintenanceInterval} </span> {category.maintenanceInterval}{" "}
                            {t.months}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => handleToggleCategoryStatus(category.id)}>
                          {category.isActive ? t.deactivate : t.activate}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noCategories1} </h3>
              <p className="text-gray-500 mb-4">{t.addCategoriesHint} </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>{t.dataManagement} </CardTitle>
          <CardDescription>{t.dataManagementDesc} </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Button onClick={exportData} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>{t.exportData} </span>
            </Button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Upload className="h-4 w-4" />
                <span>{t.importData} </span>
              </Button>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">{t.dataNotice} </p>
                <p className="text-sm text-yellow-700 mt-1">
                  {t.dataNoticeDesc}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.addAssetCategory} </DialogTitle>
            <DialogDescription>{t.addAssetCategoryDesc} </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name">{t.categoryName} *</Label>
              <Input
                id="category-name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder={t.placeholderCategoryName}
                required
              />
            </div>

            <div>
              <Label htmlFor="category-description">{t.categoryDescription} </Label>
              <Textarea
                id="category-description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder={t.placeholderCategoryDesc}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category-depreciation">{t.depRatePercent} </Label>
              <Input
                id="category-depreciation"
                type="number"
                min="0"
                max="100"
                value={newCategory.depreciationRate}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, depreciationRate: Number.parseFloat(e.target.value) || 0 })
                }
              />
            </div>

            <div>
              <Label htmlFor="category-maintenance">{t.maintenanceIntervalMonths} </Label>
              <Input
                id="category-maintenance"
                type="number"
                min="1"
                value={newCategory.maintenanceInterval}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, maintenanceInterval: Number.parseInt(e.target.value) || 12 })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={handleAddCategory}>{t.addCategory} </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.editAssetCategory} </DialogTitle>
            <DialogDescription>{t.editAssetCategoryDesc} </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-category-name">{t.categoryName} </Label>
                <Input
                  id="edit-category-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-category-description">{t.categoryDescription} </Label>
                <Textarea
                  id="edit-category-description"
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-category-depreciation">{t.depRatePercent} </Label>
                <Input
                  id="edit-category-depreciation"
                  type="number"
                  min="0"
                  max="100"
                  value={editingCategory.depreciationRate}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, depreciationRate: Number.parseFloat(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <Label htmlFor="edit-category-maintenance">{t.maintenanceIntervalMonths} </Label>
                <Input
                  id="edit-category-maintenance"
                  type="number"
                  min="1"
                  value={editingCategory.maintenanceInterval}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      maintenanceInterval: Number.parseInt(e.target.value) || 12,
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={handleSaveEditCategory}>{t.saveChanges} </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
