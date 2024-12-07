import { useForm } from 'react-hook-form'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useState } from 'react'

export default function Login() {
  const setIsLoggedIn = useOutletContext() // Access setIsLoggedIn via Outlet context
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HOST}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include', // Include cookies for session handling
      })

      if (response.ok) {
        setIsLoggedIn(true) // Set isLoggedIn to true
        navigate('/home') // Redirect to Home page on success
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.error || 'Login failed. Please try again.')
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again later.')
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Login</h2>

      {errorMessage && (
        <div className="alert alert-danger text-center">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto" style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>

        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  )
}
