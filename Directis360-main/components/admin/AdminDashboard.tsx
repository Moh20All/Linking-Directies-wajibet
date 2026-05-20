"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getSchools, updateSubscription, School } from "@/services/adminSchoolsService";
import { SchoolsGrid } from "@/components/admin/SchoolsGrid";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { FinanceOverview } from "@/components/admin/FinanceOverview";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, LogOut, RefreshCw, School as SchoolIcon, CheckCircle2, XCircle, Plus, Filter, Bell } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

export function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const [allSchools, setAllSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("schools");
  
  // Filtering & Sorting State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  // Pagination State
  const [page, setPage] = useState(1);
  const limit = 9; // Grid layout fits better with multiples of 3

  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const schoolsData = await getSchools(token);
      setAllSchools(Array.isArray(schoolsData) ? schoolsData : []);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to load schools.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  // Client-side filtering and sorting for Schools Tab
  const processedSchools = useMemo(() => {
    let result = [...allSchools];

    // Search Filter
    if (debouncedSearch) {
      const lowerSearch = debouncedSearch.toLowerCase();
      result = result.filter(
        (s) =>
          s.information.name.toLowerCase().includes(lowerSearch) ||
          s.auth.email.toLowerCase().includes(lowerSearch) ||
          s.derivationKey.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Status Filter (Client side fallback or refinement)
    // Note: If server filtering is used, allSchools is already filtered.
    // But for Search, we need to filter the result. 
    // If we rely on Server for status/plan, we should reset filterStatus local state usage? 
    // No, we are in Hybrid mode. 'filterStatus' triggers server fetch.
    // So 'result' here is already filtered by status from server.
    // However, the SEARCH is client side on that result.
    
    // Sorting
    result.sort((a, b) => {
      let valA: any = a;
      let valB: any = b;

      if (sortBy === "information.name") {
        valA = a.information.name.toLowerCase();
        valB = b.information.name.toLowerCase();
      } else if (sortBy === "substatus") {
        valA = a.substatus ? 1 : 0;
        valB = b.substatus ? 1 : 0;
      } else {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      }

      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [allSchools, debouncedSearch, sortBy, order]);

  /* Derived Stats */
  const stats = useMemo(() => {
    return {
        total: allSchools.length,
        active: allSchools.filter(s => s.substatus).length,
        inactive: allSchools.filter(s => !s.substatus).length
    }
  }, [allSchools]);

  const totalPages = Math.ceil(processedSchools.length / limit);
  const currentPage = Math.min(Math.max(1, page), Math.max(1, totalPages));
  
  const displayedSchools = processedSchools.slice(
      (currentPage - 1) * limit, 
      currentPage * limit
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterStatus, filterPlan]);


  const handleUpdateSubscription = async (
      id: string, 
      action: "activate" | "deactivate", 
      reason?: string, 
      plan?: any,
      status?: "INACTIVE" | "HOLD" | "DELETION"
  ) => {
    setLoadingActionId(id);
    try {
        const updatedSchool = await updateSubscription(token, id, { action, reason, plan, status });
        
        // Optimistic UI update with safe merge
        setAllSchools(prev => prev.map(s => s._id === id ? { ...s, ...updatedSchool } : s));
        
        toast({ title: "Success", description: `Subscription ${action}d successfully.` });
        
        // Carefully refresh the full list to ensure sync
        await fetchSchools();
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
        setLoadingActionId(null);
    }
  };

  // User initials (mocked/derived)
  const userInitials = "AD"; 

  return (
    <div className="min-h-screen bg-slate-50/50">
      <AdminHeader 
        userInitials={userInitials} 
        onLogout={onLogout} 
        title={activeTab === "finance" ? "Finance Overview" : "Schools Management"}
      />

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <Tabs defaultValue="schools" onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                <TabsList className="bg-slate-100 p-1 rounded-lg">
                    <TabsTrigger value="schools" className="px-4 py-2 text-sm">Schools Overview</TabsTrigger>
                    <TabsTrigger value="finance" className="px-4 py-2 text-sm">Finance & Revenue</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={fetchSchools} disabled={loading} className="bg-white border-slate-200 hover:bg-slate-50 shadow-sm">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-muted-foreground" /> : <RefreshCw className="mr-2 h-4 w-4 text-muted-foreground" />}
                        Sync Data
                    </Button>
                    <Link href="/admin/dashboard/schools/create">
                        <Button className="bg-slate-900 hover:bg-slate-800 shadow-sm">
                            <Plus className="mr-2 h-4 w-4" /> Add New School
                        </Button>
                    </Link>
                </div>
            </div>

            <TabsContent value="schools" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                 {/* Stats Overview */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Schools</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <SchoolIcon className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
                        <p className="text-x text-muted-foreground mt-1">Registered institutions</p>
                    </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscriptions</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{stats.active}</div>
                        <p className="text-xs text-muted-foreground mt-1">Operational & accessible</p>
                    </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Inactive / Pending</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                            <XCircle className="h-4 w-4 text-red-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{stats.inactive}</div>
                        <p className="text-xs text-muted-foreground mt-1">Requires attention or setup</p>
                    </CardContent>
                    </Card>
                </div>

                {/* Filters Toolbar */}
                <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <div className="relative w-full xl:max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search schools, email, key..."
                        className="pl-9 h-10 w-full bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={loading && allSchools.length === 0} 
                    />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto overflow-x-auto pb-1 sm:pb-0">
                        {/* Status Filter */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-sm font-medium text-muted-foreground hidden sm:block whitespace-nowrap">Status:</span>
                            <Select value={filterStatus} onValueChange={setFilterStatus} disabled={loading && allSchools.length === 0}>
                                <SelectTrigger className="h-10 w-full sm:w-[130px] bg-slate-50 border-slate-200">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Plan Filter */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-sm font-medium text-muted-foreground hidden sm:block whitespace-nowrap">Plan:</span>
                            <Select value={filterPlan} onValueChange={setFilterPlan} disabled={loading && allSchools.length === 0}>
                                <SelectTrigger className="h-10 w-full sm:w-[130px] bg-slate-50 border-slate-200">
                                    <SelectValue placeholder="All Plans" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Plans</SelectItem>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-px h-6 bg-slate-200 hidden sm:block mx-1"></div>

                        {/* Sorting */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
                            <Select value={sortBy} onValueChange={setSortBy} disabled={loading && allSchools.length === 0}>
                                <SelectTrigger className="h-10 w-full sm:w-[140px] bg-slate-50 border-slate-200">
                                    <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="createdAt">Date Created</SelectItem>
                                    <SelectItem value="information.name">Name</SelectItem>
                                    <SelectItem value="substatus">Status</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Select value={order} onValueChange={(val: any) => setOrder(val)} disabled={loading && allSchools.length === 0}>
                            <SelectTrigger className="h-10 w-full sm:w-[110px] bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Order" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="asc">Ascending</SelectItem>
                                <SelectItem value="desc">Descending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Grid Content */}
                {error ? (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {error}
                            <div className="mt-2">
                                <Button variant="outline" size="sm" onClick={fetchSchools}>Retry</Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                ) : loading && allSchools.length === 0 ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading schools...</span>
                    </div>
                ) : (
                    <>
                        <SchoolsGrid 
                            schools={displayedSchools} 
                            onUpdateSubscription={handleUpdateSubscription} 
                            loadingActionId={loadingActionId}
                        />
                        
                        {(processedSchools.length > 0) && (
                            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground pt-4 border-t">
                                <div className="mb-4 sm:mb-0">
                                    Showing {displayedSchools.length} of {processedSchools.length} results
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span>Page {currentPage} of {Math.max(1, totalPages)}</span>
                                    <div className="flex gap-1">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => setPage(curr => Math.max(1, curr - 1))}
                                            disabled={currentPage === 1 || loading}
                                        >
                                            Prev
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => setPage(curr => Math.min(totalPages, curr + 1))}
                                            disabled={currentPage >= totalPages || loading}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </TabsContent>

            <TabsContent value="finance" className="pt-2">
                <FinanceOverview schools={allSchools} />
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
