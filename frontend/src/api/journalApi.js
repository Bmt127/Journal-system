import axios from "axios";
import { attachToken } from "./attachToken.js";

export const journalApi = axios.create({
    baseURL: import.meta.env.VITE_JOURNAL_API_URL
});

attachToken(journalApi);
