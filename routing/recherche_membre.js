var express = require("express");
var router = express.Router();
var db = require("../db");

/**
 * Accéder à la page about.
 */
router.get("/", function(req, res, next) {
    res.render("recherche_membre", {
      user: req.session && req.session.user,
      title: "Recherche membre"
    });

    var usersCollection = db.get("ifobook").collection("users");

    usersCollection
    .find()
    .toArray()
    .then(function(docs) {
      res.json(docs);
    })
    .catch(next);
  });

  


module.exports = router;