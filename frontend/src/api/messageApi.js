import axios from "axios";
import {attachToken} from "./attachToken.js";

export const messageApi = axios.create({
    baseURL: "http://localhost:30083"
});
attachToken(messageApi);