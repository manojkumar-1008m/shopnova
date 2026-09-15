import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDemo } from '../context/DemoContext'

export default function OrderConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { cart, removeFromCart } = useDemo()
  const total = location.state?.total

  useEffect(() => {
    if (total === undefined) {
      navigate('/', { replace: true })
    }
  }, [total, navigate])

  useEffect(() => {
    // Clear the cart once the (synthetic) order is placed.
    cart.forEach((line) => removeFromCart(line.productId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (total === undefined) return null

  const orderId = `SN-DEMO-${Math.floor(100000 + Math.random() * 900000)}`

  return (
    <div className="container empty-state order-confirmation">
      <span className="confirmation-check" aria-hidden="true">✓</span>
      <h1>Order placed</h1>
      <p>
        This is a synthetic demo order — no real transaction occurred. Order reference{' '}
        <strong>{orderId}</strong>.
      </p>
      <p className="confirmation-total">
        Total charged (demo): <strong>₹{total.toLocaleString()}</strong>
      </p>
      <Link to="/" className="btn btn-primary">
        Back to ShopNova
      </Link>
    </div>
  )
}
