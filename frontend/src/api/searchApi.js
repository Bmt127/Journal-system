import axios from "axios";
import {attachToken} from "./attachToken.js";

export const searchApi = axios.create({
    baseURL: "http://localhost:30084"
});
attachToken(searchApi);