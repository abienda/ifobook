var express = require("express");
var router = express.Router();
var db = require("../db");
var bcrypt = require("bcrypt");
var saltRounds = 10;
var changePasswordValidation = require("../middleware/change_password-validation");
var mailer = require("nodemailer");



  
/**
 * Accéder à la page d'inscription.
 */
router.get("/", function(req, res, next) {

    /*var { email } = user.email;
    var usersCollection = db.get("ifobook").collection("users");
    usersCollection
        .findOne({ email: email }).toArray(function(err,docs){
        datas.docs = docs;
        });*/

  res.render("change_password", {
    user: req.session && req.session.user,
    title: "Modifier Mot de passe"
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
 * Modification avec cryptage du mot de passe.
 */
// On passe une "fonction de middleware" juste avant le middleware correspondant à la route.
// Cette fonction appelée changePasswordValidation reçoit en argument (req, res, next) et a pour rôle
// de valider les données reçues depuis la page de modification du mot de passe.
//
// Cette vérification est essentielle car rien ne nous assure que l'utilisateur a effectivement
// soumis notre forumaire en respectant le mécanisme fourni côté client.
// Il pourrait très bien avoir désactivé JavaScript sur son navigateur ou bien avoir inséré
// du code JS malicieux pour contourner notre mécanisme de validation côté client.
//
// NE JAMAIS FAIRE CONFIANCE AUX DONNEES ENVOYEES PAR L'UTILISATEUR !
router.post("/", changePasswordValidation, function(req, res, next) {
  var { email, password: plainPassword } = req.body;
  var usersCollection = db.get("ifobook").collection("users");
  
  usersCollection
    .findOne({ email: req.session.user.email })
    .then(function(user) {
      // l'utilisateur n'existe pas
      if (!user) {
        var error = new Error();
        error.message = "Ce profil n'est pas enregistré";
        error.statusCode = 403;
        throw error;
      }

      

    /* update mot de passe du mail saisi */
    bcrypt
        .hash(plainPassword, saltRounds)
        .then(function(hash) {
        return usersCollection.updateOne({email:req.session.user.email},{$set:{password:hash}});
        })  

        //console.log("Password 2 : "+plainPassword);

      /* remplir le mail */
      var mail = {
        from: "ifobook15@gmail.com",
        to: req.session.user.email,
        subject: "Modification mot de passe Ifobook",
        html: "<h1>Bonjour</h1><p>La modification de votre mot de passe est validé.<p><br/>"+
              "<p>Voici votre identifiant : "+ req.session.user.username+"<p><br/>"+
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

    
      req.session.user = user;
      res.redirect("/profil");      
    })
    .catch(function(error) {
      res.render("change_password", { error: error });
    });
});

module.exports = router;
