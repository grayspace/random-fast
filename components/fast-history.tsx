"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Trash2, History } from 'lucide-react'
import { useFastStore } from "@/lib/fast-store"

export function FastHistory() {
  const { fasts, deleteFast } = useFastStore()

  const formatDuration = (hours: number) => {
    if (hours >= 24) {
      const days = Math.floor(hours / 24)
      const remainingHours = hours % 24
      if (remainingHours === 0) {
        return `${days} day${days > 1 ? 's' : ''}`
      }
      return `${days}d ${remainingHours}h`
    }
    return `${hours}h`
  }

  const calculateActualDuration = (fast: any) => {
    const start = new Date(fast.startTime)
    const end = fast.status === 'completed' ? new Date(fast.completedAt || fast.endTime) : new Date()
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60) * 10) / 10
  }

  if (fasts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No fasting history yet</p>
            <p className="text-sm">Start your first fast to see it here!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Fasting History</h3>
        <Badge variant="outline">{fasts.length} total</Badge>
      </div>

      <div className="space-y-3">
        {fasts.map((fast) => (
          <Card key={fast.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  {fast.duration >= 24 ? (
                    <Calendar className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-emerald-600" />
                  )}
                  {formatDuration(fast.duration)} Fast
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={fast.status === 'active' ? 'default' : 'secondary'}>
                    {fast.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteFast(fast.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    aria-label="Delete fast"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Started</p>
                  <p className="font-medium">
                    {new Date(fast.startTime).toLocaleDateString()} at{' '}
                    {new Date(fast.startTime).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">
                    {fast.status === 'active' ? 'Target End' : 'Ended'}
                  </p>
                  <p className="font-medium">
                    {fast.status === 'completed' && fast.completedAt ? (
                      <>
                        {new Date(fast.completedAt).toLocaleDateString()} at{' '}
                        {new Date(fast.completedAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </>
                    ) : (
                      <>
                        {new Date(fast.endTime).toLocaleDateString()} at{' '}
                        {new Date(fast.endTime).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </>
                    )}
                  </p>
                </div>
              </div>
              
              {fast.status === 'completed' && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Actual Duration</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {formatDuration(calculateActualDuration(fast))}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
