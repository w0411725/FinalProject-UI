import { useNavigate, useOutletContext } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Logout() {
  const setIsLoggedIn = useOutletContext() // Access setIsLoggedIn via Outlet context
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_HOST}/users/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for session handling
        })

        if (response.ok) {
          setIsLoggedIn(false) // Set isLoggedIn to false
        } else {
          const errorData = await response.json()
          setErrorMessage(errorData.error || 'Error during logout.')
        }
      } catch (error) {
        setErrorMessage('An unexpected error occurred. Please try again later.')
      }
    }

    logoutUser()
  }, [])

  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-4">You have been logged out successfully</h2>

      {errorMessage && (
        <div className="alert alert-danger text-center">{errorMessage}</div>
      )}

      <div className="d-flex justify-content-center gap-3">
        <button className="btn btn-primary" onClick={() => navigate('/login')}>Go to Login</button>
        <button className="btn btn-secondary" onClick={() => navigate('/home')}>Go to Home</button>
      </div>
    </div>
  )
}
