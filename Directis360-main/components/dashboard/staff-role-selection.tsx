"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Users,
  DollarSign,
  Clock,
  Package,
  Key,
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useLanguage } from "@/context/language-context"

interface AdminRole {
  id: string
  title: string
  description: string
  icon: any
  color: string
  features: string[]
  hasPassword: boolean
}

export default function StaffRoleSelection() {
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { t, isRTL } = useLanguage()

  // Check if passwords are set for each role
  const checkPasswordStatus = (roleId: string) => {
    return localStorage.getItem(`admin_password_${roleId}`) !== null
  }

  const adminRoles: AdminRole[] = [
    {
      id: "pedagogy",
      title: "Pedagogy",
      description: "Student and teacher management",
      icon: Users,
      color: "bg-blue-600 hover:bg-blue-700",
      features: [
        "Create student accounts",
        "Generate schedules and groups",
        "Create teacher accounts",
        "Link parent accounts",
      ],
      hasPassword: checkPasswordStatus("pedagogy"),
    },
    {
      id: "finance",
      title: "Finance",
      description: "Financial tracking and management",
      icon: DollarSign,
      color: "bg-green-600 hover:bg-green-700",
      features: [
        "Employee financial tracking",
        "School income and outcome",
        "Add staff to database",
        "Track student payments",
      ],
      hasPassword: checkPasswordStatus("finance"),
    },
    {
      id: "attendance",
      title: "Attendance",
      description: "Employee attendance monitoring",
      icon: Clock,
      color: "bg-orange-600 hover:bg-orange-700",
      features: ["Track employee presence", "Manual attendance marking", "Attendance reports", "Absence management"],
      hasPassword: checkPasswordStatus("attendance"),
    },
    {
      id: "assets",
      title: "Assets",
      description: "School equipment and inventory",
      icon: Package,
      color: "bg-purple-600 hover:bg-purple-700",
      features: ["Equipment inventory", "Asset tracking", "Maintenance records", "Purchase management"],
      hasPassword: checkPasswordStatus("assets"),
    },
  ]

  const handleRoleSelect = (role: AdminRole) => {
    if (!role.hasPassword) {
      setError("Password not set for this role. Please contact the headmaster.")
      return
    }

    setSelectedRole(role)
    setPassword("")
    setError("")
    setIsPasswordDialogOpen(true)
  }

  const handlePasswordSubmit = async () => {
    if (!selectedRole || !password.trim()) {
      setError("Please enter a password")
      return
    }

    setLoading(true)
    setError("")

    // Simulate password verification delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const storedPassword = localStorage.getItem(`admin_password_${selectedRole.id}`)

    if (storedPassword === password) {
      // Password correct - navigate to dashboard
      window.location.href = `/dashboard/staff/${selectedRole.id}`
    } else {
      setError("Incorrect password. Please try again.")
    }

    setLoading(false)
  }

  const handleCloseDialog = () => {
    setIsPasswordDialogOpen(false)
    setSelectedRole(null)
    setPassword("")
    setError("")
    setShowPassword(false)
  }

  const handleBackToHome = () => {
    window.location.href = "/"
  }

  const passwordsSetCount = adminRoles.filter((role) => role.hasPassword).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Button variant="outline" onClick={handleBackToHome} className="mb-6 bg-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.staffrole_back_btn}
          </Button>

          <div className="mx-auto mb-6 w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.staffrole_header_title}</h1>
          <p className="text-xl text-gray-600">{t.staffrole_header_subtitle}</p>

          {/* Password Status Alert */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-blue-800 mb-2">
              <Key className="w-5 h-5" />
              <span className="font-medium">{t.staffrole_password_status_title}</span>
            </div>
            <p className="text-sm text-blue-700">
              {passwordsSetCount} {t.staffrole_password_status_count_prefix} {adminRoles.length} {t.staffrole_password_status_count_suffix}
            </p>
            {passwordsSetCount < adminRoles.length && (
              <p className="text-xs text-blue-600 mt-1">{t.staffrole_password_status_missing}</p>
            )}
          </div>
        </div>

        {/* Admin Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminRoles.map((role) => {
            const Icon = role.icon
            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 ${
                  role.hasPassword
                    ? "hover:border-blue-200 border-gray-200"
                    : "border-red-200 bg-red-50 cursor-not-allowed opacity-75"
                }`}
                onClick={() => handleRoleSelect(role)}
              >
                <CardHeader className="text-center">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`mx-auto w-16 h-16 ${role.hasPassword ? role.color : "bg-gray-400"} rounded-full flex items-center justify-center`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {role.hasPassword ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">{t.staffrole_protected}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs">{t.staffrole_no_password}</span>
                        </div>
                      )}
                      <Lock className={`w-4 h-4 ${role.hasPassword ? "text-green-600" : "text-red-600"}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{role.title}</CardTitle>
                  <CardDescription className="text-gray-600">{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${role.hasPassword ? role.color : "bg-gray-400 cursor-not-allowed"} text-white`}
                    disabled={!role.hasPassword}
                  >
                    {role.hasPassword ? `Access ${role.title} Dashboard` : "Password Required"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500">
            {t.staffrole_footer_question} {" "}
            <a href="#" className="text-blue-600 hover:underline">
              {t.staffrole_footer_contact}
            </a>
          </p>
        </div>

        {/* Password Dialog */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                {t.staffrole_dialog_title_prefix} {selectedRole?.title} {t.staffrole_dialog_title_suffix}
              </DialogTitle>
              <DialogDescription>
                {t.staffrole_dialog_desc}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rolePassword">{t.staffrole_dialog_password_label}</Label>
                <div className="relative">
                  <Input
                    id="rolePassword"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                {t.staffrole_dialog_btn_cancel}
              </Button>
              <Button onClick={handlePasswordSubmit} className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? "Verifying..." : "Access Dashboard"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
