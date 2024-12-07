import { useState, useEffect } from "react";

export default function Cart() {
  const [cartProducts, setCartProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [productQuantities, setProductQuantities] = useState({});

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const cartCookie = getCartCookie();
    if (!cartCookie) return;

    const productIds = cartCookie.split(",").filter(Boolean); // Remove empty strings
    if (productIds.length === 0) return;

    // Count product quantities
    const quantities = productIds.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
    setProductQuantities(quantities);

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HOST}/products/all`, {credentials: 'include'});
      if (response.ok) {
        const allProducts = await response.json();
        const matchedProducts = allProducts.filter((product) =>
          productIds.includes(product.product_id.toString())
        );
        setCartProducts(matchedProducts);
      } else {
        setErrorMessage("Failed to load cart products.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  const getCartCookie = () => {
    const cookies = document.cookie.split("; ");
    const cartCookie = cookies.find((cookie) => cookie.startsWith("cart="));
    return cartCookie ? cartCookie.split("=")[1] : "";
  };

  const updateCartCookie = (productIds) => {
    document.cookie = `cart=${productIds.join(",")}; path=/`;
  };

  const removeProduct = (productId) => {
    const updatedProducts = cartProducts.filter((product) => product.product_id !== productId);
    setCartProducts(updatedProducts);

    const cartCookie = getCartCookie().split(",").filter(Boolean);
    const updatedCart = cartCookie.filter((id) => parseInt(id) !== productId);
    updateCartCookie(updatedCart);

    const updatedQuantities = { ...productQuantities };
    delete updatedQuantities[productId];
    setProductQuantities(updatedQuantities);
  };

  const calculateSubtotal = () => {
    return cartProducts.reduce((total, product) => {
      const quantity = productQuantities[product.product_id] || 0;
      return total + product.cost * quantity;
    }, 0);
  };

  const calculateTax = (subtotal) => {
    const TAX_RATE = 0.15; // Example tax rate 15%
    return subtotal * TAX_RATE;
  };

  const calculateTotal = (subtotal, tax) => {
    return subtotal + tax;
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, tax);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Shopping Cart</h2>

      {errorMessage && (
        <div className="alert alert-danger text-center">{errorMessage}</div>
      )}

      {cartProducts.length > 0 ? (
        <>
          {cartProducts.map((product) => (
            <div
              key={product.product_id}
              className="d-flex justify-content-between align-items-center border-bottom py-3"
            >
              <div className="d-flex align-items-center">
                <img
                  src={`${import.meta.env.VITE_APP_HOST}/${product.image_filename}`}
                  alt={product.name}
                  width="50"
                  height="50"
                />
                <div className="ms-3">
                  <h5>
                    {product.name} x {productQuantities[product.product_id]}
                  </h5>
                  <p>Price: ${product.cost.toFixed(2)}</p>
                </div>
              </div>

              <button
                className="btn btn-danger"
                onClick={() => removeProduct(product.product_id)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-4">
            <h4>Summary</h4>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Tax (15%): ${tax.toFixed(2)}</p>
            <h5>Total: ${total.toFixed(2)}</h5>
          </div>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => (window.location.href = "/home")}
            >
              Continue Shopping
            </button>
            <button
              className="btn btn-primary"
              onClick={() => (window.location.href = "/checkout")}
            >
              Checkout
            </button>
          </div>
        </>
      ) : (
        <h4 className="text-center mt-5">Your cart is empty</h4>
      )}
    </div>
  );
}
