
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 

// importation du module sqlite en mode verbose
const sqlite3 = require('sqlite3').verbose();
// création de l'objet database, vérification par une fonction de callback
const db = new sqlite3.Database('../sqlite/gestionnaireTache.db',(err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the gestionnaireTaches SQlite database.');
});

let tache = {};
let db_request = "";
let db_param = "";

// Ouverture du serveur en écoute sur le port 3000
app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});

// Methode GET
// TODO : tester si le tuple à modifier existe
app.get('/taches/:id', function (req, res) {
  console.log('[GET] /taches + id ' + req.params.id);
  tache['id'] = parseInt(req.params.id);
  db_request = "SELECT * FROM DB_gestionnaireDeTaches WHERE id = ?";
  db_param = tache.id;
  db_get(db_request, db_param)
    .then(function(response){
      // conversion du résultat en buffer 
      let buf = Buffer.from(JSON.stringify(response[0]));
      // envoie du buffer vers les client
      return res.end(buf); 
    })
    .catch(function(response){
      return res.status(404).send('[FAILURE] Echec de l\'insertion');
    })
});


// Methode POST
app.post('/taches', function (req, res) {
  //res.send('[POST] /taches');
  console.log('POST')
  console.log(req.body)
  tache = req.body.tache;

  console.log(tache);
  let tags_tache = "";
  console.log(tache.tags_tache)
  tache["tags_tache"].forEach(element => {
    tags_tache = tags_tache + element + ',';
  });
  tache.tags_tache = tags_tache
  console.log(tache.tags_tache)
  db_request = "INSERT INTO DB_gestionnaireDeTaches(title, dateBegin, dateEnd, statut, tags) VALUES (?,?,?,?,?)"
  db_param = [tache.title, tache.dateBegin, tache.dateEnd, tache.statut, tache.tags_tache];
  db_run(db_request, db_param)
    .then(function(response){
      console.log(response)
      let buf = Buffer.from(JSON.stringify({'state' : '[SUCCESS] Insertion effectuée'}));
      return res.end(buf); 
    })
    .catch(function(response){
      console.log(response)
      let buf = Buffer.from(JSON.stringify({'state' : '[FAILURE] Echec de l\'insertion'}));
      return res.end(buf); 
    })
});

// Methode PUT
// TODO : tester si le tuple à modifier existe
app.put('/taches/:id', function (req, res) {
  //res.send('[PUT] /taches + id ' + req.params.id);
  tache = req.body.tache;
  tache.id  = parseInt(req.params.id);
  let tags = "";
  tache["tags"].forEach(element => {
    tags = tags + element + ',';
  });
  tache.tags = tags;
  db_request = "UPDATE DB_gestionnaireDeTaches SET title = (?), dateBegin = (?), dateEnd = (?), statut = (?), tags = (?) WHERE id = (?)"
  db_param = [tache.title, tache.dateBegin, tache.dateEnd, tache.statut, tache.tags, tache.id];
  db_run(db_request, db_param)
    .then(function(response){
      return res.send('[SUCCESS] Modification effectuée');
    })
    .catch(function(response){    
      return res.send('[FAILURE] Echec de la modification');
    })
});

// Methode DELETE
// TODO : tester si le tuple à modifier existe
app.delete('/taches/:id', function (req, res) {
  //res.send('[DELETE] /taches + id ' + req.params.id);
  db_request = "DELETE FROM DB_gestionnaireDeTaches WHERE id = ?"
  db_param = [parseInt(req.params.id)];
  db_run(db_request, db_param)
    .then(function(response){
      return res.send({ 'state' : 'SUCCESS] suppression effectuée'});
    })
    .catch(function(response){
      return res.send('[FAILURE] Echec de la suppression');
    })
});

// Fermer la connexion à la base de donnée
app.post('/db', function (req, res) {
  db_close(db);
});

//*-----------------*

function db_get(sql,params){
  return new Promise(function(resolve, reject){
    db.all(sql, params, function(err, result){
      if(err) reject(err)
      resolve(result);
    });
  });
};

function db_run(sql,params){
  return new Promise(function(resolve, reject){
    db.run(sql, params, function(err, result){
      if(err) reject(err)
      resolve(result);
    });
  });
};

function db_close(db){
  db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Close the database connection.'); 
  });
}