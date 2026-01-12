import axios from "axios";
import { attachAuthInterceptor } from "./axiosConfig";
export const userApi = axios.create({
    baseURL: "https://search-services.app.cloud.cbh.kth.se"
});
attachAuthInterceptor(userApi);
