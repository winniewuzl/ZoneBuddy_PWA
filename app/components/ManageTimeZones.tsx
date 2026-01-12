'use client'

import { useState } from 'react'
import { TimeZoneData, availableTimeZones } from '../utils/timezones'

interface ManageTimeZonesProps {
  timeZones: TimeZoneData[]
  onUpdate: (zones: TimeZoneData[]) => void
  onClose: () => void
}

export default function ManageTimeZones({ timeZones, onUpdate, onClose }: ManageTimeZonesProps) {
  const [searchText, setSearchText] = useState('')
  const [localZones, setLocalZones] = useState(timeZones)

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

  const handleMove = (index: number, direction: number) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= localZones.length) {
      return
    }
    const updated = [...localZones]
    const [moved] = updated.splice(index, 1)
    updated.splice(nextIndex, 0, moved)
    setLocalZones(updated)
  }

  const handleDone = () => {
    onUpdate(localZones)
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
      onClick={onClose}
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
            onClick={onClose}
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
        <div style={{ padding: '16px' }}>
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
        </div>

        {/* Your Time Zones */}
        <div style={{ padding: '0 16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#999', marginBottom: '8px' }}>
            YOUR TIME ZONES
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {localZones.map((zone, index) => (
              <div
                key={zone.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: '#F9F9F9',
                  borderRadius: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{zone.emoji}</span>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '500' }}>{zone.city}</div>
                    <div style={{ fontSize: '13px', color: '#999' }}>{zone.identifier}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '12px',
                        color: '#666',
                        cursor: 'pointer',
                        opacity: index === 0 ? 0.3 : 1,
                      }}
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMove(index, 1)}
                      disabled={index === localZones.length - 1}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '12px',
                        color: '#666',
                        cursor: 'pointer',
                        opacity: index === localZones.length - 1 ? 0.3 : 1,
                      }}
                    >
                      ▼
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(zone.id)}
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
            ))}
          </div>
        </div>

        {/* Available Time Zones */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', marginTop: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#999', marginBottom: '8px' }}>
            ADD TIME ZONE
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredZones.map(zone => (
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
