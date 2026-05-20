"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  getAllMeetingsAdmin,
  confirmMeetingAdmin,
  declineMeetingAdmin,
  deleteMeetingAdmin,
} from "@/services/meetings";
import { Meeting } from "@/types/meeting";

// Shadcn/UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

// Icons
import { Check, X, Trash, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/language-context"


interface MeetingsManagementProps {
  getFreshToken: () => Promise<string | null>;
}

export default function MeetingsManagement({
  getFreshToken,
}: MeetingsManagementProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>();
  const { toast } = useToast();
  const { t, isRTL } = useLanguage()


  const loadMeetings = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getFreshToken();
      if (token) {
        const data = await getAllMeetingsAdmin(token);
        setMeetings(data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch meetings");
      toast({
        title: "Error loading meetings",
        description: err.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const handleAction = async (
    id: string,
    action: "confirm" | "decline" | "delete"
  ) => {
    setActionLoading(id);
    try {
      const token = await getFreshToken();
      if (!token) return;

      if (action === "confirm") await confirmMeetingAdmin(token, id);
      else if (action === "decline") await declineMeetingAdmin(token, id);
      else if (action === "delete") {
        const confirmDelete = window.confirm(
          t.mm_confirm_delete
        );
        if (!confirmDelete) return;
        await deleteMeetingAdmin(token, id);
      }

      toast({
        title: `Meeting ${action}d successfully`,
        variant: "default",
      });

      await loadMeetings();
    } catch (err: any) {
      toast({
        title: `Failed to ${action} meeting`,
        description: err.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Accepted":
      case "Rescheduled Accepted":
      case "Confirmed":
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Declined":
      case "Rescheduled Declined":
      case "Rejected by Admin":
      case "Canceled":
      case "No Show":
        return "bg-red-100 text-red-700";
      case "Approved by Admin":
      case "Rescheduled":
      case "Acknowledged":
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const groupedMeetings = useMemo(() => {
    return meetings.reduce((acc, meeting) => {
      const { status } = meeting;
      if (!acc[status]) acc[status] = [];
      acc[status].push(meeting);
      return acc;
    }, {} as Record<string, Meeting[]>);
  }, [meetings]);

  const sectionOrder = [
    "Action Required (New Requests)",
    "Upcoming & Scheduled",
    "Pending Reschedule",
    "Archived / Closed",
  ];

  const sectionStatuses: Record<string, string[]> = {
    "Action Required (New Requests)": [
      "Requested",
      "Invitation Sent",
      "Acknowledged",
    ],
    "Upcoming & Scheduled": [
      "Approved by Admin",
      "Accepted",
      "Rescheduled Accepted",
      "Confirmed",
      "In Progress",
    ],
    "Pending Reschedule": ["Rescheduled", "Reschedule Requested"],
    "Archived / Closed": [
      "Declined",
      "Rescheduled Declined",
      "Rejected by Admin",
      "Completed",
      "Canceled",
      "No Show",
      "Closed",
    ],
  };

  if (loading)
    return (
      <div className="p-6 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
        <p className="text-lg text-primary">{t.mm_title_loading}</p>
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-700 bg-red-100 rounded-lg">
        {t.mm_title_error}: {error}
        <Button onClick={loadMeetings} variant="secondary" className="ml-4">
          {t.mm_retry_btn}
        </Button>
      </div>
    );

  return (
    <div className="p-6 space-y-8">
      {meetings.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            {t.mm_no_meetings}
          </CardContent>
        </Card>
      ) : (
        sectionOrder.map((sectionTitle) => {
          const meetingsInSection = sectionStatuses[sectionTitle]
            .flatMap((status) => groupedMeetings[status] || [])
            .sort(
              (a, b) =>
                new Date(a.createdAt || a.requestedDate).getTime() -
                new Date(b.createdAt || b.requestedDate).getTime()
            );

          if (!meetingsInSection.length) return null;

          return (
            <div key={sectionTitle}>
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">
                {sectionTitle} ({meetingsInSection.length})
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {meetingsInSection.map((m) => {
                  const isInitialReview = [
                    "Requested",
                    "Invitation Sent",
                    "Acknowledged",
                  ].includes(m.status);
                  const isRescheduleReview = m.status === "Rescheduled";

                  const initiator =
                    m.requesterType === "Teacher"
                      ? m.requesterId?.full_name
                      : m.requesterId?.full_name;
                  const recipient =
                    m.requesterType === "Teacher"
                      ? m.invitedId?.full_name
                      : m.invitedId?.full_name;
                  const primaryContact =
                    m.requesterType === "Teacher" ? recipient : initiator;

                  return (
                    <Card
                      key={m._id}
                      className="hover:shadow-lg transition-shadow duration-200"
                    >
                      <CardHeader>
                        <CardTitle className="flex justify-between items-start text-lg">
                          <span className="font-semibold text-gray-800">
                            {m.cause}
                          </span>
                          <Badge className={statusColor(m.status)}>
                            {m.status}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {t.mm_meeting_with}: {primaryContact || "N/A"} (
                          {m.requesterType})
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p>
                          <b>{t.mm_requested_on}:</b>{" "}
                          {new Date(m.requestedDate).toLocaleString()}
                        </p>
                        {m.scheduledDate && (
                          <p className="text-primary font-medium">
                            <b>{t.mm_scheduled}:</b>{" "}
                            {new Date(m.scheduledDate).toLocaleString()}
                          </p>
                        )}
                        {m.notes && (
                          <p className="italic text-sm text-muted-foreground">
                            <b>{t.mm_notes}:</b> {m.notes}
                          </p>
                        )}

                        <div className="mt-4 flex gap-2 pt-3 border-t">
                          {isInitialReview && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                                onClick={() => handleAction(m._id, "confirm")}
                                disabled={actionLoading === m._id}
                              >
                                {actionLoading === m._id ? (
                                  <Loader2 className="animate-spin w-4 h-4" />
                                ) : (
                                  <Check size={16} />
                                )}
                                {t.mm_btn_approve}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="flex items-center gap-1"
                                onClick={() => handleAction(m._id, "decline")}
                                disabled={actionLoading === m._id}
                              >
                                {actionLoading === m._id ? (
                                  <Loader2 className="animate-spin w-4 h-4" />
                                ) : (
                                  <X size={16} />
                                )}
                                {t.mm_btn_decline}
                              </Button>
                            </>
                          )}

                          {isRescheduleReview && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
                              onClick={() => handleAction(m._id, "confirm")}
                              disabled={actionLoading === m._id}
                            >
                              {actionLoading === m._id ? (
                                <Loader2 className="animate-spin w-4 h-4" />
                              ) : (
                                <Check size={16} />
                              )}
                              {t.mm_btn_confirm_reschedule}
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            className="ml-auto text-red-500 hover:bg-red-50 hover:text-red-700 flex items-center gap-1"
                            onClick={() => handleAction(m._id, "delete")}
                            disabled={actionLoading === m._id}
                          >
                            {actionLoading === m._id ? (
                              <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                              <Trash size={16} />
                            )}
                            {t.mm_btn_delete}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
