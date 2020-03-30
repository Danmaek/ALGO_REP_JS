const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const database = require('./class/database');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// Ouverture du serveur en écoute sur le port 3000
app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});

// Methode GET
// TODO : tester si le tuple à modifier existe

app.get('/taches/:id', async function (req, res) {
  console.log('[GET] /taches + id ' + req.params.id);

  let tache = {};
  let db_request = "";
  let db_param = "";
  var db = await return_database_object()

  tache['id'] = parseInt(req.params.id);
  db_request = "SELECT * FROM DB_gestionnaireDeTaches WHERE id = ?";
  db_param = tache.id;
  
  db.db_get(db_request, db_param)
  .then(function(response){
    db.db_close();
    console.log(response)
    const state = {'state' : '[OK] GET'};
    const buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : response}));
    return res.end(buf);
  })
  .catch(function(response){
    db.db_close();
    console.log(response)
    const state = {'state' : '[KO] GET'}
    const buf = Buffer.from(JSON.stringify({'state' : state}));
    return res.end(buf);
  })

  
});

async function return_database_object() {
  return database.build_db_connexion();
}

// Methode GET : all
app.get('/taches', async function (req, res) {
  console.log('[GET] /taches all ');

  let tache = {};
  let db_request = "";
  let db_param = "";
  var db = await return_database_object()

  db_request = "SELECT * FROM DB_gestionnaireDeTaches";
  db.db_get(db_request)
    .then(function(response){
      db.db_close();
      const state = {'state' : '[OK] GET ALL'}
      const buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : response}));
      return res.end(buf);
    })
    .catch(function(response){
      db.db_close();
      const state = {'state' : '[KO] GET ALL'}
      const buf = Buffer.from(JSON.stringify({'state' : state}));
      return res.end(buf);
    })
});

// Methode POST
app.post('/taches', async function (req, res) {
  console.log('[POST] /taches');

  let tache = req.body.tache;
  let db_request = "";
  let db_param = "";
  var db = await return_database_object()

  console.log(tache.dateBegin)

  if(!isCorrectDateFormat(tache.dateBegin) || !isCorrectDateFormat(tache.dateEnd)){

    console.log(tache.dateBegin)
    const state = {'state' : '[KO] POST date invalide'}
    const buf = Buffer.from(JSON.stringify({'state' : state}));
    return res.end(buf);
  } else {
    tache.dateBegin = reformat(tache.dateBegin)
    tache.dateEnd = reformat(tache.dateEnd)
  }

  db_request = "INSERT INTO DB_gestionnaireDeTaches(title, dateBegin, dateEnd, statut, tags) VALUES (?,?,?,?,?)"
  db_param = [tache.title, tache.dateBegin, tache.dateEnd, tache.statut, tache.tags];
  db.db_run(db_request, db_param)
    .then(function(response){
      //console.log(response);
      db_request = "SELECT * FROM DB_gestionnaireDeTaches ORDER BY id DESC LIMIT 1";
      return db.db_get(db_request);
    })
    .then(function(response){
      db.db_close();
      const state = {'state' : '[OK] POST'}
      const buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : response}));
      return res.end(buf);
    })
    .catch(function(response){
      db.db_close();
      const state = {'state' : '[KO] POST'}
      const buf = Buffer.from(JSON.stringify({'state' : state}));
      return res.end(buf); 
    })
});

// Methode PUT
// TODO : tester si le tuple à modifier existe
app.put('/taches', async function (req, res) {
  console.log('[PUT] /taches + id ' + req.body.tache.id);

  let tache = req.body.tache;
  let db_request = "";
  let db_param = "";
  var db = await return_database_object();

  if(!isCorrectDateFormat(tache.dateBegin) || !isCorrectDateFormat(tache.dateEnd)){
    const state = {'state' : '[KO] POST date invalide'}
    const buf = Buffer.from(JSON.stringify({'state' : state}));
    return res.end(buf);
  } else {
    tache.dateBegin = reformat(tache.dateBegin)
    tache.dateEnd = reformat(tache.dateEnd)
  }

  db_request = "UPDATE DB_gestionnaireDeTaches SET title = (?), dateBegin = (?), dateEnd = (?), statut = (?), tags = (?) WHERE id = (?)"
  db_param = [tache.title, tache.dateBegin, tache.dateEnd, tache.statut, tache.tags, tache.id];
  db.db_run(db_request, db_param)
    .then(function(response){
      db_request = "SELECT * FROM DB_gestionnaireDeTaches WHERE id = (?)"
      db_param = tache.id
      return db.db_get(db_request, db_param);
    })
    .then(function(response){
      db.db_close();
      if(dbResponseIsNull(response) == true){
        const state = {'state' : '[KO] PUT : no tuple for this id'}
        const buf = Buffer.from(JSON.stringify({'state' : state}));
        return res.end(buf); 
      }
      const state = {'state' : '[OK] PUT'}
      const buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : response}));
      return res.end(buf);
    })
    .catch(function(response){
      db.db_close();
      const state = {'state' : '[KO] PUT'}
      const buf = Buffer.from(JSON.stringify({'state' : state}));
      return res.end(buf); 
    })
});

// Methode DELETE
// TODO : tester si le tuple à modifier existe
app.delete('/taches/:id', async function (req, res) {
  console.log('[DELETE] /taches + id ' + req.params.id);

  let tache = {};
  let db_request = "";
  let db_param = "";
  var db = await return_database_object();

  db_request = "DELETE FROM DB_gestionnaireDeTaches WHERE id = (?)"
  db_param = [parseInt(req.params.id)];
  db.db_run(db_request, db_param)
    .then(function(response){
      db.db_close();
      const state = {'state' : '[OK] DELETE'}
      const buf = Buffer.from(JSON.stringify({'state' : state}));
      return res.end(buf);
    })
    .catch(function(response){
      db.db_close();
      const state = {'state' : '[KO] DELETE'}
      const buf = Buffer.from(JSON.stringify({'state' : state}));
      return res.end(buf); 
    })
});

//*-----------------*

function dbResponseIsNull(response){
  const boo = false
  if(JSON.stringify(response) == "[]"){
    boo = true;
  }
  return boo
}

function isCorrectDateFormat(date){
  let boo = false;
  const exploded = date.split('-');
  const d = parseInt(exploded[2]);
  const m = parseInt(exploded[1]);
  const y = parseInt(exploded[0]);
  
  if((d >= 1 && d <= 31) && (m >= 1 && m <= 12) && (y >= 0 && y <= 9999)){
    console.log("hiehteihteitheiht")
    boo = true;
  }

  return boo;
}

function reformat(date){
  const exploded = date.split('-');
  const d = exploded[2];
  const m = exploded[1];
  const y = exploded[0];
  let s_date = d + "/" + m + "/" + y;

  return s_date;
}