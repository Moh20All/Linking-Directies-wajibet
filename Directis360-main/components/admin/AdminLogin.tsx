"use client";

import React, { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, ShieldCheck, Loader2, School, CloudCog } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: (token: string, username: string) => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.post("/admin/login", {
        username,
        password,
      });

      onLoginSuccess(data.accessToken, data.username || username);
    } catch (err: any) {
      console.log(err);
      setError(err.response.data.error || err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4">
      {/* Visual Identity */}
      <div className="mb-8 flex flex-col items-center text-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
         <div className="h-12 w-12 bg-white text-slate-950 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/50">
             <School className="h-6 w-6" />
         </div>
         <h1 className="text-2xl font-bold tracking-tight text-white">
            Directis360 <span className="text-slate-400 font-normal">Admin</span>
         </h1>
         <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-widest bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
            <ShieldCheck className="h-3 w-3" />
            Restricted Access
         </div>
      </div>

      <Card className="w-full max-w-sm border-slate-800 bg-slate-900/50 text-slate-100 shadow-2xl backdrop-blur-sm animate-in zoom-in-95 duration-500">
        <CardHeader className="space-y-1 pb-4 border-b border-slate-800/50">
           <div className="flex justify-center mb-2">
                <div className="p-3 bg-slate-800/50 rounded-full">
                    <Lock className="h-5 w-5 text-slate-400" />
                </div>
           </div>
           <h2 className="text-lg font-semibold text-center text-white">Administrator Login</h2>
           <p className="text-xs text-center text-slate-400">
                This area is restricted to authorized platform operators only.
           </p>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4 pt-6">
            {error && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 text-red-200 text-xs py-2">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username" className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Username or Email
                    </Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="admin"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                        className="bg-slate-950/50 border-slate-800 placeholder:text-slate-600 focus-visible:ring-slate-700 text-slate-200"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Password
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="bg-slate-950/50 border-slate-800 focus-visible:ring-slate-700 text-slate-200"
                    />
                </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 pb-6">
            <Button 
                type="submit" 
                className="w-full bg-white text-slate-950 hover:bg-slate-200 font-semibold" 
                disabled={isLoading}
            >
              {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
              ) : (
                  "Secure Login"
              )}
            </Button>
            
            <p className="text-[10px] text-center text-slate-600">
                System access is monitored and logged for security purposes.
            </p>
          </CardFooter>
        </form>
      </Card>
      
      <div className="mt-8 text-xs text-slate-600">
        &copy; {new Date().getFullYear()} Directis360 Platform. All rights reserved.
      </div>
    </div>
  );
}
