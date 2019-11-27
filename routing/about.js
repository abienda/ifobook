var express = require("express");
var router = express.Router();
var db = require("../db");

/**
 * Accéder à la page about.
 */
router.get("/", function(req, res, next) {
    res.render("about", {
      user: req.session && req.session.user,
      title: "About"
    });
  });

  


module.exports = router;