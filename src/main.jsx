import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import Home from './routes/Home.jsx'
import Details from './routes/Details'
import Signup from './routes/Signup'
import Login from './routes/Login'
import Logout from './routes/Logout'
import Cart from './routes/Cart'
import Checkout from './routes/Checkout'
import Confirmation from './routes/Confirmation'
import 'bootstrap/dist/css/bootstrap.min.css'



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "home", element: <Home /> },
      { path: "details/:id", element: <Details /> },
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      { path: "logout", element: <Logout /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "confirmation", element: <Confirmation /> },
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
