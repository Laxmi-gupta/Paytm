import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM;

if (!EMAIL_FROM) {
  throw new Error("EMAIL_FROM environment variable is not defined");
}

export const sendOtpEmail = async (to: string, otp: string) => {
   await resend.emails.send({
      from: EMAIL_FROM, // must be verified domain
      to: to,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Your OTP Code</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 5px;">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
          <p>If you did not request this, please ignore.</p>
        </div>
      `,
    });
};