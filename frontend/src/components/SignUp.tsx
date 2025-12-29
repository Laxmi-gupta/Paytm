import type React from "react";
import { useState } from "react";
import { saveUser } from "../services/signupService";
import type { signUpSchema } from "../types/auth.types";
import { Link } from "react-router-dom";

export const  SignUp: React.FC = () => {
  const [formData,setFormData] = useState<signUpSchema>({
    name: "",
    email: "",
    password: "",
    number: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //console.log(e.target.name,e.target.value);

    setFormData((prev) => ({       // without states react dont re render anything
      ...prev,           // keeps old values alive.
      [e.target.name]: e.target.value    // all value are stored like obj formateg: formData["email"] = "l"
    }))
  }

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await saveUser(formData);
    console.log(res.message);
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
      
        {/* RIGHT SECTION (FORM CARD) */}
        <div className="flex items-center justify-center relative z-100 pt-24">
          <form
            onSubmit={handleSubmit}
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
                    name="name"
                    onChange={handleChange}
                    className="w-full border-b text-sm border-gray-300 focus:border-blue-500 outline-none py-1"
                  />
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
                    name="email"
                    onChange={handleChange}
                    className="w-full border-b text-sm border-gray-300 focus:border-blue-500 outline-none py-1"
                  />
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
                    name="password"
                    onChange={handleChange}
                    className="w-full border-b text-sm border-gray-300 focus:border-blue-500 outline-none py-1"
                  />
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
                    name="number"
                    onChange={handleChange}
                    className="w-full border-b text-sm border-gray-300 focus:border-blue-500 outline-none py-1"
                  />
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