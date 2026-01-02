import axios from "axios";
import { attachToken } from "./attachToken";
import { API_CONFIG } from "./apiConfig";

export const imageApi = axios.create({
    baseURL: API_CONFIG.IMAGE,
});

attachToken(imageApi);

export function uploadImage(formData) {
    return imageApi.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}
