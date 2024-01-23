// initialisation du module express
const express = require( 'express' );
// initialisation du module perso games
const games = require('./games.json');
// initialiser le serveur
const app = express();
// définir le port 2500 qui sera utilisé par le serveur
const PORT = 2500;

//moteur de template
app.set( 'view engine', 'ejs');
// définition du dossier contenant les vues
app.set( 'views', './views' );
// définition du dossier 'public' (container des fichiers statiques), situé dans le même dossier que notre application. 
app.use(express.static( './public' ));
// route vers la page d'accueil
// on utilise la méthode app.get avec l'url de la racine
app.get( '/', (req,res) => {
// on renvoi le résultat du template 'index' auquel on transmet les objets de games.json
  res.render('index', {games} );
});
// route vers les pages de jeux
// on utilise toujours la méthode app.get avec un schéma d'url dynamique correspondant aux noms de jeux du fichier games.json
app.get( '/game/:game', (req,res) => {
  // vient stocker le paramètre 'game' dans la constante game
  const game = req.params.game;
  // On recherche dans games.json si le nom du jeu est le même que celui de la constante game
  // On retourne le résultat dans la constante isGame
  const launchedGame = games.find(foundGame => foundGame.name === game);
  // si isGame est égalue à true
  if (launchedGame) {
    // on retourne la page du jeu
    res.render(game, {games, launchedGame});
  } else {
    // sinon on retourne une page erreur 404
    res.sendStatus(404);
  }
});
// pour toutes les autres url possible, on retourne une erreur 404 'not found'
app.use((req, res)=>{
  res.sendStatus(404);
});
// écoute du serveur sur le PORT
app.listen(PORT, () => {
  console.log( `http://localhost:${PORT}` );
});