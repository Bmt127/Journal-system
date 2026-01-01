import axios from "axios";
import {attachToken} from "./attachToken.js";

export const userApi = axios.create({
    baseURL: "http://localhost:30081"
});
attachToken(userApi);