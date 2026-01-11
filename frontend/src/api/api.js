import { userApi } from "./userApi";
import { journalApi } from "./journalApi";
import { messageApi } from "./messageApi";
import { searchApi } from "./searchApi";
import { imageApi, uploadImage } from "./imageApi";

// Vi tar bort det inledande snedstrecket om det finns,
// eftersom baseURL slutar på /
const strip = url => url.startsWith("/") ? url.substring(1) : url;

const api = {
    get: (url) => {
        const path = strip(url);
        if (path.startsWith("users")) return userApi.get(path);
        if (path.startsWith("messages")) return messageApi.get(path);
        if (path.startsWith("patients") ||
            path.startsWith("conditions") ||
            path.startsWith("encounters") ||
            path.startsWith("observations")) return journalApi.get(path);
        if (path.startsWith("search")) return searchApi.get(path);
        if (path.startsWith("images")) return imageApi.get(path);
        return Promise.reject("Unknown GET endpoint: " + url);
    },

    post: (url, data) => {
        const path = strip(url);
        if (path.startsWith("users")) return userApi.post(path, data);
        if (path.startsWith("messages")) return messageApi.post(path, data);
        if (path.startsWith("patients") ||
            path.startsWith("conditions") ||
            path.startsWith("encounters") ||
            path.startsWith("observations")) return journalApi.post(path, data);
        if (path.startsWith("search")) return searchApi.post(path, data);
        if (path.startsWith("images")) {
            if (data instanceof FormData) return uploadImage(data);
            return imageApi.post(path, data);
        }
        return Promise.reject("Unknown POST endpoint: " + url);
    }
};

export default api;