import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Nav from './ui/Nav'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Shared state to track if the user is logged in

  // Check the session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_HOST}/users/getSession`, {
          method: 'GET',
          credentials: 'include', // 👈 Include credentials to access the session
        })
        
        if (response.ok) {
          const data = await response.json()
          setIsLoggedIn(true) // User is logged in
          console.log('Session active for:', data)
        } else {
          setIsLoggedIn(false) // User is not logged in
          console.log('No active session')
        }
      } catch (error) {
        console.error('Error checking session:', error)
      }
    }

    checkSession()
  }, [])

  return (
    <>
      <Nav isLoggedIn={isLoggedIn} />
      <Outlet context={setIsLoggedIn} />
    </>
  )
}
