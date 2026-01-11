import axios from "axios"
import { attachAuthInterceptor } from "./axiosConfig"

export const searchApi = axios.create({
    baseURL: "http://localhost:8082/search-services"
})

attachAuthInterceptor(searchApi)
