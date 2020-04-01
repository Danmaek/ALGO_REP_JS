const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const taches = require('./routes/taches') ;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ouverture du serveur en écoute sur le port 3000
app.listen(3000, function() {
  console.log('Backend sur http://127.0.0.1:3000!');
});

app.get('/', (req, res) => {
  res.send("Vous êtes bien sur le backend. Pour bénéficier du frontend, merci de lancer frondend.js contenu dans le dossier frontend.")
})

//controlleur des requêtes vers /taches
app.use('/taches', taches);

