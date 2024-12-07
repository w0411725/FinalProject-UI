import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    province: '',
    country: '',
    postal_code: '',
    credit_card: '',
    credit_expire: '',
    credit_cvv: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [customerId, setCustomerId] = useState(null); // Store customer_id from session
  const [cartProducts, setCartProducts] = useState([]); // Store products in the cart
  const [productQuantities, setProductQuantities] = useState({}); // Store quantities for each product

  useEffect(() => {
    checkSession(); // Check user session on load
    loadCart(); // Load cart data on load
  }, []);

  // Check the user session and retrieve customer_id
  const checkSession = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HOST}/users/getSession`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setCustomerId(data.user_id); // Set the customer_id from session
      } else {
        navigate('/login'); // Redirect to login if session is invalid
      }
    } catch (error) {
      console.error('Error checking session:', error);
      navigate('/login');
    }
  };

  // Load cart products and quantities
  const loadCart = async () => {
    const cartCookie = getCartCookie();
    if (!cartCookie) return;

    const productIds = cartCookie.split(',').filter(Boolean); // Remove empty strings
    const quantities = productIds.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
    setProductQuantities(quantities);

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HOST}/products/all`, {
        credentials: 'include',
      });

      if (response.ok) {
        const allProducts = await response.json();
        const matchedProducts = allProducts.filter((product) =>
          productIds.includes(product.product_id.toString())
        );
        setCartProducts(matchedProducts);
      } else {
        setErrorMessage('Failed to load cart products.');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred while loading the cart.');
    }
  };

  // Get the cart cookie
  const getCartCookie = () => {
    const cookies = document.cookie.split('; ');
    const cartCookie = cookies.find((cookie) => cookie.startsWith('cart='));
    return cartCookie ? cartCookie.split('=')[1] : '';
  };

  // Clear the cart cookie after purchase
  const clearCartCookie = () => {
    document.cookie = 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Calculate the subtotal of the cart
  const calculateSubtotal = () => {
    return cartProducts.reduce((total, product) => {
      const quantity = productQuantities[product.product_id] || 0;
      return total + product.cost * quantity;
    }, 0);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cart = getCartCookie();
    if (!cart) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.15; // Example tax rate of 15%
    const total = subtotal + tax;

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HOST}/products/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          cart,
          invoice_amt: subtotal,
          invoice_tax: tax,
          invoice_total: total,
        }),
      });

      if (response.ok) {
        clearCartCookie();
        navigate('/confirmation');
      } else if (response.status === 401) {
        setErrorMessage('Session expired. Please log in again.');
        navigate('/login');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to complete the purchase.');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };

  if (!customerId) {
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
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Checkout</h2>

      {errorMessage && (
        <div className="alert alert-danger text-center">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '400px' }}>
        <h4>Mailing Address</h4>
        {['street', 'city', 'province', 'country', 'postal_code'].map((field) => (
          <div className="mb-3" key={field}>
            <label htmlFor={field} className="form-label">{field.replace('_', ' ').toUpperCase()}</label>
            <input
              id={field}
              name={field}
              type="text"
              className="form-control"
              placeholder={`Enter your ${field.replace('_', ' ')}`}
              value={formData[field]}
              onChange={handleChange}
            />
          </div>
        ))}

        <h4>Payment Information</h4>
        {[
          { name: 'credit_card', label: 'Credit Card Number', placeholder: '1234 5678 9012 3456' },
          { name: 'credit_expire', label: 'Expiration Date (MM/YY)', placeholder: 'MM/YY' },
          { name: 'credit_cvv', label: 'CVV', placeholder: '123' },
        ].map((field) => (
          <div className="mb-3" key={field.name}>
            <label htmlFor={field.name} className="form-label">{field.label}</label>
            <input
              id={field.name}
              name={field.name}
              type="text"
              className="form-control"
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="mb-3">
          <p><strong>Subtotal:</strong> ${calculateSubtotal().toFixed(2)}</p>
          <p><strong>Tax:</strong> ${(calculateSubtotal() * 0.15).toFixed(2)}</p>
          <p><strong>Total:</strong> ${(calculateSubtotal() * 1.15).toFixed(2)}</p>
        </div>

        <button type="submit" className="btn btn-success w-100">
          Complete Purchase
        </button>
      </form>
    </div>
  );
}
