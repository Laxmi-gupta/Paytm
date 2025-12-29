import type React from "react";
import { Link } from "react-router-dom";

export const Navbar: React.FC = () => {
  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto h-18 px-6 flex items-center justify-between">
        <div className="flex items-center"><img src="/logo.png" className="w-30"/></div>
        <div className="flex gap-4 items-center">
          <Link  to='/login' className="rounded-full border px-6 py-2 hover:bg-blue-100 transition">Log in</Link>
          <Link  to='/signup' className="rounded-full border px-6 py-2 bg-blue-500 text-white hover:bg-blue-400  transition">Sign up</Link>
        </div>
      </div>
    </nav>
  )
}