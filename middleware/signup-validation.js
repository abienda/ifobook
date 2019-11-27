module.exports = function signupValidation(req, res, next) {
  var { nom, prenom, email, genre, username, password, password_confirmation } = req.body;
  var isValid = true;

  var emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  var passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (nom.length < 2) isValid = false;
  if (prenom.length < 2) isValid = false;
  if (username.length < 3) isValid = false;
  if (!email.match(emailRegex)) isValid = false;
  if (!password.match(passwordRegex)) isValid = false;
  if (password !== password_confirmation) isValid = false;

  if (isValid) {
    next();
  } else {
    var error = new Error();
    error.message = "Echec de l'inscription";
    error.statusCode = 403;
    res.render("signup", {
      error: error
    });
  }
};
