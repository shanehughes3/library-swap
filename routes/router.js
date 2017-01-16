const router = require("express").Router(),
      passport = require("passport"),
      db = require("../db/db"),
      api = require("../api");

router.get("/", function(req, res) {
    if (req.user) {
        console.log(req.user.username, req.user.id);
    }
    res.render("index", {user: (req.user) ? req.user.username : ""});
});


/*
 * AUTH
 */

router.post("/login", function(req, res, next) {
    passport.authenticate("local", function(err, user, info) {
        if (err) {
            res.status(500).json({error: err});
        } else if (!user) {
            res.status(401).json({error: info.message});
        } else {
            req.login(user, function(err) {
                if (err) {
                    res.json(err);
                } else {
                    res.json({username: user.username});
                }
            });
        }
    })(req, res, next);
});
    
function loginSuccess(req, res) {
    res.json({user: req.user.username});
}

function loginFailure(err, req, res) {
    res.json({error: err});
}

router.post("/register", function(req, res) {
    if (req.body.username && req.body.password &&
        req.body.password.length > 7) {
        db.register(req.body.username, req.body.password, function(err, user) {
	    if (err) {
	        res.json({error: err});
	    } else {
                req.login(user, function(err) {
                    if (err) {
                        res.json({error: err});
                    } else {
                        res.json({username: user.username});
                    }
                });
	    }
        });
    } else if (req.body.password && req.body.password) { // password too short
        res.json({error: "Password must be at least 8 characters"});
    } else {
        res.json({error: "All fields must be completed"});
    }
});

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});


/*
 * BOOKS
 */

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
        api.search(req.query.q, req.query.o || 0, function(err, books) {
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
        api.search(req.body.id, 0, function(err, books) {
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
