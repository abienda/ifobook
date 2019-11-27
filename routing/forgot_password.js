var express = require("express");
var router = express.Router();
var db = require("../db");
var bcrypt = require("bcrypt");
var saltRounds = 10;
var mailer = require("nodemailer");
var generator = require('generate-password');
 

/* genere un nouveau mot de passe */
var password_generat = generator.generate({
    length: 8,
    numbers: true
});

/* authentifier l'expéditeur */
var smtpTransport = mailer.createTransport("SMTP",{
  service: "Gmail",
  auth: {
    user: "ifobook15@gmail.com",
    pass: "#IFOBOOK.application00!"
  }
});



/**
 * Accéder à la page de mot de passe oublié.
 */
router.get("/", function(req, res, next) {
  res.render("forgot_password", {
    user: req.session && req.session.user,
    title: "Mot de passe oublié"
  });
});

/**
 * Verification compte valide.
 */
router.post("/", function(req, res, next) {
  var { email } = req.body;
  var usersCollection = db.get("ifobook").collection("users");
  usersCollection
    .findOne({ email: email })
    .then(function(user) {
      if (!user) {
        var error = new Error();
        error.message = "L'email fourni n'est pas enregistré";
        error.statusCode = 403;
        throw error;
      }

  /* update mot de passe du mail saisi */
    bcrypt
        .hash(password_generat, saltRounds)
        .then(function(hash) {
          return usersCollection.updateOne({email:email},{$set:{password:hash}});
        })


        /* remplir le mail */
        var mail = {
          from: "ifobook15@gmail.com",
          to: email,
          subject: "Recupération mot de passe",
          html: "<h1>Bonjour</h1><p>Votre nouveau mot de passe : "+password_generat+"</p>"
        }

        /* envoye mail */
        smtpTransport.sendMail(mail, function(error, response){
          if(error){
            console.log("Erreur lors de l'envoie du mail!");
            console.log(error);
          }else{
            console.log("Mail envoyé avec succès!")
          }
          smtpTransport.close();
        });
        

        req.session.user = user;
        res.redirect("/signin");
    })
    .catch(function(error) {
      res.render("forgot_password", { error: error });
    });
});

module.exports = router;
