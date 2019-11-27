var express = require("express");
var router = express.Router();
var db = require("../db");

const multer = require('multer');
const upload = multer({dest: __dirname + '/public/img/friends'});

/**
 * Accéder à la page about.
 */
router.get("/", function(req, res, next) {
    res.render("change_avatar", {
      user: req.session && req.session.user,
      title: "Modifier avatar"
    });
  });

  

router.post("/", function(req, res, next) {


});

module.exports = router;