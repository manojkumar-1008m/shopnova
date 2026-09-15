import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDemo } from '../context/DemoContext'

const CATEGORIES = ['Electronics', 'Bags', 'Smart Home', 'Accessories', 'Deals']

export default function Header() {
  const { cart } = useDemo()
  const navigate = useNavigate()
  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0)

  function handleSearch(e) {
    e.preventDefault()
    navigate('/')
  }

  return (
    <header className="site-header" data-testid="site-header">
      <div className="container header-top">
        <Link to="/" className="logo" aria-label="ShopNova home">
          <span className="logo-mark">◈</span>
          <span className="logo-word">ShopNova</span>
        </Link>

        <form className="search-bar" role="search" onSubmit={handleSearch}>
          <input
            type="search"
            name="q"
            placeholder="Search products, brands and more"
            aria-label="Search ShopNova"
          />
          <button type="submit" className="search-btn" aria-label="Search">
            ⌕
          </button>
        </form>

        <nav className="header-actions" aria-label="Account">
          <Link to="/account" className="header-action" data-action="open-account">
            <span className="icon">☺</span>
            <span>Account</span>
          </Link>
          <Link to="/account" className="header-action" data-action="open-wishlist">
            <span className="icon">♡</span>
            <span>Wishlist</span>
          </Link>
          <Link to="/cart" className="header-action cart-action" data-action="open-cart">
            <span className="icon">
              ⛃
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </span>
            <span>Cart</span>
          </Link>
        </nav>
      </div>

      <div className="header-bottom">
        <div className="container categories-row">
          {CATEGORIES.map((cat) => (
            <button key={cat} className="category-link" type="button">
              {cat}
            </button>
          ))}
          <Link to="/demo" className="category-link demo-link" data-testid="demo-panel-link">
            Demo Scenarios
          </Link>
        </div>
      </div>
    </header>
  )
}
