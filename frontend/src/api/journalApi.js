import axios from "axios";

export const journalApi = axios.create({
    baseURL: "http://localhost:30082"
});
