const express = require('express')
const app = express()
const bodyParser = require('body-parser');

const DAO = require('./class/dao');

const Task = require('./class/task')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ouverture du serveur en écoute sur le port 3000
app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});

// Methode GET
// TODO : tester si le tuple à modifier existe
app.get('/taches/id/:id', async function (req, res) {
  console.log('[GET] /taches/id/' + req.params.id);
  
  let state = {'state' : '[KO] GET ALL'}
  let buf = "";
  
  const db = await DAO.return_database_object()
  console.log(db);
  
  taskDAO = await DAO.return_taskDAO(db);
  console.log(taskDAO)
  
  let data = await taskDAO.getTaskById(parseInt(req.params.id));
  console.log(data)
  if(data !== undefined && data.length > 0){
    state = {'state' : '[OK] GET ALL'};
  }
  
  buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : data}));
  return res.end(buf);
});

// Methode GET : all
app.get('/taches', async function (req, res) {
  console.log('[GET] /taches all');
  
  let state = {'state' : '[KO] GET ALL'}
  let buf = "";
  
  const db = await DAO.return_database_object()
  console.log(db);
  
  taskDAO = await DAO.return_taskDAO(db);
  console.log(taskDAO)
  
  let data = await taskDAO.getAllTasks();
  console.log(data)
  
  if(data !== undefined && data.length > 0){
    state = {'state' : '[OK] GET ALL'};
  }
  
  buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : data}));
  db.db_close();
  
  return res.end(buf);
});

// Methode GET : state
app.get('/taches/state', async function (req, res) {
  console.log('[GET] /taches/state ');
  let state = {'state' : '[KO] GET ALL'}
  let buf = "";
  
  const db = await DAO.return_database_object()
  console.log(db);
  
  let taskDAO = await DAO.return_taskDAO(db);
  console.log(taskDAO)
  
  let data = await taskDAO.getUnfinishedUncanceledTasks();
  console.log(data)
  
  if(data !== undefined && data.length > 0){
    state = {'state' : '[OK] GET state'};
  }
  
  buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : data}));
  db.db_close();
  
  return res.end(buf);
});

// Methode GET : tag
app.get('/taches/tag/:tag', async function (req, res) {
  console.log('[GET] /taches/tag/' + req.params.tag);

  let state = {'state' : '[KO] GET TAG'}

  const db = await DAO.return_database_object()

  let tagDAO = await DAO.return_tagDAO(db);
  let id_tag = await tagDAO.getIdByTag(req.params.tag);
  if(id_tag[0] !== undefined && id_tag[0].id){
    id_tag = id_tag[0].id
    console.log(id_tag)
  } else {
    console.log("NO")
    state = {'state' : '[KO] GET TAG : tag inexistant'}
    buf = Buffer.from(JSON.stringify({'state' : state}));
    db.db_close();
    return res.end(buf);
  }
  

  
  // TODO : tester si le tag existe
  let bindingDAO = await DAO.return_bindingDAO(db);
  let tab_id_task = await bindingDAO.getRowsFromIdTag(id_tag);
  console.log(tab_id_task);


  let taskDAO = await DAO.return_taskDAO(db);
  let tmp;
  let data = [];
  for (let index = 0; index < tab_id_task.length; index++) {
    tmp = await taskDAO.getTaskById(tab_id_task[index].id_tache);
    data.push(tmp[0]);
  }
  console.log(data)

  buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : data}));
  db.db_close();

  return res.end(buf);
});

app.post('/taches', async function (req, res) {
  console.log('[POST] /taches');
  
  let state = {'state' : '[KO] POST '}
  let buf = "";
  
  var db = await DAO.return_database_object()
  
  let t = req.body.tache;
  if(!isCorrectDateFormat(t.dateBegin) || !isCorrectDateFormat(t.dateEnd)){
    const state = {'state' : '[KO] POST date invalide'}
    const buf = Buffer.from(JSON.stringify({'state' : state}));
    return res.end(buf);
  } else {
    t.dateBegin = reformat(t.dateBegin)
    t.dateEnd = reformat(t.dateEnd)
  }
  let task = new Task(t.title, t.dateBegin, t.dateEnd, t.statut, t.tags)
  
  // ajout de la tache dans la base de données
  let taskDAO = await DAO.return_taskDAO(db);
  let data = await taskDAO.postOneTask(task);
  if(data !== undefined && data.length > 0){
    state = {'state' : '[OK] POST ALL'};
    task.setId(data[0]);
  }
  
  // ajout des nouveaux tags dans la base de données
  let tagDAO = await DAO.return_tagDAO(db);
  let bindingDAO = await DAO.return_bindingDAO(db);
  let t_tag = tags_format(task.tags);
  let id_row_tag;
  for (let index = 0; index < t_tag.length; index++) {
    id_row_tag = await tagDAO.getIdByTag(t_tag[index]);
    // si id_row_tag == []
    if(id_row_tag.length == 0){
      id_row_tag = await tagDAO.postOneTag(t_tag[index])
      id_row_tag = [{id : id_row_tag[0]}]
    }
    console.log(task.id + '  ,  ' + id_row_tag[0].id)
    
    // association de la tache avec ses tags
    await bindingDAO.postOneRow(task.id, id_row_tag[0].id)
  }
  
  // la réponse est mise en format tableau
  buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : [task]}));
  db.db_close();
  
  return res.end(buf);
});


