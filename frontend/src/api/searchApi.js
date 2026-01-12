import axios from "axios";
import { attachAuthInterceptor } from "./axiosConfig";
export const searchApi = axios.create({
    // Om namnet i dashboarden är search-service, ta bort S:et:
    baseURL: "https://search-service.app.cloud.cbh.kth.se"
});
attachAuthInterceptor(searchApi);
