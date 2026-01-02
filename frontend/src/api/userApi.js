import axios from "axios";
import { attachToken } from "./attachToken";
import { API_CONFIG } from "./apiConfig";

export const userApi = axios.create({
    baseURL: API_CONFIG.USER,
});

attachToken(userApi);
