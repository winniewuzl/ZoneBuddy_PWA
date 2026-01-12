export interface TimeZoneData {
  id: string
  city: string
  identifier: string
  label: string
  emoji: string
}

export const availableTimeZones: TimeZoneData[] = [
  // North America
  { id: 'ny', city: 'New York', identifier: 'America/New_York', label: '', emoji: '🗽' },
  { id: 'la', city: 'Los Angeles', identifier: 'America/Los_Angeles', label: '', emoji: '🌴' },
  { id: 'sf', city: 'San Francisco', identifier: 'America/Los_Angeles', label: '', emoji: '🌉' },
  { id: 'chicago', city: 'Chicago', identifier: 'America/Chicago', label: '', emoji: '🌆' },
  { id: 'denver', city: 'Denver', identifier: 'America/Denver', label: '', emoji: '⛰️' },
  { id: 'phoenix', city: 'Phoenix', identifier: 'America/Phoenix', label: '', emoji: '🌵' },
  { id: 'seattle', city: 'Seattle', identifier: 'America/Los_Angeles', label: '', emoji: '🌲' },
  { id: 'miami', city: 'Miami', identifier: 'America/New_York', label: '', emoji: '🏖️' },
  { id: 'boston', city: 'Boston', identifier: 'America/New_York', label: '', emoji: '🦞' },
  { id: 'atlanta', city: 'Atlanta', identifier: 'America/New_York', label: '', emoji: '🍑' },
  { id: 'toronto', city: 'Toronto', identifier: 'America/Toronto', label: '', emoji: '🍁' },
  { id: 'vancouver', city: 'Vancouver', identifier: 'America/Vancouver', label: '', emoji: '🏔️' },
  { id: 'mexico-city', city: 'Mexico City', identifier: 'America/Mexico_City', label: '', emoji: '🌮' },

  // South America
  { id: 'sao-paulo', city: 'São Paulo', identifier: 'America/Sao_Paulo', label: '', emoji: '🇧🇷' },
  { id: 'buenos-aires', city: 'Buenos Aires', identifier: 'America/Argentina/Buenos_Aires', label: '', emoji: '⚽' },
  { id: 'rio', city: 'Rio de Janeiro', identifier: 'America/Sao_Paulo', label: '', emoji: '🏖️' },

  // Europe
  { id: 'london', city: 'London', identifier: 'Europe/London', label: '', emoji: '🏰' },
  { id: 'paris', city: 'Paris', identifier: 'Europe/Paris', label: '', emoji: '🗼' },
  { id: 'berlin', city: 'Berlin', identifier: 'Europe/Berlin', label: '', emoji: '🏛️' },
  { id: 'madrid', city: 'Madrid', identifier: 'Europe/Madrid', label: '', emoji: '🇪🇸' },
  { id: 'rome', city: 'Rome', identifier: 'Europe/Rome', label: '', emoji: '🏛️' },
  { id: 'amsterdam', city: 'Amsterdam', identifier: 'Europe/Amsterdam', label: '', emoji: '🇳🇱' },
  { id: 'moscow', city: 'Moscow', identifier: 'Europe/Moscow', label: '', emoji: '🏛️' },
  { id: 'istanbul', city: 'Istanbul', identifier: 'Europe/Istanbul', label: '', emoji: '🕌' },
  { id: 'dublin', city: 'Dublin', identifier: 'Europe/Dublin', label: '', emoji: '🍀' },

  // Asia
  { id: 'tokyo', city: 'Tokyo', identifier: 'Asia/Tokyo', label: '', emoji: '🗼' },
  { id: 'seoul', city: 'Seoul', identifier: 'Asia/Seoul', label: '', emoji: '🇰🇷' },
  { id: 'beijing', city: 'Beijing', identifier: 'Asia/Shanghai', label: '', emoji: '🇨🇳' },
  { id: 'shanghai', city: 'Shanghai', identifier: 'Asia/Shanghai', label: '', emoji: '🏙️' },
  { id: 'hong-kong', city: 'Hong Kong', identifier: 'Asia/Hong_Kong', label: '', emoji: '🏙️' },
  { id: 'singapore', city: 'Singapore', identifier: 'Asia/Singapore', label: '', emoji: '🦁' },
  { id: 'bangkok', city: 'Bangkok', identifier: 'Asia/Bangkok', label: '', emoji: '🛕' },
  { id: 'dubai', city: 'Dubai', identifier: 'Asia/Dubai', label: '', emoji: '🏜️' },
  { id: 'mumbai', city: 'Mumbai', identifier: 'Asia/Kolkata', label: '', emoji: '🕌' },
  { id: 'delhi', city: 'Delhi', identifier: 'Asia/Kolkata', label: '', emoji: '🇮🇳' },

  // Oceania
  { id: 'sydney', city: 'Sydney', identifier: 'Australia/Sydney', label: '', emoji: '🦘' },
  { id: 'melbourne', city: 'Melbourne', identifier: 'Australia/Melbourne', label: '', emoji: '🏙️' },
  { id: 'auckland', city: 'Auckland', identifier: 'Pacific/Auckland', label: '', emoji: '🥝' },
]

export function getBackgroundColor(date: Date, timeZone: string): string[] {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  })

  const parts = formatter.formatToParts(date)
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '12')
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0')
  const hourDecimal = hour + minute / 60

  // Calculate brightness
  const normalizedHour = hourDecimal / 24
  const brightness = (Math.cos((normalizedHour - 0.5) * 2 * Math.PI) + 1) / 2

  if (brightness > 0.7) {
    return ['#F2F2F9', '#E8E8F5']
  } else if (brightness > 0.4) {
    return ['#FFD9B3', '#FFBFD9']
  } else if (brightness > 0.3) {
    return ['#667799', '#997799']
  } else {
    return ['#262A40', '#333A59']
  }
}

export function getTextColor(date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  })

  const parts = formatter.formatToParts(date)
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '12')
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0')
  const hourDecimal = hour + minute / 60

  const normalizedHour = hourDecimal / 24
  const brightness = (Math.cos((normalizedHour - 0.5) * 2 * Math.PI) + 1) / 2

  return brightness > 0.5 ? '#000000' : '#FFFFFF'
}
