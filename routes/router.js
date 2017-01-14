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

router.get("/latest", function(req, res) {
    db.getLatestBooks(req.query.o, req.user.id, function(err, books) {
        if (err) {
            res.json({error: err});
        } else {
            res.json({books: books});
        }
    });
});

router.get("/userBooksList", function(req, res) {
    db.getUserBooks(req.user.id, function(err, books) {
        if (err) {
            res.json({error: err});
        } else {
            res.json({books: books});
        }
    });
});

router.get("/lookup", function(req, res) {
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

router.get("/add", function(req, res) {
    if (req.query.id) {
        api.search(req.query.id, 0, function(err, books) {
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
    } else {
        res.json({error: "Invalid Request"});
    }
});

router.get("/delete", function(req, res) {
    if (req.query.id) {
        db.deleteBook(req.user.id, req.query.id, function(err) {
            if (err) {
                res.json({error: err});
            } else {
                res.json({success: true});
            }
        });
    } else {
        res.json({error: "Invalid Request"});
    }
});

module.exports = router;
