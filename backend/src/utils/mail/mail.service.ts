import nodemailer from "nodemailer"
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const sendOtpEmail = async (to: string, otp: string) => {
  await transporter.sendMail({
    from: `"PayX Security" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your OTP for P2P Transfer",
    html: `
      <h2>Verify Your Transfer</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes.</p>
    `
  });
};