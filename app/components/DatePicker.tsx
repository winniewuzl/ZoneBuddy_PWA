'use client'

interface DatePickerProps {
  selectedDate: Date
  onSelect: (date: Date) => void
  onClose: () => void
}

export default function DatePicker({ selectedDate, onSelect, onClose }: DatePickerProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month, day] = e.target.value.split('-').map(Number)
    const newDate = new Date(selectedDate)
    newDate.setFullYear(year, month - 1, day)
    onSelect(newDate)
  }

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
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
        <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, textAlign: 'center' }}>
          Select Date
        </h2>

        <input
          type="date"
          value={formatDateForInput(selectedDate)}
          onChange={handleDateChange}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '12px',
            fontSize: '16px',
            outline: 'none',
          }}
        />

        <button
          onClick={onClose}
          style={{
            padding: '12px',
            background: '#007AFF',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Done
        </button>
      </div>
    </div>
  )
}
