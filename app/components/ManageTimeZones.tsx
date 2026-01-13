'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragCancelEvent,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TimeZoneData, availableTimeZones } from '../utils/timezones'

interface ManageTimeZonesProps {
  timeZones: TimeZoneData[]
  onUpdate: (zones: TimeZoneData[]) => void
  onClose: () => void
}

interface SortableZoneItemProps {
  zone: TimeZoneData
  onRemove: (id: string) => void
}

function SortableZoneItem({ zone, onRemove }: SortableZoneItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: zone.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px',
        background: '#F9F9F9',
        borderRadius: '12px',
        opacity: isDragging ? 0.7 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{zone.emoji}</span>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '500' }}>{zone.city}</div>
          <div style={{ fontSize: '13px', color: '#999' }}>{zone.identifier}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${zone.city}`}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            color: '#999',
            cursor: 'grab',
            padding: '6px',
            touchAction: 'none',
          }}
        >
          ☰
        </button>
        <button
          onClick={() => onRemove(zone.id)}
          aria-label={`Remove ${zone.city}`}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            color: '#999',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default function ManageTimeZones({ timeZones, onUpdate, onClose }: ManageTimeZonesProps) {
  const [searchText, setSearchText] = useState('')
  const [localZones, setLocalZones] = useState(timeZones)
  const [isDragging, setIsDragging] = useState(false)

  const resetBodyStyles = useMemo(
    () => () => {
      document.body.style.overflow = ''
      document.body.style.overscrollBehavior = ''
      document.body.style.touchAction = ''
      document.documentElement.style.overscrollBehavior = ''
      document.documentElement.style.touchAction = ''
    },
    []
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 220,
        tolerance: 6,
      },
    })
  )

  const filteredZones = availableTimeZones.filter(zone =>
    zone.city.toLowerCase().includes(searchText.toLowerCase()) ||
    zone.identifier.toLowerCase().includes(searchText.toLowerCase())
  )

  const handleAdd = (zone: TimeZoneData) => {
    if (!localZones.find(z => z.id === zone.id)) {
      setLocalZones([...localZones, { ...zone, label: '' }])
    }
  }

  const handleRemove = (id: string) => {
    setLocalZones(localZones.filter(z => z.id !== id))
  }

  const handleDragStart = (_event: DragStartEvent) => {
    setIsDragging(true)
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
  }

  const handleDragCancel = (_event: DragCancelEvent) => {
    setIsDragging(false)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setIsDragging(false)

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = localZones.findIndex(zone => zone.id === active.id)
    const newIndex = localZones.findIndex(zone => zone.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      setLocalZones(arrayMove(localZones, oldIndex, newIndex))
    }
  }

  const handleDone = () => {
    onUpdate(localZones)
    resetBodyStyles()
    onClose()
  }

  useEffect(() => {
    if (!isDragging) {
      resetBodyStyles()
      return
    }

    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
    document.body.style.touchAction = 'none'
    document.documentElement.style.overscrollBehavior = 'none'
    document.documentElement.style.touchAction = 'none'
    return () => resetBodyStyles()
  }, [isDragging, resetBodyStyles])

  useEffect(() => {
    return () => resetBodyStyles()
  }, [resetBodyStyles])

  const handleClose = () => {
    resetBodyStyles()
    onClose()
  }

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
        alignItems: 'flex-end',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '20px 20px 0 0',
          width: '100%',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            ←
          </button>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
            Manage Time Zones
          </h2>
          <button
            onClick={handleDone}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              color: '#007AFF',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            Done
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '16px', position: 'relative' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            background: '#F5F5F5',
            borderRadius: '12px',
          }}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search cities or timezone codes..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '14px',
              }}
            />
            {searchText && (
              <button
                onClick={() => setSearchText('')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                ✕
              </button>
            )}
          </div>
          {searchText && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '64px',
                background: 'white',
                border: '1px solid #eee',
                borderRadius: '12px',
                padding: '8px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                maxHeight: '240px',
                overflowY: 'auto',
                zIndex: 2,
              }}
            >
              {filteredZones.length === 0 && (
                <div style={{ padding: '12px', fontSize: '13px', color: '#777' }}>
                  No matches
                </div>
              )}
              {filteredZones.map(zone => (
                <button
                  key={zone.id}
                  onClick={() => {
                    handleAdd(zone)
                    setSearchText('')
                  }}
                  disabled={localZones.some(z => z.id === zone.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px',
                    width: '100%',
                    background: localZones.some(z => z.id === zone.id) ? '#F0F0F0' : 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: localZones.some(z => z.id === zone.id) ? 'default' : 'pointer',
                    textAlign: 'left',
                    opacity: localZones.some(z => z.id === zone.id) ? 0.5 : 1,
                  }}
                >
                  <span>{zone.emoji}</span>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '500' }}>{zone.city}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{zone.identifier}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Your Time Zones */}
        <div style={{ padding: '0 16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#999', marginBottom: '8px' }}>
            YOUR TIME ZONES
          </h3>
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragCancel={handleDragCancel}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={localZones.map(zone => zone.id)} strategy={verticalListSortingStrategy}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  touchAction: isDragging ? 'none' : 'pan-y',
                }}
              >
                {localZones.map(zone => (
                  <SortableZoneItem key={zone.id} zone={zone} onRemove={handleRemove} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Available Time Zones */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', marginTop: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#999', marginBottom: '8px' }}>
            ADD TIME ZONE
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {availableTimeZones.map(zone => (
              <button
                key={zone.id}
                onClick={() => handleAdd(zone)}
                disabled={localZones.some(z => z.id === zone.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px',
                  background: localZones.some(z => z.id === zone.id) ? '#F0F0F0' : 'white',
                  border: '1px solid #eee',
                  borderRadius: '12px',
                  cursor: localZones.some(z => z.id === zone.id) ? 'default' : 'pointer',
                  textAlign: 'left',
                  opacity: localZones.some(z => z.id === zone.id) ? 0.5 : 1,
                }}
              >
                <span>{zone.emoji}</span>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '500' }}>{zone.city}</div>
                  <div style={{ fontSize: '13px', color: '#999' }}>{zone.identifier}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