// Methode PUT
app.put('/taches', async function (req, res) {
  console.log('[PUT] /taches + id ' + req.body.tache.id);
  
  let state = {'state' : '[KO] PUT '}
  let buf = "";
  
  var db = await DAO.return_database_object()
  
  let t = req.body.tache;
  if(!isCorrectDateFormat(t.dateBegin) || !isCorrectDateFormat(t.dateEnd)){
    const state = {'state' : '[KO] POST date invalide'}
    const buf = Buffer.from(JSON.stringify({'state' : state}));
    return res.end(buf);
  } else {
    t.dateBegin = reformat(t.dateBegin)
    t.dateEnd = reformat(t.dateEnd)
  }
  let task = new Task(t.title, t.dateBegin, t.dateEnd, t.statut, t.tags)
  task.setId(req.body.tache.id);
  
  // modification de la tache dans la base de données
  let taskDAO = await DAO.return_taskDAO(db);
  let data = await taskDAO.updateOneTask(task);
  
  if(data !== undefined && data.length > 0){
    state = {'state' : '[OK] GET PUT'};
    let bindingDAO = await DAO.return_bindingDAO(db);
    let tagDAO = await DAO.return_tagDAO(db);
    
    bindingDAO.deleteRowsfromIdTask(task.id);
    let t_tag = tags_format(task.tags);
    let id_row_tag;
    for (let index = 0; index < t_tag.length; index++) {
      id_row_tag = await tagDAO.getIdByTag(t_tag[index]);
      // si id_row_tag == []
      if(id_row_tag.length == 0){
        id_row_tag = await tagDAO.postOneTag(t_tag[index])
        id_row_tag = [{id : id_row_tag[0]}]
      }
      
      // association de la tache avec ses tags
      await bindingDAO.postOneRow(task.id, id_row_tag[0].id)
    }
  }
  buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : [task]}));
  return res.end(buf); 
});

// Methode DELETE
app.delete('/taches/:id', async function (req, res) {
  console.log('[DELETE] /taches + id ' + req.params.id);
  
  let state = {'state' : '[KO] DELETE '}
  let buf = "";
  
  var db = await DAO.return_database_object();
  let taskDAO = await DAO.return_taskDAO(db);
  let bindingDAO = await DAO.return_bindingDAO(db);
  
  let number_of_row_deleted = await taskDAO.deleteRowsFromId(req.params.id);
  if(number_of_row_deleted !== undefined && number_of_row_deleted > 0){
    state = {'state' : '[OK] DELETE '}
    await bindingDAO.deleteOneRowfromIdTask(req.params.id)
  }
  
  buf = Buffer.from(JSON.stringify({'state' : state}));
  return res.end(buf); 
});

//*-----------------*



// function dbResponseIsNull(response){
//   const boo = false
//   if(JSON.stringify(response) == "[]"){
//     boo = true;
//   }
//   return boo
// }

function isCorrectDateFormat(date){
  let boo = false;
  const exploded = date.split('-');
  const d = parseInt(exploded[2]);
  const m = parseInt(exploded[1]);
  const y = parseInt(exploded[0]);
  
  if((d >= 1 && d <= 31) && (m >= 1 && m <= 12) && (y >= 0 && y <= 9999)){
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

function tags_format(tags){
  let exploded = tags.split(',')
  for (let index = 0; index < exploded.length; index++) {
    exploded[index] = exploded[index].trim();
  }
  exploded = Array.from(new Set(exploded));
  for (let index = 0; index < exploded.length; index++) {
    if(exploded[index].length == 0){exploded.splice(index,1);break}
  }
  return exploded;
}