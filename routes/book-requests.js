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
                      req.body.requestedBookId, function(err) {
                          if (err) {
                              res.json({error: err});
                          } else {
                              res.json({success: true});
                          }
                      });
    } else if (!req.user) {
        res.json({error: new Error("Unauthorized")});
    } else {
        res.json({error: new Error("Invalid Request")});
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
        res.json({error: new Error("Unauthorized")});
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
                               res.json({request: request});
                           }
                       });
    } else {
        res.json({error: new Error("Unauthorized")});
    }
});

router.put("/api/requests/:requestId", function(req, res) {
    if (req.user && req.body.status) {
        db.changeRequestStatus(req.user.id, req.params.requestId,
                               req.body.status, function(err) {
                                   if (err) {
                                       res.json({error: err});
                                   } else {
                                       res.json({success: true});
                                   }
                               });
    } else if (!req.user) {
        res.json({error: new Error("Unauthorized")});
    } else {
        res.json({error: new Error("Invalid Request")});
    }
});

module.exports = router;
      
