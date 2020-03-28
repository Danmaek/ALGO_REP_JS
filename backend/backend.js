
const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// importation du module sqlite en mode verbose
const sqlite3 = require('sqlite3').verbose();
// création de l'objet database, vérification par une fonction de callback
const db = create_db_connexion();

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
      console.log(response)
      let state = {'state' : '[OK] GET'};
      let buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : response}));
      return res.end(buf);
    })
    .catch(function(response){
      let state = {'state' : '[KO] GET'}
      let buf = Buffer.from(JSON.stringify({'state' : state}));
      return res.end(buf);
    })
});

// Methode GET : all
app.get('/taches', function (req, res) {
  console.log('[GET] /taches all ');
  db_request = "SELECT * FROM DB_gestionnaireDeTaches";
  db_get(db_request)
    .then(function(response){
      let state = {'state' : '[OK] GET ALL'}
      let buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : response}));
      return res.end(buf);
    })
    .catch(function(response){
      let state = {'state' : '[KO] GET ALL'}
      let buf = Buffer.from(JSON.stringify({'state' : state}));
      return res.end(buf);
    })
});


// Methode POST
app.post('/taches', function (req, res) {
  //res.send('[POST] /taches');
  tache = req.body.tache;
  db_request = "INSERT INTO DB_gestionnaireDeTaches(title, dateBegin, dateEnd, statut, tags) VALUES (?,?,?,?,?)"
  db_param = [tache.title, tache.dateBegin, tache.dateEnd, tache.statut, tache.tags];
  db_run(db_request, db_param)
    .then(function(response){
      //console.log(response);
      db_request = "SELECT * FROM DB_gestionnaireDeTaches ORDER BY id DESC LIMIT 1";
      return db_get(db_request);
    })
    .then(function(response){
      console.log(response);
      let state = {'state' : '[OK] POST'}
      let buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : response}));
      return res.end(buf);
    })
    .catch(function(response){
      let state = {'state' : '[KO] POST'}
      let buf = Buffer.from(JSON.stringify({'state' : state}));
      return res.end(buf); 
    })
});

// Methode PUT
// TODO : tester si le tuple à modifier existe
app.put('/taches', function (req, res) {
  //res.send('[PUT] /taches + id ' + req.params.id);
  tache = req.body.tache;
  db_request = "UPDATE DB_gestionnaireDeTaches SET title = (?), dateBegin = (?), dateEnd = (?), statut = (?), tags = (?) WHERE id = (?)"
  db_param = [tache.title, tache.dateBegin, tache.dateEnd, tache.statut, tache.tags, tache.id];
  db_run(db_request, db_param)
    .then(function(response){
      db_request = "SELECT * FROM DB_gestionnaireDeTaches WHERE id = (?)"
      db_param = tache.id
      return db_get(db_request, db_param);
    })
    .then(function(response){
      console.log(response);
      if(JSON.stringify(response) == "[]"){
        let state = {'state' : '[KO] PUT : no tuple for this id'}
        let buf = Buffer.from(JSON.stringify({'state' : state}));
        return res.end(buf); 
      }
      let state = {'state' : '[OK] PUT'}
      let buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : response}));
      return res.end(buf);
    })
    .catch(function(response){
      let state = {'state' : '[KO] PUT'}
      let buf = Buffer.from(JSON.stringify({'state' : state}));
      return res.end(buf); 
    })
});

// Methode DELETE
// TODO : tester si le tuple à modifier existe
app.delete('/taches/:id', function (req, res) {
  //res.send('[DELETE] /taches + id ' + req.params.id);

  db_request = "DELETE FROM DB_gestionnaireDeTaches WHERE id = (?)"
  console.log(req.params.id)
  db_param = [parseInt(req.params.id)];
  console.log(db_param)
  db_run(db_request, db_param)
    .then(function(response){
      let state = {'state' : '[OK] DELETE'}
      let buf = Buffer.from(JSON.stringify({'state' : state}));
      return res.end(buf);
    })
    .catch(function(response){
      let state = {'state' : '[KO] DELETE'}
      let buf = Buffer.from(JSON.stringify({'state' : state}));
      return res.end(buf); 
    })
});

// Fermer la connexion à la base de donnée
app.post('/db', function (req, res) {
  db_close(db);
});

//*-----------------*

function create_db_connexion(){
  const db = new sqlite3.Database('../sqlite/gestionnaireTache.db',(err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the gestionnaireTaches SQlite database.');
  });
  return db;
}

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