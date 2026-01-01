import axios from "axios";
import { attachToken } from "./attachToken.js";

export const userApi = axios.create({
    baseURL: import.meta.env.VITE_USER_API_URL
});

attachToken(userApi);
