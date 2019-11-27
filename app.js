var express = require("express");
var path = require("path");
var app = express();
var db = require("./db"); // utilitaire qui nous sert d'interface avec l'instance de MongoDB
var session = require("express-session"); // gestion des sessions
var mongoose = require('mongoose');
var bodyParser = require("body-parser"); // donne accès aux paramètres contenus dans le corps de la requête à travers le champ 'req.body'

const MongoStore = require("connect-mongo")(session);
const multer = require('multer');
const upload = multer({dest: __dirname + '/public/img/friends'});

// Selon que l'on soit en mode développement ou en mode production, certaines variables d'environnement peuvent être fournies par le système sur lequel s'exécute notre serveur Express.
// Dans notre cas, ces variables sont :
// - l'URL de l'hébergeur de notre base de données
// - le port sur lequel est accessible le serveur

var MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://abienda:OFZvP6DMAsOyI30I@cluster0-rm5mx.mongodb.net/test?retryWrites=true&w=majority";
var PORT_NUMBER = process.env.PORT || 8080;


//**********//
app.set("view engine", "pug");
app.set("views", "./views"); // specify the views directory

app.use('/img', express.static(__dirname + '/public/img'));

/**
 * Voir https://github.com/expressjs/body-parser
 */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Middleware(s) qui configure(nt) une route pour servir des fichiers statiques.
// [1] la route à laquelle les requêtes sont envoyées
// [2] le répertoire du système de fichiers du serveur qui contient les fichiers à servir en réponse à des requêtes vers '/nom_de_la_route/nom_du_fichier'
app.use(
  /** [1] */ "/javascript",
  /** [2] */ express.static(path.join(__dirname, "/public/js"))
);
app.use(
  "/stylesheets",
  express.static(path.join(__dirname, "/public/stylesheets"))
);
app.use("/lib", express.static(path.join(__dirname, "/public/lib")));
app.use("/fonts", express.static(path.join(__dirname, "/public/fonts")));

// Création de session
app.set("trust proxy", 1); // trust first proxy

app.use(session({
  resave: false,
  secret: "keyboard cat",
  saveUninitialized: true, // don't create session until something stored
  store: new MongoStore({
      url: "mongodb+srv://abienda:OFZvP6DMAsOyI30I@cluster0-rm5mx.mongodb.net/test?retryWrites=true&w=majority"
  })
}));

// Upload image
app.post('/upload', upload.single('photo'), (req, res) => {
  if(req.file) {
      //res.json(req.file);
      //console.log(req.file.filename);
      var usersCollection = db.get("ifobook").collection("users");
  
      usersCollection.find({email:req.session.user.email}).toArray(function(err,docs) {
        console.log(req.session.user.email)
        if (docs.length) {
          console.log("Ok")
          usersCollection.updateOne({email:req.session.user.email},{$set:{avatar:req.file.filename}}, function(err) {
            console.log("Modifé avec succès!")
            res.redirect('/profil');
            });
        } else {
          console.log("Non modifé!")
            res.redirect('/profil');
        }
      });
  }
  else throw 'error';
});


// Route principale, renvoie la page d'accueil
// Système de routage. Voir le dossier 'routing'
app.use("/", require("./routing"));

app.get('/', function(req, res) {

  // ejs render automatically looks in the views folder
  res.render('index');
});

// Middleware pour les 404
app.use(function(req, res, next) {
  var erreur = new Error();
  erreur.statusCode = 404;
  next(erreur);
});

// Middleware de gestion des erreurs
// Si aucune code de statut n'a été spécifié, renvoyer par défaut une erreur 500
app.use(function(err, req, res, next) {
  if (!err.statusCode) {
    res.sendStatus(500);
  } else {
    res.sendStatus(err.statusCode);
  }
});

/**
 * Ne lancer le serveur que si MongoDB s'est connectée avec succès
 *
 * IMPORTANT :
 * On se connecte à la base de données au lancement de l'application puis on ne referme plus jamais la connection jusqu'à ce que l'application s'arrête.
 */


db.connect(MONGODB_URI, function(err) {
  if (!err) {
    app.listen(PORT_NUMBER, function() {
      console.log("listening on *:%d", PORT_NUMBER);
    });
  } else {
    console.log("mongodb is not connected");
  }
});