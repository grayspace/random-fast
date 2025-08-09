"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" aria-label="Toggle theme" className="shrink-0">
        <Sun className="h-4 w-4 opacity-0" />
      </Button>
    )
  }

  const isDark = (theme ?? resolvedTheme) === "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="shrink-0"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
