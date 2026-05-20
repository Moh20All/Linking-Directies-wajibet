"use client";

import { School } from "@/services/adminSchoolsService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

interface SchoolsTableProps {
  schools: School[];
  onUpdateSubscription: (id: string, action: "activate" | "deactivate", reason?: string) => Promise<void>;
  loadingActionId: string | null;
}

export function SchoolsTable({ schools, onUpdateSubscription, loadingActionId }: SchoolsTableProps) {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [deactivationReason, setDeactivationReason] = useState("");

  const handleDeactivateClick = (school: School) => {
    setSelectedSchool(school);
    setDeactivationReason("");
    setIsDeactivateDialogOpen(true);
  };

  const handleDeactivateConfirm = async () => {
    if (!selectedSchool) return;
    // Don't modify state here, bubble up to parent
    await onUpdateSubscription(selectedSchool._id, "deactivate", deactivationReason);
    setIsDeactivateDialogOpen(false);
  };

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Assigned Key</TableHead>
              <TableHead>Max Stud.</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
               <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Explicitly handle empty data state */}
            {(!schools || schools.length === 0) ? (
                <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        No schools found.
                    </TableCell>
                </TableRow>
            ) : (
                schools.map((school) => {
                    const isProcessing = loadingActionId === school._id;
                    return (
                        <TableRow key={school._id}>
                            <TableCell className="font-medium">{school.information.name}</TableCell>
                            <TableCell>{school.auth.email}</TableCell>
                            <TableCell className="font-mono text-xs">{school.derivationKey}</TableCell>
                            <TableCell>{school.information.max_students}</TableCell>
                            <TableCell>
                            <Badge
                                variant={school.substatus ? "default" : "destructive"}
                                className={school.substatus ? "bg-green-600" : "bg-red-600"}
                            >
                                {school.substatus ? "Active" : "Inactive"}
                            </Badge>
                            </TableCell>
                            <TableCell>
                            {school.subscriptions?.plan?.name || "N/A"}
                            </TableCell>
                            <TableCell>
                            {format(new Date(school.createdAt), "yyyy-MM-dd")}
                            </TableCell>
                            <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={isProcessing}>
                                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin"/> : <MoreHorizontal className="h-4 w-4" />}
                                    <span className="sr-only">Open menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(school._id)}>
                                    Copy ID
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {school.substatus ? (
                                    <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600"
                                    onClick={() => handleDeactivateClick(school)}
                                    >
                                    Deactivate Subscription
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem
                                        className="text-green-600 focus:text-green-600"
                                        onClick={() => onUpdateSubscription(school._id, "activate")}
                                    >
                                    Activate Subscription
                                    </DropdownMenuItem>
                                )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    );
                })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate access for <strong>{selectedSchool?.information.name}</strong>?
              This will block access for all school members.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for deactivation</Label>
              <Input
                id="reason"
                value={deactivationReason}
                onChange={(e) => setDeactivationReason(e.target.value)}
                placeholder="e.g., Non-payment"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeactivateDialogOpen(false)} disabled={!!loadingActionId}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeactivateConfirm} disabled={!deactivationReason || !!loadingActionId}>
               {loadingActionId === selectedSchool?._id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
