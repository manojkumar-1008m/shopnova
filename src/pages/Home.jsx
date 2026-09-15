import React from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { PRODUCTS, CUSTOMERS_BUYING, getProduct } from '../data/products'

function Section({ title, products, subtitle }) {
  if (!products.length) return null
  return (
    <section className="home-section container">
      <div className="home-section-heading">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const trending = PRODUCTS.filter((p) => p.section === 'trending')
  const deals = PRODUCTS.filter((p) => p.section === 'deals')
  const electronics = PRODUCTS.filter((p) => p.category === 'Popular Electronics')
  const recommended = PRODUCTS.filter((p) => p.section === 'recommended')
  const customersBuying = CUSTOMERS_BUYING.map(getProduct).filter(Boolean)

  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="hero-eyebrow">New season arrivals</span>
            <h1>Everything you want.<br />Delivered simply.</h1>
            <p>
              Discover NovaPods, NovaBook and more — hand-picked tech and
              everyday essentials, shipped fast.
            </p>
            <Link to="/product/novapods-pro" className="btn btn-flare hero-cta">
              Shop the flash deal
            </Link>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-art-blob" />
          </div>
        </div>
      </section>

      <Section title="Trending Now" products={trending} />
      <Section title="Limited-Time Deals" products={deals} subtitle="Prices drop while stock lasts." />
      <Section title="Popular Electronics" products={electronics} />
      <Section title="Recommended For You" products={recommended} subtitle="Based on shoppers like you." />
      <Section title="Customers Are Buying" products={customersBuying} />

      <section className="newsletter">
        <div className="container newsletter-inner">
          <div>
            <h2>Stay in the loop</h2>
            <p>Get new arrivals and deals in your inbox. No spam, unsubscribe anytime.</p>
          </div>
          <form
            className="newsletter-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input type="email" placeholder="you@example.com" aria-label="Email address" />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
