// initialisation express
const express = require( 'express' );
const games = require('./games.json');

const app = express();

const PORT = 5000;

//moteur de template
app.set( 'view engine', 'ejs');
// définition du dossier contenant les vues
app.set( 'views', './views' );

app.use(express.static( './public' ));

app.get( '/', (req,res) => {
  res.render('index.ejs', {games} );
});

app.listen(PORT, () => {
  console.log( `http://localhost:${PORT}` );
});
