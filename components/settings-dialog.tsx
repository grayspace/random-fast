"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Trash2, Plus, Settings, Clock, Calendar } from 'lucide-react'
import { usePreferencesStore } from "@/lib/preferences-store"
import type { TimeframePreference } from "@/lib/preferences-store"
import { Switch } from "@/components/ui/switch"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { preferences, updatePreferences, initializeStore } = usePreferencesStore()
  const [localTimeframes, setLocalTimeframes] = useState<TimeframePreference[]>([])
  const [newDuration, setNewDuration] = useState("")

  useEffect(() => {
    initializeStore()
  }, [initializeStore])

  useEffect(() => {
    setLocalTimeframes([...preferences.timeframes])
  }, [preferences.timeframes])

  const handleLikelihoodChange = (index: number, value: number[]) => {
    const updated = [...localTimeframes]
    updated[index].likelihood = value[0]
    setLocalTimeframes(updated)
  }

  const handleRemoveTimeframe = (index: number) => {
    const updated = localTimeframes.filter((_, i) => i !== index)
    setLocalTimeframes(updated)
  }

  const handleAddTimeframe = () => {
    const duration = parseFloat(newDuration)
    if (duration > 0) {
      const newTimeframe: TimeframePreference = { duration, likelihood: 10 }
      setLocalTimeframes([...localTimeframes, newTimeframe])
      setNewDuration("")
    }
  }

  const handleSave = () => {
    if (localTimeframes.length === 0) return

    const total = localTimeframes.reduce((s, tf) => s + tf.likelihood, 0)
    const normalized =
      total > 0
        ? localTimeframes.map((tf) => ({ ...tf, likelihood: Math.round((tf.likelihood / total) * 100 * 100) / 100 }))
        : localTimeframes.map((tf) => ({ ...tf, likelihood: 100 / localTimeframes.length }))

    updatePreferences({ timeframes: normalized })
    onOpenChange(false)
  }

  const formatDuration = (hours: number) => {
    if (hours >= 24) {
      const days = Math.floor(hours / 24)
      const remainingHours = hours % 24
      if (remainingHours === 0) return `${days} day${days > 1 ? "s" : ""}`
      return `${days}d ${remainingHours}h`
    }
    return `${hours}h`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* DialogContent is a flex column and overflow-hidden; we provide a dedicated scroll area */}
      <DialogContent className="sm:max-w-2xl sm:max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Fasting Preferences
          </DialogTitle>
          <DialogDescription>Configure your fasting timeframes and their likelihood percentages</DialogDescription>
        </DialogHeader>

        {/* Scrollable content area for ALL devices */}
        <div className="min-h-0 flex-1 overflow-y-auto pr-1 [-webkit-overflow-scrolling:touch]">
          <div className="space-y-6">
            {/* Current Timeframes */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Timeframe Options</Label>

              {localTimeframes.map((timeframe, index) => (
                <Card key={index} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {timeframe.duration >= 24 ? <Calendar className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        {formatDuration(timeframe.duration)}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{Math.round(timeframe.likelihood)}%</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveTimeframe(index)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <Label>Likelihood Weight</Label>
                        <span className="text-muted-foreground">{timeframe.likelihood}</span>
                      </div>
                      <Slider
                        value={[timeframe.likelihood]}
                        onValueChange={(value) => handleLikelihoodChange(index, value)}
                        max={100}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add New Timeframe */}
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">Add New Timeframe</CardTitle>
                <CardDescription>Enter duration in hours (e.g., 16 for 16 hours, 36 for 1.5 days)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Duration in hours"
                    type="number"
                    min="1"
                    step="0.5"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                  />
                  <Button onClick={handleAddTimeframe} disabled={!newDuration}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Allow Re-Roll Setting */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Re-Roll Options</CardTitle>
                <CardDescription>Control whether re-roll option is available when creating a new fast.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allow-reroll" className="text-sm font-medium">
                      Allow Re-Roll
                    </Label>
                    <p className="text-xs text-muted-foreground">Show re-roll button on the create fast dialog</p>
                  </div>
                  <Switch
                    id="allow-reroll"
                    checked={preferences.allowReroll}
                    onCheckedChange={(checked) => updatePreferences({ allowReroll: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Preferences</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
