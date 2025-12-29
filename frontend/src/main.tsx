import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import './index.css'
import { SignUp } from './components/SignUp'
import { Login } from './components/Login'
import { Layout } from './components/Layout'
import { Home } from './Home'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [{
      path: '/',element: <Home/>  
    }]
  },   
  {
    path: '/signup',
    element: <SignUp />
  }, 
  {
    path: '/login',
    element: <Login />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}  />
  </StrictMode>,
)
