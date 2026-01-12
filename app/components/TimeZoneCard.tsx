'use client'

import { TimeZoneData, getBackgroundColor, getTextColor } from '../utils/timezones'
import { useState, useRef, useEffect } from 'react'

interface TimeZoneCardProps {
  timeZone: TimeZoneData
  currentTime: Date
  dragOffset: number
  onDrag: (clientX: number) => void
}

export default function TimeZoneCard({ timeZone, currentTime, dragOffset, onDrag }: TimeZoneCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timeZone.identifier,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const abbreviationFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timeZone.identifier,
    timeZoneName: 'short',
  })

  const formattedTime = timeFormatter.format(currentTime)
  const [time, period] = formattedTime.split(' ')

  const timeZoneName = abbreviationFormatter.formatToParts(currentTime)
    .find(part => part.type === 'timeZoneName')?.value || ''

  const [bgStart, bgEnd] = getBackgroundColor(currentTime, timeZone.identifier)
  const textColor = getTextColor(currentTime, timeZone.identifier)

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    if (cardRef.current) {
      cardRef.current.setPointerCapture(e.pointerId)
    }
    onDrag(e.clientX)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      onDrag(e.clientX)
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)
    if (cardRef.current) {
      cardRef.current.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'relative',
        height: '80px',
        background: `linear-gradient(135deg, ${bgStart}, ${bgEnd})`,
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Vertical indicator line */}
      <div
        style={{
          position: 'absolute',
          left: `${dragOffset - 1}px`,
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'rgba(255, 255, 255, 0.6)',
          pointerEvents: 'none',
        }}
      />

      {/* City info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1 }}>
        <span style={{ fontSize: '24px' }}>{timeZone.emoji}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: textColor }}>
            {timeZone.city}
          </div>
          <div style={{ display: 'flex', gap: '4px', fontSize: '12px', color: textColor, opacity: 0.7 }}>
            {timeZone.label && (
              <>
                <span>{timeZone.label}</span>
                <span>·</span>
              </>
            )}
            <span>{timeZoneName}</span>
          </div>
        </div>
      </div>

      {/* Time display */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', zIndex: 1 }}>
        <div style={{ fontSize: '32px', fontWeight: '500', color: textColor }}>
          {time}
        </div>
        <div style={{ fontSize: '14px', fontWeight: '500', color: textColor, opacity: 0.8 }}>
          {period}
        </div>
      </div>
    </div>
  )
}
