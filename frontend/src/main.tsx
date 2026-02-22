import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import './index.css'
import { SignUp } from './components/SignUp'
import { Login } from './components/Login'
import { Layout } from './components/Layout'
import { Home } from './Home'
import { Transactions } from './Transactions'
import { P2P } from './P2P'
import {Toaster} from "react-hot-toast"
import { Dashboard } from './Dashboard'
import { SuccessTxn } from './SuccessTxn'
import { Success } from './Success'
import { Failed } from './Failed'
import { ProtectedRoute } from './ProtectedRoute'

// add protected routes to prevent url navigation

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [{
      path: '/',element: <Home/>  
    },{
      path: '/dashboard' ,element: <ProtectedRoute> <Dashboard /> </ProtectedRoute>
    },{
      path:'/transaction',element: <ProtectedRoute> <Transactions />  </ProtectedRoute>     
    },{
      path: '/p2p', element: <ProtectedRoute> <P2P/> </ProtectedRoute>
    }]
  },   
  {
    path: '/signup',
    element: <SignUp />
  }, 
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/success-payment',
    element: <ProtectedRoute> <Success/> </ProtectedRoute>
  },
  {
    path: '/payment-failed',
    element: <ProtectedRoute> <Failed/> </ProtectedRoute>
  },
  {
    path: '/success-p2p',
    element: <ProtectedRoute> <SuccessTxn/> </ProtectedRoute>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position='top-right' toastOptions={{duration:3000}}/>
    <RouterProvider router={router}  />
  </StrictMode>,
)
