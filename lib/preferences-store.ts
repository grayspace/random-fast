"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TimeframePreference {
  duration: number // in hours
  likelihood: number // weight for random selection
}

interface Preferences {
  timeframes: TimeframePreference[]
  allowReroll: boolean
}

interface PreferencesStore {
  preferences: Preferences
  updatePreferences: (preferences: Partial<Preferences>) => void
  initializeStore: () => void
}

const defaultTimeframes: TimeframePreference[] = [
  { duration: 12, likelihood: 20 },
  { duration: 16, likelihood: 30 },
  { duration: 18, likelihood: 25 },
  { duration: 20, likelihood: 15 },
  { duration: 24, likelihood: 8 },
  { duration: 48, likelihood: 2 }
]

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set, get) => ({
      preferences: {
        timeframes: defaultTimeframes,
        allowReroll: true
      },

      updatePreferences: (newPreferences) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...newPreferences
          }
        }))
      },

      initializeStore: () => {
        // Force initialization if store is empty or corrupted
        const state = get()
        if (!state.preferences || !state.preferences.timeframes || state.preferences.timeframes.length === 0) {
          set({
            preferences: {
              timeframes: [...defaultTimeframes],
              allowReroll: true
            }
          })
        }
        // Ensure allowReroll exists for existing users
        if (state.preferences && typeof state.preferences.allowReroll === 'undefined') {
          set((state) => ({
            preferences: {
              ...state.preferences,
              allowReroll: true
            }
          }))
        }
      }
    }),
    {
      name: 'randomfast-preferences',
      version: 1,
      // Ensure proper serialization/deserialization
      partialize: (state) => ({ preferences: state.preferences }),
      onRehydrateStorage: () => (state) => {
        // Validate rehydrated state
        if (state && (!state.preferences || !state.preferences.timeframes || state.preferences.timeframes.length === 0)) {
          state.preferences = { 
            timeframes: [...defaultTimeframes],
            allowReroll: true
          }
        }
        // Ensure allowReroll exists for existing users
        if (state && state.preferences && typeof state.preferences.allowReroll === 'undefined') {
          state.preferences.allowReroll = true
        }
      }
    }
  )
)
