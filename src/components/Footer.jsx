import React from 'react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <span className="logo-word footer-logo">ShopNova</span>
          <p>Everything you want. Delivered simply.</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Shop</h4>
            <a href="#top">Electronics</a>
            <a href="#top">Bags</a>
            <a href="#top">Smart Home</a>
          </div>
          <div>
            <h4>Help</h4>
            <a href="#top">Returns</a>
            <a href="#top">Shipping</a>
            <a href="#top">Contact</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#top">About</a>
            <a href="#top">Careers</a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>ShopNova is a synthetic demo storefront for testing the ClauseGuard dark-pattern detector. No real products or transactions.</p>
      </div>
    </footer>
  )
}
