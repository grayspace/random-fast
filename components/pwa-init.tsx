"use client"

import { useEffect } from "react"

export function PWAInit() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator)) return

    const isSecure =
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"

    if (!isSecure) return

    const register = async () => {
      try {
        // Register the SW from /sw (dotless path to avoid MIME/type routing issues)
        const reg = await navigator.serviceWorker.register("/sw", { scope: "/" })

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing
          if (!newWorker) return
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              console.log("Service worker updated.")
            }
          })
        })
      } catch (err) {
        console.error("SW registration failed:", err)
      }
    }

    register()
  }, [])

  return null
}
