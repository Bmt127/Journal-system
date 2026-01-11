import axios from "axios";
import { attachAuthInterceptor } from "./axiosConfig";
export const messageApi = axios.create({
    baseURL: import.meta.env.VITE_MESSAGE_SERVICE_URL || "http://localhost:8086"
});
attachAuthInterceptor(messageApi);
