var express = require("express");
var router = express.Router();
var db = require("../db");

/**
 * Accéder à la page about.
 */
router.get("/", function(req, res, next) {

  /*var { email } = user.email;
  var usersCollection = db.get("ifobook").collection("users");
  usersCollection
    .findOne({ email: email }).toArray(function(err,docs){
      datas.docs = docs;
    })*/

    /*const toto = {
          email:req.session.user.email,
          photo:req.body.photo?req.body.photo:toto.photo,
          societe: req.body.societe?req.body.societe:toto.societe,
          presentation: req.body.presentation?req.body.presentation:toto.presentation,
          preference: req.body.preference?req.body.preference:toto.preference,
          mail_pro: req.body.mail_pro?req.body.mail_pro:toto.mail_pro,
          linkedin: req.body.linkedin?req.body.linkedin:toto.linkedin    
      }; */

    res.render("profil", {
      user: req.session && req.session.user,
      title: "Profil"
    });
  });

  

router.post("/", function(req, res, next) {
  var usersCollection = db.get("ifobook").collection("users");
  
  usersCollection.find({email:req.session.user.email}).toArray(function(err,docs) {
    console.log(req.session.user.email)
    if (docs.length) {
      console.log("Ok")
      usersCollection.updateOne({email:req.session.user.email},{$set:{societe:req.body.societe,presentation:req.body.presentation,preference:req.body.preference,mail_pro:req.body.mail_pro,linkedin:req.body.linkedin}}, function(err) {
        console.log("Modifé avec succès!")
        res.redirect('/profil');
        });
    } else {
      console.log("Non modifé!")
        res.redirect('/');
    }
});
});

module.exports = router;