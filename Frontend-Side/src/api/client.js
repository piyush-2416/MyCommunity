import axios from "axios";

// Local (npm run dev): seedha backend | Netlify: relative /api (netlify _redirects Render ko bhejta hai)
const client = axios.create({
  baseURL: import.meta.env.DEV ? "http://localhost:3000/api" : "/api",
  withCredentials: true, // LOGIN COOKIE har request ke saath jaye (iske bina 401 aata hai)
});

// Server kabhi { error } bhejta hai, kabhi { message }. Dono ko ek jaisa bana do,
// taaki pages mein "Create fail!" ki jagah asli wajah dikhe.
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err.response?.data;
    if (data && typeof data === "object") {
      if (!data.error && data.message) data.error = data.message;
      if (err.response.status === 401) {
        data.error = "Pehle login karo, phir dobara try karo";
      }
    }
    return Promise.reject(err);
  }
);

export default client;