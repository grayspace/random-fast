"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dice6, Clock, Calendar } from 'lucide-react'
import { useFastStore } from "@/lib/fast-store"
import { usePreferencesStore } from "@/lib/preferences-store"
import { selectRandomDuration } from "@/lib/utils"

interface CreateFastDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateFastDialog({ open, onOpenChange }: CreateFastDialogProps) {
  const [startTime, setStartTime] = useState(() => {
    const now = new Date()
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  })
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)
  const [isRandomizing, setIsRandomizing] = useState(false)
  const [endTime, setEndTime] = useState<Date | null>(null)

  const { createFast } = useFastStore()
  const { preferences, initializeStore } = usePreferencesStore()

  useEffect(() => {
    preferences.timeframes.length === 0 && initializeStore()
  }, [preferences.timeframes.length, initializeStore])

  useEffect(() => {
    if (open && preferences.timeframes.length > 0) {
      handleRandomize()
    }
  }, [open, preferences.timeframes.length])

  useEffect(() => {
    if (!selectedDuration) {
      setEndTime(null)
      return
    }
    const start = new Date(startTime)
    if (isNaN(start.getTime())) {
      setEndTime(null)
      return
    }
    const end = new Date(start.getTime() + selectedDuration * 60 * 60 * 1000)
    setEndTime(end)
  }, [startTime, selectedDuration])

  const handleRandomize = () => {
    setIsRandomizing(true)
    setSelectedDuration(null)
    setEndTime(null)
    setTimeout(() => {
      const duration = selectRandomDuration(preferences.timeframes)
      setSelectedDuration(duration)
      setIsRandomizing(false)
    }, 1500)
  }

  const handleCreateFast = () => {
    if (!selectedDuration) return

    const start = new Date(startTime)
    const computedEnd = endTime ?? new Date(start.getTime() + selectedDuration * 60 * 60 * 1000)

    createFast({
      startTime: start.toISOString(),
      endTime: computedEnd.toISOString(),
      duration: selectedDuration,
      status: "active",
    })

    // Reset form
    setSelectedDuration(null)
    setEndTime(null)
    const now = new Date()
    setStartTime(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16))
    onOpenChange(false)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Provide a scroll area for mobile; footer stays visible on desktop due to max-h constraint */}
      <DialogContent className="sm:max-w-lg sm:max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Create New Fast
          </DialogTitle>
          <DialogDescription>Set your start time and let RandomFast choose your fasting duration</DialogDescription>
        </DialogHeader>

        {/* Scrollable middle section */}
        <div className="min-h-0 flex-1 overflow-y-auto space-y-6 pr-1 [-webkit-overflow-scrolling:touch]">
          {/* Start Time */}
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Input id="start-time" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>

          {/* Random Duration Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Fasting Duration</Label>
              {preferences.allowReroll && (
                <Button variant="outline" size="sm" onClick={handleRandomize} disabled={isRandomizing} className="flex items-center gap-2">
                  <Dice6 className="h-4 w-4" />
                  Re-roll
                </Button>
              )}
            </div>

            {isRandomizing ? (
              <Card className="border-teal-200 bg-teal-50 dark:bg-slate-900 dark:border-teal-800">
                <CardContent className="pt-6">
                  <div className="text-center text-teal-700 dark:text-teal-300">
                    <Dice6 className="h-12 w-12 mx-auto mb-4 animate-spin" />
                    <p className="text-lg font-medium">Rolling the dice...</p>
                    <p className="text-sm opacity-75">Selecting your random fasting duration</p>
                  </div>
                </CardContent>
              </Card>
            ) : selectedDuration ? (
              <Card className="border-emerald-200 bg-emerald-50 dark:bg-slate-900 dark:border-emerald-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-emerald-800 dark:text-emerald-200">Selected Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedDuration >= 24 ? <Calendar className="h-5 w-5 text-emerald-600" /> : <Clock className="h-5 w-5 text-emerald-600" />}
                      <span className="text-xl font-semibold text-emerald-800 dark:text-emerald-200">{formatDuration(selectedDuration)}</span>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                      Random
                    </Badge>
                  </div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-2">
                    {endTime
                      ? (() => {
                          const date = endTime.toLocaleDateString()
                          const time = endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          return `End time: ${date} at ${time}`
                        })()
                      : null}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed border-slate-300 dark:border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-center text-slate-500 dark:text-slate-400">
                    <Dice6 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Click "Re-roll" to select a different fasting duration</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateFast} disabled={!selectedDuration || isRandomizing} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Start Fast
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
