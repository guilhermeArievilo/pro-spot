// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/`, // Defina a URL base da sua API
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
});

export default axiosInstance;
