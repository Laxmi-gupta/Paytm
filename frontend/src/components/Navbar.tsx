import type React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../utils/axios";
import { LogOut, User, Wallet } from "lucide-react";

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

  const handleLogout = async() => {
    try {
      await api.post("/logout");
      setUserName(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error", err);
    } 
  }

  return (
    <nav className="w-full border border-gray-300/40 bg-white">
       
      <div className="max-w-6xl mx-auto h-18 px-6 flex items-center justify-between">
        <Link to={isAuthenticated ? '/dashboard' : '/'}>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-3 rounded-xl shadow-md">
              <Wallet size={16} className="text-white" />
            </div>
            <div className="flex items-baseline">
              <h2 className="text-2xl font-bold text-black">PayX</h2>
            </div>
          </div>
        </Link>

        {!isAuthenticated &&
          <div className="flex gap-4 items-center">
            <Link  to='/login' className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">Log in</Link>
            <Link  to='/signup' className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">Sign up</Link>
          </div>
        }
     
        {isAuthenticated &&
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-2xl">
              <User size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-800">
                {userName}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition text-sm font-medium"
            ><LogOut size={16} />Log out</button>
          </div>
        }
         
      </div>
    </nav>
  )
}