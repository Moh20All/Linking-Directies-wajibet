"use client";

import { useState, useMemo } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  Users,
  Eye,
  Loader2,
  Search,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
// -------------------- Types --------------------
interface BankAccount {
  accountNumber?: string;
  bankName?: string;
}

interface Transaction {
  _id: string;
  date: string;
  type: "outflow" | "inflow" | "student_fees" | "salary";
  amount: number;
  description: string;
}

interface FinancialProfile {
  _id: string;
  teacherId?: { full_name: string };
  name?: string;
  position?: string;
  department?: string;
  hireDate?: string;
  status: "active" | "inactive";
  role: "TEACHER" | "STAFF";
  salary?: number;
  bankAccount?: BankAccount;
  lastPayment?: string;
  transactions?: Transaction[];
}

interface CreateProfilePayload {
  role: "STAFF";
  profileData: Omit<FinancialProfile, "_id" | "transactions">;
}

interface CreateTransactionPayload {
  paymentProfileId: string;
  amount: number;
  type: "salary";
  description: string;
}

interface FinanceSettings {
  currency: string;
}

interface EmployeeFinanceProps {
  profiles: FinancialProfile[];
  settings: FinanceSettings;
  onCreateProfile: (payload: CreateProfilePayload) => Promise<void>;
  onUpdateProfile: (
    profileId: string,
    updates: Partial<FinancialProfile>
  ) => Promise<void>;
  onDeleteProfile: (profileId: string) => Promise<void>;
  onCreateTransaction: (
    payload: CreateTransactionPayload,
    isStudentPayment: boolean
  ) => Promise<void>;
}

// -------------------- Spinner --------------------
const Spinner = () => <Loader2 className="mr-2 h-4 w-4 animate-spin" />;

