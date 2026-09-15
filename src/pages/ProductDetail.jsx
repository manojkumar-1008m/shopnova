import React from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import ProductImage from '../components/ProductImage'
import { getProduct, discountPercent } from '../data/products'
import { useDemo, formatTimer } from '../context/DemoContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProduct(id)
  const { scenarios, stock, viewers, timerSeconds, addToCart, setPremiumProtection } = useDemo()

  if (!product) {
    return (
      <div className="container empty-state">
        <h2>Product not found</h2>
        <Link to="/" className="btn btn-ghost">
          Back to homepage
        </Link>
      </div>
    )
  }

  const discount = discountPercent(product)
  const currentStock = stock[product.id]
  const currentViewers = viewers[product.id]
  const showFlashDeal = scenarios.falseUrgency && product.flashDeal
  const showScarcity = scenarios.scarcity && product.scarcity
  const showSocialProof = scenarios.socialProof && product.socialProof

  function handleBuyNow(withPremium) {
    addToCart(product.id, 1)
    setPremiumProtection(scenarios.preselectedAddon ? withPremium : false)
    navigate('/checkout')
  }

  return (
    <div className="container product-detail">
      <div className="product-detail-grid">
        <div className="product-detail-media card">
          <ProductImage image={product.image} name={product.name} size={360} />
        </div>

        <div className="product-detail-info">
          <p className="product-detail-category">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="product-detail-tagline">{product.tagline}</p>

          <div className="product-card-rating">
            <span className="stars" aria-hidden="true">★★★★★</span>
            <span className="rating-value">{product.rating}</span>
            <span className="rating-count">({product.reviews.toLocaleString()} ratings)</span>
          </div>

          {showFlashDeal && (
            <div className="flash-deal-banner" data-demo-pattern="false_urgency countdown_timer">
              <span className="badge badge-flare">Flash Deal</span>
              <span className="flash-deal-timer" data-pattern="countdown_timer">
                Only {formatTimer(timerSeconds)} remaining
              </span>
              <p className="flash-deal-note">
                Offer expires when the timer reaches zero. Order now to lock in this price.
              </p>
            </div>
          )}

          <div className="product-detail-price">
            <span className="price-current" data-price-type="base" data-price={product.price}>
              ₹{product.price.toLocaleString()}
            </span>
            {product.previousPrice && (
              <>
                <span className="price-previous">₹{product.previousPrice.toLocaleString()}</span>
                <span className="badge badge-flare">-{discount}%</span>
              </>
            )}
          </div>

          {showScarcity && (
            <div className="scarcity-block" data-pattern="scarcity">
              <p className="scarcity-stock">Only {currentStock} left in stock</p>
              <p className="scarcity-demand">High demand — selling fast</p>
            </div>
          )}

          {showSocialProof && (
            <p className="social-proof-line" data-pattern="social_proof">
              {currentViewers} people are viewing this item · Popular choice
            </p>
          )}

          <p className="product-detail-delivery">{product.delivery}</p>

          {scenarios.visualMisdirection ? (
            <div className="misdirection-ctas" data-demo-pattern="visual_misdirection">
              <button
                type="button"
                className="btn btn-flare misdirection-primary"
                data-action="continue-with-premium"
                onClick={() => handleBuyNow(true)}
              >
                Continue with Premium Protection
              </button>
              <button
                type="button"
                className="misdirection-secondary"
                data-action="continue-without-premium"
                onClick={() => handleBuyNow(false)}
              >
                Continue without Premium
              </button>
            </div>
          ) : (
            <div className="product-detail-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => addToCart(product.id, 1)}
              >
                Add to Cart
              </button>
              <button type="button" className="btn btn-flare" onClick={() => handleBuyNow(false)}>
                Buy Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
