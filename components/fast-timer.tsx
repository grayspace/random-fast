"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, Calendar } from 'lucide-react'
import { useFastStore } from "@/lib/fast-store"
import type { Fast } from "@/lib/fast-store"

const formatDateTime = (iso: string) => {
  const d = new Date(iso)
  const date = d.toLocaleDateString()
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  return `${date} at ${time}`
}

interface FastTimerProps {
  fast: Fast
}

export function FastTimer({ fast }: FastTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState("")
  const [progress, setProgress] = useState(0)
  const { completeFast } = useFastStore()

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const start = new Date(fast.startTime)
      const end = new Date(fast.endTime)

      const totalDuration = end.getTime() - start.getTime()
      const elapsed = now.getTime() - start.getTime()
      const remaining = Math.max(0, end.getTime() - now.getTime())

      if (remaining <= 0) {
        setTimeRemaining("Fast completed!")
        setProgress(100)
        return
      }

      const progressPercent = (elapsed / totalDuration) * 100
      setProgress(Math.max(0, Math.min(100, progressPercent)))

      const hours = Math.floor(remaining / (1000 * 60 * 60))
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

      if (hours >= 24) {
        const days = Math.floor(hours / 24)
        const remainingHours = hours % 24
        setTimeRemaining(`${days}d ${remainingHours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [fast])

  const handleCompleteFast = () => {
    completeFast(fast.id)
  }

  const formatDuration = (hours: number) => {
    if (hours >= 24) {
      const days = Math.floor(hours / 24)
      const remainingHours = hours % 24
      if (remainingHours === 0) return `${days} day${days > 1 ? "s" : ""}`
      return `${days} day${days > 1 ? "s" : ""} ${remainingHours}h`
    }
    return `${hours} hours`
  }

  const isCompleted = new Date() >= new Date(fast.endTime)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {fast.duration >= 24 ? <Calendar className="h-5 w-5 text-emerald-600" /> : <Clock className="h-5 w-5 text-emerald-600" />}
          <span className="font-semibold text-lg">{formatDuration(fast.duration)} Fast</span>
        </div>
        <Badge variant={isCompleted ? "default" : "secondary"}>{isCompleted ? "Completed" : "Active"}</Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      <div className="text-center py-4">
        <div className="text-3xl font-mono font-bold text-slate-900 dark:text-slate-100 mb-2">{timeRemaining}</div>
        <p className="text-sm text-slate-600 dark:text-slate-400">{isCompleted ? "Fast completed!" : "remaining"}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-600 dark:text-slate-400">Started</p>
          <p className="font-medium">{formatDateTime(fast.startTime)}</p>
        </div>
        <div>
          <p className="text-slate-600 dark:text-slate-400">Target End</p>
          <p className="font-medium">{formatDateTime(fast.endTime)}</p>
        </div>
      </div>

      {fast.status === "active" && (
        <Button onClick={handleCompleteFast} className="w-full" variant={isCompleted ? "default" : "outline"}>
          <CheckCircle className="h-4 w-4 mr-2" />
          {isCompleted ? "Mark as Completed" : "End Fast Early"}
        </Button>
      )}
    </div>
  )
}
