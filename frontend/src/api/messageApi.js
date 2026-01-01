import axios from "axios";
import { attachToken } from "./attachToken.js";

export const messageApi = axios.create({
    baseURL: import.meta.env.VITE_MESSAGE_API_URL
});

attachToken(messageApi);
