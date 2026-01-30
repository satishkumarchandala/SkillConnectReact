import React from 'react'

const Stars = ({ rating }) => {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5

  return (
    <span>
      {Array.from({ length: full }).map((_, idx) => (
        <span key={`full-${idx}`} style={{ color: 'var(--accent-warning)' }}>
          ★
        </span>
      ))}
      {half && <span style={{ color: 'var(--accent-warning)' }}>☆</span>}
    </span>
  )
}

export default Stars
