import type React from "react";
import {useForm} from "react-hook-form";
import type { loginSchema } from "../types/auth.types";
import { Link, useNavigate } from "react-router-dom";
import { logInUser } from "../services/authService";

export const Login: React.FC = () => {
  const {register,handleSubmit,formState: {errors}} = useForm<loginSchema>();

  const navigate = useNavigate();

  const onSubmit = async(data:loginSchema) => {
    try {
    const res = await logInUser(data);
    console.log(res.data);
    navigate('/dashboard');
    } catch(ex) {
      console.error("signup eror",ex);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div
        className="absolute w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/image.png')" }}
      >
        <div className="flex items-center justify-center relative z-100 pt-24">
          <form className="bg-white w-full max-w-[420px] rounded-2xl shadow-lg p-6 space-y-1" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-2xl font-semibold text-center">
               Log In
            </h2>
            <div className="mb-4">
              <div className="flex items-center gap-4">
                <img src="/src/assets/download.svg" />
                <div className="w-full">
                  <label className="text-sm text-gray-600">Email</label>                 
                  <input
                    type="email"
                    {...register("email",{required: "Email is required", pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },})}
                    className="w-full border-b text-sm border-gray-300 focus:border-blue-500 outline-none py-1"
                  />
                  {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>
              </div>
            </div>
            <div>
             
            <div className="mb-4">
              <div className="flex items-center gap-4">
                <img src="/src/assets/password.svg" />
                <div className="w-full">
                  <label className="text-sm text-gray-600">Password</label>                 
                  <input
                    type="password"
                    {...register("password",{required: "Password is required"})}
                    className="w-full border-b text-sm border-gray-300 focus:border-blue-500 outline-none py-1"
                  />
                  {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>
              </div>
            </div>
              
           <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-full mt-4 hover:bg-blue-600 transition"
            >
              LOG IN
            </button>

            <p className="text-center text-sm mt-2 text-gray-500">
              Don't have an account with PayX?{" "}
              <Link className="text-blue-500 cursor-pointer" to="/signup">
                Sign Up
              </Link>
            </p>
            
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}