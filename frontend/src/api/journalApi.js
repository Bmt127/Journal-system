import axios from "axios";
import { attachToken } from "./attachToken";
import { API_CONFIG } from "./apiConfig";

export const journalApi = axios.create({
    baseURL: API_CONFIG.JOURNAL,
});

attachToken(journalApi);
