// src/api/api.js
import { userApi } from "./userApi";
import { journalApi } from "./journalApi";
import { messageApi } from "./messageApi";
import { searchApi } from "./searchApi";
import { imageApi, uploadImage } from "./imageApi";

function strip(url) {


    // removes the leading slash so axios doesn't double it
    return url.startsWith("/") ? url.substring(1) : url;
}

const api = {

    // ---------------- GET ----------------
    get: (url) => {
        if (url.startsWith("/users"))
            return userApi.get(strip(url));

        if (url.startsWith("/messages"))
            return messageApi.get(strip(url));

        if (url.startsWith("/patients") || url.startsWith("/conditions") || url.startsWith("/encounters"))
            return journalApi.get(strip(url));

        if (url.startsWith("/search"))
            return searchApi.get(strip(url));

        if (url.startsWith("/images"))
            return imageApi.get(strip(url));

        return Promise.reject("Unknown GET endpoint: " + url);
    },

    // ---------------- POST ----------------
    post: (url, data) => {

        if (url.startsWith("/users"))
            return userApi.post(strip(url), data);

        if (url.startsWith("/messages"))
            return messageApi.post(strip(url), data);

        if (url.startsWith("/patients") ||
            url.startsWith("/conditions") ||
            url.startsWith("/encounters"))
            return journalApi.post(strip(url), data);

        if (url.startsWith("/search"))
            return searchApi.post(strip(url), data);

        // IMAGE SPECIAL CASE (file upload)
        if (url.startsWith("/images")) {
            if (data instanceof FormData)
                return uploadImage(data); // correct upload handler
            return imageApi.post(strip(url), data);
        }

        return Promise.reject("Unknown POST endpoint: " + url);
    }
};

export default api;
