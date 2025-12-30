import type React from "react";
import { saveUser } from "../services/authService";
import type { signUpSchema } from "../types/auth.types";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export const  SignUp: React.FC = () => {
  const {register,handleSubmit,formState: {errors}} = useForm<signUpSchema>();

  const navigate = useNavigate();

  const onSubmit = async(formData:signUpSchema) => {
    try {
    const res = await saveUser(formData);
    console.log(res);
    navigate('/login');
    } catch(ex) {
      console.error("signup eror",ex);
    }
  }

  // console.log(formData); //React component = a function. This entire function runs AGAIN every time state changes.

   return (
     <div className="min-h-screen flex">
     {/* <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 items-center px-4"> */}
      {/* <div className="relative w-full h-screen"> */}
        {/* LEFT BACKGROUND */}
      <div
        className="absolute w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/image.png')" }}
      >
        <div className="flex items-center justify-center relative z-100 pt-24">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white w-full max-w-[420px] rounded-2xl shadow-lg p-6 space-y-1"
          >
            {/* <img src="/logo.png" className="w-32 mx-auto font-bold"/> */}
            <h2 className="text-2xl font-semibold text-center">
               Sign Up
            </h2>

            {/* Name */}
            <div className="mb-4">
              <div className="flex items-center gap-4">
                <img src="/src/assets/download.svg" />
                <div className="w-full">
                  <label className="text-sm text-gray-600">Name</label>                 
                  <input
                    type="text"
                    {...register("name",{required: "Name is required"})}
                    className="w-full border-b text-sm border-gray-300 focus:border-blue-500 outline-none py-1"
                  />
                  {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
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

            {/* Phone */}
            <div className="mb-4">
              <div className="flex items-center gap-4">
                <img src="/src/assets/download.svg" />
                <div className="w-full">
                  <label className="text-sm text-gray-600">Phone Number</label>                 
                  <input
                    type="text"
                    {...register("number",{required: "Number is required",pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Enter valid 10-digit mobile number",
                    },})}
                    className="w-full border-b text-sm border-gray-300 focus:border-blue-500 outline-none py-1"
                  />
                  {errors.number && <p className="text-red-500">{errors.number.message}</p>}
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-full mt-4 hover:bg-blue-600 transition"
            >
              SIGN UP
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link className="text-blue-500 cursor-pointer" to="/login">
                Login
              </Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}