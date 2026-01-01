import axios from "axios";
import {attachToken} from "./attachToken.js";

const imageApi = axios.create({
    baseURL: "http://localhost:30085"
});

// Upload handler (correct endpoint)
export function uploadImage(formData) {
    return imageApi.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}
attachToken(imageApi);
export { imageApi };
