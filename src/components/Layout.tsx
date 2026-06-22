import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { cartCount } = useCart()

  return (
    <div className="site-shell">
      <div className="top-bar">Free shipping on orders over $75</div>
      <header className="site-header container">
        <p className="brand">The Grind Studio</p>
        <div className="subnav-row">
          <nav className="nav" aria-label="Main navigation">
            <NavLink to="/">Shop</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
          <NavLink className="cart-pill" to="/cart" aria-label="cart-count">
            Cart ({cartCount})
          </NavLink>
        </div>
      </header>
      <main className="container site-main">{children}</main>
      <footer className="site-footer">
        <div className="container footer-content">
          <p className="footer-name">The Grind Studio</p>
          <p>128 Roast Lane, Boston, MA 02116</p>
          <p>
            Phone: (617) 555-0188  -  Email: hello@thegrindstudio.com
          </p>
        </div>
      </footer>
    </div>
  )
}
