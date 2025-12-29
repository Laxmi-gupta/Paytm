import type React from "react";
import { Link } from "react-router-dom";

export const Navbar: React.FC = () => {
  return (
    <nav className="w-full border border-gray-300/40 bg-white">
      <div className="max-w-6xl mx-auto h-18 px-6 flex items-center justify-between">
        <Link to={'/'}><div className="flex items-center"><h2 className="text-3xl font-bold text-blue-900">Pay</h2><h2 className="text-3xl font-bold text-blue-400">X</h2></div></Link>
        <div className="flex gap-4 items-center">
          <Link  to='/login' className="rounded-full border px-6 py-2 hover:bg-blue-100 transition">Log in</Link>
          <Link  to='/signup' className="rounded-full border px-6 py-2 bg-blue-500 text-white hover:bg-blue-400  transition">Sign up</Link>
        </div>
      </div>
    </nav>
  )
}