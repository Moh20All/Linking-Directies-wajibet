"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
  GraduationCap,
  Banknote,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import {
  Transaction,
  FinancialProfile,
  CreateTransactionPayload,
} from "@/services/staffFinanceService";
import { useLanguage } from "@/context/language-context";

// --- DYNAMIC DATE HELPER ---
/**
 * Calculates the year-to-date period in YYYY-MM format.
 * @returns An object with the start date (e.g., "2024-01") and end date (e.g., "2024-09").
 */
const getYearToDateRange = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // getMonth() is 0-indexed, so add 1

  // Pad the month with a leading zero if it's a single digit (e.g., 9 -> "09")
  const paddedMonth = String(month).padStart(2, "0");

  return {
    start: `${year}-01`, // January of the current year
    end: `${year}-${paddedMonth}`, // Current month of the current year
  };
};

interface FinanceSettings {
  currency: string;
}

interface IncomeOutcomeProps {
  transactions: Transaction[];
  profiles: FinancialProfile[];
  settings: FinanceSettings;
  onCreateTransaction: (
    payload: CreateTransactionPayload,
    isStudentPayment: boolean
  ) => Promise<void>;
  onDeleteTransaction: (transactionId: string) => Promise<void>;
}

export default function IncomeOutcome({
  transactions,
  profiles,
  settings,
  onCreateTransaction,
  onDeleteTransaction,
}: IncomeOutcomeProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { t, isRTL } = useLanguage()
  const [formData, setFormData] = useState({
    type: "inflow" as "inflow" | "outflow",
    amount: "",
    description: "",
  });

  // State for the date range filter, dynamically initialized to Year-to-Date
  const [startDate, setStartDate] = useState(getYearToDateRange().start);
  const [endDate, setEndDate] = useState(getYearToDateRange().end);

  // 1. First, filter transactions based on the selected date range
  const periodTransactions = useMemo(() => {
    if (!startDate || !endDate) {
      return transactions; // If no period is set, show all transactions
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);

    return transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return transactionDate >= start && transactionDate <= end;
    });
  }, [transactions, startDate, endDate]);

  // 2. The original search filter now works on the date-filtered list
  const filteredTransactions = periodTransactions.filter((t) =>
    t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateTransactionPayload = {
      type: formData.type,
      amount: Number(formData.amount),
      description: formData.description,
    };
    await onCreateTransaction(payload, false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ type: "inflow", amount: "", description: "" });
    setIsAddDialogOpen(false);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: settings.currency,
    }).format(amount);

  // 3. The original summary calculations now work on the date-filtered list
  const totalIncome = periodTransactions
    .filter((t) => t.type === "inflow" || t.type === "student_fees")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = periodTransactions
    .filter((t) => t.type === "outflow" || t.type === "salary")
    .reduce((sum, t) => sum + t.amount, 0);

  const getIcon = (type: string) => {
    switch (type) {
      case "inflow":
        return <ArrowUpCircle className="w-5 h-5 text-green-600" />;
      case "outflow":
        return <ArrowDownCircle className="w-5 h-5 text-red-600" />;
      case "salary":
        return <Banknote className="w-5 h-5 text-purple-600" />;
      case "student_fees":
        return <GraduationCap className="w-5 h-5 text-blue-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-emerald-50 to-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-emerald-700">
              {t.inc_out_total_income}
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700">
              {formatCurrency(totalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-rose-50 to-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-rose-700">
              {t.inc_out_total_expenses}
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-700">
              {formatCurrency(totalExpenses)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-slate-50 to-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-700">
              {t.inc_out_net_flow}
            </CardTitle>
            <DollarSign
              className={`h-5 w-5 ${
                totalIncome - totalExpenses >= 0
                  ? "text-emerald-600"
                  : "text-rose-600"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                totalIncome - totalExpenses >= 0
                  ? "text-emerald-700"
                  : "text-rose-700"
              }`}
            >
              {formatCurrency(totalIncome - totalExpenses)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-wrap items-center gap-4">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72"
          />
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-500">{t.inc_out_from_label}</label>
            <Input
              type="month"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-40"
            />
            <label className="text-sm font-medium text-gray-500">{t.inc_out_to_label}</label>
            <Input
              type="month"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-40"
            />
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full px-6">
              <Plus className="w-4 h-4 mr-2" />
              {t.inc_out_add_btn}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-2xl shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {t.inc_out_record_title}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                value={formData.type}
                onValueChange={(v: any) =>
                  setFormData({ ...formData, type: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inflow">{t.inc_out_type_income}</SelectItem>
                  <SelectItem value="outflow">{t.inc_out_type_expense}</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
              <Button type="submit" className="w-full">
                {t.inc_out_save_btn}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.map((t) => (
          <Card
            key={t._id}
            className="flex items-center justify-between px-4 py-3 hover:shadow-md transition rounded-xl"
          >
            <div className="flex items-center gap-3">
              {getIcon(t.type)}
              <div>
                <p className="font-medium">
                  {t.type === "student_fees"
                    ? `Student Fees: ${t.paymentProfileId?.studentId?.full_name}`
                    : t.type === "salary"
                    ? `Salary: ${
                        t.paymentProfileId?.teacherId?.full_name ||
                        t.paymentProfileId?.name
                      }`
                    : t.description}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(t.createdAt).toLocaleDateString()} •{" "}
                  {t.paymentMethod || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`font-semibold ${
                  t.type === "inflow" || t.type === "student_fees"
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {t.type === "inflow" || t.type === "student_fees" ? "+" : "-"}{" "}
                {formatCurrency(t.amount)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteTransaction(t._id)}
                className="text-rose-500 hover:text-rose-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
