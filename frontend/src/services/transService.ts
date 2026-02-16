import axios from "axios";
import { api } from "../utils/axios";

const URL = import.meta.env.VITE_API_URL;

export const saveP2pData = async(data: any) => {
 // try {
    const res = await api.post(`${URL}/p2p`,data);
    console.log(res)
    return res.data;
  // } catch (error:unknown) {
  //   if(axios.isAxiosError(error)){
  //     console.log("p2p service",error);
  //     throw new Error(error.response?.data.message || "Something went wrong");
  //   }
  // }
}

export const verifyOtpService = async(data:any) => {
  try {
    const res = await api.post(`${URL}/p2p/verify-otp`,data);
    return res.data;
  } catch(err) {
    console.log("Otp verification failed",err);
  }
}

// export const executeTransfer = async(intentId:number)  => {
//   try {
//    const res = await api.post(`${URL}/p2p/execute-p2p`,{intentId});
//     return res.data;
//   } catch(err) {
//     console.log("P2p execution failed",err);
//   }
// }