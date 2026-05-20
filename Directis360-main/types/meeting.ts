export type MeetingStatus =
  | "Requested"
  | "Rejected by Admin"
  | "Approved by Admin"
  | "Invitation Sent"
  | "Acknowledged"
  | "Accepted"
  | "Declined"
  | "Rescheduled"
  | "Confirmed"
  | "In Progress"
  | "Completed"
  | "Canceled"
  | "No Show"
  | "Closed";

export type MeetingCause =
  | "Academic Performance"
  | "Behavioral Issues"
  | "Attendance Issues"
  | "Health & Wellbeing"
  | "Administrative Request"
  | "Extracurricular Activities"
  | "General Follow-up"
  | "Conflict Resolution";

export interface Meeting {
  _id: string;
  invitedId: {
    _id: string;
    full_name: string;
  };
  cause: MeetingCause;
  status: MeetingStatus;
  requestedDate: string;
  scheduledDate?: string;
}
