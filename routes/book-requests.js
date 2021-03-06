const router = require("express").Router(),
      db = require("../db/db");

router.get("/requests*", function(req, res) {
    if (req.user) {
        res.render("requests", {user: req.user.username});
    } else {
        res.redirect("/");
    }
});

router.post("/api/requests", function(req, res) {
    // new request submission
    if (req.user && req.body.offerBookId && req.body.requestedBookId) {
        db.newRequest(req.user.id, req.body.offerBookId,
                      req.body.requestedBookId, function(err, newId) {
                          if (err) {
                              res.json({error: "An error occurred"});
                              console.log(err);
                          } else {
                              res.json({
                                  success: true,
                                  id: newId
                              });
                          }
                      });
    } else if (!req.user) {
        res.json({error: "Unauthorized"});
    } else {
        res.json({error: "Invalid Request"});
    }
});

router.get("/api/requests", function(req, res) {
    if (req.user) {
        db.getAllUserRequests(req.user.id, function(err, requests) {
            if (err) {
                res.json({error: err});
            } else {
                res.json({requests: requests || []});
            }
        });
    } else {
        res.json({error: "Unauthorized"});
    }
});

router.get("/api/requests/incoming", function(req, res) {
    if (req.user) {
        db.getIncomingUserRequests(req.user.id, function(err, requests) {
            if (err) {
                res.json({error: err});
            } else {
                res.json({requests: requests || []});
            }
        });
    } else {
        res.json({error: "Unauthorized"});
    }
});

router.get("/api/requests/outgoing", function(req, res) {
    if (req.user) {
        db.getOutgoingUserRequests(req.user.id, function(err, requests) {
            if (err) {
                res.json({error: err});
            } else {
                res.json({requests: requests});
            }
        });
    } else {
        res.json({error: new Error("Unauthorized")});
    }
});

router.get("/api/requests/:requestId", function(req, res) {
    if (req.user) {
        db.viewRequest(req.user.id, req.params.requestId,
                       function(err, request) {
                           if (err) {
                               res.json({error: err});
                           } else {
                               res.json({
                                   request:
                                           parseRequestForUser(request,
                                                               req.user.id)
                               });
                           }
                       });
    } else {
        res.json({error: new Error("Unauthorized")});
    }
});

router.put("/api/requests/:requestId", function(req, res) {
    if (req.user && req.body.status) {
        db.changeRequestStatus(req.user.id, req.user.username,
                               req.params.requestId,
                               req.body.status, function(err) {
                                   if (err) {
                                       console.error(err);
                                       res.json({error: err});
                                   } else {
                                       res.json({success: true});
                                   }
                               });
    } else if (!req.user) {
        res.json({error: "Unauthorized"});
    } else {
        res.json({error: "Invalid Request"});
    }
});

router.get("/api/requests/:requestId/messages", function(req, res) {
    if (req.user) {
        db.getRequestMessages(req.params.requestId, function(err, messages) {
            if (err) {
                res.json({error: err});
            } else {
                if (messages[0].Request.SellerUserId === req.user.id ||
                    messages[0].Request.BuyerUserId === req.user.id) {
                    res.json({
                        messages: parseMessagesForUser(messages, req.user.id)
                    });
                } else {
                    res.json({error: "Unauthorized"});
                }
            }
        });
    } else {
        res.json({error: "Unauthorized"});
    }
});

router.post("/api/requests/:requestId/messages", function(req, res) {
    if (req.user && req.body.message) {
        db.newMessage(req.params.requestId, req.user.id, req.body.message,
                      function(err) {
                          if (err) {
                              res.json({error: err});
                          } else {
                              res.json({success: true});
                          }
                      });
    } else if (!req.user) {
        res.json({error: "Unauthorized"});
    } else {
        res.json({error: "Invalid Request"});
    }
});

router.get("/api/requests/:requestId/messages/unread", function(req, res) {
    if (req.user) {
        db.countRequestUnread(req.params.requestId, req.user.id,
                              function(err, count) {
                                  if (err) {
                                      console.error(err);
                                      res.json({error: err});
                                  } else {
                                      res.json({count: count});
                                  }
                              });
    } else {
        res.json({error: "Unauthorized"});
    }
});

router.delete("/api/requests/:requestId/messages/unread", function(req, res) {
    if (req.user) {
        db.setRequestMessagesRead(req.params.requestId, req.user.id,
                                  function(err) {
                                      if (err) {
                                          console.error(err);
                                          res.json({error: err});
                                      } else {
                                          res.json({success: true});
                                      }
                                  });
    } else {
        res.json({error: "Unauthorized"});
    }
});

module.exports = router;
      
function parseMessagesForUser(messages, userId) {
    if (messages.length > 0) {
        messages = messages.map((message) => message.get({plain: true}));
        messages.forEach((message) => {
            delete message.Request;
            if (message.autoGenerated === true) {
                message.source = "server";
            } else if (message.UserId === userId) {
                message.source = "self";
            } else {
                message.source = "other";
            } 
        });
    }
    return messages;
}

function parseRequestForUser(request, userId) {
    if (request) {
        request = request.get({plain: true});
        if (request.BuyerUserId === userId) {
            request.source = "self";
        } else {
            request.source = "other";
        }
        delete request.SellerBookId;
        delete request.BuyerBookId;
        delete request.SellerUserId;
        delete request.BuyerUserId;
    }
    return request;
}
