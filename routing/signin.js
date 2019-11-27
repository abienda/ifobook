var express = require("express");
var router = express.Router();
var db = require("../db");
var bcrypt = require("bcrypt");

/**
 * Accéder à la page de connexion.
 */
router.get("/", function(req, res, next) {
  res.render("signin", {
    user: req.session && req.session.user,
    title: "Connexion"
  });
});

/**
 * Authentification avec cryptage du mot de passe.
 */
router.post("/", function(req, res, next) {
  var { username, password } = req.body;
  var usersCollection = db.get("ifobook").collection("users");
  usersCollection
    .findOne({ username: username })
    .then(function(user) {
      if (!user) {
        var error = new Error();
        error.message = "L'username fourni est erroné";
        error.statusCode = 403;
        throw error;
      }

      return bcrypt.compare(password, user.password).then(function(isMatch) {
        if (!isMatch) {
          var error = new Error();
          error.message = "Le mot de passe est incorrect";
          error.statusCode = 403;
          throw error;
        }

        req.session.user = user;
        //res.redirect("/profil");


        usersCollection.updateOne({email:req.session.user.email},{$set:{inline:'1'}}, function(err) {
          console.log("En ligne!")
          res.redirect('/profil');
          });
      });
    })
    .catch(function(error) {
      res.render("signin", { error: error });
    });
});

module.exports = router;
