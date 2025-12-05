import type React from "react";
import { useState } from "react";
import { saveUser } from "../services/signupService";
import type { signUpSchema } from "../types/auth.types";

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
    console.log(res.data);
  }

  // console.log(formData); //React component = a function. This entire function runs AGAIN every time state changes.
  return (
    <>
      <form onSubmit={handleSubmit}> 
        <label htmlFor="fname">Name:</label>
        <input type="text" name="name" id="fname" onChange={handleChange}/>
        <label htmlFor="email">Email:</label>
        <input type="email" name="email" id="email" onChange={handleChange}/>
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" id="password" onChange={handleChange}/>
        <label htmlFor="number">Number:</label>
        <input type="text" name="number" id="number" onChange={handleChange}/>
        <button >Sign Up</button>
      </form>
    </>
  )
}