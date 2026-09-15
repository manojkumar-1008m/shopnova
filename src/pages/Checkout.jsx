import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProduct } from '../data/products'
import { useDemo } from '../context/DemoContext'

const PREMIUM_PROTECTION_PRICE = 199

const FEES = [
  { key: 'handling', label: 'Platform handling fee', amount: 49 },
  { key: 'convenience', label: 'Convenience fee', amount: 99 },
  { key: 'service', label: 'Service charge', amount: 51 },
]

const STEPS = ['Delivery address', 'Delivery option', 'Payment method', 'Review order']

export default function Checkout() {
  const { cart, cartTotal, premiumProtection, setPremiumProtection, scenarios } = useDemo()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const lines = cart
    .map((line) => ({ ...line, product: getProduct(line.productId) }))
    .filter((line) => line.product)

  // In the drip-pricing scenario, an extra fee "unlocks" as the shopper
  // advances through the checkout steps — never shown on the product page.
  const visibleFees = scenarios.dripPricing ? FEES.slice(0, step) : []
  const feesTotal = visibleFees.reduce((sum, f) => sum + f.amount, 0)
  const addonTotal = scenarios.preselectedAddon && premiumProtection ? PREMIUM_PROTECTION_PRICE : 0
  const total = useMemo(() => cartTotal + feesTotal + addonTotal, [cartTotal, feesTotal, addonTotal])

  if (lines.length === 0) {
    return (
      <div className="container empty-state">
        <h2>Nothing to check out</h2>
        <Link to="/" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    )
  }

  function nextStep() {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      navigate('/order-confirmation', { state: { total } })
    }
  }

  function prevStep() {
    setStep(Math.max(0, step - 1))
  }

  return (
    <div className="container checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-stepper" aria-label="Checkout steps">
        {STEPS.map((label, i) => (
          <div key={label} className={`checkout-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <span className="checkout-step-index">{i + 1}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <div className="checkout-main card">
          {step === 0 && (
            <div className="checkout-panel">
              <h2>Delivery address</h2>
              <div className="form-grid">
                <input placeholder="Full name" defaultValue="A. Shopper" />
                <input placeholder="Phone number" defaultValue="98765 43210" />
                <input placeholder="Address line 1" defaultValue="221 Nova Street" />
                <input placeholder="City" defaultValue="Bengaluru" />
                <input placeholder="PIN code" defaultValue="560001" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="checkout-panel">
              <h2>Delivery option</h2>
              <label className="radio-row">
                <input type="radio" name="delivery" defaultChecked />
                <span>Standard delivery — 3-4 days (Free)</span>
              </label>
              <label className="radio-row">
                <input type="radio" name="delivery" />
                <span>Express delivery — next day (₹99)</span>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-panel">
              <h2>Payment method</h2>
              <label className="radio-row">
                <input type="radio" name="payment" defaultChecked />
                <span>Card ending in 4242 (demo — no real transaction)</span>
              </label>
              <label className="radio-row">
                <input type="radio" name="payment" />
                <span>Demo Wallet Balance — no real transaction</span>
              </label>
              <p className="checkout-note">
                This is a synthetic checkout. No real payment information is collected or transmitted.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="checkout-panel">
              <h2>Review order</h2>
              {lines.map((line) => (
                <div key={line.productId} className="review-line">
                  <span>
                    {line.product.name} × {line.qty}
                  </span>
                  <span data-price-type="base" data-price={line.product.price * line.qty}>
                    ₹{(line.product.price * line.qty).toLocaleString()}
                  </span>
                </div>
              ))}

              {scenarios.preselectedAddon && (
                <label className="radio-row addon-row" data-demo-pattern="preselected_option">
                  <input
                    type="checkbox"
                    checked={premiumProtection}
                    data-action="toggle-premium-protection"
                    onChange={(e) => setPremiumProtection(e.target.checked)}
                  />
                  <span>
                    Protect your purchase — Premium Protection
                    <br />
                    <small>Covers accidental damage for 12 months.</small>
                  </span>
                  <span data-price-type="additional_fee" data-price={PREMIUM_PROTECTION_PRICE}>
                    ₹{PREMIUM_PROTECTION_PRICE}
                  </span>
                </label>
              )}
            </div>
          )}

          <div className="checkout-nav">
            {step > 0 && (
              <button type="button" className="btn btn-ghost" onClick={prevStep}>
                Back
              </button>
            )}
            <button type="button" className="btn btn-flare" data-action="checkout-continue" onClick={nextStep}>
              {step === STEPS.length - 1 ? 'Place order' : 'Continue'}
            </button>
          </div>
        </div>

        <aside className="checkout-summary card">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span data-price-type="base" data-price={cartTotal}>
              ₹{cartTotal.toLocaleString()}
            </span>
          </div>

          {visibleFees.map((fee) => (
            <div className="summary-row summary-fee" key={fee.key} data-demo-pattern="drip_pricing">
              <span>{fee.label}</span>
              <span data-price-type="additional_fee" data-price={fee.amount}>
                ₹{fee.amount}
              </span>
            </div>
          ))}

          {addonTotal > 0 && (
            <div className="summary-row">
              <span>Premium Protection</span>
              <span data-price-type="additional_fee" data-price={addonTotal}>
                ₹{addonTotal.toLocaleString()}
              </span>
            </div>
          )}

          <div className="summary-row summary-total">
            <span>Total</span>
            <span data-price-type="total" data-price={total}>
              ₹{total.toLocaleString()}
            </span>
          </div>
        </aside>
      </div>
    </div>
  )
}
