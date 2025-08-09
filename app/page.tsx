"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Plus, Settings, History, Timer } from 'lucide-react'
import { CreateFastDialog } from "@/components/create-fast-dialog"
import { SettingsDialog } from "@/components/settings-dialog"
import { FastTimer } from "@/components/fast-timer"
import { FastHistory } from "@/components/fast-history"
import { useFastStore } from "@/lib/fast-store"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const { currentFast, fasts, initializeStore } = useFastStore()

  useEffect(() => {
    initializeStore()
  }, [initializeStore])

  const activeFasts = fasts.filter(fast => fast.status === 'active')
  const completedFasts = fasts.filter(fast => fast.status === 'completed')

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              RandomFast
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button onClick={() => setCreateDialogOpen(true)} className="flex-1 max-w-xs bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Fast
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSettingsDialogOpen(true)}
              className="shrink-0"
              aria-label="Open settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Current Fast Status */}
        {currentFast && (
          <Card className="mb-8 border-emerald-200 bg-emerald-50 dark:bg-slate-900 dark:border-emerald-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
                <Clock className="h-5 w-5" />
                Current Fast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FastTimer fast={currentFast} />
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 rounded-md bg-slate-100 p-1 dark:bg-slate-800">
            <TabsTrigger
              value="overview"
              className="rounded-md text-slate-700 dark:text-slate-300 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-md text-slate-700 dark:text-slate-300 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Active Fasts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {activeFasts.length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Completed Fasts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {completedFasts.length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Fasts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {fasts.length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest fasting sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {fasts.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Timer className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No fasts yet. Start your first fast to begin tracking!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {fasts.slice(0, 3).map((fast) => (
                      <div key={fast.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div>
                          <p className="font-medium">
                            {fast.duration >= 24 ? `${Math.floor(fast.duration / 24)} day${Math.floor(fast.duration / 24) > 1 ? 's' : ''}` : `${fast.duration}h`} fast
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Started {new Date(fast.startTime).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={fast.status === 'active' ? 'default' : 'secondary'}>
                          {fast.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <FastHistory />
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <CreateFastDialog 
          open={createDialogOpen} 
          onOpenChange={setCreateDialogOpen} 
        />
        <SettingsDialog 
          open={settingsDialogOpen} 
          onOpenChange={setSettingsDialogOpen} 
        />
      </div>
    </div>
  )
}
