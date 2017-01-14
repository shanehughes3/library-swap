const api = require("google-books-search");

const options = {
    limit: 15,
    type: "books"
};

exports.search = function(query, offset, cb) {
    options.offset = offset;
    api.search(query, options, function(err, results, response) {
        if (err) {
            cb(err);
        } else {
            cb(null, results);
        }
    });
};
