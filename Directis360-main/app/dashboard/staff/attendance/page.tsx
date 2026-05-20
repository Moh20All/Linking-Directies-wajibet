"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AttendanceDashboard from "@/components/dashboard/attendance-dashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { verifyTabPassword } from "@/services/staffTabsService";
import { checkAttendanceAccess } from "@/services/staffAttendanceService";

// Defines the possible states for component access
type AccessState = "loading" | "accepted" | "denied";

export default function AttendancePage() {
  const { getFreshToken } = useAuth();
  const [accessState, setAccessState] = useState<AccessState>("loading");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetches the user's access rights when the component mounts
    const fetchAccess = async () => {
      try {
        const token = await getFreshToken();
        if (!token) {
          setAccessState("denied");
          return;
        }

        setAccessToken(token);

        // Check for attendance-specific access
        const res = await checkAttendanceAccess(token);
        setAccessState(res.granted ? "accepted" : "denied");
      } catch (err) {
        console.error(err);
        setAccessState("denied");
      }
    };

    fetchAccess();
  }, [getFreshToken]);

  // Handles the password submission to unlock the dashboard
  const handleUnlock = async () => {
    if (!accessToken) return;
    setVerifying(true);
    setError("");

    try {
      const { valid, error: msg } = await verifyTabPassword(
        accessToken,
        "attendance", // Specify 'attendance' tab for verification
        password
      );

      if (valid) {
        setAccessState("accepted");
      } else {
        setError(msg || "Incorrect password");
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify password");
    } finally {
      setVerifying(false);
    }
  };

  // Render loading state
  if (accessState === "loading") {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-6">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-4" />
        <p className="text-gray-700 font-medium">
          Checking attendance access...
        </p>
      </div>
    );
  }

  // Render dashboard if access is accepted
  if (accessState === "accepted") {
    return <AttendanceDashboard />;
  }

  // Render password prompt if access is denied
  if (accessState === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-white p-6">
        <Card className="w-full max-w-md backdrop-blur-md bg-white/70 shadow-xl border border-purple-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Attendance Access
            </CardTitle>
            <CardDescription>
              Enter your password to unlock this section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus-visible:ring-purple-600 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-purple-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-purple-500" />
                  )}
                </Button>
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <Button
                onClick={handleUnlock}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={verifying || !password}
              >
                {verifying ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Unlock"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback return, though states should be exhaustive
  return null;
}
