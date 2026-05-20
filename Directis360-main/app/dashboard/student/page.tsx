"use client";

import StudentDashboard from "@/components/dashboard/student-dashboard";
import { useAuth } from "@/context/AuthContext";
// import { checkStudentAccess } from "@/services/student.service";
import { checkStudentAccess } from "@/services/studentService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentPage() {
  const { getFreshToken } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAccess = async () => {
      setWaiting(true);
      try {
        const token = await getFreshToken();
        // Ensure there's a token and the user's role is STUDENT
        if (token) {
          const hasAccess = await checkStudentAccess(token);
          if (hasAccess) {
            setIsAuthorized(true);
          } else {
            // Redirect if the backend access check fails
            router.push("/login");
          }
        } else {
          // Redirect if there's no token or the role is incorrect
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to verify student access:", error);
        // Redirect on any error during the process
        router.push("/login");
      } finally {
        setWaiting(false);
      }
    };

    verifyAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFreshToken, router]);

  if (waiting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-blue-600 font-semibold text-lg">
          Verifying Student Access...
        </span>
      </div>
    );
  }

  if (!isAuthorized) {
    // You can replace this with a more sophisticated "Access Denied" component
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-700">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return <StudentDashboard />;
}
