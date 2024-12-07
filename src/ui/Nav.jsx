import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'

export default function Nav({ isLoggedIn }) {
  const [cartCount, setCartCount] = useState(0)

  // Helper to get the cart cookie
  const getCartCookie = () => {
    const cookies = document.cookie.split('; ')
    const cartCookie = cookies.find(cookie => cookie.startsWith('cart='))
    return cartCookie ? cartCookie.split('=')[1] : ''
  }

  // Update the cart count whenever the page reloads
  useEffect(() => {
    const updateCartCount = () => {
      const cartCookie = getCartCookie()
      const productIds = cartCookie ? cartCookie.split(',').filter(Boolean) : []
      setCartCount(productIds.length)
    }

    updateCartCount()

    // Optional: Listen for changes to the cookie (this is an advanced approach)
    const cookieInterval = setInterval(updateCartCount, 1000) // Check cookie every second
    return () => clearInterval(cookieInterval) // Cleanup interval on unmount
  }, [])

  return (
    <div>
      <h1 className="d-flex justify-content-center flex-wrap gap-3">Old School Runescape Item Shop</h1>
      <div className="d-flex justify-content-center gap-3">
        <Link to="/home" className="btn btn-primary d-flex align-items-center justify-content-center" style={{ height: '3rem', width: '6rem' }}>
            Home
        </Link>
        <Link to="/cart" className="btn btn-success position-relative d-flex align-items-center justify-content-center" style={{ height: '3rem', width: '6rem' }}>
            <i className="bi bi-cart3"></i>
            {cartCount > 0 && (
            <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: '0.75rem', transform: 'translate(-50%, -50%)' }}
            >
                {cartCount}
            </span>
            )}
        </Link>
        {isLoggedIn ? (
            <Link to="/logout" className="btn btn-secondary d-flex align-items-center justify-content-center" style={{ height: '3rem', width: '6rem' }}>
            Logout
            </Link>
        ) : (
            <Link to="/login" className="btn btn-secondary d-flex align-items-center justify-content-center" style={{ height: '3rem', width: '6rem' }}>
            Login
            </Link>
        )}
        </div>
    </div>
  )
}
