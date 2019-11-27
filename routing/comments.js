var express = require("express");
var router = express.Router();
var db = require("../db");

/**
 * Retrouver des commentaires.
 * Possibilité de retrouver uniquement les commentaires publiés après une certaine date.
 */
router.get("/", function(req, res, next) {
  var publishedAfter = req.query.publishedAfter;
  var query = publishedAfter
    ? {
        publish_date: {
          $gt: new Date(publishedAfter)
        }
      }
    : {};

  db.get("ifobook")
    .collection("comments")
    .find(query)
    .toArray()
    .then(function(docs) {
      res.json(docs);
    })
    .catch(next);
});

/**
 * Publier un nouveau commentaire.
 */
router.post("/", function(req, res, next) {
  var bodyParams = req.body;

  if (req.session && req.session.user) {
    db.get("ifobook")
      .collection("comments")
      .insertOne({
        author: req.session.user,
        body: bodyParams.body,
        publish_date: new Date(bodyParams.publish_date)
      })
      .then(function(response) {
        res.status(200);
        res.json(response.ops[0]);
      })
      .catch(next);
  } else {
    var erreur = new Error();
    erreur.message = "Forbidden";
    erreur.statusCode = 403;
    next(erreur);
  }
});

module.exports = router;
