import axios from "axios";
import { attachAuthInterceptor } from "./axiosConfig";
export const imageApi = axios.create({
    baseURL: import.meta.env.VITE_IMAGE_SERVICE_URL || "http://localhost:8087"
});
export const uploadImage = (formData) => imageApi.post("/images/upload", formData);
attachAuthInterceptor(imageApi);
