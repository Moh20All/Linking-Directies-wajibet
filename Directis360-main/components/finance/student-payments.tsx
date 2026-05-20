"use client";

import type React from "react";
import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  TrendingUp,
  CheckCircle,
  Users,
  Plus,
  Eye,
  Loader2,
  Search,
} from "lucide-react";

import {
  Transaction,
  FinancialProfile,
  CreateStudentPaymentPayload,
} from "@/services/staffFinanceService";
import { useLanguage } from "@/context/language-context"


// --- TYPE DEFINITIONS ---
interface FinanceSettings {
  currency: string;
}

interface StudentPaymentsProps {
  studentPayments: Transaction[];
  studentProfiles: FinancialProfile[];
  settings: FinanceSettings;
  onCreatePayment: (
    payload: CreateStudentPaymentPayload,
    isStudentPayment: boolean
  ) => Promise<void>;
}

type PaymentStatus = "Overdue" | "Due Soon" | "Paid Up" | "Never Paid";
type RevenueFilter = "O" | "A" | "M" | "Q";

// --- COMPONENT ---
export default function StudentPayments({
  studentPayments,
  studentProfiles,
  settings,
  onCreatePayment,
}: StudentPaymentsProps) {
  // --- STATE MANAGEMENT ---
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<FinancialProfile | null>(null);
  const [revenueFilter, setRevenueFilter] = useState<RevenueFilter>("O");
  const { t, isRTL } = useLanguage()


  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    description: "Tuition Fee",
    paymentPlan: "MONTHLY",
    paymentMethod: "cash",
  });

  // --- MEMOIZED HELPERS & CALCULATIONS ---
  const studentPaymentMap = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    studentPayments.forEach((p) => {
      const studentId = p.studentId;
      if (!map.has(studentId)) {
        map.set(studentId, []);
      }
      map.get(studentId)!.push(p);
    });
    map.forEach((payments) =>
      payments.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
    return map;
  }, [studentPayments]);

  const getStudentPayments = (studentId: string) =>
    studentPaymentMap.get(studentId) || [];

  const getNextPaymentDate = (studentId: string): Date | null => {
    const payments = getStudentPayments(studentId);
    if (payments.length === 0) return null;

    const latest = payments[0];
    const nextDate = new Date(latest.createdAt);

    switch (latest.paymentPlan) {
      case "MONTHLY":
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case "QUARTERLY":
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case "YEARLY":
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      default:
        return null;
    }
    return nextDate;
  };

  const getPaymentStatus = (studentId: string): PaymentStatus => {
    const payments = getStudentPayments(studentId);
    if (payments.length === 0) return "Never Paid";

    const nextPaymentDate = getNextPaymentDate(studentId);
    if (!nextPaymentDate) return "Paid Up";

    const today = new Date();
    const daysUntilDue =
      (nextPaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (daysUntilDue < 0) return "Overdue";
    if (daysUntilDue <= 10) return "Due Soon";
    return "Paid Up";
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: settings.currency,
    }).format(amount);

  const formatDate = (date: Date | string | null): string => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // --- FILTERING LOGIC ---
  const filteredStudents = useMemo(() => {
    return studentProfiles.filter((profile) => {
      const studentId = profile.studentId?._id;
      if (!studentId) return false;

      const name = profile.studentId?.full_name || "";
      if (!name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      const payments = getStudentPayments(studentId);
      const status = getPaymentStatus(studentId);

      switch (filter) {
        case "never":
          return status === "Never Paid";
        case "dueSoon":
          return status === "Due Soon" || status === "Overdue";
        case "MONTHLY":
        case "QUARTERLY":
        case "YEARLY":
          return payments.length > 0 && payments[0].paymentPlan === filter;
        case "all":
        default:
          return true;
      }
    });
  }, [studentProfiles, searchTerm, filter, studentPaymentMap]);

  // --- ACTIONS & EVENT HANDLERS ---
  const handleOpenPaymentDialog = (student: FinancialProfile) => {
    setSelectedStudent(student);
    setSubmitError(null);
    setIsPaymentDialogOpen(true);
  };

  const handleOpenDetailsDialog = (student: FinancialProfile) => {
    setSelectedStudent(student);
    setIsDetailsDialogOpen(true);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent?.studentId?._id) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload: CreateStudentPaymentPayload = {
        studentId: selectedStudent.studentId._id,
        amount: Number(paymentForm.amount),
        description: paymentForm.description,
        paymentPlan: paymentForm.paymentPlan as any,
        paymentMethod: paymentForm.paymentMethod as any,
      };
      await onCreatePayment(payload, true);

      setIsPaymentDialogOpen(false);
      setPaymentForm({
        amount: "",
        description: "Tuition Fee",
        paymentPlan: "MONTHLY",
        paymentMethod: "cash",
      });
    } catch (error) {
      console.error("Failed to create payment:", error);
      setSubmitError("Failed to save payment. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DERIVED STATS FOR SUMMARY CARDS ---
  const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
  const averagePayment =
    studentPayments.length > 0 ? totalPaid / studentPayments.length : 0;

  const filteredTotalRevenue = useMemo(() => {
    if (revenueFilter === "O") {
      return totalPaid;
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentQuarter = Math.floor(currentMonth / 3);

    const filtered = studentPayments.filter((p) => {
      const paymentDate = new Date(p.createdAt);
      if (paymentDate.getFullYear() !== currentYear) return false;

      switch (revenueFilter) {
        case "M":
          return paymentDate.getMonth() === currentMonth;
        case "Q":
          return Math.floor(paymentDate.getMonth() / 3) === currentQuarter;
        case "A":
          return true;
        default:
          return false;
      }
    });

    return filtered.reduce((sum, p) => sum + p.amount, 0);
  }, [studentPayments, revenueFilter, totalPaid]);

  // --- RENDER ---
  const renderStatusBadge = (status: PaymentStatus) => {
    const statusStyles: Record<
      PaymentStatus,
      { text: string; className: string }
    > = {
      "Paid Up": {
        text: "Paid Up",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      "Due Soon": {
        text: "Due Soon",
        className: "bg-amber-100 text-amber-800 border-amber-200",
      },
      Overdue: {
        text: "Overdue",
        className: "bg-red-100 text-red-800 border-red-200 font-semibold",
      },
      "Never Paid": {
        text: "Never Paid",
        className: "bg-slate-100 text-slate-600 border-slate-200",
      },
    };

    const { text, className } = statusStyles[status];
    return (
      <Badge variant="outline" className={className}>
        {text}
      </Badge>
    );
  };

  const revenueFilterOptions: {
    label: string;
    value: RevenueFilter;
    title: string;
  }[] = [
    { label: "O", value: "O", title: "Overall" },
    { label: "M", value: "M", title: "This Month" },
    { label: "Q", value: "Q", title: "This Quarter" },
    { label: "A", value: "A", title: "This Year" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.stdpay_title}</h1>
        <p className="text-muted-foreground">
          {t.stdpay_description}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t.stdpay_card_students}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentProfiles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t.stdpay_card_transactions}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentPayments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div className="space-y-2">
              <CardTitle className="text-sm font-medium">
                {t.stdpay_card_revenue}
              </CardTitle>
              <div className="flex items-center gap-1">
                {revenueFilterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setRevenueFilter(opt.value)}
                    title={opt.title}
                    className={`flex items-center justify-center h-6 w-6 rounded-md text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      revenueFilter === opt.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-slate-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(filteredTotalRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t.stdpay_card_average}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(averagePayment)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Toolbar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center">
          <Input
            placeholder={t.stdpay_search_placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto sm:flex-grow"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.stdpay_filter_all}</SelectItem>
              <SelectItem value="dueSoon">{t.stdpay_filter_due}</SelectItem>
              <SelectItem value="never">{t.stdpay_filter_never}</SelectItem>
              <SelectItem value="MONTHLY">{t.stdpay_filter_monthly}</SelectItem>
              <SelectItem value="QUARTERLY">{t.stdpay_filter_quarterly}</SelectItem>
              <SelectItem value="YEARLY">{t.stdpay_filter_yearly}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Student Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => {
            if (!student.studentId?._id) return null;
            const studentId = student.studentId._id;
            const name = student.studentId?.full_name || "Unnamed Student";
            const payments = getStudentPayments(studentId);
            const nextPayment = getNextPaymentDate(studentId);
            const status = getPaymentStatus(studentId);

            return (
              <Card key={student._id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{name}</CardTitle>
                    {renderStatusBadge(status)}
                  </div>
                  <CardDescription>
                    {t.stdpay_label_plan}:{" "}
                    {payments.length > 0 ? payments[0].paymentPlan : "Not Set"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t.stdpay_last_payment}
                    </p>
                    <p>{formatDate(payments[0]?.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t.stdpay_next_due}
                    </p>
                    <p>{formatDate(nextPayment)}</p>
                  </div>
                </CardContent>
                <DialogFooter className="p-4 pt-0 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleOpenPaymentDialog(student)}
                  >
                    <Plus className="w-4 h-4 mr-2" /> {t.stdpay_btn_record_payment}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDetailsDialog(student)}
                  >
                    <Eye className="w-4 h-4 mr-2" /> {t.stdpay_btn_view_details}
                  </Button>
                </DialogFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-semibold">{t.stdpay_no_students_title}</h3>
          <p className="mt-1 text-muted-foreground">
            {t.stdpay_no_students_text}
          </p>
        </div>
      )}

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t.stdpay_dialog_record_title}</DialogTitle>
            <DialogDescription>
              {t.stdpay_dialog_record_for_prefix} {selectedStudent?.studentId?.full_name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPayment} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                {t.stdpay_label_amount}
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder={`Amount in ${settings.currency}`}
                value={paymentForm.amount}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, amount: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                {t.stdpay_label_description}
              </Label>
              <Input
                id="description"
                value={paymentForm.description}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentPlan" className="text-right">
                {t.stdpay_label_plan}
              </Label>
              <Select
                value={paymentForm.paymentPlan}
                onValueChange={(v) =>
                  setPaymentForm({ ...paymentForm, paymentPlan: v })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">{t.stdpay_option_monthly}</SelectItem>
                  <SelectItem value="QUARTERLY">{t.stdpay_option_quarterly}</SelectItem>
                  <SelectItem value="YEARLY">{t.stdpay_option_yearly}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentMethod" className="text-right">
                {t.stdpay_label_method}
              </Label>
              <Select
                value={paymentForm.paymentMethod}
                onValueChange={(v) =>
                  setPaymentForm({ ...paymentForm, paymentMethod: v })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">{t.stdpay_option_cash}</SelectItem>
                  <SelectItem value="card">{t.stdpay_option_card}</SelectItem>
                  <SelectItem value="bank_transfer">{t.stdpay_option_bank}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {submitError && (
              <p className="text-sm text-red-500 text-center col-span-4">
                {submitError}
              </p>
            )}
            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? t.stdpay_btn_saving : t.stdpay_btn_save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.stdpay_dialog_history_title}</DialogTitle>
            <DialogDescription>
              {t.stdpay_dialog_history_prefix} {selectedStudent?.studentId?.full_name}.
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="max-h-96 overflow-y-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.stdpay_table_date}</TableHead>
                      <TableHead>{t.stdpay_table_desc}</TableHead>
                      <TableHead>{t.stdpay_table_plan}</TableHead>
                      <TableHead>{t.stdpay_table_method}</TableHead>
                      <TableHead className="text-right">{t.stdpay_table_amount}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getStudentPayments(selectedStudent.studentId!._id).length >
                    0 ? (
                      getStudentPayments(selectedStudent.studentId!._id).map(
                        (t) => (
                          <TableRow key={t._id}>
                            <TableCell>{formatDate(t.createdAt)}</TableCell>
                            <TableCell>{t.description}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{t.paymentPlan}</Badge>
                            </TableCell>
                            <TableCell className="capitalize">
                              {t.paymentMethod}
                            </TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                              {formatCurrency(t.amount)}
                            </TableCell>
                          </TableRow>
                        )
                      )
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                          {t.stdpay_table_no_data}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end items-center p-4 bg-slate-50 rounded-md dark:bg-slate-800">
                <span className="text-lg font-semibold">{t.stdpay_total_paid}:</span>
                <span className="text-lg font-bold text-green-600 ml-2">
                  {formatCurrency(
                    getStudentPayments(selectedStudent.studentId!._id).reduce(
                      (acc, t) => acc + t.amount,
                      0
                    )
                  )}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
