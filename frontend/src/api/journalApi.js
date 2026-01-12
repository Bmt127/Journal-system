import axios from "axios";
import { attachAuthInterceptor } from "./axiosConfig";

export const journalApi = axios.create({
    // Lägg till det extra 's'et så det matchar journal-servicess
    baseURL: "https://journal-servicess.app.cloud.cbh.kth.se"
});

attachAuthInterceptor(journalApi);