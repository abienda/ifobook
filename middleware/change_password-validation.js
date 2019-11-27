module.exports = function changePasswordValidation(req, res, next) {
  var { password, password_confirmation } = req.body;
  var isValid = true;

  var passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!password.match(passwordRegex)) isValid = false;
  if (password !== password_confirmation) isValid = false;

  if (isValid) {
    next();
  } else {
    var error = new Error();
    error.message = "Echec de la modification";
    error.statusCode = 403;
    res.render("change_password", {
      error: error
    });
  }
};
