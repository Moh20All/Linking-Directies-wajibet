"use client";

import { useMemo, useState } from "react";
import { School } from "@/services/adminSchoolsService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, Calendar, CreditCard, Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinanceOverviewProps {
  schools: School[];
}

export function FinanceOverview({ schools }: FinanceOverviewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // 1. Calculate KPIs
  const kpis = useMemo(() => {
    let totalRevenue = 0;
    let monthlyRevenue = 0;
    let yearlyRevenue = 0;
    let activeSubs = 0;
    let monthlyCount = 0;
    let yearlyCount = 0;

    schools.forEach((school) => {
      // Only count active subscriptions with valid plans
      if (school.substatus && school.subscriptions?.plan) {
        const plan = school.subscriptions.plan;
        const price = plan.price || 0;
        
        activeSubs++;

        if (plan.duration === "Monthly") {
            monthlyCount++;
            monthlyRevenue += price;
            // Annualized
            yearlyRevenue += (price * 12);
            totalRevenue += price; // Current recognized value (simple sum)
        } else if (plan.duration === "Yearly") {
            yearlyCount++;
            yearlyRevenue += price;
            // Monthly Normalized
            monthlyRevenue += (price / 12);
            totalRevenue += price;
        }
      }
    });

    return {
      totalRevenue,
      monthlyRevenue,
      yearlyRevenue,
      activeSubs,
      monthlyCount,
      yearlyCount
    };
  }, [schools]);

  // 2. Prepare Table Data
  const tableData = useMemo(() => {
    let data = schools
      .filter((s) => s.substatus && s.subscriptions?.plan) // Only active paying schools
      .map((s) => ({
        id: s._id,
        name: s.information.name,
        planName: s.subscriptions.plan?.name || "Custom",
        price: s.subscriptions.plan?.price || 0,
        duration: s.subscriptions.plan?.duration || "Unknown",
        status: s.subscriptions.status || "ACTIVE",
        startDate: s.subscriptions.plan?.startingDate,
        endDate: s.subscriptions.plan?.endingDate,
      }));

    // Search Filter
    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        data = data.filter(item => 
            item.name.toLowerCase().includes(lower) || 
            item.planName.toLowerCase().includes(lower)
        );
    }

    // Sorting
    if (sortConfig) {
        data.sort((a: any, b: any) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }

    return data;
  }, [schools, searchTerm, sortConfig]);

  const handleSort = (key: string) => {
      let direction: "asc" | "desc" = "asc";
      if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
          direction = "desc";
      }
      setSortConfig({ key, direction });
  };

  const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('en-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Active Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Sum of active plans</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">MRR (Est.)</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.monthlyRevenue)}</div>
             <p className="text-xs text-muted-foreground mt-1">Monthly Recurring Revenue</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ARR (Est.)</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.yearlyRevenue)}</div>
             <p className="text-xs text-muted-foreground mt-1">Annual Recurring Revenue</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.activeSubs}</div>
             <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                 <span className="text-blue-600 font-medium">{kpis.monthlyCount} Monthly</span>
                 <span>•</span>
                 <span className="text-purple-600 font-medium">{kpis.yearlyCount} Yearly</span>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables & Charts Area */}
      <div className="grid gap-6">
        <Card className="col-span-1 shadow-sm border-slate-200">
             <CardHeader className="flex flex-row items-center justify-between"> 
                 <div>
                    <CardTitle>Revenue Breakdown</CardTitle>
                    <CardDescription>Detailed list of currently active subscriptions.</CardDescription>
                 </div>
                 <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search school or plan..." 
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
             </CardHeader>
             <CardContent>
                 <div className="rounded-md border">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort("name")}>
                                    School Name <ArrowUpDown className="ml-2 h-3 w-3 inline" />
                                </TableHead>
                                <TableHead onClick={() => handleSort("planName")} className="cursor-pointer">Plan</TableHead>
                                <TableHead onClick={() => handleSort("duration")} className="cursor-pointer">Cycle</TableHead>
                                <TableHead onClick={() => handleSort("price")} className="text-right cursor-pointer">Amount (DZD)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead onClick={() => handleSort("endDate")} className="text-right cursor-pointer">Renewal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tableData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No active subscriptions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tableData.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.planName}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={item.duration === "Yearly" ? "bg-purple-100 text-purple-700 hover:bg-purple-100" : "bg-blue-100 text-blue-700 hover:bg-blue-100"}>
                                                {item.duration}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">{formatCurrency(item.price)}</TableCell>
                                        <TableCell>
                                            <Badge className="bg-green-100 text-green-700 border-green-200 shadow-none hover:bg-green-100 uppercase text-[10px]">
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            {item.endDate ? new Date(item.endDate).toLocaleDateString() : "N/A"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                 </div>
             </CardContent>
        </Card>
      </div>
    </div>
  );
}
