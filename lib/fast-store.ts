"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Fast {
  id: string
  startTime: string
  endTime: string
  duration: number // in hours
  status: 'active' | 'completed'
  completedAt?: string
}

interface FastStore {
  fasts: Fast[]
  currentFast: Fast | null
  createFast: (fastData: Omit<Fast, 'id'>) => void
  completeFast: (id: string) => void
  deleteFast: (id: string) => void
  initializeStore: () => void
}

export const useFastStore = create<FastStore>()(
  persist(
    (set, get) => ({
      fasts: [],
      currentFast: null,

      createFast: (fastData) => {
        const newFast: Fast = {
          ...fastData,
          id: Date.now().toString()
        }

        set((state) => ({
          fasts: [newFast, ...state.fasts],
          currentFast: newFast.status === 'active' ? newFast : state.currentFast
        }))
      },

      completeFast: (id) => {
        set((state) => ({
          fasts: state.fasts.map((fast) =>
            fast.id === id
              ? { ...fast, status: 'completed' as const, completedAt: new Date().toISOString() }
              : fast
          ),
          currentFast: state.currentFast?.id === id ? null : state.currentFast
        }))
      },

      deleteFast: (id) => {
        set((state) => ({
          fasts: state.fasts.filter((fast) => fast.id !== id),
          currentFast: state.currentFast?.id === id ? null : state.currentFast
        }))
      },

      initializeStore: () => {
        const state = get()
        const activeFast = state.fasts.find(fast => fast.status === 'active')
        
        // Check if active fast has expired
        if (activeFast && new Date() >= new Date(activeFast.endTime)) {
          set((state) => ({
            fasts: state.fasts.map((fast) =>
              fast.id === activeFast.id
                ? { ...fast, status: 'completed' as const, completedAt: activeFast.endTime }
                : fast
            ),
            currentFast: null
          }))
        } else {
          set({ currentFast: activeFast || null })
        }
      }
    }),
    {
      name: 'randomfast-store'
    }
  )
)
