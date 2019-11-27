(function() {
  // DOM
  var form = document.getElementById("change_password-form");
  var passwordInput = document.getElementById("password");
  var letter = document.getElementById("letter");
  var capital = document.getElementById("capital");
  var number = document.getElementById("number");
  var length = document.getElementById("length");

  // Données
  var isValid = false;

  /**
   * Gestionnaires d'événements
   */

  // When the user starts to type something inside the password field
  function validerMotDePasse() {
    // Validate lowercase letters
    var lowerCaseLetters = /[a-z]/g;
    if (passwordInput.value.match(lowerCaseLetters)) {
      letter.classList.remove("invalid");
      letter.classList.add("valid");
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
    }

    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if (passwordInput.value.match(upperCaseLetters)) {
      capital.classList.remove("invalid");
      capital.classList.add("valid");
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
    }

    // Validate numbers
    var numbers = /[0-9]/g;
    if (passwordInput.value.match(numbers)) {
      number.classList.remove("invalid");
      number.classList.add("valid");
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
    }

    // Validate length
    if (passwordInput.value.length >= 8) {
      length.classList.remove("invalid");
      length.classList.add("valid");
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
    }
  }

  

  function validerPassword(password) {
    return password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/);
  }

  function validerPasswordConfirmation(passwordConfirmation) {
    return (
      passwordConfirmation.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/) &&
      formDataObject.password === passwordConfirmation
    );
  }

  function validerChamp(champ) {
    switch (champ.name) {
      case "password": {
        if (validerPassword(champ.value)) {
          champ.classList.add("valid");
          champ.classList.remove("invalid");
        } else {
          champ.classList.add("invalid");
          champ.classList.remove("valid");
        }
        break;
      }
      case "password_confirmation": {
        if (validerPasswordConfirmation(champ.value)) {
          champ.classList.add("valid");
          champ.classList.remove("invalid");
        } else {
          champ.classList.add("invalid");
          champ.classList.remove("valid");
        }
        break;
      }
      default: {
        return;
      }
    }
  }

  function validerFormulaire(formDataObject) {
    // validation mot de passe
    if (formDataObject.password !== formDataObject.password_confirmation) {
      console.log("vous n'avez pas saisi deux fois le même mot de passe");
      return false;
    }
    return true;
  }

  function getFormDataObject(form) {
    var formData = new FormData(form);
    var formDataEntries = formData.entries(); // -> renvoie un itérateur
    var formDataArray = Array.from(formDataEntries); // -> convertit l'itérateur en tableau

    return formDataArray.reduce(function(accumulateur, valeurCourante) {
      accumulateur[valeurCourante[0]] = valeurCourante[1];
      return accumulateur;
    }, []);
  }

  passwordInput.onkeyup = validerMotDePasse;

  // When the user clicks on the password field, show the message box
  passwordInput.onfocus = function() {
    document.getElementById("message").style.display = "block";
  };

  // When the user clicks outside of the password field, hide the message box
  passwordInput.onblur = function() {
    document.getElementById("message").style.display = "none";
  };

  document
    .querySelectorAll("input, textarea, select")
    .forEach(function(element) {
      element.addEventListener("blur", function(event) {
        // Mise à jour de toutes les données du formulaire
        formDataObject = getFormDataObject(form);

        // Validation du champ en question
        validerChamp(element);
      });
    });

  /**
   * NOUVELLE TECHNIQUE ! (découverte en traînant sur le formulaire d'inscription d'Amazon)
   *
   * Plutôt que de soumettre le formulaire en créant notre propre requête avec AJAX,
   * il est possible de retarder la soumission "normale" du formulaire en suivant les étapes suivantes :
   *
   * 1. On intercepte l'événement de soumission "submit" du formulaire
   * 2. On empêche la soumission classique du formulaire avec event.preventDefault();
   * 3. On réalise toutes les opérations de validation nécessaires
   * 4. Si le formulaire est valide, on force une nouvelle soumission en appelant form.submit() sur la référence à l'élément forumlaire du DOM
   *
   * REMARQUE :
   * L'appel à form.submit() ne déclenche aucun événement de type "submit".
   * Aucun risque d'appel du gestionnaire d'événement en boucle infinie :)
   */
  form.addEventListener("submit", function(event) {
    // On empêche la soumission normale du formulaire
    event.preventDefault();

    var formData = getFormDataObject(form);

    isValid = validerFormulaire(formData);

    if (isValid) {
      form.submit();
    } else {
      console.log("formulaire invalide");
    }
  });
})();
