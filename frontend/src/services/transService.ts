import axios from "axios";
import type { p2pSchema } from "../types/trans";

const URL = "http://localhost:3000";

export const saveP2pData = async(data: p2pSchema) => {
  try {
    const res = await axios.post(`${URL}/p2p`,data);
    return res.data;
  } catch (error) {
    console.log("p2p service",error);
  }
}