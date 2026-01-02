import axios from "axios";
import { attachToken } from "./attachToken";
import { API_CONFIG } from "./apiConfig";

export const searchApi = axios.create({
    baseURL: API_CONFIG.SEARCH,
});

attachToken(searchApi);
