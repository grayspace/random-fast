import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TimeframePreference } from "./preferences-store"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function selectRandomDuration(timeframes: TimeframePreference[]): number {
  console.log('selectRandomDuration called with:', timeframes) // Debug log
  
  if (!timeframes || timeframes.length === 0) {
    console.log('No timeframes available, using default 16h') // Debug log
    return 16 // Default fallback
  }

  // Calculate total weight
  const totalWeight = timeframes.reduce((sum, tf) => sum + (tf.likelihood || 0), 0)
  console.log('Total weight:', totalWeight) // Debug log
  
  if (totalWeight === 0) {
    // If all weights are 0, select randomly with equal probability
    const randomIndex = Math.floor(Math.random() * timeframes.length)
    console.log('Equal probability selection, index:', randomIndex) // Debug log
    return timeframes[randomIndex].duration
  }

  // Generate random number between 0 and totalWeight
  const random = Math.random() * totalWeight
  console.log('Random value:', random, 'out of', totalWeight) // Debug log
  
  // Find the selected timeframe based on weighted probability
  let currentWeight = 0
  for (let i = 0; i < timeframes.length; i++) {
    const timeframe = timeframes[i]
    currentWeight += (timeframe.likelihood || 0)
    console.log(`Checking timeframe ${i}: duration=${timeframe.duration}h, likelihood=${timeframe.likelihood}, currentWeight=${currentWeight}`) // Debug log
    
    if (random <= currentWeight) {
      console.log('Selected timeframe:', timeframe) // Debug log
      return timeframe.duration
    }
  }
  
  // Fallback (should never reach here)
  console.log('Fallback to first timeframe') // Debug log
  return timeframes[0].duration
}
