import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductImage from '../components/ProductImage'
import ConfirmShamingModal from '../components/ConfirmShamingModal'
import { getProduct } from '../data/products'
import { useDemo } from '../context/DemoContext'

const PREMIUM_PROTECTION_PRICE = 199

export default function Cart() {
  const {
    cart,
    updateQty,
    removeFromCart,
    cartTotal,
    premiumProtection,
    setPremiumProtection,
    scenarios,
    pushToast,
  } = useDemo()
  const navigate = useNavigate()
  const [showConfirmShaming, setShowConfirmShaming] = useState(false)
  const [discountApplied, setDiscountApplied] = useState(false)

  const lines = cart
    .map((line) => ({ ...line, product: getProduct(line.productId) }))
    .filter((line) => line.product)

  const addonTotal = scenarios.preselectedAddon && premiumProtection ? PREMIUM_PROTECTION_PRICE : 0
  const total = cartTotal + addonTotal

  function goToCheckout() {
    if (scenarios.confirmShaming && !discountApplied) {
      setShowConfirmShaming(true)
      return
    }
    navigate('/checkout')
  }

  function acceptDiscount() {
    setDiscountApplied(true)
    setShowConfirmShaming(false)
    pushToast('20% discount applied')
    navigate('/checkout')
  }

  function declineDiscount() {
    setShowConfirmShaming(false)
    navigate('/checkout')
  }

  if (lines.length === 0) {
    return (
      <div className="container empty-state">
        <h2>Your cart is empty</h2>
        <p>Browse the catalog and add something you like.</p>
        <Link to="/" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container cart-page">
      <h1>Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-lines">
          {lines.map((line) => (
            <div key={line.productId} className="cart-line card" data-testid="cart-line">
              <ProductImage image={line.product.image} name={line.product.name} size={88} />
              <div className="cart-line-info">
                <h3>{line.product.name}</h3>
                <p className="cart-line-tagline">{line.product.tagline}</p>
                <div className="cart-line-qty">
                  <label htmlFor={`qty-${line.productId}`}>Qty</label>
                  <select
                    id={`qty-${line.productId}`}
                    value={line.qty}
                    onChange={(e) => updateQty(line.productId, Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn-quiet"
                    data-action="remove-item"
                    onClick={() => removeFromCart(line.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="cart-line-price">
                <span data-price-type="base" data-price={line.product.price * line.qty}>
                  ₹{(line.product.price * line.qty).toLocaleString()}
                </span>
              </div>
            </div>
          ))}

          {scenarios.preselectedAddon && (
            <div className="cart-addon card" data-demo-pattern="preselected_option">
              <label className="cart-addon-label">
                <input
                  type="checkbox"
                  checked={premiumProtection}
                  data-action="toggle-premium-protection"
                  onChange={(e) => setPremiumProtection(e.target.checked)}
                />
                <span>
                  <strong>Premium Protection</strong>
                  <br />
                  Covers accidental damage for 12 months.
                </span>
              </label>
              <span data-price-type="additional_fee" data-price={PREMIUM_PROTECTION_PRICE}>
                ₹{PREMIUM_PROTECTION_PRICE}
              </span>
            </div>
          )}
        </div>

        <aside className="cart-summary card">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span data-price-type="subtotal" data-price={cartTotal}>
              ₹{cartTotal.toLocaleString()}
            </span>
          </div>
          {addonTotal > 0 && (
            <div className="summary-row">
              <span>Premium Protection</span>
              <span data-price-type="additional_fee" data-price={addonTotal}>
                ₹{addonTotal.toLocaleString()}
              </span>
            </div>
          )}
          {discountApplied && (
            <div className="summary-row summary-discount">
              <span>Discount (20%)</span>
              <span>applied at checkout</span>
            </div>
          )}
          <div className="summary-row summary-total">
            <span>Estimated Total</span>
            <span data-price-type="total" data-price={total}>
              ₹{total.toLocaleString()}
            </span>
          </div>
          <button type="button" className="btn btn-flare summary-cta" onClick={goToCheckout}>
            Proceed to Checkout
          </button>
          <Link to="/" className="btn-quiet cart-continue">
            Continue shopping
          </Link>
        </aside>
      </div>

      {showConfirmShaming && (
        <ConfirmShamingModal onAccept={acceptDiscount} onDecline={declineDiscount} />
      )}
    </div>
  )
}
