const router = require("express").Router(),
      passport = require("passport"),
      db = require("../db/db"),
      api = require("../api"),
      authRoutes = require("./auth"),
      bookRoutes = require("./books");

router.get("/", function(req, res) {
    if (req.user) {
        console.log(req.user.username, req.user.id);
    }
    res.render("index", {user: (req.user) ? req.user.username : ""});
});

router.use(authRoutes);
router.use(bookRoutes);

module.exports = router;
