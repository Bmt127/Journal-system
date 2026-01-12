import axios from "axios";
import { attachAuthInterceptor } from "./axiosConfig";

export const userApi = axios.create({
    // Ändra denna till din faktiska USER-service URL
    baseURL: "https://user-services.app.cloud.cbh.kth.se"
});

attachAuthInterceptor(userApi);