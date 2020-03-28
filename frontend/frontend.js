const path = require('path')
const express = require('express')
const layout = require('express-layout')

const routes = require('./routes')
const forms = require('./forms')
const app = express();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// chargement du fichier layout sur l'ensemble des pages
const middlewares = [
  layout(),
  express.static(path.join(__dirname, 'public'))
];
app.use(middlewares);

app.use('/', routes); // vue principale
app.use('/forms', forms); // middleware interne

app.listen(3001, () => {
  console.log('App running at http://localhost:3001');
});
 
