"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, School, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLanguage } from "@/context/language-context";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login, getFreshToken, role, authLoading } = useAuth();
  const { t, isRTL } = useLanguage()
  const searchParams = useSearchParams();

  // Helper to handle redirect if "redirect" query param exists
  const handleSSORedirect = (token: string) => {
    const redirectUrl = searchParams.get("redirect");
    
    if (redirectUrl) {
      // Security: In prod, validate domain.
      // e.g. if (!redirectUrl.startsWith("http://trusted-domain.com")) return;
      
      // Append token
      const separator = redirectUrl.includes('?') ? '&' : '?';
      const target = `${redirectUrl}${separator}token=${token}`;
      window.location.href = target;
      return true; // handled
    }
    return false; // not handled
  };

  // On mount: if already authenticated, redirect appropriately
  useEffect(() => {
    const checkAuth = async () => {
      if (authLoading) return; // wait for auth to finish initializing

      const token = await getFreshToken();
      if (token && role) {
        // PRIORITIZE SSO REDIRECT. If redirect handles it, STOP.
        if (handleSSORedirect(token)) return; 

        if (role === "HEADMASTER") {
          router.replace("/dashboard/headmaster");
        } else {
          router.replace("/dashboard");
        }
      }
    };

    checkAuth();
  }, [authLoading, role, getFreshToken, router, searchParams]); // Ensure SearchParams is stable

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      // Immediately try to get fresh token to see if session is active
      const token = await getFreshToken();
      
      if (token) {
        if (handleSSORedirect(token)) return;
      }
      
      // otherwise, let useEffect handle role-based redirect
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // While authentication is being validated OR redirect is in progress
  if (authLoading || role) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-4" />
        <p className="text-gray-700 font-medium">{t.gettingReady}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-purple-50 to-white p-6 gap-6">
      {/* Language Switcher */}
      <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"}`}>  
        <LanguageSwitcher />
      </div>

      {/* Hero Row */}
      <div className="flex flex-col items-center text-center mt-6">
        <Link href={"/"}>
          <Image
            src="/logoDirectis.png"
            alt="Directis Logo"
            width={40}
            height={40}
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            priority
          />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          {t.welcomeTo} <span className="text-blue-900">Directis </span>
          <span className="text-orange-500">360</span>
        </h1>
        <p className="text-gray-500 mt-2 max-w-lg">
          {t.streamlinedDashboards}
        {t.allInOneSecurePlatform}.  
        </p>
      </div>

      {/* Login Card Row */}
      <div className="flex justify-center w-full">
        <Card className="w-full max-w-md backdrop-blur-md bg-white/70 shadow-xl border border-purple-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              {t.signIn}
            </CardTitle>
                <CardDescription>{t.accessDashboard}</CardDescription>              
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.identificator}</Label>
                <Input
                  id="email"
                  placeholder={t.enterIdentificator}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus-visible:ring-purple-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                      placeholder={t.enterPassword}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t.signingIn}</span>
                  </div>
                ) : (
                  t.signIn
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Signup Row */}
      <div className="flex justify-center w-full">
        <Card className="w-full max-w-md backdrop-blur-md bg-white/60 shadow border border-purple-100">
          <CardContent className="flex flex-col items-center text-center py-6">
            <p className="text-gray-700 mb-3">
              {t.headmasterUpgrade}
            </p>
            <Button
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 flex items-center gap-2"
              onClick={() => router.push("/signup")}
            >
              {t.joinUs} <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
          <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-4" />
          <p className="text-gray-700 font-medium">Loading...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
