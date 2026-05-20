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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Key,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { setTabPasswords as updatePasswords } from "@/services/masterService";
import api from "@/lib/api";
import { useLanguage } from "@/context/language-context";

interface TabPassword {
  id: "pedagogy" | "finance" | "attendance" | "assets";
  name: string;
  description: string;
  isSet: boolean;
  lastUpdated?: string; // This would ideally come from the server if available
}

export default function TabPasswordManager() {
  const { getFreshToken } = useAuth();
  const { t, isRTL } = useLanguage()
  const [tabPasswords, setTabPasswords] = useState<TabPassword[]>([
    {
      id: "pedagogy",
      name: t.tabPwdMgmt_tabPedagogy,
      description: t.tabPwdMgmt_descPedagogy,
      isSet: false,
    },
    {
      id: "finance",
      name: t.tabPwdMgmt_tabFinance,
      description: t.tabPwdMgmt_descFinance,
      isSet: false,
    },
    {
      id: "attendance",
      name: t.tabPwdMgmt_tabAttendance,
      description: t.tabPwdMgmt_descAttendance,
      isSet: false,
    },
    {
      id: "assets",
      name: t.tabPwdMgmt_tabAssets,
      description: t.tabPwdMgmt_descAssets,
      isSet: false,
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabPassword | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch initial password statuses from the backend
  useEffect(() => {
    const fetchTabStatus = async () => {
      setIsLoading(true);
      try {
        const token = await getFreshToken();
        if (!token) throw new Error("Authentication token not found.");

        // This endpoint is in auth.routes.js but is the correct one for this job.
        const res = await api.get("/v1/auth/tabs/status", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const statuses = res.data as { [key: string]: boolean };

        setTabPasswords((prev) =>
          prev.map((tab) => ({
            ...tab,
            isSet: statuses[tab.id] || false,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch tab password statuses:", err);
        setError("Could not load password statuses from the server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTabStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetPassword = (tab: TabPassword) => {
    setSelectedTab(tab);
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    setIsDialogOpen(true);
  };

  const handleSavePassword = async () => {
    if (!selectedTab) return;

    if (!password.trim()) {
      setError(t.passwordCannotBeEmpty);
      return;
    }
    if (password.length < 4) {
      setError(t.passwordTooShort4);
      return;
    }
    if (password !== confirmPassword) {
      setError(t.passwordsNotMatch);
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication token not found.");

      const payload = { [selectedTab.id]: password };
      const response = await updatePasswords(token, payload);
      console.log("tab response: ", response);
      setTabPasswords((prev) =>
        prev.map((tab) =>
          tab.id === selectedTab.id
            ? {
                ...tab,
                isSet: true,
                lastUpdated: new Date().toLocaleDateString(),
              }
            : tab
        )
      );

      setSuccess(response.message || t.passwordUpdated);
      handleCloseDialog();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t.unknownError;
      setError(errorMessage);
      console.error(`Failed to set password for ${selectedTab.id}:`, err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSelectedTab(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span>{t.tabPwdMgmt_loading}</span>
      </div>
    );
  }

  const setPasswordsCount = tabPasswords.filter((tab) => tab.isSet).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {t.tabPasswordManagementTitle}
        </h2>
        <p className="text-gray-600">
          {t.tabPasswordManagementDesc}
        </p>
      </div>

      {success && (
        <Alert
          variant="default"
          className="bg-green-50 border-green-200 text-green-800"
        >
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>{t.success}</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Key className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">
                  {t.passwordStatus}
                </h3>
                <p className="text-sm text-purple-700">
                  {setPasswordsCount} of {tabPasswords.length}
                  {t.passwordStatusCount}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {setPasswordsCount}/{tabPasswords.length}
              </div>
              <div className="text-xs text-purple-600">{t.configured}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tabPasswords.map((tab) => (
          <Card
            key={tab.id}
            className={
              tab.isSet ? "border-green-200 bg-green-50" : "border-gray-200"
            }
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {tab.name}
                </CardTitle>
                {tab.isSet ? (
                  <Badge className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {t.set}
                  </Badge>
                ) : (
                  <Badge variant="secondary">{t.notSet}</Badge>
                )}
              </div>
              <CardDescription>{tab.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => handleSetPassword(tab)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {tab.isSet ? t.updatePassword : t.setPassword}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>{t.importantLabel}</strong> 
                  {t.importantNotice}
        </AlertDescription>
      </Alert>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedTab?.isSet ? t.updatePassword : t.setPassword} for{" "}
              {selectedTab?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedTab?.isSet
                ? t.updatePasswordDesc
                : t.createPasswordDesc}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="password">{t.newPassword}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.enterPasswordPlaceholder}
                  disabled={isSaving}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t.confirmPasswordPlaceholder}
                  disabled={isSaving}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
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
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isSaving}
            >
              {t.cancel}
            </Button>
            <Button
              onClick={handleSavePassword}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedTab?.isSet ? t.updatePassword : t.setPassword}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
