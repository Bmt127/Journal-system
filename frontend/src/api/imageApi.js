import axios from "axios";
import { attachAuthInterceptor } from "./axiosConfig";

export const imageApi = axios.create({
    baseURL: "/image-api"
});

attachAuthInterceptor(imageApi);

export function uploadImage(formData) {
    return imageApi.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}
