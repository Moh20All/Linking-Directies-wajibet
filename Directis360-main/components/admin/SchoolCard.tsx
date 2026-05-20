"use client";

import { School } from "@/services/adminSchoolsService";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ClipboardCopy, 
  Loader2, 
  School as SchoolIcon, 
  Users, 
  Calendar,
  CreditCard
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

import Link from "next/link";

interface SchoolCardProps {
  school: School;
  onUpdateSubscription: (id: string, action: "activate" | "deactivate", reason?: string) => Promise<void>;
  loadingActionId: string | null;
  onDeactivateClick: (school: School) => void;
  onActivateClick: (school: School) => void;
}

export function SchoolCard({ school, onUpdateSubscription, loadingActionId, onDeactivateClick, onActivateClick }: SchoolCardProps) {
  const isProcessing = loadingActionId === school._id;

  const copyToClipboard = (e: React.MouseEvent, text: string, label: string) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast({ description: `${label} copied to clipboard!` });
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    action();
  };

  return (
    <Link href={`/admin/dashboard/schools/${school._id}`} className="block h-full">
      <Card className="flex flex-col h-full group transition-all duration-200 hover:shadow-lg border-slate-200">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex gap-3">
             {/* School Avatar */}
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-lg font-bold shadow-sm ${school.substatus ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                {school.information?.name ? school.information.name.substring(0, 2).toUpperCase() : "SC"}
            </div>
            <div className="space-y-1">
                <CardTitle className="text-base font-semibold text-slate-900 line-clamp-1" title={school.information?.name}>
                {school.information?.name || "Unknown School"}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground line-clamp-1 font-medium" title={school.auth?.email}>
                {school.auth?.email || "No Email"}
                </CardDescription>
            </div>
          </div>
          <Badge
            variant={school.substatus ? "default" : "secondary"}
            className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold ${school.substatus ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200"}`}
          >
            {school.substatus ? "Active" : "Inactive"}
          </Badge>
        </CardHeader>
        
        <CardContent className="flex-1 space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5" /> Plan
                </p>
                <p className="text-sm font-semibold text-slate-700">
                    {school.subscriptions?.plan?.name || "None"}
                </p>
             </div>
             <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> Capacity
                </p>
                <p className="text-sm font-semibold text-slate-700">
                    {school.information?.max_students || "0"} Students
                </p>
             </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Access Key</span>
            <div 
              className="group/key relative bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2.5 font-mono text-xs text-slate-600 flex justify-between items-center cursor-copy hover:border-slate-300 hover:bg-white transition-colors"
              onClick={(e) => copyToClipboard(e, school.derivationKey || "", "Access Key")}
              title="Click to copy"
            >
              <span className="truncate mr-2 select-all">{school.derivationKey || "No Key"}</span>
              <ClipboardCopy className="h-3 w-3 text-slate-400 group-hover/key:text-blue-500 transition-colors" />
            </div>
          </div>
          
           <div className="pt-2 border-t border-slate-100 mt-2">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                    <Calendar className="h-3 w-3" />
                    <span>Registered: {school.createdAt ? format(new Date(school.createdAt), "MMM d, yyyy") : "N/A"}</span>
                </div>
           </div>
        </CardContent>

        <CardFooter className="pt-2 pb-4">
          {school.substatus ? (
            <Button 
              variant="outline" 
              size="sm"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-9 font-medium"
              disabled={isProcessing}
              onClick={(e) => handleAction(e, () => onDeactivateClick(school))}
            >
              {isProcessing ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : "Deactivate Access"}
            </Button>
          ) : (
            <Button 
              size="sm"
              className="w-full bg-green-600 hover:bg-green-700 text-white h-9 shadow-sm hover:shadow font-medium"
              disabled={isProcessing}
              onClick={(e) => handleAction(e, () => onActivateClick(school))}
            >
              {isProcessing ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : "Activate Access"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
