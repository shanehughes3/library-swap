/**
 * @namespace 
 */
export class Ajax {
    /**
     * Send a GET request
     * @param {string} endpoint - The request endpoint
     * @param {(string|Object)} [query] - The request query string or object
     * @param {requestCallback} cb - The callback that handles the response or error
     */
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

    /**
     * Send a POST request
     * @param {string} endpoint - The request endpoint
     * @param {Object} payload - The request body payload
     * @param {Object} [options] - The options for the particular request
     * @param {string} [options.contentType] - The "Content-Type" header for the request, minus the "application/" prefix. Can be either "json" or "x-www-form-urlencoded". Defaults to "json".
     * @param {requestCallback} cb - The callback that handles the response or error
     */
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

    /**
     * Send a DELETE request
     * @param {string} endpoint - The request endpoint
     * @param {requestCallback} cb - The callback that handles the response or error
     */
    static delete(endpoint, cb) {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", () =>
            this.parseResponse(xhr.responseText, cb));
        xhr.addEventListener("error", (err) => cb(err));
        xhr.addEventListener("abort", () => cb("abort"));
        xhr.open("DELETE", endpoint);
        xhr.send(null);
    }

    /**
     * Send a PUT request
     * @param {string} endpoint - The request endpoint
     * @param {Object} payload - The request body payload
     * @param {Object} [options] - The options for the particular request
     * @param {string} [options.contentType] - The "Content-Type" header for the request, minus the "application/" prefix. Can be either "json" or "x-www-form-urlencoded". Defaults to "json".
     * @param {requestCallback} cb - The callback that handles the response or error
     */
    static put(endpoint, payload, options, cb) {
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
        xhr.open("PUT", endpoint);
        xhr.setRequestHeader("Content-Type",
                             `application/${options.contentType}`);
        if (options.contentType === "x-www-form-urlencoded") {
            payload = this.formEncode(payload);
        } else if (options.contentType === "json") {
            payload = JSON.stringify(payload);
        }
        xhr.send(payload);
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

/**
 * Global callback type
 * @callback requestCallback
 * @param {object} err - Any error encountered (null on no error)
 * @param {object} res - The server's response (null on error)
 */
