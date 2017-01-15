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
    subtitle: Sequelize.STRING,
    author: Sequelize.STRING,
    thumbnail: Sequelize.STRING,
    publisher: Sequelize.STRING,
    publishedYear: Sequelize.INTEGER,
    pages: Sequelize.INTEGER
}, {
    indexes: [
        { type: "FULLTEXT",
          name: "search",
          fields: ["title", "subtitle", "author"] }
    ]
});

Book.belongsTo(User);

exports.getLatestBooks = function(offset, userID, cb) {
    Book.findAll({
        where: {
            UserId: {
                $ne: userID
            }
        },
        limit: 15
    }).then(function(books) {
        cb(null, books);
    }).catch(function(err) {
        cb(err);
    });
}

exports.searchBooks = function(userID, query, offset, cb) {
    db.query("SELECT * FROM `Books` WHERE " + 
               "MATCH (title, subtitle, author) " +
             "AGAINST (? IN NATURAL LANGUAGE MODE) " +
             "LIMIT 15 OFFSET ?;", 
             { replacements: [query, parseInt(offset, 10)],
               type: Sequelize.QueryTypes.SELECT })
        .then(function(books) {
            cb(null, books);
        }).catch(function(err) {
            cb(err);
        });
    
};

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
    let authorString = "";
    if (bookData.authors) {
        bookData.authors.forEach((name) => {
            if (authorString) {
                authorString += ", ";
            }
            authorString += name;
        });
    }

    Book.build({
            title: bookData.title,
            subtitle: bookData.subtitle || null,
            author: authorString,
            thumbnail: bookData.thumbnail || null,
            publisher: bookData.publisher || null,
            publishedYear: (bookData.publishedDate) ?
                           parseInt(bookData.publishedDate.slice(0, 4), 10) :
                           null,
            pages: bookData.pageCount || null,
            UserId: userID
        }).save()
        .then((book) => {
            cb(null);
        }).catch((err) => cb(err));
};

exports.deleteBook = function(userID, bookID, cb) {
    Book.findById(bookID)
        .then((book) => {
            if (userID === book.UserId) {
                book.destroy();
                cb(null);
            } else {
                cb(new Error("Unauthorized"));
            }
        }).catch((err) => cb(err));
};

/* CLEANUP
 */

db.sync();
