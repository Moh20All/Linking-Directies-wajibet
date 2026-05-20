"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations, supportedLanguages, type Translation } from "@/lib/translations"

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: Translation
  isRTL: boolean
  supportedLanguages: typeof supportedLanguages
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState("en")

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Update document direction and save to localStorage
    const isRTL = language === "ar"
    document.documentElement.dir = isRTL ? "rtl" : "ltr"
    document.documentElement.lang = language

    // Add/remove RTL class for styling
    if (isRTL) {
      document.documentElement.classList.add("rtl")
    } else {
      document.documentElement.classList.remove("rtl")
    }

    localStorage.setItem("language", language)
  }, [language])

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang)
    }
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    isRTL: language === "ar",
    supportedLanguages,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
