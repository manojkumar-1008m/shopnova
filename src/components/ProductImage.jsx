import React from 'react'

// Deterministic placeholder art per product so the catalog looks varied
// without needing external image assets.
const PALETTES = {
  earbuds: ['#232A63', '#4F6BFF'],
  laptop: ['#12131A', '#4a4d5a'],
  watch: ['#E14620', '#FF8A65'],
  headphones: ['#171B45', '#4F6BFF'],
  monitor: ['#0F2540', '#2E6FA3'],
  charger: ['#8A5F14', '#E8A93E'],
  backpack: ['#2C4A2E', '#5B8C5A'],
  hub: ['#4B2E83', '#8A5FD1'],
}

export default function ProductImage({ image, name, size = 240 }) {
  const [c1, c2] = PALETTES[image] || ['#232A63', '#4F6BFF']
  const gradientId = `grad-${image}`
  return (
    <svg
      viewBox="0 0 240 240"
      width="100%"
      height={size}
      role="img"
      aria-label={name}
      style={{ borderRadius: 12, background: '#fff' }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="240" height="240" fill="#fff" />
      <circle cx="120" cy="120" r="86" fill={`url(#${gradientId})`} opacity="0.14" />
      <rect x="60" y="70" width="120" height="100" rx="18" fill={`url(#${gradientId})`} />
      <circle cx="120" cy="120" r="26" fill="#fff" opacity="0.85" />
    </svg>
  )
}
