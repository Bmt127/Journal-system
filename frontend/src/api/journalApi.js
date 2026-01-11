import axios from "axios";
import { attachAuthInterceptor } from "./axiosConfig";

export const journalApi = axios.create({
    baseURL: "http://localhost:8084/"
});

attachAuthInterceptor(journalApi);