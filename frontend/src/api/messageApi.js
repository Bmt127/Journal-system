import axios from "axios";
import { attachAuthInterceptor } from "./axiosConfig";

export const messageApi = axios.create({
    baseURL: "http://localhost:8083/"
});

attachAuthInterceptor(messageApi);