// -------------------- Main --------------------
export default function EmployeeFinance({
  profiles,
  settings,
  onCreateProfile,
  onUpdateProfile,
  onDeleteProfile,
  onCreateTransaction,
}: EmployeeFinanceProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<FinancialProfile | null>(
    null
  );
  const [viewingProfile, setViewingProfile] = useState<FinancialProfile | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterFinanceStatus, setFilterFinanceStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { t, isRTL } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
    salary: "",
    bankAccount: "",
    hireDate: "",
    status: "active" as "active" | "inactive",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: "active" | "inactive") => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  // -------------------- Helpers --------------------
  const departments = useMemo(
    () => [...new Set(profiles.map((p) => p.department))].filter(Boolean),
    [profiles]
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Present":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            {t.emp_finance_attendance_present}
          </Badge>
        );
      case "Absent":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            {t.emp_finance_attendance_absent}
          </Badge>
        );
      case "Late":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            {t.emp_finance_attendance_late}
          </Badge>
        );
      case "Justified Absence":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            {t.emp_finance_attendance_justified}
          </Badge>
        );
      case "Holiday":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            {t.emp_finance_attendance_holiday}
          </Badge>
        );
      case "Rest Day":
        return (
          <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">
            {t.emp_finance_attendance_rest}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{t.emp_finance_attendance_unknown}</Badge>;
    }
  };

  const getFinanceStatus = (profile: FinancialProfile) => {
    if (profile.lastPayment?.date) {
      const lastPaymentDate = new Date(profile.lastPayment.date);
      const today = new Date();

      // Check if the last payment was in the same month/year
      const sameMonth =
        lastPaymentDate.getFullYear() === today.getFullYear() &&
        lastPaymentDate.getMonth() === today.getMonth();

      if (sameMonth) {
        return "done"; // salary for this month already processed
      }
    }

    // If no salary set → undone
    if (!profile.salary || profile.salary <= 0) {
      return "undone";
    }

    // Salary exists but no payment this month → pending
    return "pending";
  };

  const filteredProfiles = useMemo(
    () =>
      profiles.filter((profile) => {
        const name = profile.teacherId?.full_name || profile.name || "";
        const position =
          profile.position ||
          (profile.role === "TEACHER" ? "Teacher" : "Staff");
        const department = profile.department || "Academic";
        const financeStatus = getFinanceStatus(profile);

        const matchesSearch =
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          position.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment =
          filterDepartment === "all" || department === filterDepartment;
        const matchesFinanceStatus =
          filterFinanceStatus === "all" ||
          financeStatus === filterFinanceStatus;

        return matchesSearch && matchesDepartment && matchesFinanceStatus;
      }),
    [profiles, searchTerm, filterDepartment, filterFinanceStatus]
  );

  const formatCurrency = (amount?: number) => {
    if (typeof amount !== "number" || isNaN(amount)) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: settings.currency || "USD",
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Invalid Date";

    return d.toLocaleDateString("en-GB");
  };

  const totalPayroll = useMemo(
    () => profiles.reduce((sum, p) => sum + (p.salary || 0), 0),
    [profiles]
  );

  const financeStatusCounts = useMemo(
    () =>
      profiles.reduce((counts, p) => {
        const status = getFinanceStatus(p);
        counts[status] = (counts[status] || 0) + 1;
        return counts;
      }, {} as Record<string, number>),
    [profiles]
  );

  const statusConfig = {
    done: {
      label: "Complete",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    pending: {
      label: "Pending",
      className: "bg-amber-100 text-amber-800 border-amber-200",
    },
    undone: {
      label: "No Salary",
      className: "bg-red-100 text-red-800 border-red-200 font-semibold",
    },
  };

  // -------------------- Handlers --------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const profileData = {
        salary: Number(formData.salary) || 0,
        bankAccount: {
          accountNumber: formData.bankAccount,
          bankName: (formData as any).bankName || "",
        },
      };

      if (editingProfile) {
        await onUpdateProfile(editingProfile._id, {
          ...profileData,
          name: formData.name,
          position: formData.position,
          department: formData.department,
          hireDate: formData.hireDate,
          status: formData.status,
        });
      } else {
        const payload: CreateProfilePayload = {
          role: "STAFF",
          profileData: {
            role: "STAFF",
            ...profileData,
            name: formData.name,
            position: formData.position,
            department: formData.department,
            hireDate: formData.hireDate,
            status: formData.status,
          },
        };
        await onCreateProfile(payload);
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      department: "",
      salary: "",
      bankAccount: "",
      hireDate: "",
      status: "active",
    });
    setEditingProfile(null);
    setIsFormOpen(false);
  };

  const handleEdit = (profile: FinancialProfile) => {
    setEditingProfile(profile);
    setFormData({
      name: profile.teacherId?.full_name || profile.name || "",
      position: profile.position || "Teacher",
      department: profile.department || "Academic",
      salary: profile.salary?.toString() || "",
      bankAccount: profile.bankAccount?.accountNumber || "",
      hireDate: profile.hireDate
        ? new Date(profile.hireDate).toISOString().split("T")[0]
        : "",
      status: profile.status || "active",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this profile? This action cannot be undone."
      )
    ) {
      setIsProcessing(id);
      try {
        await onDeleteProfile(id);
      } catch (error) {
        console.error("Failed to delete profile:", error);
      } finally {
        setIsProcessing(null);
      }
    }
  };

  const processPayroll = async (profile: FinancialProfile) => {
    if (!profile.salary || profile.salary <= 0) {
      alert("Cannot process payroll: Salary not set.");
      return;
    }
    setIsProcessing(profile._id);
    try {
      const payload: CreateTransactionPayload = {
        paymentProfileId: profile._id,
        amount: profile.salary,
        type: "salary",
        description: `Salary for ${
          profile.teacherId?.full_name || profile.name
        }`,
      };
      await onCreateTransaction(payload, false);
    } catch (error) {
      console.error("Failed to process payroll:", error);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleViewDetails = (profile: FinancialProfile) => {
    setViewingProfile(profile);
    setIsDetailsOpen(true);
  };

  const [isPayrollDialogOpen, setIsPayrollDialogOpen] = useState(false);
  const [payrollProfile, setPayrollProfile] = useState<FinancialProfile | null>(
    null
  );
  const [payrollForm, setPayrollForm] = useState({
    baseSalary: 0,
    taxPercent: 0,
    absencePenalty: 0,
    latePenalty: 0,
  });

  const openPayrollDialog = (profile: FinancialProfile) => {
    setPayrollProfile(profile);
    setPayrollForm({
      baseSalary: profile.salary || 0,
      taxPercent: 0,
      absencePenalty: 0,
      latePenalty: 0,
    });
    setIsPayrollDialogOpen(true);
  };

  const handlePayrollChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPayrollForm((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const confirmPayroll = async (e) => {
    e.preventDefault();
    if (!payrollProfile) return;

    const taxAmount = (payrollForm.baseSalary * payrollForm.taxPercent) / 100;
    const finalSalary =
      payrollForm.baseSalary -
      taxAmount -
      payrollForm.absencePenalty -
      payrollForm.latePenalty;

    if (finalSalary <= 0) {
      alert("Final salary cannot be zero or negative.");
      return;
    }

    setIsProcessing(payrollProfile._id);
    try {
      const payload: CreateTransactionPayload = {
        paymentProfileId: payrollProfile._id,
        amount: finalSalary,
        type: "salary",
        description: `Salary for ${
          payrollProfile.teacherId?.full_name || payrollProfile.name
        }`,
      };
      await onCreateTransaction(payload, false);
      setIsPayrollDialogOpen(false);
    } catch (err) {
      console.error("Failed to process payroll:", err);
    } finally {
      setIsProcessing(null);
    }
  };

  // -------------------- UI --------------------
  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.emp_finance_title}</h1>
        <p className="text-muted-foreground">
          {t.emp_finance_subtitle}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          icon={<Users className="text-muted-foreground" />}
          title="Total Employees"
          value={profiles.length}
        />
        <SummaryCard
          icon={<CheckCircle className="text-muted-foreground" />}
          title="Finance Complete"
          value={financeStatusCounts["done"] || 0}
        />
        <SummaryCard
          icon={<Clock className="text-muted-foreground" />}
          title="Pending Payroll"
          value={financeStatusCounts["pending"] || 0}
        />
        <SummaryCard
          icon={<DollarSign className="text-muted-foreground" />}
          title="Est. Monthly Payroll"
          value={formatCurrency(totalPayroll)}
          isCurrency
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-grow">
            <Input
              placeholder={t.emp_finance_search_placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-auto sm:flex-grow"
            />
            <Select
              value={filterDepartment}
              onValueChange={setFilterDepartment}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder={t.emp_finance_filter_department} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.emp_finance_filter_all_departments}</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterFinanceStatus}
              onValueChange={setFilterFinanceStatus}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder={t.emp_finance_filter_status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.emp_finance_filter_all_statuses}</SelectItem>
                <SelectItem value="done">{t.emp_finance_filter_done}</SelectItem>
                <SelectItem value="pending">{t.emp_finance_filter_pending}</SelectItem>
                <SelectItem value="undone">{t.emp_finance_filter_undone}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => {
              setEditingProfile(null);
              resetForm();
              setIsFormOpen(true);
            }}
            className="w-full sm:w-auto flex-shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" /> {t.emp_finance_add_staff_btn}
          </Button>
        </CardContent>
      </Card>

      {/* Profiles Grid */}
      {filteredProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile._id}
              profile={profile}
              statusConfig={statusConfig}
              getFinanceStatus={getFinanceStatus}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onProcessPayroll={openPayrollDialog}
              onViewDetails={handleViewDetails}
              isProcessing={isProcessing === profile._id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-semibold">{t.emp_finance_no_employee_title}</h3>
          <p className="mt-1 text-muted-foreground">
            {t.emp_finance_no_employee_subtitle}
          </p>
        </div>
      )}

      {/* Add/Edit Staff Dialog */}
      <Dialog
        open={isFormOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetForm(); // Reset form when closing
          }
          setIsFormOpen(isOpen);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingProfile ? "Edit Financial Profile" : "Add New Staff"}
            </DialogTitle>
            <DialogDescription>
              {editingProfile
                ? t.emp_finance_dialog_edit_desc
                : t.emp_finance_dialog_add_desc}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.emp_finance_form_name}</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., John Smith"
                  required
                  disabled={!!editingProfile?.teacherId} // Disable if editing a teacher profile
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">{t.emp_finance_form_position}</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="e.g., Accountant"
                  required
                  disabled={!!editingProfile?.teacherId}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">{t.emp_finance_form_department}</Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g., Finance"
                  required
                  disabled={!!editingProfile?.teacherId}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hireDate">{t.emp_finance_form_hire_date}</Label>
                <Input
                  id="hireDate"
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">{t.emp_finance_form_salary} ({settings.currency})</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  placeholder="e.g., 50000"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccount">{t.emp_finance_form_bank_account}</Label>
                <Input
                  id="bankAccount"
                  name="bankAccount"
                  placeholder="Account Number"
                  value={formData.bankAccount}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t.emp_finance_form_status}</Label>
              <Select
                name="status"
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.emp_finance_form_select_status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t.emp_finance_form_status_active}</SelectItem>
                  <SelectItem value="inactive">{t.emp_finance_form_status_inactive}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={resetForm}>
                {t.emp_finance_btn_cancel}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner /> : null}
                {editingProfile ? t.emp_finance_btn_save : t.emp_finance_btn_create}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.emp_finance_attendance_title}</DialogTitle>
            <DialogDescription>
              {t.emp_finance_attendance_desc_prefix}
              {viewingProfile?.teacherId?.full_name || viewingProfile?.name}.
            </DialogDescription>
          </DialogHeader>
          {viewingProfile && (
            <div className="space-y-4">
              <div className="max-h-96 overflow-y-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.emp_finance_attendance_col_date}</TableHead>
                      <TableHead>{t.emp_finance_attendance_col_status}</TableHead>
                      <TableHead className="flex justify-center items-center">
                        {t.emp_finance_attendance_col_time}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewingProfile?.attendanceReport &&
                    viewingProfile?.attendanceReport.length > 0 ? (
                      viewingProfile?.attendanceReport
                        .filter((tx) => tx && tx.status && tx.date)
                        .map((tx, index) => (
                          <TableRow key={index}>
                            <TableCell>{tx.date}</TableCell>
                            <TableCell>{getStatusBadge(tx.status)}</TableCell>
                            <TableCell className="flex justify-center items-center">
                              <Badge variant="outline" className="capitalize">
                                {tx.time || "-"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                          {t.emp_finance_no_attendance}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          <DialogHeader>
            <DialogTitle>{t.emp_finance_transaction_title}</DialogTitle>
            <DialogDescription>
              {t.emp_finance_transaction_desc_prefix}
              {viewingProfile?.teacherId?.full_name || viewingProfile?.name}.
            </DialogDescription>
          </DialogHeader>
          {viewingProfile && (
            <div className="space-y-4">
              <div className="max-h-96 overflow-y-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.emp_finance_transaction_col_date}</TableHead>
                      <TableHead>{t.emp_finance_transaction_col_desc}</TableHead>
                      <TableHead>{t.emp_finance_transaction_col_type}</TableHead>
                      <TableHead className="text-right">{t.emp_finance_transaction_col_amount}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewingProfile.transactions &&
                    viewingProfile.transactions.length > 0 ? (
                      viewingProfile.transactions
                        .filter(
                          (tx) =>
                            tx &&
                            tx._id &&
                            typeof tx.amount === "number" &&
                            !isNaN(tx.amount)
                        )
                        .map((tx) => (
                          <TableRow key={tx._id}>
                            <TableCell>{formatDate(tx.createdAt)}</TableCell>
                            <TableCell>{tx.description || "-"}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {tx.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                              {formatCurrency(tx.amount)}
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                          {t.emp_finance_no_transactions}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Payroll Dialog */}
      <Dialog open={isPayrollDialogOpen} onOpenChange={setIsPayrollDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.emp_finance_payroll_title}</DialogTitle>
            <DialogDescription>
              {t.emp_finance_payroll_desc_prefix} {" "}
              {payrollProfile?.teacherId?.full_name || payrollProfile?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="baseSalary">
                {t.emp_finance_payroll_base_salary} ({settings.currency})
              </Label>
              <Input
                id="baseSalary"
                name="baseSalary"
                type="number"
                value={payrollForm.baseSalary}
                onChange={handlePayrollChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxPercent">{t.emp_finance_payroll_tax_percent}</Label>
              <Input
                id="taxPercent"
                name="taxPercent"
                type="number"
                value={payrollForm.taxPercent}
                onChange={handlePayrollChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="absencePenalty"
                  className="flex gap-2 items-center justify-between"
                >
                  {t.emp_finance_payroll_absence_penalty}
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    Absent:{" "}
                    {
                      payrollProfile?.attendanceReport.filter(
                        (record: any) => record.status === "Absent"
                      ).length
                    }
                  </Badge>
                </Label>
                <Input
                  id="absencePenalty"
                  name="absencePenalty"
                  type="number"
                  value={payrollForm.absencePenalty}
                  onChange={handlePayrollChange}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="latePenalty"
                  className="flex justify-between items-center"
                >
                  {t.emp_finance_payroll_late_penalty}
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    {t.emp_finance_attendance_late}:{" "}
                    {
                      payrollProfile?.attendanceReport.filter(
                        (record: any) => record.status === "Late"
                      ).length
                    }
                  </Badge>
                </Label>
                <Input
                  id="latePenalty"
                  name="latePenalty"
                  type="number"
                  value={payrollForm.latePenalty}
                  onChange={handlePayrollChange}
                />
              </div>
            </div>

            <div className="p-3 border rounded-md bg-gray-50">
              <p className="font-semibold">
                {t.emp_finance_payroll_final_salary}:{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: settings.currency || "USD",
                }).format(
                  payrollForm.baseSalary -
                    (payrollForm.baseSalary * payrollForm.taxPercent) / 100 -
                    payrollForm.absencePenalty -
                    payrollForm.latePenalty
                )}
              </p>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setIsPayrollDialogOpen(false)}
            >
              {t.emp_finance_btn_cancel}
            </Button>
            <Button onClick={(e) => confirmPayroll(e)} disabled={isProcessing}>
              {isProcessing ? <Spinner /> : "Confirm & Pay"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// -------------------- Sub Components --------------------
const SummaryCard = ({
  icon,
  title,
  value,
  isCurrency = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  isCurrency?: boolean;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div
        className={`text-2xl font-bold ${isCurrency ? "text-green-600" : ""}`}
      >
        {value}
      </div>
    </CardContent>
  </Card>
);

const ProfileCard = ({
  profile,
  statusConfig,
  getFinanceStatus,
  formatCurrency,
  formatDate,
  onEdit,
  onDelete,
  onProcessPayroll,
  onViewDetails,
  isProcessing,
}: any) => {
  const financeStatus = getFinanceStatus(profile);
  const config = statusConfig[financeStatus];
  const name = profile.teacherId?.full_name || profile.name || "N/A";
  const { t, isRTL } = useLanguage()


  return (
    <Card key={profile._id} className="relative flex flex-col">
      {isProcessing && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg z-10">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{name}</CardTitle>
          <Badge variant="outline" className={config.className}>
            {config.label}
          </Badge>
        </div>
        <CardDescription>{profile.position || profile.role}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">{t.emp_finance_profile_monthly_salary}</p>
          <p className="font-semibold text-lg">
            {profile.salary ? formatCurrency(profile.salary) : "Not Set"}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{t.emp_finance_profile_last_payment}</p>
          {profile?.transactions[0] ? (
            <p>{formatDate(profile.transactions[0].createdAt)}</p>
          ) : (
            "N/A"
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{t.emp_finance_profile_absence_report}</p>
          {profile?.attendanceReport.filter(
            (record: any) =>
              record.status === "Absent" || record.status === "Late"
          ).length > 0 ? (
            <div className="flex gap-2 flex-wrap items-center py-1">
              {profile?.attendanceReport.filter(
                (record: any) => record.status === "Absent"
              ).length > 0 && (
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                  {t.emp_finance_attendance_absent}:
                  {
                    profile?.attendanceReport.filter(
                      (record: any) => record.status === "Absent"
                    ).length
                  }
                </Badge>
              )}
              {profile?.attendanceReport.filter(
                (record: any) => record.status === "Late"
              ).length > 0 && (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                  {t.emp_finance_attendance_late}:
                  {
                    profile?.attendanceReport.filter(
                      (record: any) => record.status === "Late"
                    ).length
                  }
                </Badge>
              )}
            </div>
          ) : (
            "N/A"
          )}
        </div>
      </CardContent>
      <DialogFooter className="p-4 pt-0 flex flex-col justify-center gap-2">
        <div className="flex flex-col w-full gap-2">
          <div className="w-full flex gap-2 justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(profile)}
              disabled={isProcessing}
              className="w-full flex-1"
            >
              <Eye className="w-4 h-4" /> {t.emp_finance_profile_btn_view}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(profile)}
              disabled={isProcessing}
            >
              <Edit className="w-4 h-4" />
            </Button>
            {profile.role === "STAFF" && !profile.teacherId && (
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => onDelete(profile._id)}
                disabled={isProcessing}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="w-full flex">
            <Button
              size="sm"
              onClick={() => onProcessPayroll(profile)}
              disabled={isProcessing || !profile.salary}
              className={
                isProcessing || !profile.salary
                  ? "w-full flex-1 text-white bg-gray-500 cursor-not-allowed"
                  : "w-full flex-1 bg-green-600 text-white hover:bg-green-700"
              }
            >
              <DollarSign className="w-4 h-4" /> {t.emp_finance_profile_btn_pay_salary}
            </Button>
          </div>
        </div>
      </DialogFooter>
    </Card>
  );
};
