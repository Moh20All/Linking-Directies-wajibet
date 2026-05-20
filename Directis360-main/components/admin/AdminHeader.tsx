"use client";

import { School, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminHeaderProps {
  userInitials: string;
  onLogout: () => void;
  title?: string;
}

export function AdminHeader({ userInitials, onLogout, title = "Overview" }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900">
            <div className="h-8 w-8 bg-black text-white rounded-lg flex items-center justify-center">
              <School className="h-5 w-5" />
            </div>
            Directis360 <span className="text-slate-400 font-normal">Admin</span>
          </div>
          
          <div className="hidden md:block w-px h-6 bg-slate-200 mx-2"></div>
          
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
             <span className="px-3 py-1 bg-slate-100 text-slate-900 rounded-full">{title}</span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-1 h-auto py-1.5 hover:bg-slate-50 focus-visible:ring-0 focus-visible:ring-offset-0">
                         <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium leading-none">Administrator</p>
                            <p className="text-xs text-muted-foreground mt-1">Super Admin</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-medium shadow-sm ring-2 ring-white">
                            {userInitials}
                        </div>
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer" onClick={onLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
