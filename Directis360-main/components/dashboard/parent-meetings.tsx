"use client";

import { useEffect, useState } from "react";
import {
  requestMeetingParent,
  getParentMeetings,
  respondMeetingParent,
  rescheduleMeetingParent,
  TeacherInfo,
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

interface ParentMeetingsPageProps {
  getFreshToken: () => Promise<string | null>;
}

export default function ParentMeetingsPage({
  getFreshToken,
}: ParentMeetingsPageProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<TeacherInfo[]>([]);
  const [teacherId, setTeacherId] = useState<string>("");
  const [cause, setCause] = useState<MeetingCause | "">("");
  const [requestedDate, setRequestedDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const { t, isRTL } = useLanguage()
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    const token = await getFreshToken();
    if (token) {
      const data = await getParentMeetings(token);
      setMeetings(data.meetings);
      setAvailableTeachers(data.availableTeachers);
    }
  };

  const handleRequest = async () => {
    if (!teacherId || !cause || !requestedDate)
      return alert("Please fill all required fields!");
    const token = await getFreshToken();
    if (token) {
      await requestMeetingParent(token, {
        invitedId: teacherId,
        cause,
        requestedDate,
        notes,
      });
      loadMeetings();
      setTeacherId("");
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
      await respondMeetingParent(token, id, action);
      loadMeetings();
    }
  };

  // 🔹 Reschedule handler
  const handleReschedule = async (id: string, newDate: string) => {
    if (!newDate) return alert("Please choose a new date to reschedule!");
    const token = await getFreshToken();
    if (token) {
      await rescheduleMeetingParent(token, id, { newDate });
      loadMeetings();
    }
  };

  // 🔹 Decline reschedule handler
  const handleDeclineReschedule = async (id: string) => {
    const token = await getFreshToken();
    if (token) {
      await rescheduleMeetingParent(token, id, { decline: true });
      loadMeetings();
    }
  };

  const filteredTeachers = availableTeachers.filter((t) =>
    t.full_name.toLowerCase().includes(filter.toLowerCase())
  );

  // Status → color mapping
  const statusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Declined":
        return "bg-red-100 text-red-700";
      case "Approved by Admin":
        return "bg-blue-100 text-blue-700";
      case "Reschedule Requested":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Request Meeting */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">{t.request_a_meeting}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Teacher Filter + Select */}
            <div className="col-span-2 flex flex-col gap-2">
              <Label>{t.select_teacher}</Label>
              <Input
                placeholder="Search teacher or child..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <Select
                onValueChange={(val) => setTeacherId(val)}
                value={teacherId || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose Teacher" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  {filteredTeachers.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      <div className="flex flex-col justify-center items-start">
                        <span className="font-medium">{t.full_name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cause */}
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
                    {t.academic_performance}
                  </SelectItem>
                  <SelectItem value="Behavioral Issues">
                    {t.behavioral_issues}
                  </SelectItem>
                  <SelectItem value="Attendance Issues">
                    {t.attendance_issues}
                  </SelectItem>
                  <SelectItem value="Health & Wellbeing">
                    {t.health_and_wellbeing}
                  </SelectItem>
                  <SelectItem value="Administrative Request">
                    {t.administrative_request}
                  </SelectItem>
                  <SelectItem value="Extracurricular Activities">
                    {t.extracurricular_activities}
                  </SelectItem>
                  <SelectItem value="General Follow-up">
                    {t.general_follow_up}
                  </SelectItem>
                  <SelectItem value="Conflict Resolution">
                    {t.conflict_resolution}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-2">
              <Label>{t.date}</Label>
              <Input
                type="datetime-local"
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="sm:col-span-2 flex flex-col gap-2">
              <Label>{t.notes} ({t.optional})</Label>
              <Input
                placeholder={t.teacher_meetings_notes_placeholder}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={handleRequest}>{t.send_request}</Button>
          </div>
        </CardContent>
      </Card>

      {/* List Meetings */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">{t.your_meetings}</h2>
        {meetings.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {meetings.map((m) => (
              <Card key={m._id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>
                      {m.requesterId.role === "PARENT"
                        ? "Status of Your Request"
                        : "A Teacher has Requested a meeting with you"}
                    </span>
                    <Badge className={statusColor(m.status)}>{m.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <b>{t.teacher}:</b>{" "}
                    {m.invitedId.role === "PARENT"
                      ? m.requesterId.full_name
                      : m.invitedId.full_name}
                  </p>
                  <p>
                    <b>{t.cause}:</b> {m.cause}
                  </p>
                  <p>
                    <b>{t.requested}:</b>{" "}
                    {new Date(m.requestedDate).toLocaleString()}
                  </p>
                  {m.scheduledDate && (
                    <p>
                      <b>{t.scheduled}:</b>{" "}
                      {new Date(m.scheduledDate).toLocaleString()}
                    </p>
                  )}
                  {m.notes && (
                    <p className="italic text-sm text-muted-foreground">
                      <b>{t.notes}:</b> {m.notes}
                    </p>
                  )}

                  {/* If approved → respond */}
                  {(m.status === "Approved by Admin" ||
                    (m.status === "Rescheduled" &&
                      m.invitedType === "Teacher")) && (
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRespond(m._id, "accept")}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRespond(m._id, "decline")}
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleRespond(m._id, "reschedule")}
                      >
                        Request Reschedule
                      </Button>
                    </div>
                  )}

                  {/* If reschedule requested → accept/decline */}
                  {m.status === "Reschedule Requested" && (
                    <div className="mt-3 flex flex-col gap-2">
                      <Input
                        type="datetime-local"
                        onChange={(e) => ((m as any)._newDate = e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleReschedule(m._id, (m as any)._newDate)
                          }
                        >
                          {t.confirm_new_date}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeclineReschedule(m._id)}
                        >
                          {t.decline_reschedule}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              {t.no_meetings_found}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
