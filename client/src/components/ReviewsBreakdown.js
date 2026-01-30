import React from 'react'

const ReviewsBreakdown = ({ reviews }) => {
  const total = reviews.length
  const counts = [5, 4, 3, 2, 1].map((star) =>
    reviews.filter((review) => review.rating === star).length
  )

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {counts.map((count, index) => {
        const star = 5 - index
        const percent = total ? Math.round((count / total) * 100) : 0
        return (
          <div key={`breakdown-${star}`} style={{ display: 'flex', gap: 8 }}>
            <span style={{ width: 40 }}>{star}★</span>
            <div
              style={{
                flex: 1,
                background: 'var(--bg-muted)',
                borderRadius: 999,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  background: 'var(--accent-warning)',
                  height: 8
                }}
              />
            </div>
            <span style={{ width: 30 }}>{count}</span>
          </div>
        )
      })}
    </div>
  )
}

export default ReviewsBreakdown
