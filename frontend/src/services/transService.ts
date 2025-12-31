import axios from "axios";
import { api } from "../utils/axios";

const URL = import.meta.env.VITE_API_URL;

export const saveP2pData = async(data: any) => {
  try {
    const res = await api.post(`${URL}/p2p`,data);
    return res.data;
  } catch (error) {
    console.log("p2p service",error);
  }
}