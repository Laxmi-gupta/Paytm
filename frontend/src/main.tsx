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

// add protected routes to prevent url navigation

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [{
      path: '/',element: <Home/>  
    },{
      path: '/dashboard' ,element: <Dashboard /> 
    },{
      path:'/transaction',element: <Transactions />         
    },{
      path: '/p2p', element: <P2P/>
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
    element: <Success/>
  },
  {
    path: '/payment-failed',
    element: <Failed/>
  },
  {
    path: '/success-p2p',
    element: <SuccessTxn/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position='top-right' toastOptions={{duration:3000}}/>
    <RouterProvider router={router}  />
  </StrictMode>,
)
