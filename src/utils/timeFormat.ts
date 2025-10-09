// Utility functions for time formatting

/**
 * Convert 24h time to 12h AM/PM format
 * @param time24 - Time in 24h format (e.g., "14:30", "09:00")
 * @returns Time in 12h format (e.g., "2:30 PM", "9:00 AM")
 */
export function to12Hour(time24: string): string {
  if (!time24) return ''
  
  const [hoursStr, minutesStr] = time24.split(':')
  let hours = parseInt(hoursStr)
  const minutes = minutesStr
  
  const period = hours >= 12 ? 'PM' : 'AM'
  
  // Convert to 12h format
  if (hours === 0) {
    hours = 12 // Midnight
  } else if (hours > 12) {
    hours = hours - 12
  }
  
  return `${hours}:${minutes} ${period}`
}

/**
 * Convert 12h AM/PM time to 24h format
 * @param time12 - Time in 12h format (e.g., "2:30 PM", "9:00 AM")
 * @returns Time in 24h format (e.g., "14:30", "09:00")
 */
export function to24Hour(time12: string): string {
  if (!time12) return ''
  
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return time12 // Return as-is if not in expected format
  
  let hours = parseInt(match[1])
  const minutes = match[2]
  const period = match[3].toUpperCase()
  
  // Convert to 24h
  if (period === 'AM') {
    if (hours === 12) hours = 0 // Midnight
  } else {
    if (hours !== 12) hours += 12
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`
}

/**
 * Format time input to show AM/PM while storing 24h format
 * @param value - Current input value
 * @returns Formatted value
 */
export function formatTimeInput(value: string): string {
  // If value is in 24h format (HH:MM), convert to 12h
  if (/^\d{1,2}:\d{2}$/.test(value)) {
    return to12Hour(value)
  }
  return value
}

