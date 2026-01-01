import axios from "axios";
import { attachToken } from "./attachToken.js";

export const searchApi = axios.create({
    baseURL: import.meta.env.VITE_SEARCH_API_URL
});

attachToken(searchApi);
