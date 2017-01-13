const Sequelize = require("sequelize"),
      passportLocalSequelize = require("passport-local-sequelize"),
      env = process.env.NODE_ENV || "development",
      config = require("../config")[env];

const db = new Sequelize("library_swap", config.dbUser, config.dbPass, {
    host: "localhost",
    dialect: "mysql"
});

/* USER/AUTH
 */

const User = passportLocalSequelize.defineUser(db, {});

passportLocalSequelize.attachToUser(User, {
    keylen: 125   // fixes passport-local-sequelize bug (issue #21)
});

exports.user = User;

exports.register = function(username, password, cb) {
    User.register(username, password, cb);
}
    
/* BOOKS
 */

const Book = db.define("Book", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: Sequelize.STRING,
    author: Sequelize.STRING,
    isbn: Sequelize.STRING,
    thumbnail: Sequelize.STRING
});

Book.belongsTo(User);

exports.getLatestBooks = function(offset, userID, cb) {

}

exports.getUserBooks = function(userID, cb) {
    Book.findAll({
        where: {
            userId: userID
        }
    }).then(function(books) {
        cb(null, books);
    }).catch(function(err) {
        cb(err);
    });
}

exports.saveBook = function(userID, bookData, cb) {

}

/* CLEANUP
 */

db.sync();
