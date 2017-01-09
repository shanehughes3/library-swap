const router = require("express").Router(),
      passport = require("passport"),
      db = require("../db/db");

router.get("/", function(req, res) {
    if (req.user) {
        res.render("index", {user: req.user.username});
    } else {
        res.render("index");
    }
});

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
});

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;
