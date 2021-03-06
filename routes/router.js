const router = require("express").Router(),
      passport = require("passport"),
      db = require("../db/db"),
      authRoutes = require("./auth"),
      bookRoutes = require("./books"),
      bookRequestRoutes = require("./book-requests");

router.get("/", function(req, res) {
    res.render("index", {user: (req.user) ? req.user.username : ""});
});

router.use(authRoutes);
router.use(bookRoutes);
router.use(bookRequestRoutes);

module.exports = router;
