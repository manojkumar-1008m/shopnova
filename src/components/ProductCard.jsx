import React from 'react'
import { Link } from 'react-router-dom'
import ProductImage from './ProductImage'
import { discountPercent } from '../data/products'
import { useDemo } from '../context/DemoContext'

export default function ProductCard({ product }) {
  const { stock, viewers, scenarios } = useDemo()
  const discount = discountPercent(product)
  const currentStock = stock[product.id]
  const showScarcity = scenarios.scarcity && product.scarcity && currentStock <= 5
  const showSocialProof = scenarios.socialProof && product.socialProof

  return (
    <Link to={`/product/${product.id}`} className="product-card card" data-testid="product-card">
      <div className="product-card-media">
        <ProductImage image={product.image} name={product.name} size={180} />
        {discount > 0 && <span className="badge badge-flare product-card-discount">-{discount}%</span>}
      </div>
      <div className="product-card-body">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-tagline">{product.tagline}</p>
        <div className="product-card-rating">
          <span className="stars" aria-hidden="true">★★★★★</span>
          <span className="rating-value">{product.rating}</span>
          <span className="rating-count">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="product-card-price">
          <span className="price-current" data-price-type="base" data-price={product.price}>
            ₹{product.price.toLocaleString()}
          </span>
          {product.previousPrice && (
            <span className="price-previous">₹{product.previousPrice.toLocaleString()}</span>
          )}
        </div>
        {showScarcity && (
          <p className="product-card-scarcity" data-pattern="scarcity">
            Only {currentStock} left in stock
          </p>
        )}
        {showSocialProof && (
          <p className="product-card-social" data-pattern="social_proof">
            {viewers[product.id]} people viewing now
          </p>
        )}
        <p className="product-card-delivery">{product.delivery}</p>
      </div>
    </Link>
  )
}
