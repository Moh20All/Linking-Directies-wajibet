"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  Users,
  TrendingUp,
  CreditCard,
  Loader2,
  AlertTriangle,
  UserPlus,
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useLanguage } from "@/context/language-context";
// Import Components
import EmployeeFinance from "../finance/employee-finance";
import IncomeOutcome from "../finance/income-outcome";
import StudentPayments from "../finance/student-payments";
import MissingProfiles from "../finance/missing-profiles";
import FinanceOverview from "../finance/finance-overview";

// Import API Service and Types
import {
  getFinancialProfiles,
  getTransactions,
  getMembersWithoutProfile,
  createFinancialProfile,
  updateFinancialProfile,
  deleteFinancialProfile,
  createTransaction,
  createStudentPayment,
  deleteTransaction,
  getDashboardStats,
  FinancialProfile,
  Transaction,
  CreateProfilePayload,
  CreateTransactionPayload,
  CreateStudentPaymentPayload,
  MissingProfilesResponse,
  createFinancialProfilesBulk,
  BulkCreateProfilePayload,
  DashboardStatsResponse,
} from "@/services/staffFinanceService";

export default function FinanceDashboard() {
  const { getFreshToken } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const { t, isRTL } = useLanguage()
  const [profiles, setProfiles] = useState<FinancialProfile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [missingProfiles, setMissingProfiles] =
    useState<MissingProfilesResponse>({
      students: [],
      teachers: [],
    });
  const [dashboardStats, setDashboardStats] =
    useState<DashboardStatsResponse | null>(null);

  const [settings, setSettings] = useState({ currency: "DZD" });

  // Loading states
  const [initialLoading, setInitialLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Reload function like pedagogy ---
  const reloadData = useCallback(
    async (isInitial = false, type: string = "all") => {
      if (isInitial) setInitialLoading(true);
      else setIsRefreshing(true);

      try {
        const token = await getFreshToken();
        if (!token)
          throw new Error("Authentication expired. Please login again.");

        if (type === "profiles" || type === "all") {
          const profilesData = await getFinancialProfiles(token);
          setProfiles(profilesData);
        }
        if (type === "transactions" || type === "all") {
          const transactionsData = await getTransactions(token);
          setTransactions(transactionsData);
        }
        if (type === "missing" || type === "all") {
          const missingProfilesData = await getMembersWithoutProfile(token);
          setMissingProfiles(missingProfilesData);
        }
        if (type === "stats" || type === "all") {
          const statsData = await getDashboardStats(token);
          setDashboardStats(statsData);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load finance data.");
        toast.error("Finance data fetch failed");
      } finally {
        if (isInitial) setInitialLoading(false);
        else setIsRefreshing(false);
      }
    },
    [getFreshToken]
  );

  useEffect(() => {
    reloadData(true, "all");
  }, []);

  // --- Handlers now call reloadData instead of fetchData ---
  const handleCreateProfile = async (payload: CreateProfilePayload) => {
    const token = await getFreshToken();
    if (!token) return;
    try {
      await createFinancialProfile(token, payload);
      toast.success("Financial profile created successfully!");
      reloadData(false, "profiles");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const handleCreateMissingProfiles = async () => {
    const token = await getFreshToken();
    if (!token) return;
    const { students, teachers } = missingProfiles;
    const membersToCreate: BulkCreateProfilePayload[] = [
      ...students,
      ...teachers,
    ].map((m) => ({
      memberId: m._id,
      role: m.role.toUpperCase() as "STUDENT" | "TEACHER",
    }));

    if (membersToCreate.length === 0) {
      toast.info("No missing profiles to create.");
      return;
    }

    setIsCreating(true);
    try {
      const result = await createFinancialProfilesBulk(token, membersToCreate);
      toast.success(result.message);
      if (result.errorCount > 0) {
        toast.error(`${result.errorCount} profiles could not be created`);
      }
      reloadData(false, "missing");
    } catch (error) {
      toast.error("Bulk profile creation failed");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateProfile = async (
    profileId: string,
    updates: Partial<FinancialProfile>
  ) => {
    const token = await getFreshToken();
    if (!token) return;
    try {
      await updateFinancialProfile(token, profileId, updates);
      toast.success("Financial profile updated successfully!");
      reloadData(false, "profiles");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    const token = await getFreshToken();
    if (!token) return;
    if (!confirm("Delete profile and all associated transactions?")) return;
    try {
      await deleteFinancialProfile(token, profileId);
      toast.success("Financial profile deleted!");
      reloadData(false, "profiles");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const handleCreateTransaction = async (
    payload: CreateTransactionPayload | CreateStudentPaymentPayload,
    isStudentPayment: boolean
  ) => {
    const token = await getFreshToken();
    if (!token) return;
    try {
      if (isStudentPayment) {
        await createStudentPayment(
          token,
          payload as CreateStudentPaymentPayload
        );
        toast.success("Student payment recorded!");
      } else {
        await createTransaction(token, payload as CreateTransactionPayload);
        toast.success("Transaction created successfully!");
      }
      reloadData(false, "transactions");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    const token = await getFreshToken();
    if (!token) return;
    if (!confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(token, transactionId);
      toast.success("Transaction deleted!");
      reloadData(false, "transactions");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  // Sidebar items
  const sidebarItems = [
    { id: "overview", label: "Finance Overview", icon: TrendingUp },
    {
      id: "missing",
      label: "Missing Profiles",
      icon: UserPlus,
      count: missingProfiles.students.length + missingProfiles.teachers.length,
    },
    { id: "employees", label: "Employee Finance", icon: Users },
    { id: "payments", label: "Student Payments", icon: CreditCard },
    { id: "income", label: "Income & Outcome", icon: TrendingUp },
  ];

  const renderContent = () => {
    if (initialLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col justify-center items-center h-64 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <FinanceOverview
            isLoading={initialLoading}
            stats={dashboardStats}
            currency={settings.currency}
          />
        );
      case "missing":
        return (
          <MissingProfiles
            missingStudents={missingProfiles.students}
            missingTeachers={missingProfiles.teachers}
            onCreateAll={handleCreateMissingProfiles}
            isLoading={isCreating}
          />
        );
      case "employees":
        return (
          <EmployeeFinance
            profiles={profiles.filter(
              (p) => p.role === "TEACHER" || p.role === "STAFF"
            )}
            settings={settings}
            onCreateProfile={handleCreateProfile}
            onUpdateProfile={handleUpdateProfile}
            onDeleteProfile={handleDeleteProfile}
            onCreateTransaction={handleCreateTransaction}
          />
        );
      case "payments":
        return (
          <StudentPayments
            studentPayments={transactions.filter(
              (t) => t.type === "student_fees"
            )}
            studentProfiles={profiles.filter((p) => p.role === "STUDENT")}
            settings={settings}
            onCreatePayment={handleCreateTransaction}
            onDeletePayment={handleDeleteTransaction}
          />
        );
      case "income":
        return (
          <IncomeOutcome
            transactions={transactions}
            profiles={profiles}
            settings={settings}
            onCreateTransaction={handleCreateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {initialLoading && (
        <div className="absolute h-screen w-screen inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 mr-2 animate-spin" />
          {t.loading_finance_data}
        </div>
      )}
      <div className="flex">
        <Sidebar
          items={sidebarItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="flex-1">
          <Header title="Finance Dashboard" isRefreshing={isRefreshing} />
          <main className="p-6">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
}
