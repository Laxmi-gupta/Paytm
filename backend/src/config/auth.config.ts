export const authConfig = {
  secret:process.env.JWT_SECRET_KEY as string,
  secret_expires:process.env.JWT_EXPIRES as string,
  refresh_secret:process.env.JWT_REFRESH_KEY as string,
  refresh_expires:process.env.JWT_REFRESH_EXPIRES as string
}

