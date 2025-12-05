import axios from "axios";
import type { signUpSchema } from "../types/auth.types";

const URL = "http://localhost:3000";

export const saveUser = async(formData: signUpSchema) => {
  try {
    const res = await axios.post(`${URL}/signup`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}