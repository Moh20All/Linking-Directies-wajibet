"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Settings, Save } from "lucide-react"
import { useLanguage } from "@/context/language-context"

interface FinanceSettings {
  currency: string
  taxRate: number
  payrollFrequency: string
  fiscalYearStart: string
  autoReminders: boolean
  lateFeeAmount: number
  lateFeeGracePeriod: number
}

interface FinanceSettingsProps {
  settings: FinanceSettings
  setSettings: (settings: FinanceSettings) => void
}

export default function FinanceSettingsComponent({ settings, setSettings }: FinanceSettingsProps) {
  const handleSave = () => {
    // Settings are automatically saved via useEffect in parent component
    alert("Settings saved successfully!")
  }
  const { t, isRTL } = useLanguage()

  const handleInputChange = (field: keyof FinanceSettings, value: string | number | boolean) => {
    setSettings({
      ...settings,
      [field]: value,
    })
  }

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "INR", name: "Indian Rupee" },
  ]

  const payrollFrequencies = [
    { value: "weekly", label: "Weekly" },
    { value: "bi-weekly", label: "Bi-weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
  ]

  const fiscalYearStarts = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            {t.fin_set_title}
          </h2>
          <p className="text-gray-600">{t.fin_set_subtitle}</p>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          {t.fin_set_save_btn}
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t.fin_set_general_title}</CardTitle>
          <CardDescription>{t.fin_set_general_desc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="currency">{t.fin_set_currency_label}</Label>
              <Select value={settings.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate">{t.fin_set_tax_label}</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={settings.taxRate * 100}
                onChange={(e) => handleInputChange("taxRate", Number.parseFloat(e.target.value) / 100)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="payrollFrequency">{t.fin_set_payroll_label}</Label>
              <Select
                value={settings.payrollFrequency}
                onValueChange={(value) => handleInputChange("payrollFrequency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {payrollFrequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fiscalYearStart">{t.fin_set_fiscal_label}</Label>
              <Select
                value={settings.fiscalYearStart}
                onValueChange={(value) => handleInputChange("fiscalYearStart", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fiscalYearStarts.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t.fin_set_student_title}</CardTitle>
          <CardDescription>{t.fin_set_student_desc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t.fin_set_auto_reminder_label}</Label>
              <p className="text-sm text-muted-foreground">
                {t.fin_set_auto_reminder_desc}
              </p>
            </div>
            <Switch
              checked={settings.autoReminders}
              onCheckedChange={(checked) => handleInputChange("autoReminders", checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="lateFeeAmount">{t.fin_set_late_fee_label}</Label>
              <Input
                id="lateFeeAmount"
                type="number"
                step="0.01"
                min="0"
                value={settings.lateFeeAmount}
                onChange={(e) => handleInputChange("lateFeeAmount", Number.parseFloat(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">{t.fin_set_late_fee_hint} ({settings.currency})</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lateFeeGracePeriod">{t.fin_set_grace_label}</Label>
              <Input
                id="lateFeeGracePeriod"
                type="number"
                min="0"
                value={settings.lateFeeGracePeriod}
                onChange={(e) => handleInputChange("lateFeeGracePeriod", Number.parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">{t.fin_set_grace_hint}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t.fin_set_system_title}</CardTitle>
          <CardDescription>{t.fin_set_system_desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium">{t.fin_set_system_storage_label}</Label>
              <p className="text-sm text-muted-foreground">{t.fin_set_system_storage_val}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">{t.fin_set_system_updated_label}</Label>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
