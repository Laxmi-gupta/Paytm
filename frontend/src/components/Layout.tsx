import type React from "react";
import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";

export const Layout: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Outlet />  
      <Footer />
    </div>
  )
}