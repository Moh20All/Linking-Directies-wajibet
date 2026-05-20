"use client";
import { useEffect, useState } from "react";
import {
  requestMeeting,
  getTeacherMeetings,
  respondMeeting,
  ParentInfo,
  rescheduleMeetingTeacher,
} from "@/services/meetings";
import { Meeting, MeetingCause } from "@/types/meeting";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/language-context";



interface TeacherMeetingsPageProps {
  getFreshToken: () => Promise<string | null>;
}

export default function TeacherMeetingsPage({
  getFreshToken,
}: TeacherMeetingsPageProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [availableParents, setAvailableParents] = useState<ParentInfo[]>([]);
  const [parentId, setParentId] = useState<string>("");
  const [cause, setCause] = useState<MeetingCause | "">("");
  const [requestedDate, setRequestedDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [rescheduleDate, setRescheduleDate] = useState<string>("");
  const { t, isRTL } = useLanguage()


  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    const token = await getFreshToken();
    if (token) {
      const data = await getTeacherMeetings(token);
      setMeetings(data.meetings);
      setAvailableParents(data.availableParents);
    }
  };

  const handleRequest = async () => {
    if (!parentId || !cause || !requestedDate)
      return alert("Please fill all required fields!");
    const token = await getFreshToken();
    if (token) {
      await requestMeeting(token, {
        invitedId: parentId,
        cause,
        requestedDate,
        notes,
      });
      loadMeetings();
      setParentId("");
      setCause("");
      setRequestedDate("");
      setNotes("");
    }
  };

  const handleRespond = async (
    id: string,
    action: "accept" | "decline" | "reschedule"
  ) => {
    const token = await getFreshToken();
    if (token) {
      await respondMeeting(token, id, action);
      loadMeetings();
    }
  };

  const handleReschedule = async (
    id: string,
    action: "confirm" | "decline"
  ) => {
    const token = await getFreshToken();
    if (!token) return;

    if (action === "confirm" && !rescheduleDate)
      return alert("Please pick a new date!");

    if (action === "confirm") {
      await rescheduleMeetingTeacher(token, id, {
        newDate: rescheduleDate,
      });
    } else {
      await rescheduleMeetingTeacher(token, id, {
        decline: true,
      });
    }

    setRescheduleDate("");
    loadMeetings();
  };

  const filteredParents = availableParents.filter(
    (p) =>
      p.full_name.toLowerCase().includes(filter.toLowerCase()) ||
      p.children.some((c) =>
        c.full_name.toLowerCase().includes(filter.toLowerCase())
      )
  );

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
        // Requested, Invitation Sent, Reschedule Requested, Pending, Closed
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // Group meetings by status
  const groupedMeetings = meetings.reduce((acc, meeting) => {
    const { status } = meeting;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(meeting);
    return acc;
  }, {} as Record<string, Meeting[]>);

  // Define the order and titles for sections
  const sectionOrder = [
    "Action Required",
    "Upcoming Meetings",
    "Pending Approval",
    "Archived",
  ];

  const sectionStatuses: Record<string, string[]> = {
    // Teacher needs to Accept/Decline (Initial request approved by admin, or Parent wants to reschedule)
    "Action Required": ["Approved by Admin", "Reschedule Requested"],
    // Meetings that are confirmed or in progress
    "Upcoming Meetings": [
      "Accepted",
      "Rescheduled Accepted",
      "Confirmed",
      "In Progress",
    ],
    // Meetings waiting for an initial response from the Admin/Parent
    "Pending Approval": ["Requested", "Invitation Sent", "Acknowledged"],
    // Completed, Declined, Cancelled, Rejected, or Fully Rescheduled
    Archived: [
      "Declined",
      "Rescheduled",
      "Rescheduled Declined",
      "Rejected by Admin",
      "Completed",
      "Canceled",
      "No Show",
      "Closed",
    ],
  };

  return (
    <div className="p-6 space-y-8">
      {/* Request Meeting Card (unchanged) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">{t.teacher_meetings_request_title} </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-2 flex flex-col gap-2">
              <Label>{t.teacher_meetings_select_parent}</Label>
              <Input
                placeholder="Search parent or child..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <Select
                onValueChange={(val) => setParentId(val)}
                value={parentId || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose Parent" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  {filteredParents.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      <div className="flex flex-col justify-center items-start">
                        <span className="font-medium">{p.full_name}</span>
                        <span className="text-xs text-muted-foreground">
                          Children:
                          {p.children
                            .map(
                              (c) =>
                                ` ${c.full_name} (Group ${
                                  c.registeredGroupId.split("-")[1]
                                }-${c.registeredGroupId.split("-")[2]}-${
                                  c.registeredGroupId.split("-")[3]
                                })`
                            )
                            .join("\n")}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Cause</Label>
              <Select
                onValueChange={(val) => setCause(val as MeetingCause)}
                value={cause || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.teacher_meetings_select_cause} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic Performance">
                    {t.teacher_meetings_cause_academic}
                  </SelectItem>
                  <SelectItem value="Behavioral Issues">
                    {t.teacher_meetings_cause_behavioral}
                  </SelectItem>
                  <SelectItem value="Attendance Issues">
                    {t.teacher_meetings_cause_attendance}
                  </SelectItem>
                  <SelectItem value="Health & Wellbeing">
                    {t.teacher_meetings_cause_health}
                  </SelectItem>
                  <SelectItem value="Administrative Request">
                    {t.teacher_meetings_cause_admin}
                  </SelectItem>
                  <SelectItem value="Extracurricular Activities">
                    {t.teacher_meetings_cause_extra}
                  </SelectItem>
                  <SelectItem value="General Follow-up">
                    {t.teacher_meetings_cause_followup}
                  </SelectItem>
                  <SelectItem value="Conflict Resolution">
                    {t.teacher_meetings_cause_conflict}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t.teacher_meetings_date_label}</Label>
              <Input
                type="datetime-local"
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-2">
              <Label>{t.teacher_meetings_notes_label} </Label>
              <Input
                placeholder={t.teacher_meetings_notes_placeholder}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleRequest}>{t.teacher_meetings_send_request}</Button>
          </div>
        </CardContent>
      </Card>

      {/* List Meetings - Now with sections */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{t.teacher_meetings_list_title}</h2>
        {meetings.length > 0 ? (
          <div className="space-y-6">
            {sectionOrder.map((sectionTitle) => {
              // Get all meetings that fall under the current section
              const meetingsInSection = sectionStatuses[sectionTitle]
                .flatMap((status) => groupedMeetings[status] || [])
                .sort(
                  (a, b) =>
                    new Date(a.requestedDate).getTime() -
                    new Date(b.requestedDate).getTime()
                );

              // If there are no meetings for this section, don't render it
              if (meetingsInSection.length === 0) {
                return null;
              }

              return (
                <div key={sectionTitle}>
                  <h3 className="text-lg font-semibold mb-3 border-b pb-2">
                    {sectionTitle}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {meetingsInSection.map((m) => (
                      <Card key={m._id}>
                        <CardHeader>
                          <CardTitle className="flex justify-between items-center">
                            <span className="font-normal text-gray-800">
                              <span className="text-black font-semibold">
                                {m.requesterType === "Teacher"
                                  ? "Meeting with: "
                                  : "Meeting Request By: "}
                              </span>
                              {m.requesterType === "Teacher"
                                ? m.invitedId?.full_name
                                : m.requesterId?.full_name}
                            </span>
                            {/* <span>{m.invitedId?.full_name || "Parent"}</span> */}
                            <Badge className={statusColor(m.status)}>
                              {m.status}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p>
                            <b>{t.teacher_meetings_cause_display}:</b> {m.cause}
                          </p>
                          <p>
                            <b>{t.teacher_meetings_meeting_on}:</b>{" "}
                            {new Date(m.requestedDate).toLocaleString()}
                          </p>
                          {m.scheduledDate && (
                            <p>
                              <b>{t.teacher_meetings_scheduled}:</b>{" "}
                              {new Date(m.scheduledDate).toLocaleString()}
                            </p>
                          )}
                          {m.notes && (
                            <p className="italic text-sm text-muted-foreground">
                              <b>{t.teacher_meetings_notes}:</b> {m.notes}
                            </p>
                          )}
                          {Array.isArray(m.invitedId?.children) &&
                            m.invitedId.children.length > 0 && (
                              <div>
                                <b>{t.teacher_meetings_children}:</b>
                                <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                                  {m.invitedId.children.map((c: any) => (
                                    <li key={c._id}>
                                      {c.full_name} ( {t.teacher_meetings_group}:
                                      {c.registeredGroupId
                                        ?.split("-")
                                        .slice(1)
                                        .join("-") || "N/A"}
                                      )
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          {(m.status === "Approved by Admin" ||
                            (m.status === "Rescheduled" &&
                              m.invitedType === "Parent") ||
                            m.status === "Acknowledged" ||
                            m.status === "Invitation Sent") &&
                            m.status !== "Accepted" &&
                            m.status !== "Declined" && (
                              <div className="mt-3 flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleRespond(m._id, "accept")}
                                >
                                  {t.teacher_meetings_btn_accept}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleRespond(m._id, "decline")
                                  }
                                >
                                  {t.teacher_meetings_btn_decline}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() =>
                                    handleRespond(m._id, "reschedule")
                                  }
                                >
                                  {t.teacher_meetings_btn_reschedule}
                                </Button>
                              </div>
                            )}

                          {m.status === "Reschedule Requested" && (
                            <div className="mt-3 flex flex-col gap-2">
                              <Input
                                type="datetime-local"
                                value={rescheduleDate}
                                onChange={(e) =>
                                  setRescheduleDate(e.target.value)
                                }
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleReschedule(m._id, "confirm")
                                  }
                                >
                                  {t.teacher_meetings_btn_confirm_date}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleReschedule(m._id, "decline")
                                  }
                                >
                                  {t.teacher_meetings_btn_decline_date}
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              {t.teacher_meetings_empty}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
