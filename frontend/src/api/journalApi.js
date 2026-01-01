import axios from "axios";
import {attachToken} from "./attachToken.js";

export const journalApi = axios.create({
    baseURL: "http://localhost:30082"
});
attachToken(journalApi);