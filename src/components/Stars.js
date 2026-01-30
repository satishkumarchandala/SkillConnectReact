import React from 'react'

const Stars = ({ rating }) => {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5

  return (
    <span>
      {Array.from({ length: full }).map((_, idx) => (
        <span key={`full-${idx}`} style={{ color: '#fbbf24' }}>
          ★
        </span>
      ))}
      {half && <span style={{ color: '#fbbf24' }}>☆</span>}
    </span>
  )
}

export default Stars
