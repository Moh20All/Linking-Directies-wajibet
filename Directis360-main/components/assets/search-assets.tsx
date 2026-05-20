"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  Filter,
  Eye,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Download,
} from "lucide-react"
import { useLanguage } from "@/context/language-context";


interface Asset {
  id: string
  name: string
  category: string
  condition: "excellent" | "good" | "fair" | "poor" | "needs-repair"
  location: string
  purchaseDate: string
  purchasePrice: number
  currentValue: number
  lastMaintenance?: string
  nextMaintenance?: string
  status: "active" | "inactive" | "maintenance" | "disposed"
  assignedTo?: string
  serialNumber?: string
  manufacturer?: string
  model?: string
  warranty?: string
  notes?: string
}

interface SearchFilters {
  category: string
  condition: string
  status: string
  location: string
  priceRange: string
  dateRange: string
  assignedTo: string
}

export default function SearchAssets() {
  const [assets, setAssets] = useState<Asset[]>([])
  const { t, isRTL } = useLanguage()
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    category: "all",
    condition: "all",
    status: "all",
    location: "all",
    priceRange: "all",
    dateRange: "all",
    assignedTo: "",
  })

  useEffect(() => {
    // Load assets from localStorage
    const savedAssets = localStorage.getItem("school-assets")
    if (savedAssets) {
      const parsedAssets = JSON.parse(savedAssets)
      setAssets(parsedAssets)
      setFilteredAssets(parsedAssets)
    }
  }, [])

  useEffect(() => {
    // Apply search and filters
    let filtered = assets

    // Text search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchLower) ||
          asset.category.toLowerCase().includes(searchLower) ||
          asset.location.toLowerCase().includes(searchLower) ||
          asset.serialNumber?.toLowerCase().includes(searchLower) ||
          asset.manufacturer?.toLowerCase().includes(searchLower) ||
          asset.model?.toLowerCase().includes(searchLower) ||
          asset.assignedTo?.toLowerCase().includes(searchLower) ||
          asset.notes?.toLowerCase().includes(searchLower),
      )
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((asset) => asset.category === filters.category)
    }

    // Condition filter
    if (filters.condition !== "all") {
      filtered = filtered.filter((asset) => asset.condition === filters.condition)
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((asset) => asset.status === filters.status)
    }

    // Location filter
    if (filters.location !== "all") {
      filtered = filtered.filter((asset) => asset.location === filters.location)
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      filtered = filtered.filter((asset) => {
        const price = asset.currentValue
        switch (filters.priceRange) {
          case "under-100":
            return price < 100
          case "100-500":
            return price >= 100 && price <= 500
          case "500-1000":
            return price >= 500 && price <= 1000
          case "1000-5000":
            return price >= 1000 && price <= 5000
          case "over-5000":
            return price > 5000
          default:
            return true
        }
      })
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date()
      filtered = filtered.filter((asset) => {
        const purchaseDate = new Date(asset.purchaseDate)
        const monthsAgo = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30)

        switch (filters.dateRange) {
          case "last-month":
            return monthsAgo <= 1
          case "last-3-months":
            return monthsAgo <= 3
          case "last-6-months":
            return monthsAgo <= 6
          case "last-year":
            return monthsAgo <= 12
          case "over-year":
            return monthsAgo > 12
          default:
            return true
        }
      })
    }

    // Assigned to filter
    if (filters.assignedTo) {
      const assignedLower = filters.assignedTo.toLowerCase()
      filtered = filtered.filter((asset) => asset.assignedTo?.toLowerCase().includes(assignedLower))
    }

    setFilteredAssets(filtered)
  }, [assets, searchTerm, filters])

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset)
    setIsViewDialogOpen(true)
  }

  const clearFilters = () => {
    setFilters({
      category: "all",
      condition: "all",
      status: "all",
      location: "all",
      priceRange: "all",
      dateRange: "all",
      assignedTo: "",
    })
    setSearchTerm("")
  }

  const exportResults = () => {
    const csvContent = [
      [
        "Name",
        "Category",
        "Condition",
        "Status",
        "Location",
        "Purchase Date",
        "Purchase Price",
        "Current Value",
        "Assigned To",
        "Serial Number",
        "Manufacturer",
        "Model",
      ],
      ...filteredAssets.map((asset) => [
        asset.name,
        asset.category,
        asset.condition,
        asset.status,
        asset.location,
        asset.purchaseDate,
        asset.purchasePrice.toString(),
        asset.currentValue.toString(),
        asset.assignedTo || "",
        asset.serialNumber || "",
        asset.manufacturer || "",
        asset.model || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `assets-search-results-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-blue-100 text-blue-800"
      case "fair":
        return "bg-yellow-100 text-yellow-800"
      case "poor":
        return "bg-orange-100 text-orange-800"
      case "needs-repair":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "disposed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case "excellent":
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "fair":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "poor":
      case "needs-repair":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  // Get unique values for filter options
  const categories = [...new Set(assets.map((asset) => asset.category))]
  const locations = [...new Set(assets.map((asset) => asset.location))]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>{t.search_assets_title} </span>
          </CardTitle>
          <CardDescription>{t.search_assets_desc} </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder={t.search_assets_placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span> {t.search_assets_filters_btn} </span>
              </Button>
              <Button
                variant="outline"
                onClick={exportResults}
                className="flex items-center space-x-2 bg-transparent"
                disabled={filteredAssets.length === 0}
              >
                <Download className="h-4 w-4" />
                <span> {t.search_assets_export_btn} </span>
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg"> {t.search_assets_adv_filters} </CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    {t.search_assets_clear_all}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label> {t.search_assets_category_label} </Label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => setFilters({ ...filters, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all"> {t.search_assets_category_all} </SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label> {t.search_assets_condition_label} </Label>
                    <Select
                      value={filters.condition}
                      onValueChange={(value) => setFilters({ ...filters, condition: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all"> {t.search_assets_condition_all} </SelectItem>
                        <SelectItem value="excellent"> {t.search_assets_condition_excellent} </SelectItem>
                        <SelectItem value="good"> {t.search_assets_condition_good} </SelectItem>
                        <SelectItem value="fair"> {t.search_assets_condition_fair} </SelectItem>
                        <SelectItem value="poor"> {t.search_assets_condition_poor} </SelectItem>
                        <SelectItem value="needs-repair"> {t.search_assets_condition_needsrepair} </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label> {t.search_assets_status_label} </Label>
                    <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all"> {t.search_assets_status_all} </SelectItem>
                        <SelectItem value="active"> {t.search_assets_status_active} </SelectItem>
                        <SelectItem value="inactive"> {t.search_assets_status_inactive} </SelectItem>
                        <SelectItem value="maintenance"> {t.search_assets_status_maintenance} </SelectItem>
                        <SelectItem value="disposed"> {t.search_assets_status_disposed} </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label> {t.search_assets_location_label} </Label>
                    <Select
                      value={filters.location}
                      onValueChange={(value) => setFilters({ ...filters, location: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all"> {t.search_assets_location_all} </SelectItem>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label> {t.search_assets_price_label} </Label>
                    <Select
                      value={filters.priceRange}
                      onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all"> {t.search_assets_price_all} </SelectItem>
                        <SelectItem value="under-100"> {t.search_assets_price_under100} </SelectItem>
                        <SelectItem value="100-500"> {t.search_assets_price_100_500} </SelectItem>
                        <SelectItem value="500-1000"> {t.search_assets_price_500_1000} </SelectItem>
                        <SelectItem value="1000-5000"> {t.search_assets_price_1000_5000} </SelectItem>
                        <SelectItem value="over-5000"> {t.search_assets_price_over5000} </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Purchase Date</Label>
                    <Select
                      value={filters.dateRange}
                      onValueChange={(value) => setFilters({ ...filters, dateRange: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all"> {t.search_assets_date_all} </SelectItem>
                        <SelectItem value="last-month"> {t.search_assets_date_lastmonth} </SelectItem>
                        <SelectItem value="last-3-months"> {t.search_assets_date_last3months} </SelectItem>
                        <SelectItem value="last-6-months"> {t.search_assets_date_last6months} </SelectItem>
                        <SelectItem value="last-year"> {t.search_assets_date_lastyear} </SelectItem>
                        <SelectItem value="over-year"> {t.search_assets_date_overyear} </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label> {t.search_assets_assigned_label} </Label>
                    <Input
                      placeholder="Search by assigned person or department"
                      value={filters.assignedTo}
                      onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Results */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {t.search_assets_results_found} {filteredAssets.length} {t.search_assets_results_found_asset}{filteredAssets.length !== 1 ? "s" : ""}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
            {filteredAssets.length > 0 && (
              <p className="text-sm text-gray-600">
                {t.search_assets_results_value} ${filteredAssets.reduce((sum, asset) => sum + asset.currentValue, 0).toLocaleString()}
              </p>
            )}
          </div>

          {filteredAssets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => (
                <Card
                  key={asset.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewAsset(asset)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getConditionIcon(asset.condition)}
                        <CardTitle className="text-lg">{asset.name}</CardTitle>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {asset.category}
                      </Badge>
                      <Badge className={`text-xs ${getConditionColor(asset.condition)}`}>{asset.condition}</Badge>
                      <Badge className={`text-xs ${getStatusColor(asset.status)}`}>{asset.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{asset.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{t.search_assets_details_purchased} {new Date(asset.purchaseDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>{t.value} ${asset.currentValue.toLocaleString()}</span>
                      </div>
                      {asset.assignedTo && (
                        <div className="text-gray-600">
                          <span className="font-medium">{t.search_assets_details_assigned}:</span> {asset.assignedTo}
                        </div>
                      )}
                      {asset.serialNumber && (
                        <div className="text-gray-600">
                          <span className="font-medium">S/N:</span> {asset.serialNumber}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t.search_assets_no_results_title}</h3>
              <p className="text-gray-500 mb-4">
                {assets.length === 0
                  ? t.search_assets_no_results_empty
                  : t.search_assets_no_results_try}
              </p>
              {(searchTerm || Object.values(filters).some((f) => f !== "all" && f !== "")) && (
                <Button variant="outline" onClick={clearFilters}>
                  {t.search_assets_clear_btn}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Asset Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.search_assets_details_title}</DialogTitle>
            <DialogDescription>{t.search_assets_details_desc}</DialogDescription>
          </DialogHeader>
          {selectedAsset && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">{t.search_assets_details_name}</Label>
                  <p className="text-lg font-semibold">{selectedAsset.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">{t.search_assets_details_category}</Label>
                  <p>{selectedAsset.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">{t.search_assets_details_condition}</Label>
                  <Badge className={`${getConditionColor(selectedAsset.condition)} mt-1`}>
                    {selectedAsset.condition}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">{t.search_assets_details_status}</Label>
                  <Badge className={`${getStatusColor(selectedAsset.status)} mt-1`}>{selectedAsset.status}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">{t.search_assets_details_location}</Label>
                  <p>{selectedAsset.location}</p>
                </div>
                {selectedAsset.assignedTo && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t.search_assets_details_assigned}</Label>
                    <p>{selectedAsset.assignedTo}</p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">{t.search_assets_details_purchase_date}</Label>
                  <p>{new Date(selectedAsset.purchaseDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">{t.search_assets_details_purchase_price}</Label>
                  <p>${selectedAsset.purchasePrice.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">{t.search_assets_details_current_value}</Label>
                  <p>${selectedAsset.currentValue.toLocaleString()}</p>
                </div>
                {selectedAsset.serialNumber && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t.search_assets_details_serial}</Label>
                    <p>{selectedAsset.serialNumber}</p>
                  </div>
                )}
                {selectedAsset.manufacturer && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t.search_assets_details_manufacturer}</Label>
                    <p>{selectedAsset.manufacturer}</p>
                  </div>
                )}
                {selectedAsset.model && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t.search_assets_details_model}</Label>
                    <p>{selectedAsset.model}</p>
                  </div>
                )}
                {selectedAsset.warranty && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t.search_assets_details_warranty}</Label>
                    <p>{selectedAsset.warranty}</p>
                  </div>
                )}
                {selectedAsset.lastMaintenance && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t.search_assets_details_last_maintenance}</Label>
                    <p>{new Date(selectedAsset.lastMaintenance).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedAsset.nextMaintenance && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t.search_assets_details_next_maintenance}</Label>
                    <p>{new Date(selectedAsset.nextMaintenance).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              {selectedAsset.notes && (
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-500">{t.search_assets_details_notes}</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md">{selectedAsset.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
