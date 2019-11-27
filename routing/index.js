var express = require("express");
var router = express.Router();

/**
 * Page d'accueil
 */
router.get("/", function(req, res, next) {
  res.render("index", {
    user: req.session && req.session.user
  });
});

// Autres routes
router.use("/comments", require("./comments"));
//router.use("/login", require("./login"));
router.use("/signup", require("./signup"));
router.use("/logout", require("./logout"));
router.use("/signin", require("./signin"));
router.use("/about", require("./about"));
router.use("/profil", require("./profil"));
router.use("/forgot_password", require("./forgot_password"));
router.use("/change_password", require("./change_password"));
router.use("/change_avatar", require("./change_avatar"));
router.use("/recherche_membre", require("./recherche_membre"));
router.use("/profil_recherche", require("./profil_recherche"));



module.exports = router;
