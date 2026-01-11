import type React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../utils/axios";

export const Navbar: React.FC = () => {
  const [userName,setUserName] = useState<string | null>(null);
  const isAuthenticated = userName!==null;
  const location = useLocation();

  const pathname =  location.pathname;

  const publicRoutes = ["/","/login","/signup"];
  const isPublicRoutes = publicRoutes.includes(pathname);
  
  const fetchName =async () => {
    try {
      const res = await api.get('/getName');
      setUserName(res.data.data);
    } catch(err) {
      console.error("fetchName erorr",err);
    }
  }

  useEffect(() => {
    if(!isPublicRoutes) {;
      fetchName();
    }
  },[location.pathname])

  return (
    <nav className="w-full border border-gray-300/40 bg-white">
       
      <div className="max-w-6xl mx-auto h-18 px-6 flex items-center justify-between">
        <Link to={isAuthenticated ? '/dashboard' : '/'}>
          <div className="flex items-center">
            <h2 className="text-3xl font-bold text-blue-900">Pay</h2>
            <h2 className="text-3xl font-bold text-blue-400">X</h2>
          </div>
        </Link>

        {!isAuthenticated &&
          <div className="flex gap-4 items-center">
            <Link  to='/login' className="rounded-full border px-6 py-2 hover:bg-blue-100 transition">Log in</Link>
            <Link  to='/signup' className="rounded-full border px-6 py-2 bg-blue-500 text-white hover:bg-blue-400  transition">Sign up</Link>
          </div>
        }
     
        {isAuthenticated &&
          <div className="flex gap-4 items-center">
            {userName}
            <Link  to='/logout' className="rounded-full border px-6 py-2 hover:bg-blue-100 transition">Log out</Link>
          </div>
        }
         
      </div>
    </nav>
  )
}