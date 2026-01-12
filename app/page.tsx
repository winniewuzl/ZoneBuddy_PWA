'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import TimeZoneCard from './components/TimeZoneCard'
import ManageTimeZones from './components/ManageTimeZones'
import DatePicker from './components/DatePicker'
import { TimeZoneData, availableTimeZones } from './utils/timezones'

const DEFAULT_TIMEZONES = [
  { id: 'current', city: 'Your Location', identifier: Intl.DateTimeFormat().resolvedOptions().timeZone, label: '', emoji: '📍' },
  { id: 'sf', city: 'San Francisco', identifier: 'America/Los_Angeles', label: 'HOME', emoji: '🌉' },
  { id: 'ny', city: 'New York', identifier: 'America/New_York', label: 'WORK', emoji: '🗽' },
  { id: 'london', city: 'London', identifier: 'Europe/London', label: 'TEAM', emoji: '🏰' },
  { id: 'tokyo', city: 'Tokyo', identifier: 'Asia/Tokyo', label: 'FRIENDS', emoji: '🗼' },
  { id: 'sydney', city: 'Sydney', identifier: 'Australia/Sydney', label: 'FAMILY', emoji: '🦘' },
]

export default function Home() {
  const [selectedTime, setSelectedTime] = useState<Date>(new Date())
  const [dragOffset, setDragOffset] = useState<number>(0)
  const [timeZones, setTimeZones] = useState<TimeZoneData[]>(DEFAULT_TIMEZONES)
  const [showingManageZones, setShowingManageZones] = useState(false)
  const [showingDatePicker, setShowingDatePicker] = useState(false)

  // Load settings from cookies
  useEffect(() => {
    const savedZones = Cookies.get('timeZones')
    const savedDate = Cookies.get('selectedDate')

    if (savedZones) {
      try {
        setTimeZones(JSON.parse(savedZones))
      } catch (e) {
        console.error('Failed to parse saved zones:', e)
      }
    }

    if (savedDate) {
      setSelectedTime(new Date(savedDate))
    }

    // Initialize drag offset to center and keep in sync with resize
    if (typeof window !== 'undefined') {
      const updateOffset = () => setDragOffset(window.innerWidth / 2)
      updateOffset()
      window.addEventListener('resize', updateOffset)
      return () => window.removeEventListener('resize', updateOffset)
    }
  }, [])

  // Save settings to cookies
  useEffect(() => {
    Cookies.set('timeZones', JSON.stringify(timeZones), { expires: 365 })
  }, [timeZones])

  useEffect(() => {
    Cookies.set('selectedDate', selectedTime.toISOString(), { expires: 7 })
  }, [selectedTime])

  const handleDrag = (clientX: number) => {
    setDragOffset(clientX)

    // Map the drag offset to time of day
    const totalWidth = typeof window !== 'undefined' ? window.innerWidth - 32 : 375
    const normalizedOffset = Math.min(Math.max(clientX - 16, 0), totalWidth)
    const hourFraction = (normalizedOffset / totalWidth) * 24.0

    const date = new Date(selectedTime)
    date.setHours(Math.floor(hourFraction))
    date.setMinutes(Math.floor((hourFraction % 1) * 60))
    date.setSeconds(0)

    setSelectedTime(date)
  }

  const formattedDate = selectedTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
      }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'rgba(0, 0, 0, 0.8)' }}>
          ZoneBuddy
        </h1>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => setShowingDatePicker(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              background: 'rgba(255, 255, 255, 0.7)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'rgba(0, 0, 0, 0.7)',
              cursor: 'pointer',
            }}
          >
            <span>📅</span>
            <span>{formattedDate}</span>
          </button>

          <button
            onClick={() => setShowingManageZones(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px',
              background: 'transparent',
              border: 'none',
              fontSize: '16px',
              color: 'rgba(0, 0, 0, 0.7)',
              cursor: 'pointer',
            }}
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Time zone cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {timeZones.map((zone) => (
            <TimeZoneCard
              key={zone.id}
              timeZone={zone}
              currentTime={selectedTime}
              dragOffset={dragOffset}
              onDrag={handleDrag}
            />
          ))}
        </div>
      </div>

      {/* Manage Zones Modal */}
      {showingManageZones && (
        <ManageTimeZones
          timeZones={timeZones}
          onUpdate={setTimeZones}
          onClose={() => setShowingManageZones(false)}
        />
      )}

      {/* Date Picker Modal */}
      {showingDatePicker && (
        <DatePicker
          selectedDate={selectedTime}
          onSelect={(date) => {
            setSelectedTime(date)
            setShowingDatePicker(false)
          }}
          onClose={() => setShowingDatePicker(false)}
        />
      )}
    </main>
  )
}
