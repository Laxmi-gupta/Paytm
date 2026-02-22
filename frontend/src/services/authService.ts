import type { loginSchema, signUpSchema } from "../types/auth.types";
import { api } from "../utils/axios";

export const saveUser = async(formData: signUpSchema) => {
  const res = await api.post(`/signup`, formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res;
}

export const logInUser = async(formData:loginSchema) => {
  const res = await api.post(`/login`,formData,{ withCredentials: true });
  return res.data;
}