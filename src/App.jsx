import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Nav from './ui/Nav'

export default function App() {
  // Shared state to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <>
      {/* Pass isLoggedIn as a prop to Nav to control visibility of menu links */}
      <Nav isLoggedIn={isLoggedIn} />
      {/* Pass setIsLoggedIn to all child routes using Outlet context */}
      <Outlet context={setIsLoggedIn} />
    </>
  )
}