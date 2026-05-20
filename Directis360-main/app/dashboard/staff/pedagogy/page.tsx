"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import PedagogyDashboard from "@/components/dashboard/pedagogy-dashboard";
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
import { checkPedagogyAccess } from "@/services/staffPedagogyService";

type AccessState = "loading" | "accepted" | "denied";

export default function PedagogyPage() {
  const { getFreshToken } = useAuth();
  const [accessState, setAccessState] = useState<AccessState>("loading");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        const token = await getFreshToken();
        if (!token) {
          setAccessState("denied");
          return;
        }

        setAccessToken(token);

        const res = await checkPedagogyAccess(token);
        setAccessState(res.granted ? "accepted" : "denied");
      } catch (err) {
        console.error(err);
        setAccessState("denied");
      }
    };

    fetchAccess();
  }, [getFreshToken]);

  const handleUnlock = async () => {
    if (!accessToken) return;
    setVerifying(true);
    setError("");

    try {
      const { valid, error: msg } = await verifyTabPassword(
        accessToken,
        "pedagogy",
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

  if (accessState === "loading") {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-6">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-4" />
        <p className="text-gray-700 font-medium">Checking pedagogy access...</p>
      </div>
    );
  }

  if (accessState === "accepted") {
    return <PedagogyDashboard />;
  }

  if (accessState === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-white p-6">
        <Card className="w-full max-w-md backdrop-blur-md bg-white/70 shadow-xl border border-purple-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Pedagogy Access
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
                  className="focus-visible:ring-purple-600"
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
}
