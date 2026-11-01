import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true, // iske bina cookie nahi jaati aur har request 401 deti hai
});

export default client;