// initialisation express
const express = require( 'express' );
const games = require('./games.json');

const app = express();

const PORT = 2500;

//moteur de template
app.set( 'view engine', 'ejs');
// définition du dossier contenant les vues
app.set( 'views', './views' );

app.use(express.static( './public' ));

app.get( '/', (req,res) => {
  res.render('index', {games} );
});

app.get( '/game/:game', (req,res) => {
  const game = req.params.game;
  const test = games.find(foundGame => foundGame.name === game);
    if (test) {
        res.render(game, {games, game});
    } else {
        res.sendStatus(404);
    };
});

app.use((req, res)=>{
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log( `http://localhost:${PORT}` );
});