import axios from "axios";
import type { loginSchema, signUpSchema } from "../types/auth.types";

const URL = import.meta.env.VITE_API_URL;
console.log(URL)

export const saveUser = async(formData: signUpSchema) => {
  const res = await axios.post(`${URL}/signup`, formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res;
}

export const logInUser = async(formData:loginSchema) => {
  const res = await axios.post(`${URL}/login`,formData,{ withCredentials: true });
  return res.data;
}