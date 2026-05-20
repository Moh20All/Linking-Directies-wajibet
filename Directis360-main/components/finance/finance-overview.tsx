"use client";

import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  ArrowDownLeft,
  ArrowUpRight,
  ClipboardList,
  DollarSign,
  Info,
  Loader2,
  PieChart as PieChartIcon,
  Search,
  Users,
  TrendingUp,
  CalendarDays,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

// --- TYPES ---

interface Transaction {
  _id: string;
  createdAt: string;
  type: string;
  amount: number;
  description: string;
  paymentMethod: string;
  paymentProfileId?: {
    role: string;
    name?: string;
    full_name?: string;
  } | null;
}

interface MonthlyData {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  net: number;
  transactionCount: number;
  incomeByType: Record<string, number>;
  expensesByType: Record<string, number>;
}

interface DashboardStatsResponse {
  overall: {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    incomeByType: Record<string, number>;
    expensesByType: Record<string, number>;
    profileCounts: { students: number; teachers: number; employees: number };
  };
  monthlyData: MonthlyData[];
  latestTransactions: Transaction[];
  message?: string;
}

interface FinanceDashboardProProps {
  isLoading: boolean;
  stats: DashboardStatsResponse | null;
  currency: string;
}

// --- HELPERS ---

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount
  );

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatMonthChart = (monthStr: string) =>
  new Date(monthStr + "-02").toLocaleString("default", {
    month: "short",
    year: "2-digit",
  });

const formatMonthFilter = (monthStr: string) =>
  new Date(monthStr + "-02").toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

const toTitleCase = (str: string) =>
  str
    .replace(/_/g, " ")
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );

// --- SUBCOMPONENTS ---

