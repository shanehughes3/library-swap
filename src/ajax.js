export class Ajax {
    static get(endpoint, query, cb) {
        if (typeof query == "function") {
            cb = query;
            query = "";
        }
        if (typeof query == "object") {
            query = "?" + this.formEncode(query);
        }
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", () => 
            this.parseResponse(xhr.responseText, cb));
        xhr.addEventListener("error", (e) => cb(e));
        xhr.addEventListener("abort", () => cb("abort"));
        xhr.open("GET", endpoint + query);
        xhr.send(null);
    }

    static post(endpoint, payload, options, cb) {
        if (typeof options == "function") {
            cb = options;
            options = {};
        }
        const defaults = {
            contentType: "json"
        };
        options = Object.assign({}, defaults, options);
        
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", () =>
            this.parseResponse(xhr.responseText, cb));
        xhr.addEventListener("error", (err) => cb(err));
        xhr.addEventListener("abort", () => cb("abort"));
        xhr.open("POST", endpoint);
        xhr.setRequestHeader("Content-Type",
                             `application/${options.contentType}`);
        if (options.contentType === "x-www-form-urlencoded") {
            payload = this.formEncode(payload);
        } else if (options.contentType === "json") {
            payload = JSON.stringify(payload);
        }
        xhr.send(payload);
    }

    static delete(endpoint, cb) {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", () =>
            this.parseResponse(xhr.responseText, cb));
        xhr.addEventListener("error", (err) => cb(err));
        xhr.addEventListener("abort", () => cb("abort"));
        xhr.open("DELETE", endpoint);
        xhr.send(null);
    }

    static parseResponse(res, cb) {
        let err, responseObj;
        try {
            responseObj = JSON.parse(res);
        } catch(e) {
            err = e;
        }
        cb(err, responseObj);
    }

    static formEncode(inObj) {
        let output = "";
        for (let key in inObj) {
            if (output) {
                output += "&";
            }
            output +=
                `${encodeURIComponent(key)}=${encodeURIComponent(inObj[key])}`;
        }
        return output;
    }
}

