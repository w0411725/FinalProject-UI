import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HOST}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        navigate('/login') // Redirect to Login page on success
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.error || 'Signup failed. Please try again.')
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again later.')
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Signup</h2>

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

        <button type="submit" className="btn btn-primary w-100">Signup</button>
      </form>
    </div>
  )
}