const StatCard = ({ title, value, icon, color }: any) => (
  <Card className="shadow-sm hover:shadow-md transition-all">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium flex items-center gap-2">
        {icon} {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className={`text-2xl font-semibold ${color}`}>{value}</p>
    </CardContent>
  </Card>
);

const PieChartCard = ({ title, data, COLORS, currency, emptyText }: any) => (
  <div className="text-center">
    <h3 className="font-semibold mb-2">{title}</h3>
    {data.length > 0 ? (
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={65}
          >
            {data.map((entry: any, index: number) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatCurrency(value, currency)}
          />
        </PieChart>
      </ResponsiveContainer>
    ) : (
      <span className="text-sm text-muted-foreground">{emptyText}</span>
    )}
  </div>
);

// --- MAIN COMPONENT ---

export default function FinanceDashboardPro({
  isLoading,
  stats,
  currency,
}: FinanceDashboardProProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [selectedPeriod, setSelectedPeriod] = useState<string>("overall");
  const { t, isRTL } = useLanguage()

  const displayData = useMemo(() => {
    if (!stats) return null;
    if (selectedPeriod === "overall") return stats;

    const monthData = stats.monthlyData.find((m) => m.month === selectedPeriod);
    if (!monthData) return stats;

    const periodTransactions = stats.latestTransactions.filter((tx) =>
      tx.createdAt.startsWith(selectedPeriod)
    );
    return {
      overall: {
        totalIncome: monthData.totalIncome,
        totalExpenses: monthData.totalExpenses,
        netProfit: monthData.net,
        incomeByType: monthData.incomeByType,
        expensesByType: monthData.expensesByType,
        profileCounts: stats.overall.profileCounts,
      },
      monthlyData: stats.monthlyData,
      latestTransactions: periodTransactions,
    };
  }, [stats, selectedPeriod]);

  if (!displayData || isLoading)
    return (
      <div className="flex justify-center items-cente bg-gray-50 rounded-lg">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="ml-3 text-lg text-blue-600">
          {t.fin_dash_loading_msg}
        </p>
      </div>
    );

  if (stats && stats.message)
    return (
      <Card className="text-center py-16">
        <Info className="mx-auto h-14 w-14 text-blue-500" />
        <CardTitle className="mt-4 text-xl font-semibold">
          {t.fin_dash_no_data_title}
        </CardTitle>
        <CardDescription className="mt-2 text-md">
          {stats.message}
        </CardDescription>
      </Card>
    );

  const { overall, monthlyData, latestTransactions } = displayData;

  const incomeChartData = useMemo(
    () =>
      Object.entries(overall.incomeByType).map(([name, value]) => ({
        name: toTitleCase(name),
        value,
      })),
    [overall.incomeByType]
  );

  const expenseChartData = useMemo(
    () =>
      Object.entries(overall.expensesByType).map(([name, value]) => ({
        name: toTitleCase(name),
        value,
      })),
    [overall.expensesByType]
  );

  // const filteredTransactions = useMemo(() => {
  //   const incomeTypes = new Set(Object.keys(overall.incomeByType));
  //   return latestTransactions
  //     .filter((tx) => {
  //       if (typeFilter === "all") return true;
  //       const isIncome = incomeTypes.has(tx.type);
  //       return typeFilter === "income" ? isIncome : !isIncome;
  //     })
  //     .filter(
  //       (tx) =>
  //         tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         tx.paymentProfileId?.role
  //           .toLowerCase()
  //           .includes(searchTerm.toLowerCase())
  //     );
  // }, [latestTransactions, searchTerm, typeFilter, overall.incomeByType]);

  const COLORS = ["#22c55e", "#16a34a", "#4ade80", "#86efac", "#a7f3d0"];
  const COLORS2 = ["#ef4444", "#b91c1c", "#f87171", "#fca5a5", "#fee2e2"];

  return (
    <>
      {!isLoading && (
        <div className="space-y-6 p-4 md:p-6 bg-gray-50/50">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-800">
                {t.fin_dash_title}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t.fin_dash_subtitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-gray-500" />
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[200px] shadow-sm">
                  <SelectValue placeholder={t.fin_dash_period_label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overall">{t.fin_dash_period_overall}</SelectItem>
                  {stats?.monthlyData.map((m) => (
                    <SelectItem key={m.month} value={m.month}>
                      {formatMonthFilter(m.month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <StatCard
                title="Net Profit"
                value={formatCurrency(overall.netProfit, currency)}
                icon={<DollarSign className="w-5 h-5 text-blue-600" />}
                color="text-blue-600"
              />
              <div className="grid grid-cols-2 gap-6">
                <StatCard
                  title="Total Income"
                  value={formatCurrency(overall.totalIncome, currency)}
                  icon={<ArrowUpRight className="w-4 h-4 text-green-600" />}
                  color="text-green-600"
                />
                <StatCard
                  title="Total Expenses"
                  value={formatCurrency(overall.totalExpenses, currency)}
                  icon={<ArrowDownLeft className="w-4 h-4 text-red-600" />}
                  color="text-red-600"
                />
              </div>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-md">
                    <Users className="w-5 h-5 text-gray-500" /> {t.fin_dash_stat_profiles}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t.fin_dash_profiles_students}</span>
                    <strong>{stats?.overall.profileCounts.students}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.fin_dash_profiles_teachers}</span>
                    <strong>{stats?.overall.profileCounts.teachers}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.fin_dash_profiles_staff}</span>
                    <strong>{stats?.overall.profileCounts.employees}</strong>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-gray-500" /> {t.fin_dash_breakdown_title}
                  </CardTitle>
                  <CardDescription>
                    {t.fin_dash_breakdown_desc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <PieChartCard
                    title="Income Sources"
                    data={incomeChartData}
                    COLORS={COLORS}
                    currency={currency}
                    emptyText="No income data available."
                  />
                  <PieChartCard
                    title="Expense Categories"
                    data={expenseChartData}
                    COLORS={COLORS2}
                    currency={currency}
                    emptyText="No expense data available."
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Row: Monthly Performance & Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="shadow-sm lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gray-500" /> {t.fin_dash_monthly_title}
                </CardTitle>
                <CardDescription>
                  {t.fin_dash_monthly_desc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickFormatter={formatMonthChart}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `DZD ${v / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        formatCurrency(value, currency)
                      }
                      cursor={{ fill: "rgba(241,245,249,0.5)" }}
                    />
                    <Legend iconSize={10} />
                    <Bar
                      dataKey="totalIncome"
                      name="Income"
                      radius={[4, 4, 0, 0]}
                    >
                      {monthlyData.map((entry) => (
                        <Cell
                          key={entry.month}
                          fill={
                            entry.month === selectedPeriod
                              ? "#166534"
                              : "#22c55e"
                          }
                        />
                      ))}
                    </Bar>
                    <Bar
                      dataKey="totalExpenses"
                      name="Expenses"
                      radius={[4, 4, 0, 0]}
                    >
                      {monthlyData.map((entry) => (
                        <Cell
                          key={entry.month}
                          fill={
                            entry.month === selectedPeriod
                              ? "#991b1b"
                              : "#ef4444"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm lg:col-span-2">
              <CardHeader>
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-gray-500" />{" "}
                    {t.fin_dash_transactions_title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {t.fin_dash_transactions_desc}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select
                    value={typeFilter}
                    onValueChange={(value: any) => setTypeFilter(value)}
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.fin_dash_transactions_filter_all}</SelectItem>
                      <SelectItem value="income">{t.fin_dash_transactions_filter_income}</SelectItem>
                      <SelectItem value="expense">{t.fin_dash_transactions_filter_expense}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="overflow-y-auto h-[300px] pr-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.fin_dash_transactions_col_details}</TableHead>
                      <TableHead className="text-right">{t.fin_dash_transactions_col_amount}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats && stats.latestTransactions.length > 0 ? (
                      stats.latestTransactions.map((tx) => {
                        const isIncome = Object.keys(
                          stats.overall.incomeByType
                        ).includes(tx.type);
                        return (
                          <TableRow
                            key={tx._id}
                            className="hover:bg-gray-50 transition-all"
                          >
                            <TableCell>
                              <div className="font-medium">
                                {toTitleCase(tx.description)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(tx.createdAt)}{" "}
                                {tx.paymentProfileId?.full_name
                                  ? `- ${tx.paymentProfileId.full_name}`
                                  : ""}
                              </div>
                            </TableCell>
                            <TableCell
                              className={`text-right font-semibold ${
                                isIncome ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {isIncome ? "+" : "-"}{" "}
                              {formatCurrency(tx.amount, currency)}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center h-24">
                          <p className="font-semibold">
                            {t.fin_dash_no_transactions_title}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {t.fin_dash_no_transactions_subtitle}
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
