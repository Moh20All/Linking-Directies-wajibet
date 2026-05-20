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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  UserPlus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getAllMembers,
  createStaffMember,
  updateStaffMember,
  StaffMember,
  StaffMemberPayload,
} from "@/services/masterService";
import { useLanguage } from "@/context/language-context";
type Admin = StaffMember;

export default function AdminManagement() {
  const { getFreshToken } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const { t, isRTL } = useLanguage()


  const [formData, setFormData] = useState<StaffMemberPayload>({
    username: "",
    password: "",
    full_name: "",
    phone_number: "",
    email: "",
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getFreshToken();
        if (!token) throw new Error("Authentication failed.");
        const allMembers = await getAllMembers(token);
        const staffMembers = allMembers.filter(
          (member) => member.role === "STAFF"
        ) as Admin[];
        setAdmins(staffMembers);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : t.unknownError1;
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication failed.");

      if (dialogMode === "create") {
        if (!formData.password || formData.password.length < 8) {
          throw new Error(
            t.passwordTooShort1
          );
        }
        const newAdmin = await createStaffMember(token, formData);
        setAdmins([...admins, newAdmin]);
        setSuccess(t.adminCreatedSuccess1);
      } else if (dialogMode === "edit" && editingAdminId) {
        // If password exists but is too short, show an error. Otherwise, proceed.
        if (formData.password && formData.password.length < 8) {
          throw new Error(t.passwordTooShortEdit1);
        }
        // Exclude password from payload if it's empty
        const { password, ...updateData } = formData;
        const payload = password ? formData : updateData;

        const updatedAdmin = await updateStaffMember(
          token,
          editingAdminId,
          payload
        );
        setAdmins(
          admins.map((admin) =>
            admin._id === editingAdminId ? updatedAdmin : admin
          )
        );
        setSuccess(t.adminUpdatedSuccess1);
      }

      handleCloseDialog();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : `Failed to ${dialogMode} admin.`;
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    field: keyof StaffMemberPayload,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenDialog = () => {
    setDialogMode("create");
    setEditingAdminId(null);
    setFormData({
      username: "",
      password: "",
      full_name: "",
      phone_number: "",
      email: "",
    });
    setError(null);
    setSuccess(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (admin: Admin) => {
    setDialogMode("edit");
    setEditingAdminId(admin._id);
    setFormData({
      username: admin.username,
      full_name: admin.full_name,
      email: admin.email,
      phone_number: admin.phone_number,
      password: "", // Clear password field for editing
    });
    setError(null);
    setSuccess(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setShowPassword(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
          {t.adminManagementTitle}
          </h2>
          <p className="text-gray-600">
            {t.adminManagementDesc}
          </p>
        </div>

        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={handleOpenDialog}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {t.addAdmin}
        </Button>
      </div>

      {success && (
        <Alert
          variant="default"
          className="bg-green-50 border-green-200 text-green-800"
        >
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>{t.successTitle}</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
            <CardTitle>{t.adminStaffMembers}</CardTitle>
          <CardDescription>
            {t.adminStaffMembersDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                  <TableHead>{t.fullName}</TableHead>
                <TableHead>{t.username}</TableHead>
                <TableHead>{t.email}</TableHead>
                <TableHead>{t.phone}</TableHead>
                <TableHead>{t.createdAt}</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      {t.loadingAdminData}
                    </div>
                  </TableCell>
                </TableRow>
              ) : error && !isDialogOpen ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-red-600"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : admins.length > 0 ? (
                admins.map((admin) => (
                  <TableRow key={admin._id}>
                    <TableCell className="font-medium">
                      {admin.full_name}
                    </TableCell>
                    <TableCell>{admin.fullUsername}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.phone_number}</TableCell>
                    <TableCell>
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(admin)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          disabled
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    {t.noAdminsFound}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? t.createNewAdmin : t.editAdmin}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? t.createNewAdminDesc
                : t.editAdminDesc2}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t.username}</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  required
                  disabled={isSaving || dialogMode === "edit"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password || ""}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required={dialogMode === "create"}
                    placeholder={
                      dialogMode === "edit" ? t.leaveBlank : ""
                    }
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">{t.fullName}</Label>
              <Input
                id="fullName"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phoneNumber">{t.phoneNumber}</Label>
              <Input
                id="phoneNumber"
                value={formData.phone_number}
                onChange={(e) =>
                  handleInputChange("phone_number", e.target.value)
                }
                required
                disabled={isSaving}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isSaving}
              >
                {t.cancel}
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {dialogMode === "create" ? t.createAdmin : t.saveChanges}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
