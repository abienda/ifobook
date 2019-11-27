var express = require("express");
var router = express.Router();
var db = require("../db");
var bcrypt = require("bcrypt");
var saltRounds = 10;
var signupValidation = require("../middleware/signup-validation");
var mailer = require("nodemailer");

/**
 * Accéder à la page d'inscription.
 */
router.get("/", function(req, res, next) {
  res.render("signup", {
    user: req.session && req.session.user,
    title: "Inscription"
  });
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
 * Inscription avec cryptage du mot de passe.
 */
// On passe une "fonction de middleware" juste avant le middleware correspondant à la route.
// Cette fonction appelée signupValidation reçoit en argument (req, res, next) et a pour rôle
// de valider les données reçues depuis la page d'inscription.
//
// Cette vérification est essentielle car rien ne nous assure que l'utilisateur a effectivement
// soumis notre forumaire d'inscription en respectant le mécanisme fourni côté client.
// Il pourrait très bien avoir désactivé JavaScript sur son navigateur ou bien avoir inséré
// du code JS malicieux pour contourner notre mécanisme de validation côté client.
//
// NE JAMAIS FAIRE CONFIANCE AUX DONNEES ENVOYEES PAR L'UTILISATEUR !
router.post("/", signupValidation, function(req, res, next) {
  var { nom, prenom, email, genre, birthday, username, password: plainPassword } = req.body;
  var usersCollection = db.get("ifobook").collection("users");

  usersCollection
    .findOne({ email: email })
    .then(function(user) {
      // l'utilisateur existe déjà
      if (user) {
        var error = new Error();
        error.message = "Cette email est déjà enregistrée";
        error.statusCode = 403;
        throw error;
      }


      /* remplir le mail */
      var mail = {
        from: "ifobook15@gmail.com",
        to: email,
        subject: "Inscription Ifobook",
        html: "<h1>Bonjour</h1><p>Votre inscription est validé.<p><br/>"+
              "<p>Voici votre identifiant : "+ username+"<p><br/>"+
              "<p>et votre mot de passe : "+plainPassword+"</p>"
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


      bcrypt
        .hash(plainPassword, saltRounds)
        .then(function(hash) {
          return usersCollection.insertOne({
            nom: nom,
            prenom: prenom,
            email: email,
            genre: genre,
            birthday: birthday,
            username: username,
            password: hash
          });
        })
        .then(function(response) {
          req.session.user = response.ops[0]; // contient le 'user'
          res.status(200);
          res.redirect("/");
        });      
    })
    .catch(function(error) {
      res.render("signup", { error: error });
    });
});

module.exports = router;
