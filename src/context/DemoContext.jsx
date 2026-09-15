import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { PRODUCTS } from '../data/products'

const DemoContext = createContext(null)

const DEFAULT_SCENARIOS = {
  falseUrgency: true,
  scarcity: true,
  dripPricing: true,
  preselectedAddon: true,
  confirmShaming: true,
  cancellationObstruction: true,
  visualMisdirection: true,
  socialProof: true,
}

const TIMER_START_SECONDS = 9 * 60 + 42 // 09:42
const TIMER_RESET_THRESHOLD = 9 * 60 + 1 // resets when it WOULD drop below 09:01

function initialStock() {
  const map = {}
  PRODUCTS.forEach((p) => {
    map[p.id] = p.stock
  })
  return map
}

function initialViewers() {
  const map = {}
  PRODUCTS.forEach((p) => {
    map[p.id] = 8 + Math.floor(Math.random() * 10)
  })
  return map
}

export function DemoProvider({ children }) {
  const [scenarios, setScenarios] = useState(DEFAULT_SCENARIOS)
  const [cart, setCart] = useState([]) // {productId, qty}
  const [premiumProtection, setPremiumProtection] = useState(true)
  const [timerSeconds, setTimerSeconds] = useState(TIMER_START_SECONDS)
  const [stock, setStock] = useState(initialStock())
  const [viewers, setViewers] = useState(initialViewers())
  const [membershipStatus, setMembershipStatus] = useState('active') // active | cancelled
  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

  // Flash-deal countdown. Resets to the start value once it would fall below
  // the threshold, so the "limited time" offer never actually runs out.
  // This loop only runs while the falseUrgency scenario is enabled.
  useEffect(() => {
    if (!scenarios.falseUrgency) return undefined
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        const next = prev - 1
        if (next < TIMER_RESET_THRESHOLD) {
          return TIMER_START_SECONDS
        }
        return next
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [scenarios.falseUrgency])

  // Social-proof viewer counts drift slightly over time.
  useEffect(() => {
    if (!scenarios.socialProof) return undefined
    const interval = setInterval(() => {
      setViewers((prev) => {
        const next = { ...prev }
        Object.keys(next).forEach((id) => {
          const delta = Math.random() > 0.5 ? 1 : -1
          next[id] = Math.max(4, next[id] + delta)
        })
        return next
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [scenarios.socialProof])

  const pushToast = useCallback((message) => {
    const id = ++toastId.current
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  const decrementStock = useCallback((productId) => {
    setStock((prev) => {
      if (!(productId in prev)) return prev
      const current = prev[productId]
      if (current <= 1) return prev
      return { ...prev, [productId]: current - 1 }
    })
  }, [])

  const addToCart = useCallback(
    (productId, qty = 1) => {
      setCart((prev) => {
        const existing = prev.find((line) => line.productId === productId)
        if (existing) {
          return prev.map((line) =>
            line.productId === productId ? { ...line, qty: line.qty + qty } : line
          )
        }
        return [...prev, { productId, qty }]
      })
      if (scenarios.scarcity) {
        decrementStock(productId)
      }
      pushToast('Added to cart')
    },
    [decrementStock, pushToast, scenarios.scarcity]
  )

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((line) => line.productId !== productId))
  }, [])

  const updateQty = useCallback((productId, qty) => {
    setCart((prev) =>
      prev
        .map((line) => (line.productId === productId ? { ...line, qty } : line))
        .filter((line) => line.qty > 0)
    )
  }, [])

  const toggleScenario = useCallback((key) => {
    setScenarios((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const setAllScenarios = useCallback((value) => {
    const next = {}
    Object.keys(DEFAULT_SCENARIOS).forEach((key) => {
      next[key] = value
    })
    setScenarios(next)
  }, [])

  const resetDemo = useCallback(() => {
    setScenarios(DEFAULT_SCENARIOS)
    setCart([])
    setPremiumProtection(true)
    setTimerSeconds(TIMER_START_SECONDS)
    setStock(initialStock())
    setViewers(initialViewers())
    setMembershipStatus('active')
    setToasts([])
    pushToast('Demo reset')
  }, [pushToast])

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, line) => {
      const product = PRODUCTS.find((p) => p.id === line.productId)
      if (!product) return sum
      return sum + product.price * line.qty
    }, 0)
  }, [cart])

  const value = {
    scenarios,
    toggleScenario,
    setAllScenarios,
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    cartTotal,
    premiumProtection,
    setPremiumProtection,
    timerSeconds,
    stock,
    viewers,
    membershipStatus,
    setMembershipStatus,
    toasts,
    pushToast,
    resetDemo,
  }

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}

export function formatTimer(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
