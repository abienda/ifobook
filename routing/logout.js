var express = require("express");
var router = express.Router();

/**
 * Accéder à la page d'inscription.
 */
router.get("/", function(req, res, next) {
  req.session.destroy();
  res.redirect("/");

  /*usersCollection.updateOne({email:req.session.user.email},{$set:{inline:'0'}}, function(err) {
    console.log("Hors ligne!")
    req.session.destroy();
    res.redirect("/");
    });*/
});



module.exports = router;
