import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Details() {
  const { id } = useParams() // Get product ID from URL
  const [product, setProduct] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProductDetails()
  }, [])

  // Fetch product details
  const loadProductDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HOST}/products/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      } else {
        setMessage('Product not found')
      }
    } catch (error) {
      setMessage('An error occurred while loading the product details.')
    }
  }

  // Add product to cart
  const addToCart = (productId) => {
    const cartCookie = getCartCookie().split(',').filter(Boolean) // Get current cart
    cartCookie.push(productId.toString()) // Add the new product ID
    updateCartCookie(cartCookie) // Update the cookie with the new cart
    setMessage('Product added to cart!')
  }

  // Helper to get the cart cookie
  const getCartCookie = () => {
    const cookies = document.cookie.split('; ')
    const cartCookie = cookies.find(cookie => cookie.startsWith('cart='))
    return cartCookie ? cartCookie.split('=')[1] : ''
  }

  // Helper to update the cart cookie
  const updateCartCookie = (productIds) => {
    document.cookie = `cart=${productIds.join(',')}; path=/`
  }

  return (
    <div className="container mt-5">
      {message && <div className="alert alert-success text-center">{message}</div>}

      {product ? (
        <>
          <h2 className="text-center mb-4">{product.name}</h2>
          <img src={`${import.meta.env.VITE_APP_HOST}/${product.image_filename}`} alt={product.name} className="img-fluid mb-4" />
          <p>{product.description}</p>
          <p>Price: ${product.cost.toFixed(2)}</p>

          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-success" onClick={() => addToCart(product.product_id)}>
              Add to Cart
            </button>

            <button className="btn btn-secondary" onClick={() => window.history.back()}>
              Go Back
            </button>
          </div>
        </>
      ) : (
        <h4 className="text-center mt-5">{message}</h4>
      )}
    </div>
  )
}
