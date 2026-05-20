"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  Users,
  GraduationCap,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { MemberStub } from "@/services/staffFinanceService";
import { useLanguage } from "@/context/language-context";

interface MissingProfilesProps {
  missingStudents: MemberStub[];
  missingTeachers: MemberStub[];
  onCreateAll: () => Promise<void>;
  isLoading: boolean;
}

export default function MissingProfiles({
  missingStudents,
  missingTeachers,
  onCreateAll,
  isLoading,
}: MissingProfilesProps) {
  const totalMissing = missingStudents.length + missingTeachers.length;
  const { t, isRTL } = useLanguage()
  const Section = ({
    title,
    icon: Icon,
    count,
    members,
    badgeLabel,
    badgeVariant,
    emptyText,
  }: {
    title: string;
    icon: React.ElementType;
    count: number;
    members: MemberStub[];
    badgeLabel: string;
    badgeVariant: "secondary" | "outline";
    emptyText: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Icon className="w-5 h-5 text-muted-foreground" />
          {title}{" "}
          <Badge variant="secondary" className="ml-2">
            {count}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {count > 0 ? (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {members.map((m) => (
              <div
                key={m._id}
                className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/50 transition"
              >
                <div>
                  <p className="text-sm font-medium">{m.full_name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
                <Badge variant={badgeVariant}>{badgeLabel}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            {emptyText}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Top summary card */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <UserPlus className="w-6 h-6" />
              {t.emp_finance_missing_profiles}
            </CardTitle>
            <CardDescription>
              {t.emp_finance_missing_profiles_desc}
              {t.emp_finance_missing_profiles_desc_suffix}
            </CardDescription>
          </div>

          {totalMissing > 0 && (
            <Button onClick={onCreateAll} disabled={isLoading} size="lg">
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              {t.emp_finance_create_all} ({totalMissing})
            </Button>
          )}
        </CardHeader>
      </Card>

      {/* Empty state */}
      {totalMissing === 0 && !isLoading ? (
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium">{t.emp_finance_all_profiles_created}</h3>
            <p className="text-muted-foreground">
              {t.emp_finance_all_profiles_created_desc}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section
            title="Teachers"
            icon={Users}
            count={missingTeachers.length}
            members={missingTeachers}
            badgeLabel="Teacher"
            badgeVariant="secondary"
            emptyText="No teachers are missing profiles."
          />
          <Section
            title="Students"
            icon={GraduationCap}
            count={missingStudents.length}
            members={missingStudents}
            badgeLabel="Student"
            badgeVariant="outline"
            emptyText="No students are missing profiles."
          />
        </div>
      )}
    </div>
  );
}
