import axios from "axios";

export const messageApi = axios.create({
    baseURL: "http://localhost:30083"
});
