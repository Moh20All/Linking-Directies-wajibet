"use client";

import { useState } from "react";
import { School } from "@/services/adminSchoolsService";
import { SchoolCard } from "./SchoolCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, School as SchoolIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";  // Added Import
import { toast } from "@/components/ui/use-toast";

interface SchoolsGridProps {
  schools: School[];
  onUpdateSubscription: (
      id: string, 
      action: "activate" | "deactivate", 
      reason?: string, 
      plan?: any,
      status?: "INACTIVE" | "HOLD" | "DELETION"
  ) => Promise<void>; 
  loadingActionId: string | null;
}

export function SchoolsGrid({ schools, onUpdateSubscription, loadingActionId }: SchoolsGridProps) {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  
  // Deactivation State
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [deactivationReason, setDeactivationReason] = useState(""); // Custom manual reason
  const [deactivationReasonType, setDeactivationReasonType] = useState(""); // Selected predefined reason
  const [deactivationStatus, setDeactivationStatus] = useState<"INACTIVE" | "HOLD" | "DELETION">("INACTIVE");

  // Activation State
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
  const [activationPlan, setActivationPlan] = useState<{
      name: string;
      price: number;
      duration: "Monthly" | "Yearly";
  }>({ name: "Basic", price: 20000, duration: "Yearly" });


  const handleDeactivateClick = (school: School) => {
    setSelectedSchool(school);
    setDeactivationReason("");
    setDeactivationReasonType("");
    setDeactivationStatus("INACTIVE");
    setIsDeactivateDialogOpen(true);
  };

  const handleDeactivateConfirm = async () => {
    if (!selectedSchool) return;
    const finalReason = deactivationReasonType === "Other" ? deactivationReason : deactivationReasonType;
    
    await onUpdateSubscription(selectedSchool._id, "deactivate", finalReason, undefined, deactivationStatus);
    setIsDeactivateDialogOpen(false);
  };

  const handleActivateClick = (school: School) => {
      setSelectedSchool(school);
      // Reset plan to default or handle based on prev logic? Default is fine.
      setActivationPlan({ name: "Basic", price: 20000, duration: "Yearly" });
      setIsActivateDialogOpen(true);
  };

  const handleActivateConfirm = async () => {
      if (!selectedSchool) return;
      
      const startingDate = new Date();
      const planPayload = {
          ...activationPlan,
          startingDate: startingDate.toISOString()
      };

      await onUpdateSubscription(selectedSchool._id, "activate", undefined, planPayload);
      setIsActivateDialogOpen(false);
      toast({ description: "School activated successfully." });
  };

  if (schools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <SchoolIcon className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No schools found</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            We couldn't find any schools matching your search. Try adjusting the filters or search terms.
        </p>
      </div>
    );
  }
 
  // Ensure SchoolIcon is imported if not already. It is imported as part of lines 17 or similar?
  // Checking imports: line 17 has Loader2. 
  // I need to ensure School, SearchX or similar is imported. 'School' is imported as 'SchoolIcon' in line 4/5? 
  // No, checking imports: line 4 imports School type.
  // I need to add 'School' to lucide-react imports if not present.
  // Wait, I am replacing lines 97-102. 
  // Let me check existing imports in lines 1-20. 
  // I will assume SchoolIcon is NOT imported from lucide-react yet in this file, or is it?
  // StartLine 17 in previous view: import { Loader2 } from "lucide-react";
  // I need to add School (as SchoolIcon) to imports first.


  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {schools.map((school, index) => (
          <SchoolCard
            key={school._id || `school-${index}`}
            school={school}
            onUpdateSubscription={onUpdateSubscription as any} // Cast safely or update type
            loadingActionId={loadingActionId}
            onDeactivateClick={handleDeactivateClick}
            onActivateClick={handleActivateClick}
          />
        ))}
      </div>

      <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        {/* ... Deactivate Dialog Content (Same as before) ... */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate access for <strong>{selectedSchool?.information?.name}</strong>?
              This will block access for all school members immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="grid gap-2">
                 <Label>New Status</Label>
                 <Select 
                    value={deactivationStatus} 
                    onValueChange={(val: "INACTIVE" | "HOLD" | "DELETION") => setDeactivationStatus(val)}
                 >
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="INACTIVE">Inactive (Standard)</SelectItem>
                        <SelectItem value="HOLD">Hold (Temporary)</SelectItem>
                        <SelectItem value="DELETION">Deletion (Pending Removal)</SelectItem>
                    </SelectContent>
                 </Select>
            </div>
            <div className="space-y-2">
                 <Label>Reason for Deactivation</Label>
                 <Select 
                    onValueChange={(val) => setDeactivationReasonType(val)}
                 >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Non-payment">Non-payment</SelectItem>
                        <SelectItem value="Trial Ended">Trial Ended</SelectItem>
                        <SelectItem value="Policy Violation">Policy Violation</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                 </Select>
            </div>
            {deactivationReasonType === "Other" && (
                 <div className="space-y-2">
                     <Textarea 
                        placeholder="Please specify..." 
                        value={deactivationReason}
                        onChange={(e) => setDeactivationReason(e.target.value)}
                     />
                 </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeactivateDialogOpen(false)} disabled={!!loadingActionId}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeactivateConfirm} disabled={!deactivationReasonType || (deactivationReasonType === "Other" && !deactivationReason) || !!loadingActionId}>
               {loadingActionId === selectedSchool?._id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Activation Dialog */}
      <Dialog open={isActivateDialogOpen} onOpenChange={setIsActivateDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Activate Subscription</DialogTitle>
                <DialogDescription>
                    Define the new subscription plan for <strong>{selectedSchool?.information?.name}</strong>.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label>Plan Name</Label>
                         <Select 
                            value={activationPlan.name} 
                            onValueChange={(val) => setActivationPlan({...activationPlan, name: val})}
                         >
                            <SelectTrigger>
                                <SelectValue placeholder="Name" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Basic">Basic</SelectItem>
                                <SelectItem value="Standard">Standard</SelectItem>
                                <SelectItem value="Premium">Premium</SelectItem>
                            </SelectContent>
                         </Select>
                     </div>
                     <div className="space-y-2">
                         <Label>Duration</Label>
                         <Select 
                            value={activationPlan.duration} 
                            onValueChange={(val: "Monthly" | "Yearly") => setActivationPlan({...activationPlan, duration: val})}
                         >
                            <SelectTrigger>
                                <SelectValue placeholder="Duration" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                                <SelectItem value="Yearly">Yearly</SelectItem>
                            </SelectContent>
                         </Select>
                     </div>
                </div>
                 <div className="space-y-2">
                     <Label>Price (DZD)</Label>
                     <Input 
                        type="number" 
                        value={activationPlan.price}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setActivationPlan({...activationPlan, price: parseInt(e.target.value) || 0})}
                     />
                 </div>
            </div>
             <DialogFooter>
                <Button variant="outline" onClick={() => setIsActivateDialogOpen(false)} disabled={!!loadingActionId}>Cancel</Button>
                <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleActivateConfirm}
                    disabled={!!loadingActionId}
                >
                    {loadingActionId === selectedSchool?._id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Activate
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
