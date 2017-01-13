const api = require("google-books-search");

const options = {
    limit: 15,
    type: "books"
};

exports.search = function(query, offset, cb) {
    options.offest = offset;
    api.search(query, options, function(err, results, response) {
        console.log("Error: ", err, "Results: ", results);
        if (!err) {
            cb(null, results, response);
        } else {
            cb(err);
        }
    });
};
