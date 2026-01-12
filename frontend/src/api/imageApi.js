import axios from "axios";
import { attachAuthInterceptor } from "./axiosConfig";
export const imageApi = axios.create({
    baseURL: "https://image-servicee.app.cloud.cbh.kth.se"
});
export const uploadImage = (formData) => imageApi.post("/images/upload", formData);
attachAuthInterceptor(imageApi);
