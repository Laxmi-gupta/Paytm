import { api } from "../utils/axios";

export const saveP2pData = async(data: any) => {
  const res = await api.post(`/p2p`,data);
  return res.data;
}

export const verifyOtpService = async(data:any) => {
  const res = await api.post(`/p2p/verify-otp`,data);
  return res.data;
}
