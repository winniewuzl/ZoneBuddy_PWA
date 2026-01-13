'use client'

import { useMemo, useState } from 'react'

interface DatePickerProps {
  selectedDate: Date
  onSelect: (date: Date) => void
  onClose: () => void
}

export default function DatePicker({ selectedDate, onSelect, onClose }: DatePickerProps) {
  const [displayedMonth, setDisplayedMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  )

  const monthLabel = displayedMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const calendarDays = useMemo(() => {
    const year = displayedMonth.getFullYear()
    const month = displayedMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const startOffset = firstDay.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const totalSlots = startOffset + daysInMonth
    const slots = Array.from({ length: totalSlots }, (_, index) => {
      if (index < startOffset) {
        return null
      }
      return index - startOffset + 1
    })
    return slots
  }, [displayedMonth])

  const handleSelect = (day: number) => {
    const newDate = new Date(selectedDate)
    newDate.setFullYear(displayedMonth.getFullYear(), displayedMonth.getMonth(), day)
    onSelect(newDate)
  }

  const handlePreviousMonth = () => {
    setDisplayedMonth(new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setDisplayedMonth(new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1))
  }

  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '24px',
          maxWidth: '400px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={handlePreviousMonth}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            ←
          </button>
          <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
            {monthLabel}
          </h2>
          <button
            onClick={handleNextMonth}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {weekdayLabels.map((label) => (
            <div
              key={label}
              style={{
                fontSize: '12px',
                color: '#888',
                textAlign: 'center',
                fontWeight: '600',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} />
            }

            const isSelected =
              day === selectedDate.getDate() &&
              displayedMonth.getMonth() === selectedDate.getMonth() &&
              displayedMonth.getFullYear() === selectedDate.getFullYear()

            return (
              <button
                key={day}
                onClick={() => handleSelect(day)}
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: '12px',
                  border: 'none',
                  background: isSelected ? '#007AFF' : '#F2F2F2',
                  color: isSelected ? 'white' : '#222',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
