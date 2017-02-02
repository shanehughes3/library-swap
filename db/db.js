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

exports.getLatestBooks = function(offset, userId, cb) {
    Book.findAll({
        where: {
            UserId: {
                $ne: userId
            }
        },
        limit: 15
    }).then(function(books) {
        cb(null, books);
    }).catch(function(err) {
        cb(err);
    });
}

exports.searchBooks = function(userId, query, offset, cb) {
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

exports.getUserBooks = function(userId, cb) {
    Book.findAll({
        where: {
            userId: userId
        }
    }).then(function(books) {
        cb(null, books);
    }).catch(function(err) {
        cb(err);
    });
}

exports.saveBook = function(userId, bookData, cb) {
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
            UserId: userId
        }).save()
        .then((book) => {
            cb(null);
        }).catch((err) => cb(err));
};

exports.deleteBook = function(userId, bookId, cb) {
    Book.findById(bookId)
        .then((book) => {
            if (userId === book.UserId) {
                book.destroy();
                cb(null);
            } else {
                cb(new Error("Unauthorized"));
            }
        }).catch((err) => cb(err));
};


/*
 * BOOK REQUESTS
 */

const Request = db.define("Request", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    status: {   // status should be "open," "accepted," or "rejected"
        type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "open"
    }
});

Request.belongsTo(User, { as: "SellerUser" });
Request.belongsTo(User, { as: "BuyerUser" });
Request.belongsTo(Book, { as: "SellerBook" });
Request.belongsTo(Book, { as: "BuyerBook" });

// seller/buyer naming is used to avoid [decrease] confusion - buyer is the
// user who clicked "request book"; seller will get the notification
// in his/her inbox

exports.newRequest = function(buyerUserId, buyerBookId, sellerBookId, cb) {
    Book.findById(sellerBookId)
        .then((sellerBook) => {
            Request.build({
                SellerUserId: sellerBook.UserId,
                SellerBookId: sellerBookId,
                BuyerUserId: buyerUserId,
                BuyerBookId: buyerBookId
            }).save()
                   .then((newRequest) =>
                       createInitialRequestMessage(newRequest, cb))
                   .catch((err) => cb(err));
        })
        .catch((err) => cb(err)); // catch sellerBook lookup
};
/*
exports.viewRequest = function(userId, requestId, cb) {
    Request.findById(requestId)
           .then((request) => {
               if (userId === request.SellerUserId ||
                   userId === request.BuyerUserId) {
                   // restrict access
                   cb(null, request);
               } else {
                   cb(new Error("Unauthorized"));
               }
           })
           .catch((err) => cb(err));
};
*/
exports.getIncomingUserRequests = function(userId, cb) {
    Request.findAll({
        where: {
            SellerUserId: userId
        },
        include: [
            { model: Book, as: "SellerBook" },
            { model: Book, as: "BuyerBook" }
        ]
    })
           .then((reqs) => cb(null, reqs))
           .catch((err) => cb(err));
};

exports.getAllUserRequests = function(userId, cb) {
    Request.findAll({
        where: {
            $or: [
                { BuyerUserId: userId },
                { SellerUserId: userId }
            ]
        },
        include: [
            { model: Book, as: "SellerBook" },
            { model: Book, as: "BuyerBook" }
        ]
    })
           .then((reqs) => cb(null, reqs))
           .catch((err) => { cb(err); console.log(err)});
};

exports.getOutgoingUserRequests = function(userId, cb) {
    Request.findAll({
        where: {
            BuyerUserId: userId
        },
        include: [
            { model: Book, as: "SellerBook" },
            { model: Book, as: "BuyerBook" }
        ]
    })
           .then((reqs) => cb(null, reqs))
           .catch((err) => cb(err));
};

exports.changeRequestStatus = function(userId, requestId, newStatus, cb) {
    if (["accepted", "rejected"].includes(newStatus)) {
        Request.findById(requestId)
               .then((request) => {
                   if (userId === request.SellerUserId) {
                       request.status = newStatus;
                       request.save()
                              .then(() => cb(null))
                              .catch((err) => cb(err));
                   } else {
                       cb(new Error("Unauthorized"));
                   }
               })
               .catch();
    } else {
        cb(new Error("Invalid Request"));
    }
};

/* MESSAGES
 */

const Message = db.define("Message", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    text: Sequelize.STRING(510)
});

Message.belongsTo(User);
Message.belongsTo(Request);

function createInitialRequestMessage(newRequest, cb) {
    Request.findOne({
        where: {
            id: newRequest.id
        },
        include: [{ all: true }]
    })
           .then((fullNewRequest) => {
               Message.build({
                   text: `${fullNewRequest.BuyerUser.username} has requested ${fullNewRequest.SellerBook.title} from ${fullNewRequest.SellerUser.username} and offered ${fullNewRequest.BuyerBook.title} in exchange.`,
                   RequestId: fullNewRequest.id
               }).save()
                      .then(() => cb(null, fullNewRequest.id))
                      .catch((err) => cb(err));
           })
           .catch((err) => cb(err));
}

exports.getRequestMessages = function(requestId, cb) {
    Message.findAll({
        where: {
            RequestId: requestId
        },
        include: [
            { model: Request }
        ]
    })
           .then((messages) => cb(null, messages))
           .catch((err) => cb(err));
        
}

exports.newMessage = function(requestId, userId, messageText, cb) {
    Request.findById(requestId)
           .then((request) => {
               if (request.SellerUserId === userId ||
                   request.BuyerUserId === userId) {
                   Message.build({
                       RequestId: requestId,
                       UserId: userId,
                       text: messageText
                   }).save()
                          .then(() => cb(null))
                          .catch((err) => cb(err));
               } else {
                   cb("Unauthorized");
               }
           })
           .catch((err) => cb(err));
}
    

/* CLEANUP
 */

db.sync();
