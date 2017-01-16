const router = require("express").Router(),
      passport = require("passport"),
      db = require("../db/db.js");


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

module.exports = router;
