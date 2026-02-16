import bcrypt from "bcrypt";

export const generateOtp = () => {
  let otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}

export const hashOtp = (otp:string) => {
  let hashedOtp = bcrypt.hash(otp,10);

  return hashedOtp;
}