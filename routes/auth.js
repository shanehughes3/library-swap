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

router.get("/unread", function(req, res) {
    if (req.user) {
        db.countUserUnread(req.user.id, function(err, data) {
            if (err) {
                console.log(err);
                res.json({error: "Sorry, an error occurred"});
            } else {
                res.json(parseUnreadData(data));
            }
        });
    } else {
        res.json({error: "Unauthorized"});
    }
});

function parseUnreadData(data) {
    if (data.rows && data.rows.length > 0) {
        data.rows = data.rows.map((row) => row.RequestId);
    }
    return data;
}

router.get("/profile", function(req, res) {
    if (req.user) {
        res.render("profile", {user: req.user.username});
    } else {
        res.redirect("/");
    }
});

router.get("/api/profile", function(req, res) {
    if (req.user) {
        db.getUserInfo(req.user.id, (err, info) => {
            if (err) {
                console.error(err);
                res.json({error: "Sorry, an error occurred"});
            } else {
                res.json(info || {});
            }
        });
    } else {
        res.json({error: "Unauthorized"});
    }
});

router.put("/api/profile", function(req, res) {
    if (req.user && req.body) {
        db.updateUserInfo(
            req.user.id,
            {
                firstName: req.body.firstName || "",
                lastName: req.body.lastName || "",
                city: req.body.city || "",
                state: req.body.state || "",
                country: req.body.country || ""
            },
            (err) => {
                if (err) {
                    console.error(err);
                    res.json({error: "Sorry, an error occurred"});
                } else {
                    res.json({success: true});
                }
            });
    } else {
        res.json({error: "Unauthorized"});
    }
});

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;
