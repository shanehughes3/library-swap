const Sequelize = require("sequelize"),
      passportLocalSequelize = require("passport-local-sequelize"),
      env = process.env.NODE_ENV || "development",
      config = require("../config")[env];

const db = new Sequelize("library_swap", config.dbUser, config.dbPass, {
    host: "localhost",
    dialect: "mysql"
});

const User = passportLocalSequelize.defineUser(db, {});

User.sync();

exports.user = User;

exports.register = function(username, password, cb) {
    User.register(username, password, cb);
};
