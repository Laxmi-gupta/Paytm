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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [{
      path: '/',element: <Home/>  
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
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}  />
  </StrictMode>,
)
