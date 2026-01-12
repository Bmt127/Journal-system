import axios from "axios";
import { attachAuthInterceptor } from "./axiosConfig";
export const messageApi = axios.create({
    baseURL: "https://message-services.app.cloud.cbh.kth.se" // Kontrollera namnet i dashboarden
});
attachAuthInterceptor(messageApi);
