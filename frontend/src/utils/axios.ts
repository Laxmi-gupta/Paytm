import axios from "axios"

export const api = axios.create({          // Creates a custom axios instance
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

// response interceptors => works after the req is send

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    // console.log(error);
    const originalReq = error.config;
    if(error.response?.status==401 && !originalReq._retry && originalReq.url !== "/refresh-token") {
      try {
        originalReq._retry = true;          // Prevents infinite retry loops
        await api.post('/refresh-token');
        console.log("Access token refreshed");
        return api(originalReq);  // Original /transactions request already failed → it never got a response. Interceptor cannot magically fill the response; it has to send the request again. So we resend it with the new access token as api.post(/transax)
      } catch(ex) {
        console.error("axios interceptor failed",ex);
        window.location.href = '/login';
        return Promise.reject(ex);
      }
    }
    return Promise.reject(error);
  }
)


// Axios interceptors must return either a resolved value or a rejected promise.