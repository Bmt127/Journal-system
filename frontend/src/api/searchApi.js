import axios from "axios";
import { attachAuthInterceptor } from "./axiosConfig";
export const searchApi = axios.create({
    baseURL: "https://search-services.app.cloud.cbh.kth.se"
});
attachAuthInterceptor(searchApi);
