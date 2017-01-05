const express = require("express"),
      passport = require("passport"),
      bodyParser = require("body-parser"),
      cookieParser = require("cookie-parser"),
      session = require("express-session"),
      scribe = require("express-scribe"),
      env = process.env.NODE_ENV || "development",
      config = require("./config")[env],
      User = require("./db/db").user,
      router = require("./routes/router"),
      app = express();

app.use(scribe({
    removeIPv4Prefix: true
}));
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(__dirname + "/public"));
app.set("view engine", "pug");
app.use(router);

app.listen(config.port);
