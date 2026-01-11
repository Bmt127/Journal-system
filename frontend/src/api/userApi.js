import axios from "axios";
import { attachAuthInterceptor } from "./axiosConfig";

export const userApi = axios.create({
    baseURL: "http://localhost:8081/"
});

attachAuthInterceptor(userApi);