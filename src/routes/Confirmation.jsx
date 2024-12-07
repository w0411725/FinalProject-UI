import { useNavigate } from 'react-router-dom'

export default function Confirmation() {
  const navigate = useNavigate()

  return (
    <div className="container mt-5 text-center">
      <h2>Thank You for Your Purchase!</h2>
      <p>Your order has been successfully placed.</p>
      <button
        className="btn btn-primary mt-4"
        onClick={() => navigate('/home')}
      >
        Continue Shopping
      </button>
    </div>
  )
}
