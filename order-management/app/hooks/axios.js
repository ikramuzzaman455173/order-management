"use client"
import Axios from 'axios';

const axios = Axios.create({
  // baseURL: "http://localhost:4000/api/",
  baseURL: "https://order-management-backend-ten.vercel.app/api/",
  withCredentials: true
});

export default axios;