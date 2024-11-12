// src/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL, // Set base URL from environment variable
});

export default axiosInstance;
