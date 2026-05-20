"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateSchoolForm } from "@/components/admin/CreateSchoolForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreateSchoolPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (!storedToken) {
      router.push("/admin");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  if (!token) return null;

  return (
    <div className="container mx-auto py-10 max-w-5xl space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Register New School</h1>
        <p className="text-muted-foreground">
          Create a new school identity, set initial access credentials, and configure subscription rights.
        </p>
      </div>

      <CreateSchoolForm />
    </div>
  );
}
