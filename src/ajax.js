export class Ajax {
    static get(endpoint, query, cb) {
        if (typeof query == "function") {
            cb = query;
            query = "";
        }
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", () => cb(null, xhr.responseText));
        xhr.addEventListener("error", (e) => cb(e));
        xhr.addEventListener("abort", () => cb("abort"));
        xhr.open("GET", endpoint + query);
        xhr.send(null);
    }
}
