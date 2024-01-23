// initialisation express
const express = require( 'express' );

const app = express();

const PORT = 3000;

//moteur de template
app.set( 'view engine', 'ejs');
// définition du dossier contenant les vues
app.set( 'views', '/views' );

app.use(express.static( './public' ));

app.listen(PORT, () => {
  console.log( `http://localhost:${PORT}` );
});
