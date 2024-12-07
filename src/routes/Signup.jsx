import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Signup() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();
  
  const [apiError, setApiError] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HOST}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          first_name: data.first_name, // Matches the API's required fields
          last_name: data.last_name, // Matches the API's required fields
        }),
      });

      if (response.ok) {
        console.log('Signup successful!');
      } else {
        const errorData = await response.json();
        setApiError(errorData.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setApiError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Signup</h2>

      {apiError && (
        <div className="alert alert-danger text-center">{apiError}</div>
      )}

      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="mx-auto" 
        style={{ maxWidth: '400px' }}
      >
        {/* Email Field */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
        </div>

        {/* First Name Field */}
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">First Name</label>
          <input
            id="first_name"
            type="text"
            className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
            {...register('first_name', { required: 'First name is required' })}
          />
          {errors.first_name && (
            <div className="invalid-feedback">{errors.first_name.message}</div>
          )}
        </div>

        {/* Last Name Field */}
        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">Last Name</label>
          <input
            id="last_name"
            type="text"
            className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
            {...register('last_name', { required: 'Last name is required' })}
          />
          {errors.last_name && (
            <div className="invalid-feedback">{errors.last_name.message}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100">Signup</button>
      </form>
    </div>
  );
}
