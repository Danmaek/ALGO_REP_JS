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

  let tache = {};
  let db_request = "";
  let db_param = "";

  var db = await foo()
  console.log(db)

  console.log('[GET] /taches + id ' + req.params.id);
  tache['id'] = parseInt(req.params.id);
  db_request = "SELECT * FROM DB_gestionnaireDeTaches WHERE id = ?";
  db_param = tache.id;
  
  db.db_get(db_request, db_param)
  .then(function(response){
    console.log(response)
    const state = {'state' : '[OK] GET'};
    const buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : response}));
    return res.end(buf);
  })
  .catch(function(response){
    console.log(response)
    const state = {'state' : '[KO] GET'}
    const buf = Buffer.from(JSON.stringify({'state' : state}));
    return res.end(buf);
  })
});

async function foo () {
  return database.build_db_connexion();
}

// // Methode GET : all
// app.get('/taches', function (req, res) {
//   let tache = {};
//   let db_request = "";
//   let db_param = "";
//   console.log('[GET] /taches all ');
//   db_request = "SELECT * FROM DB_gestionnaireDeTaches";
//   db_get(db_request)
//     .then(function(response){
//       const state = {'state' : '[OK] GET ALL'}
//       const buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : response}));
//       return res.end(buf);
//     })
//     .catch(function(response){
//       const state = {'state' : '[KO] GET ALL'}
//       const buf = Buffer.from(JSON.stringify({'state' : state}));
//       return res.end(buf);
//     })
// });


// // Methode POST
// app.post('/taches', function (req, res) {
//   let tache = {};
//   let db_request = "";
//   let db_param = "";
//   console.log('[POST] /taches');
//   tache = req.body.tache;

//   if(!isCorrectDateFormat(tache.dateBegin) || !isCorrectDateFormat(tache.dateEnd)){
//     const state = {'state' : '[KO] POST date invalide'}
//     const buf = Buffer.from(JSON.stringify({'state' : state}));
//     return res.end(buf);
//   }

//   db_request = "INSERT INTO DB_gestionnaireDeTaches(title, dateBegin, dateEnd, statut, tags) VALUES (?,?,?,?,?)"
//   db_param = [tache.title, tache.dateBegin, tache.dateEnd, tache.statut, tache.tags];
//   db_run(db_request, db_param)
//     .then(function(response){
//       //console.log(response);
//       db_request = "SELECT * FROM DB_gestionnaireDeTaches ORDER BY id DESC LIMIT 1";
//       return db_get(db_request);
//     })
//     .then(function(response){
//       const state = {'state' : '[OK] POST'}
//       const buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : response}));
//       return res.end(buf);
//     })
//     .catch(function(response){
//       const state = {'state' : '[KO] POST'}
//       const buf = Buffer.from(JSON.stringify({'state' : state}));
//       return res.end(buf); 
//     })
// });

// // Methode PUT
// // TODO : tester si le tuple à modifier existe
// app.put('/taches', function (req, res) {
//   let tache = {};
//   let db_request = "";
//   let db_param = "";
//   console.log('[PUT] /taches + id ' + req.body.tache.id);
//   tache = req.body.tache;

//   if(!isCorrectDateFormat(tache.dateBegin) || !isCorrectDateFormat(tache.dateEnd)){
//     const state = {'state' : '[KO] POST date invalide'}
//     const buf = Buffer.from(JSON.stringify({'state' : state}));
//     return res.end(buf);
//   }

//   db_request = "UPDATE DB_gestionnaireDeTaches SET title = (?), dateBegin = (?), dateEnd = (?), statut = (?), tags = (?) WHERE id = (?)"
//   db_param = [tache.title, tache.dateBegin, tache.dateEnd, tache.statut, tache.tags, tache.id];
//   db_run(db_request, db_param)
//     .then(function(response){
//       db_request = "SELECT * FROM DB_gestionnaireDeTaches WHERE id = (?)"
//       db_param = tache.id
//       return db_get(db_request, db_param);
//     })
//     .then(function(response){
//       if(dbResponseIsNull(response) == true){
//         const state = {'state' : '[KO] PUT : no tuple for this id'}
//         const buf = Buffer.from(JSON.stringify({'state' : state}));
//         return res.end(buf); 
//       }
//       const state = {'state' : '[OK] PUT'}
//       const buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : response}));
//       return res.end(buf);
//     })
//     .catch(function(response){
//       const state = {'state' : '[KO] PUT'}
//       const buf = Buffer.from(JSON.stringify({'state' : state}));
//       return res.end(buf); 
//     })
// });

// // Methode DELETE
// // TODO : tester si le tuple à modifier existe
// app.delete('/taches/:id', function (req, res) {
//   let tache = {};
//   let db_request = "";
//   let db_param = "";
//   console.log('[DELETE] /taches + id ' + req.params.id);
//   db_request = "DELETE FROM DB_gestionnaireDeTaches WHERE id = (?)"
//   db_param = [parseInt(req.params.id)];
//   db_run(db_request, db_param)
//     .then(function(response){
//       const state = {'state' : '[OK] DELETE'}
//       const buf = Buffer.from(JSON.stringify({'state' : state}));
//       return res.end(buf);
//     })
//     .catch(function(response){
//       const state = {'state' : '[KO] DELETE'}
//       const buf = Buffer.from(JSON.stringify({'state' : state}));
//       return res.end(buf); 
//     })
// });

// // Fermer la connexion à la base de donnée
// app.post('/db', function (req, res) {
//   db_close(db);
// });

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

  const exploded = date.split('/');
  const d = exploded[0];
  const m = exploded[1];
  const y = exploded[2];
  
  if((d >= 1 && d <= 31) && (m >= 1 && m <= 12) && (y >= 0 && y <= 9999)){
    boo = true;
  }

  return boo;
}
