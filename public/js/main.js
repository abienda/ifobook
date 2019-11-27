(function() {
  "use strict";

  // DOM
  var form = document.getElementById("comments-form");
  var textarea = document.getElementById("comments-textarea");
  var listeCommentaires = document.getElementById("comments-list");

  // Données
  var commentaires = [];
  var pollingIntervalID = null;
  var intervalPolling = 1000;

  function creerElementCommentaire(data) {
    var li = document.createElement("li");
    li.className = "comments__item media";
    var commentAvatar = document.createElement("img");
    commentAvatar.src = "/img/friends/" + data.author.avatar + ".jpg";
    commentAvatar.className = "media__avatar";
    commentAvatar.alt = "avatar";
    var commentBody = document.createElement("div");
    commentBody.className = "media__body";


    commentBody.innerHTML =
      "<div class='activity-panel'><header><h3>" +
      data.author.username +
      "</h3></header>" +
      "<p>" +
      data.body +
      "</p><footer>" +
      new Date(data.publish_date).toLocaleDateString() +
      " " +
      new Date(data.publish_date).toLocaleTimeString();
    ("</footer></div>");

    li.appendChild(commentAvatar);
    li.appendChild(commentBody);
    

    return li;
  }


  function demarrerPolling() {
    pollingIntervalID = setInterval(
      chargerNouveauxCommentaires,
      intervalPolling
    );
  }

  function arreterLePolling() {
    clearInterval(pollingIntervalID);
  }

  function publierCommentaire(commentaire) {
    $.ajax({
      url: "/comments",
      method: "POST",
      data: commentaire,
      success: function(data) {
        commentaires.push(data);
        var li = creerElementCommentaire(data);
        listeCommentaires.append(li);
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  function chargerNouveauxCommentaires() {
    var data = commentaires.length
      ? {
          publishedAfter: new Date(
            commentaires[commentaires.length - 1].publish_date
          ).toISOString()
        }
      : (data = null);

    $.ajax({
      url: "/comments",
      method: "GET",
      data: data,
      success: function(data) {
        for (var i = 0; i < data.length; i++) {
          var commentaire = data[i];
          commentaires.push(commentaire);
          var li = creerElementCommentaire(commentaire);
          listeCommentaires.append(li);
        }
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  if (form) {
    form.addEventListener("submit", function(event) {
      // Empêcher la soumission par défaut du formulaire
      event.preventDefault();
      var texte = textarea.value.trim();

      if (texte && texte.length >= 3) {
        var commentaire = {
          body: texte,
          publish_date: new Date().toISOString()
        };

        publierCommentaire(commentaire);

        textarea.value = "";
      }
    });
  }

  // Interroger le serveur à intervales réguliers pour vérifier si de nouveaux commentaires ont été publiés
  demarrerPolling();
})();
