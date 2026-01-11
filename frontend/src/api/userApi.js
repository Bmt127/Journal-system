import axios from "axios";
import { attachAuthInterceptor } from "./axiosConfig";
export const userApi = axios.create({
    baseURL: import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:8081"
});
attachAuthInterceptor(userApi);
