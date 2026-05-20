"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { School } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
// import favicon from "../../public/logoDirectis.png";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}
interface SidebarProps {
  items: SidebarItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  specialMenuItem?: React.ReactNode;
}

export default function Sidebar({
  items,
  activeTab,
  onTabChange,
  specialMenuItem,
}: SidebarProps) {
  const { getFreshToken, authLoading } = useAuth();
  const { t, isRTL } = useLanguage()

  const schoolName = "Directis 360";

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <Image
              src="/logoWhite.png"
              alt="Directis Logo"
              width={30}
              height={30}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col gap-0 justify-center items-start">
            <h2 className="font-bold text-gray-900 truncate" title={schoolName}>
              {authLoading ? (
                "Loading..."
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-blue-900">
                    {schoolName.split(" ")[0]}
                  </span>
                  <span className="text-orange-500">
                    {schoolName.split(" ")[1]}
                  </span>
                </div>
              )}
            </h2>
            <p className="text-sm text-gray-500">{t.managementSystem}</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2 flex-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                activeTab === item.id
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Button>
          );
        })}
        
        {specialMenuItem && (
            <div className="pt-4 mt-2 border-t border-gray-100">
                {specialMenuItem}
            </div>
        )}
      </nav>
    </div>
  );
}
