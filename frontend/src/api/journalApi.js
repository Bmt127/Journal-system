import axios from "axios";
import { attachAuthInterceptor } from "./axiosConfig";

export const journalApi = axios.create({
    // Ändrad från localhost till molnets HTTPS-adress
    baseURL: "https://journal-services.app.cloud.cbh.kth.se"
});

attachAuthInterceptor(journalApi);