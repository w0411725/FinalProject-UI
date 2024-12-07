import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Checkout({ isLoggedIn }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    province: '',
    country: '',
    postal_code: '',
    credit_card: '',
    credit_expire: '',
    credit_cvv: '',
  })
  const [errorMessage, setErrorMessage] = useState('')

  // Helper to get the cart cookie
  const getCartCookie = () => {
    const cookies = document.cookie.split('; ')
    const cartCookie = cookies.find(cookie => cookie.startsWith('cart='))
    return cartCookie ? cartCookie.split('=')[1] : ''
  }

  // Helper to clear the cart cookie
  const clearCartCookie = () => {
    document.cookie = 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }

  // Handle form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const cart = getCartCookie()
    if (!cart) {
      setErrorMessage('Your cart is empty.')
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HOST}/products/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cart,
        }),
      })

      if (response.ok) {
        clearCartCookie() // Clear cart cookie after purchase
        navigate('/confirmation') // Redirect to Confirmation page
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.error || 'Failed to complete the purchase.')
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again later.')
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="container mt-5 text-center">
        <h4>You must be logged in to proceed to checkout.</h4>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Checkout</h2>

      {errorMessage && (
        <div className="alert alert-danger text-center">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '400px' }}>
        <h4>Mailing Address</h4>
        {['street', 'city', 'province', 'country', 'postal_code'].map(field => (
          <div className="mb-3" key={field}>
            <label htmlFor={field} className="form-label">
              {field.replace('_', ' ').toUpperCase()}
            </label>
            <input
              id={field}
              name={field}
              type="text"
              className="form-control"
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <h4>Payment Information</h4>
        {['credit_card', 'credit_expire', 'credit_cvv'].map(field => (
          <div className="mb-3" key={field}>
            <label htmlFor={field} className="form-label">
              {field.replace('_', ' ').toUpperCase()}
            </label>
            <input
              id={field}
              name={field}
              type="text"
              className="form-control"
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <button type="submit" className="btn btn-success w-100">
          Complete Purchase
        </button>
      </form>
    </div>
  )
}
