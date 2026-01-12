import axios from "axios";
import { attachAuthInterceptor } from "./axiosConfig";
export const searchApi = axios.create({
    // Denna MÅSTE ha ett s på slutet om dashboarden säger search-services
    baseURL: "https://search-services.app.cloud.cbh.kth.se"
});
attachAuthInterceptor(searchApi);
