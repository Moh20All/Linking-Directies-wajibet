"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSchoolById, updateSubscription, updateMaxStudents, School } from "@/services/adminSchoolsService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Loader2, School as SchoolIcon, Mail, Key, Users, 
  CreditCard, Calendar, MapPin, AlertTriangle, ChevronRight,
  Pencil, Check, X
} from "lucide-react";
import { format, isValid } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/admin/AdminHeader";
import Link from "next/link";

export default function SchoolDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [actionLoading, setActionLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);

  // Deactivation State
  const [deactivateReason, setDeactivateReason] = useState("");
  const [deactivateReasonType, setDeactivateReasonType] = useState("");
  const [deactivateStatus, setDeactivateStatus] = useState<"INACTIVE" | "HOLD" | "DELETION">("INACTIVE");
  
  // Activation State
  const [activationPlan, setActivationPlan] = useState({
      name: "Basic",
      price: 20000,
      duration: "Yearly" as "Monthly" | "Yearly"
  });

  // Capacity UI State
  const [isEditingCapacity, setIsEditingCapacity] = useState(false);
  const [tempCapacity, setTempCapacity] = useState(0);
  const [isSavingStart, setIsSavingStart] = useState(false);
  const [capacityError, setCapacityError] = useState<string | null>(null);

  const userInitials = "AD";

  const fetchSchoolData = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    if (!token || !id) return;

    try {
      const data = await getSchoolById(token, id);
      setSchool(data);
    } catch (err: any) {
      setError(err.message || "Failed to load school details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSchoolData();
  }, [fetchSchoolData]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin");
  };

  const handleStatusChange = async (action: "activate" | "deactivate") => {
    const token = localStorage.getItem("adminToken");
    if (!token || !school) return;

    setActionLoading(true);
    try {
      const finalReason = action === "deactivate" 
         ? (deactivateReasonType === "Other" ? deactivateReason : deactivateReasonType)
         : "Manual activation by admin";

      await updateSubscription(token, school._id, {
          action,
          status: action === "deactivate" ? deactivateStatus : "ACTIVE",
          reason: finalReason
      });

      toast({ title: "Success", description: `School status updated to ${action}d.` });
      setDialogOpen(false);
      resetActionStates();
      await fetchSchoolData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const confirmActivation = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token || !school) return;

    setActionLoading(true);
    try {
      await updateSubscription(token, school._id, {
          action: "activate",
          plan: { ...activationPlan, startingDate: new Date().toISOString() }
      });
      
      toast({ title: "Activated", description: "Plan successfully assigned." });
      setActivateDialogOpen(false);
      await fetchSchoolData();
    } catch (err: any) {
      toast({ title: "Activation Error", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const resetActionStates = () => {
    setDeactivateReason("");
    setDeactivateReasonType("");
    setDeactivateStatus("INACTIVE");
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isValid(d) ? format(d, "PPP") : "Invalid Date";
  };

  const startEditingCapacity = () => {
    if (school) {
        setTempCapacity(school.information.max_students);
        setIsEditingCapacity(true);
        setCapacityError(null);
    }
  };

  const cancelEditingCapacity = () => {
    setIsEditingCapacity(false);
    setTempCapacity(0);
    setCapacityError(null);
  };

  const saveCapacity = async () => {
      if (!school) return;
      
      // Client-side validation
      if (tempCapacity <= 0) {
          setCapacityError("Must be positive number");
          return;
      }
      
      const token = localStorage.getItem("adminToken");
      if (!token) {
          toast({ title: "Unauthorized", description: "Please log in again.", variant: "destructive" });
          return;
      }

      setCapacityError(null);
      const previousCapacity = school.information.max_students;
      
      // Optimistic Update: Update Display, Close Edit Mode (Temporarily)
      // Actually, to handle "revert on failure" cleanly while showing inline error, 
      // we should maybe keep it in edit mode if it fails? 
      // BUT current requirement says "Optimistic update on success" -> usually implies we assume success and close.
      // IF failure, we revert. 
      // If we revert to logic where we want inline error, we must RE-OPEN edit mode.

      // 1. Optimistic Update (UI Only)
      setSchool({ ...school, information: { ...school.information, max_students: tempCapacity } });
      setIsEditingCapacity(false); 
      setIsSavingStart(true); 

      try {
          await updateMaxStudents(token, school._id, tempCapacity);
          // Success: Do nothing more, state is already updated.
      } catch (err: any) {
          // Failure: Revert School State
          setSchool({ ...school, information: { ...school.information, max_students: previousCapacity } });
          
          // Re-enter Edit Mode to show error
          setIsEditingCapacity(true);
          setTempCapacity(tempCapacity); // Keep the wrong value so user can fix it
          
          // Set Error Message
          let msg = "Update failed";
          if (err.message.includes("401") || err.message.includes("Unauthorized")) msg = "Unauthorized";
          else if (err.message.includes("Network")) msg = "Network error";
          else if (err.message.includes("Failed")) msg = "Update failed"; 

          setCapacityError(msg);
      } finally {
          setIsSavingStart(false);
      }
  };

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (error || !school) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <p className="text-red-500 font-medium">{error || "School not found"}</p>
      <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <AdminHeader userInitials={userInitials} onLogout={handleLogout} title="School Details" />
      
      {/* Action Bar */}
      <div className="bg-white border-b sticky top-0 z-10">
         <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center text-sm text-muted-foreground">
                 <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
                 <ChevronRight className="h-4 w-4 mx-2 text-slate-300" />
                 <Link href="/admin" className="hover:text-primary transition-colors">Schools</Link>
                 <ChevronRight className="h-4 w-4 mx-2 text-slate-300" />
                 <span className="font-medium text-foreground flex items-center gap-2">
                    {school.information.name}
                 </span>
             </div>
             
             <div className="flex items-center gap-3">
                 <Badge variant={school.substatus ? "default" : "secondary"} className={school.substatus ? "bg-green-600" : ""}>
                    {school.substatus ? "Active Subscription" : "Inactive"}
                 </Badge>
                 
                 <Button 
                    variant={school.substatus ? "destructive" : "default"} 
                    size="sm"
                    className={!school.substatus ? "bg-green-600 hover:bg-green-700" : ""}
                    onClick={() => school.substatus ? setDialogOpen(true) : setActivateDialogOpen(true)}
                    disabled={actionLoading}
                 >
                    {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {school.substatus ? "Deactivate Access" : "Activate Access"}
                 </Button>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="info">School Information</TabsTrigger>
              <TabsTrigger value="subscription">Subscription Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>School Information</CardTitle>
                    <CardDescription>Core identity and contact details.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-6 pt-6">
                    <InfoItem icon={<Mail className="h-4 w-4 text-blue-600" />} label="Contact Email" value={school.auth.email} />
                    <InfoItem icon={<Key className="h-4 w-4 text-amber-600" />} label="Derivation Key" value={school.derivationKey} isCode />
                    <InfoItem icon={<SchoolIcon className="h-4 w-4 text-purple-600" />} label="School Type" value={school.information.type} />
                    <InfoItem icon={<MapPin className="h-4 w-4 text-slate-600" />} label="Location" value={`${school.information.location.x}, ${school.information.location.y}`} />
                </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="shadow-sm border-slate-200">
                          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Current Status</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-6">
                               <div className="flex items-center gap-4">
                                   <div className="p-3 bg-blue-50 rounded-full border border-blue-100">
                                       <Calendar className="h-5 w-5 text-blue-600" />
                                   </div>
                                   <div>
                                       <p className="text-sm text-muted-foreground mb-1">Subscription State</p>
                                       <Badge variant={school.subscriptions.status === "ACTIVE" ? "default" : "secondary"} className={`text-sm px-3 py-0.5 ${school.subscriptions.status === "ACTIVE" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}>
                                           {school.subscriptions.status || "N/A"}
                                       </Badge>
                                   </div>
                               </div>
                          </CardContent>
                      </Card>

                      <Card className="shadow-sm border-slate-200">
                           <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                               <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Capacity Limit</CardTitle>
                           </CardHeader>
                          <CardContent className="pt-6">
                               <div className="flex items-center gap-4">
                                   <div className="p-3 bg-purple-50 rounded-full border border-purple-100">
                                       <Users className="h-5 w-5 text-purple-600" />
                                   </div>
                                   <div className="flex-1">
                                      <p className="text-sm text-muted-foreground mb-1">Max Students</p>
                                      {isEditingCapacity ? (
                                          <div className="flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-200">
                                              <div className="flex items-center gap-3">
                                                  <div className={`flex items-center bg-white border rounded-md px-3 py-1 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 ${capacityError ? "border-red-500 ring-red-500/20" : "border-slate-200"}`}>
                                                      <Input 
                                                          type="number" 
                                                          value={tempCapacity} 
                                                          onChange={(e) => setTempCapacity(parseInt(e.target.value) || 0)}
                                                          className="border-0 focus-visible:ring-0 shadow-none h-7 w-20 p-0 text-base font-semibold"
                                                          autoFocus
                                                          disabled={isSavingStart}
                                                      />
                                                  </div>
                                                  <div className="flex items-center gap-1">
                                                      <Button size="icon" className="h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all" onClick={saveCapacity} disabled={isSavingStart}>
                                                          {isSavingStart ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : <Check className="h-4 w-4 text-white" />}
                                                      </Button>
                                                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100" onClick={cancelEditingCapacity} disabled={isSavingStart}>
                                                          <X className="h-4 w-4" />
                                                      </Button>
                                                  </div>
                                              </div>
                                              {capacityError && <span className="text-xs text-red-600 font-medium flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {capacityError}</span>}
                                          </div>
                                      ) : (
                                          <div className="flex items-center gap-2 group cursor-pointer" onClick={startEditingCapacity}>
                                              <p className="text-2xl font-semibold text-slate-900 group-hover:text-primary transition-colors">{school.information.max_students}</p>
                                              <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all">
                                                  <Pencil className="h-3 w-3 text-slate-500" />
                                              </div>
                                          </div>
                                      )}
                                   </div>
                               </div>
                          </CardContent>
                      </Card>
                 </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     <Card className="lg:col-span-1 h-fit shadow-sm border-slate-200">
                        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Plan</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                             <div className="flex items-center gap-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                                 <div className="p-2 bg-white rounded-lg shadow-sm border border-emerald-100">
                                    <CreditCard className="h-6 w-6 text-emerald-600" />
                                 </div>
                                 <div>
                                     <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Current Tier</p>
                                     <p className="text-xl font-bold text-emerald-950">{school.subscriptions.plan?.name || "No Plan"}</p>
                                 </div>
                             </div>
                             {school.subscriptions.plan && (
                                 <div className="space-y-3 text-sm">
                                     <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-200">
                                        <span className="text-muted-foreground">Price</span>
                                        <span className="font-semibold text-slate-900">{school.subscriptions.plan.price.toLocaleString()} DZD</span>
                                     </div>
                                     <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-200">
                                        <span className="text-muted-foreground">Duration</span>
                                        <span className="font-semibold text-slate-900">{school.subscriptions.plan.duration}</span>
                                     </div>
                                     <div className="pt-2">
                                         <p className="text-xs text-muted-foreground mb-1">Valid Until</p>
                                         <p className="font-semibold text-slate-900 flex items-center gap-2">
                                            <Calendar className="h-3 w-3 text-slate-400" />
                                            {formatDate(school.subscriptions.plan.endingDate)}
                                         </p>
                                     </div>
                                 </div>
                             )}
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2 shadow-sm border-slate-200">
                        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Subscription History</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                             <div className="space-y-8 relative border-l-2 border-slate-100 ml-3 pl-8 py-2">
                                {school.subscriptions.history?.length ? [...school.subscriptions.history].reverse().map((hist, idx) => (
                                    <div key={idx} className="relative">
                                        {/* Timeline Dot */}
                                        <div className={`absolute -left-[41px] top-1.5 h-5 w-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${hist.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                        
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg hover:bg-slate-50 transition-colors -mt-2">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-slate-900">{hist.name}</p>
                                                    <Badge variant="outline" className={`text-[10px] uppercase px-1.5 h-5 ${hist.status === 'ACTIVE' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-slate-500'}`}>
                                                        {hist.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium">{hist.price.toLocaleString()} DZD</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-400 font-mono">{formatDate(hist.startingDate)}</p>
                                                {hist.reason && (
                                                    <p className="text-xs text-red-500 flex items-center justify-end gap-1 mt-1 font-medium bg-red-50 px-2 py-0.5 rounded-md w-fit ml-auto">
                                                        <AlertTriangle className="h-3 w-3" /> {hist.reason}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )) : <div className="text-center py-8 text-muted-foreground text-sm">No subscription history available.</div>}
                             </div>
                        </CardContent>
                    </Card>
                </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Deactivation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Deactivate School Access</DialogTitle>
                <DialogDescription>Immediate access revocation. Please select a reason.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
                <div className="space-y-2">
                     <Label>New Status</Label>
                     <Select value={deactivateStatus} onValueChange={(val: any) => setDeactivateStatus(val)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INACTIVE">Inactive (Standard)</SelectItem>
                            <SelectItem value="HOLD">Hold (Temporary)</SelectItem>
                            <SelectItem value="DELETION">Deletion (Pending)</SelectItem>
                        </SelectContent>
                     </Select>
                </div>
                <div className="space-y-2">
                     <Label>Reason</Label>
                     <Select onValueChange={setDeactivateReasonType}>
                        <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Non-payment">Non-payment</SelectItem>
                            <SelectItem value="Trial Ended">Trial Ended</SelectItem>
                            <SelectItem value="Policy Violation">Policy Violation</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                     </Select>
                </div>
                {deactivateReasonType === "Other" && (
                     <Textarea placeholder="Details..." onChange={(e) => setDeactivateReason(e.target.value)} />
                )}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={() => handleStatusChange("deactivate")} disabled={actionLoading || !deactivateReasonType}>
                    Confirm Deactivation
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Activation Dialog */}
      <Dialog open={activateDialogOpen} onOpenChange={setActivateDialogOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>Activate Subscription</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label>Plan</Label>
                         <Select value={activationPlan.name} onValueChange={(val) => setActivationPlan({...activationPlan, name: val})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Basic">Basic</SelectItem>
                                <SelectItem value="Standard">Standard</SelectItem>
                                <SelectItem value="Premium">Premium</SelectItem>
                            </SelectContent>
                         </Select>
                     </div>
                     <div className="space-y-2">
                         <Label>Duration</Label>
                         <Select value={activationPlan.duration} onValueChange={(val: any) => setActivationPlan({...activationPlan, duration: val})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                                <SelectItem value="Yearly">Yearly</SelectItem>
                            </SelectContent>
                         </Select>
                     </div>
                </div>
                <div className="space-y-2">
                    <Label>Price (DZD)</Label>
                    <Input type="number" value={activationPlan.price} onChange={(e) => setActivationPlan({...activationPlan, price: parseInt(e.target.value) || 0})} />
                </div>
            </div>
             <DialogFooter>
                <Button variant="outline" onClick={() => setActivateDialogOpen(false)}>Cancel</Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={confirmActivation} disabled={actionLoading}>
                    Activate Now
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoItem({ icon, label, value, isCode = false }: { icon: React.ReactNode, label: string, value: string, isCode?: boolean }) {
    return (
        <div className="flex items-start gap-4">
            <div className="mt-1 p-2 bg-slate-50 rounded-lg border border-slate-100">{icon}</div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                {isCode ? (
                    <code className="text-sm bg-slate-100 px-2 py-1 rounded border border-slate-200 font-mono break-all text-slate-700">{value}</code>
                ) : (
                    <p className="text-base font-medium text-foreground capitalize">{value}</p>
                )}
            </div>
        </div>
    );
}