// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api`, // Defina a URL base da sua API
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`
  }
});

export default axiosInstance;
