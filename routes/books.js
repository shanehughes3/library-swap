const router = require("express").Router(),
      db = require("../db/db"),
      googleApi = require("../api");


router.get("/books", function(req, res) {
    if (req.user) {
        res.render("books", {user: req.user.username});
    } else {
        res.redirect("/");
    }
});

router.get("/booksApi/latest", function(req, res) {
    // allow unauthenticated requests but remove user's own books on
    // authenticated requests
    const userId = (req.user) ? req.user.id : null;
    db.getLatestBooks(req.query.o || 0, userId, function(err, books) {
        if (err) {
            res.json({error: err});
        } else {
            res.json({books: books});
        }
    });
});

router.get("/booksApi/search", function(req, res) {
    if (req.query.q) {
        db.searchBooks(
            req.user.id, req.query.q, req.query.o || 0,
            function(err, books) {
                if (err) {
                    res.json({error: err});
                } else {
                    res.json({books: books});
                }
            });
    } else {
        res.json({error: "Invalid Request"});
    }
});

router.get("/booksApi/user", function(req, res) {
    if (req.user) { 
        db.getUserBooks(req.user.id, function(err, books) {
            if (err) {
                res.json({error: err});
            } else {
                res.json({books: books});
            }
        });
    } else {
        res.json({error: "Unauthorized"});
    }
});

router.get("/booksApi/lookup", function(req, res) {
    if (req.query.q) {
        googleApi.search(req.query.q, req.query.o || 0, function(err, books) {
            if (err) {
                res.json({error: err});
            } else {
                res.json({books: books});
            }
        });
    } else {
        res.json({error: "Invalid Request"});
    }
});

router.post("/booksApi", function(req, res) {
    if (req.body.id && req.user) {
        googleApi.search(req.body.id, 0, function(err, books) {
            if (err) {
                res.json({error: err});
            } else {
                db.saveBook(req.user.id, books[0], function(err) {
                    if (err) {
                        res.json({error: err});
                    } else {
                        res.json({success: true});
                    }
                });
            }
        });
    } else if (!req.user) {
        res.json({error: "Unauthorized"});
    } else {
        res.json({error: "Invalid Request"});
    }
});

router.delete("/booksApi/:id", function(req, res) {
    db.deleteBook(req.user.id, req.params.id, function(err) {
        if (err) {
            res.json({error: err});
        } else {
            res.json({success: true});
        }
    });
});

module.exports = router;
