const router = require("express").Router(),
      passport = require("passport"),
      db = require("../db/db");

router.get("/", function(req, res) {
    res.render("index");
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {failWithError: true}),
	    loginSuccess, loginFailure);
    
function loginSuccess(req, res) {
    res.end("success");
}

function loginFailure(err, req, res) {
    res.render("login");
}

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    db.register(req.body.username, req.body.password, function(err, user) {
	if (err) {
	    res.end(err);
	} else {
	    res.end(`Success: ${user}`);
	}
    });
});

module.exports = router;
