import React from 'react'
import { useDemo } from '../context/DemoContext'

export default function ToastStack() {
  const { toasts } = useDemo()
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.message}
        </div>
      ))}
    </div>
  )
}
