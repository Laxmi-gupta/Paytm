import axios from "axios";
import type { loginSchema, signUpSchema } from "../types/auth.types";

const URL = import.meta.env.VITE_API_URL;

export const saveUser = async(formData: signUpSchema) => {
  try {
    const res = await axios.post(`${URL}/signup`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (error) {
    console.log("signup service",error);
  }
}

export const logInUser = async(formData:loginSchema) => {
  try {
    const res = await axios.post(`${URL}/login`,formData,{ withCredentials: true });
    return res.data;
  } catch (error) {
    console.log("login service",error);
  }
}