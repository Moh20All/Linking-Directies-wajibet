"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function LogoutSuccessPage() {
  const router = useRouter();

  // Optional auto-redirect after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/login");
    }, 5000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          You have been logged out
        </h1>
        <p className="text-gray-600 mb-6">
          Redirecting you to the login page...
        </p>
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => router.push("/login")}
        >
          Go to Login Now
        </Button>
      </div>
    </div>
  );
}
