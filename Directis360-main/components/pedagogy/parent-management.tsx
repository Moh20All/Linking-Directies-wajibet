"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  createParent,
  linkParentToStudent,
  getParents,
  Parent,
  CreateParentPayload,
} from "@/services/staffPedagogyService";
// import { StudentInterface } from "./PedagogyDashboard";
import { StudentInterface } from "../dashboard/pedagogy-dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle, LinkIcon } from "lucide-react";
import { useLanguage } from "@/context/language-context"
interface ParentManagementProps {
  students: StudentInterface[];
  reloadData: (type: "students" | "all") => void;
}

export default function ParentManagement({
  students,
  reloadData,
}: ParentManagementProps) {
  const { getFreshToken } = useAuth();
  const [parents, setParents] = useState<Parent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { t, isRTL } = useLanguage()

  // State for Create Parent Form
  const [createFormData, setCreateFormData] = useState<CreateParentPayload>({
    username: "",
    password: "",
    full_name: "",
    phone_number: "",
    email: "",
    national_ID: "",
    relationship: "father",
  });

  // State for Link Parent Form
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [linkRelationship, setLinkRelationship] = useState<"mother" | "father">(
    "father"
  );

  const fetchParents = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication failed.");
      const response = await getParents(token);
      setParents(response.parents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch parents.");
    } finally {
      setIsLoading(false);
    }
  }, [getFreshToken]);

  useEffect(() => {
    fetchParents();
  }, [fetchParents]);

  const handleCreateFormChange = (
    field: keyof CreateParentPayload,
    value: string
  ) => {
    setCreateFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateParent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication failed.");
      await createParent(token, createFormData);
      setSuccess("Parent account created successfully!");
      setCreateFormData({
        username: "",
        password: "",
        full_name: "",
        phone_number: "",
        email: "",
        national_ID: "",
        relationship: "father",
      });
      fetchParents(); // Refresh parent list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Creation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkAccounts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParentId || !selectedStudentId) {
      setError("Please select both a parent and a student.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication failed.");
      const response = await linkParentToStudent(token, {
        parentId: selectedParentId,
        studentId: selectedStudentId,
        relationship: linkRelationship,
      });
      setSuccess(response.message);
      setSelectedParentId("");
      setSelectedStudentId("");
      reloadData("students"); // Refresh student data to show the link
    } catch (err) {
      setError(err instanceof Error ? err.message : "Linking failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Tabs defaultValue="link">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="link">{t.pm_tab_link_parent}</TabsTrigger>
        <TabsTrigger value="create">{t.pm_tab_create_parent}</TabsTrigger>
      </TabsList>

      {/* LINK PARENT TAB */}
      <TabsContent value="link">
        <Card>
          <CardHeader>
            <CardTitle>{t.pm_link_title}</CardTitle>
            <CardDescription>
              {t.pm_link_description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <form onSubmit={handleLinkAccounts} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{t.pm_select_student_label}</Label>
                    <Select
                      value={selectedStudentId}
                      onValueChange={setSelectedStudentId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.pm_select_student_placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((s) => (
                          <SelectItem key={s._id} value={s._id}>
                            {s.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Select Parent</Label>
                    <Select
                      value={selectedParentId}
                      onValueChange={setSelectedParentId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.pm_select_parent_placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {parents.map((p) => (
                          <SelectItem key={p._id} value={p._id}>
                            {p.full_name} ({p.relationship})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t.pm_relationship_label}</Label>
                  <Select
                    value={linkRelationship}
                    onValueChange={(value: "mother" | "father") =>
                      setLinkRelationship(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.pm_relationship_placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">{t.pm_relationship_father}</SelectItem>
                      <SelectItem value="mother">{t.pm_relationship_mother}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LinkIcon className="mr-2 h-4 w-4" />
                  )}
                  {t.pm_link_btn}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* CREATE PARENT TAB */}
      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle>{t.pm_create_title}</CardTitle>
            <CardDescription>
              {t.pm_create_description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateParent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.pm_label_full_name}</Label>
                  <Input
                    value={createFormData.full_name}
                    onChange={(e) =>
                      handleCreateFormChange("full_name", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.pm_label_email}</Label>
                  <Input
                    type="email"
                    value={createFormData.email}
                    onChange={(e) =>
                      handleCreateFormChange("email", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.pm_label_phone}</Label>
                  <Input
                    value={createFormData.phone_number}
                    onChange={(e) =>
                      handleCreateFormChange("phone_number", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.pm_label_nid}</Label>
                  <Input
                    value={createFormData.national_ID}
                    onChange={(e) =>
                      handleCreateFormChange("national_ID", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.pm_label_username}</Label>
                  <Input
                    value={createFormData.username}
                    onChange={(e) =>
                      handleCreateFormChange("username", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.pm_label_password}</Label>
                  <Input
                    type="password"
                    value={createFormData.password}
                    onChange={(e) =>
                      handleCreateFormChange("password", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.pm_label_declared_relationship}</Label>
                  <Select
                    value={createFormData.relationship}
                    onValueChange={(value: "mother" | "father") =>
                      handleCreateFormChange("relationship", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">{t.pm_relationship_father}</SelectItem>
                      <SelectItem value="mother">{t.pm_relationship_mother}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {t.pm_btn_create}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
