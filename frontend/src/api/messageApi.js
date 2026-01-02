import axios from "axios";
import { attachToken } from "./attachToken";
import { API_CONFIG } from "./apiConfig";

export const messageApi = axios.create({
    baseURL: API_CONFIG.MESSAGE,
});

attachToken(messageApi);
