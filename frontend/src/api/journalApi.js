import axios from "axios";
import { attachAuthInterceptor } from "./axiosConfig";
export const journalApi = axios.create({
    baseURL: import.meta.env.VITE_JOURNAL_SERVICE_URL || "http://localhost:8084"
});
attachAuthInterceptor(journalApi);
