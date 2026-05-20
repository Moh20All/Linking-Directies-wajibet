"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/context/language-context"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { LanguageSwitcher } from "@/components/ui/language-switcher"

interface HeaderProps {
  title: string
  isRefreshing?: boolean
}

export default function Header({ title, isRefreshing }: HeaderProps) {
  const { logout, role } = useAuth()
  const { t, isRTL } = useLanguage()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/logout-success")
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">
            {t.welcomeBack} {t.thisIsYourDashboard}
          </p>
        </div>
        {isRefreshing && (
          <div className="flex items-center gap-2 px-6 py-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.refreshingData}
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* User dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback>{role ? role[0] : "U"}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem disabled>
                {t.signedInAs} {role || "User"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                {t.logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
