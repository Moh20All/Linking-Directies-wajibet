"use client";

import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { School, LogOut, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NoActiveSubscriptionPage() {
  const { t, isRTL } = useLanguage();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      {/* Top Bar for Language Switcher */}
      <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} z-10`}>
        <LanguageSwitcher />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg border-red-100">
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="mx-auto bg-red-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-2">
              <ShieldAlert className="w-10 h-10 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              {t.no_active_subscription_title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <CardDescription className="text-base text-slate-600 px-4">
              {t.no_active_subscription_desc}
            </CardDescription>

            <div className="pt-4 border-t border-slate-100 w-full">
              <Button 
                variant="destructive" 
                size="lg" 
                className="w-full gap-2 font-medium"
                onClick={() => logout()}
              >
                <LogOut className="w-4 h-4" />
                {t.no_active_subscription_logout}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optional Filter Footer or Watermark */}
      <div className="py-6 text-center text-slate-400 text-sm">
         Directis 360
      </div>
    </div>
  );
}
