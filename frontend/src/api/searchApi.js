import axios from "axios";
import { attachAuthInterceptor } from "./axiosConfig";
export const searchApi = axios.create({
    baseURL: import.meta.env.VITE_SEARCH_SERVICE_URL || "http://localhost:8086"
});
attachAuthInterceptor(searchApi);
