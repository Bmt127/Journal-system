import axios from "axios";
import { attachToken } from "./attachToken.js";

const imageApi = axios.create({
    baseURL: import.meta.env.VITE_IMAGE_API_URL
});

attachToken(imageApi);

// Upload handler
export function uploadImage(formData) {
    return imageApi.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

export { imageApi };
