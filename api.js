const api = require("google-books-search");

const options = {
    limit: 15,
    type: "books"
};

exports.search = function(query, offset, cb) {
    options.offset = offset;
    console.log("|_|_|_|_|_|_|", query, options);
    api.search(query, options, function(err, results, response) {
        //console.log("**********err", err);
        //console.log("**********results", results);
        //console.log("**********response", response);
        if (err) {
            cb(err);
        } else {
            cb(null, results);
        }
    });
};
