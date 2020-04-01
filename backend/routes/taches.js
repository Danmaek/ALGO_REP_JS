const express = require('express');
const router = express.Router();

const DAO = require('../fonction/dao');
const Task = require('../class/task')

const f = require('../fonction/fonction')

const bodyParser = require('body-parser');
router.use(bodyParser.json()); 
router.use(bodyParser.urlencoded({ extended: true }));

// Methode GET
router.get('/id/:id', async function (req, res) {
    console.log('[GET] /taches/id/' + req.params.id);
    
    let state = {'state' : '[KO] GET ' + req.params.id }
    let buf = "";
    
    const db = await DAO.return_database_object()
    console.log(db);
    
    taskDAO = await DAO.return_taskDAO(db);
    console.log(taskDAO)
    
    let data = await taskDAO.getTaskById(parseInt(req.params.id));
    console.log(data)

    if(data !== undefined && data.length == 0){
        state = {'state' : '[OK] GET : aucune tâche correspondante à l\'id'};
    } else if(data !== undefined && data.length > 0){
        state = {'state' : '[OK] GET tâche numéro ' + req.params.id};
    }
    
    buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : data}));
    return res.end(buf);
});

// Methode GET : all
router.get('/', async function (req, res) {
    console.log('[GET] /taches all');
    
    let state = {'state' : '[KO] GET ALL'}
    let buf = "";
    
    const db = await DAO.return_database_object()
    console.log(db);
    
    taskDAO = await DAO.return_taskDAO(db);
    console.log(taskDAO)
    
    let data = await taskDAO.getAllTasks();
    console.log(data)
    
    if(data !== undefined && data.length == 0){
        state = {'state' : '[OK] GET ALL : bdd vide'};
    } else if(data !== undefined && data.length > 0){
        state = {'state' : '[OK] GET ALL'};
    }
    
    buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : data}));
    db.db_close();
    
    return res.end(buf);
});

// Methode GET : state
router.get('/state', async function (req, res) {
    console.log('[GET] /taches/state ');
    let state = {'state' : '[KO] GET tâche'}
    let buf = "";
    
    const db = await DAO.return_database_object()
    console.log(db);
    
    let taskDAO = await DAO.return_taskDAO(db);
    console.log(taskDAO)
    
    let data = await taskDAO.getUnfinishedUncanceledTasks();
    console.log(data)
    
    if(data !== undefined && data.length == 0){
        state = {'state' : '[OK] GET state : pas de tâches !achevées ou !annulées'};
    } else if(data !== undefined && data.length > 0){
        state = {'state' : '[OK] GET state'};
    }
    
    buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : data}));
    db.db_close();
    
    return res.end(buf);
});

// Methode GET : tag
router.get('/tag/:tag', async function (req, res) {
    console.log('[GET] /taches/tag/' + req.params.tag);
    
    let state = {'state' : '[KO] GET TAG ' + req.params.tag}
    
    const db = await DAO.return_database_object()
    
    let tagDAO = await DAO.return_tagDAO(db);
    let id_tag = await tagDAO.getIdByTag(req.params.tag);
    if(id_tag[0] !== undefined && id_tag[0].id){
        id_tag = id_tag[0].id
        console.log(id_tag)
    } else {
        state = {'state' : '[KO] GET TAG : tag inexistant'}
        buf = Buffer.from(JSON.stringify({'state' : state}));
        db.db_close();
        return res.end(buf);
    }
    
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

    if(data !== undefined && data.length == 0){
        state = {'state' : '[OK] GET tag : pas de tâches correspondante au tag ' + req.params.tag};
    } else if(data !== undefined && data.length > 0){
        state = {'state' : '[OK] GET tag ' + req.params.tag};
    }
    
    buf = Buffer.from(JSON.stringify({'state' : state, 'req_response' : data}));
    db.db_close();
    
    return res.end(buf);
});

router.post('/', async function (req, res) {
    console.log('[POST] /taches');
    
    let state = {'state' : '[KO] POST '}
    let buf = "";
    
    var db = await DAO.return_database_object()
    
    let t = req.body.tache;
    if(!f.isCorrectDateFormat(t.dateBegin) || !f.isCorrectDateFormat(t.dateEnd)){
        state = {'state' : '[KO] POST date invalide'}
        buf = Buffer.from(JSON.stringify({'state' : state}));
        return res.end(buf);
    } else {
        t.dateBegin = f.reformat(t.dateBegin)
        t.dateEnd = f.reformat(t.dateEnd)
    }
    if(!f.isCorrectDates(t.dateBegin, t.dateEnd)){
        state = {'state' : '[KO] POST dateBegin "' + t.dateBegin + '" placée avant dateEnd "' + t.dateEnd + '"'}
        buf = Buffer.from(JSON.stringify({'state' : state}));
        return res.end(buf);
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
    let t_tag = f.tags_format(task.tags);
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
router.put('/', async function (req, res) {
    console.log('[PUT] /taches + id ' + req.body.tache.id);
    
    let state = {'state' : '[KO] PUT '+ req.body.tache.id}
    let buf = "";
    
    var db = await DAO.return_database_object()
    
    let t = req.body.tache;
    if(!f.isCorrectDateFormat(t.dateBegin) || !f.isCorrectDateFormat(t.dateEnd)){
        const state = {'state' : '[KO] PUT date invalide'}
        const buf = Buffer.from(JSON.stringify({'state' : state}));
        return res.end(buf);
    } else {
        t.dateBegin = f.reformat(t.dateBegin)
        t.dateEnd = f.reformat(t.dateEnd)
    }

    if(!f.isCorrectDates(t.dateBegin, t.dateEnd)){
        state = {'state' : '[KO] PUT dateBegin "' + t.dateBegin + '" placée avant dateEnd "' + t.dateEnd + '"'}
        buf = Buffer.from(JSON.stringify({'state' : state}));
        return res.end(buf);
    }

    let task = new Task(t.title, t.dateBegin, t.dateEnd, t.statut, t.tags)
    task.setId(req.body.tache.id);
    
    // modification de la tache dans la base de données
    let taskDAO = await DAO.return_taskDAO(db);
    let data = await taskDAO.updateOneTask(task);
    
    if(data !== undefined && data.length > 0){
        state = {'state' : '[OK] PUT ' + req.body.tache.id};
        let bindingDAO = await DAO.return_bindingDAO(db);
        let tagDAO = await DAO.return_tagDAO(db);
        
        bindingDAO.deleteRowsfromIdTask(task.id);
        let t_tag = f.tags_format(task.tags);
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
router.delete('/:id', async function (req, res) {
    console.log('[DELETE] /taches + id ' + req.params.id);
    
    let state = {'state' : '[KO] DELETE ' + req.params.id}
    let buf = "";
    
    var db = await DAO.return_database_object();
    let taskDAO = await DAO.return_taskDAO(db);
    let bindingDAO = await DAO.return_bindingDAO(db);
    
    let number_of_row_deleted = await taskDAO.deleteOneRowFromId(req.params.id);
    console.log(number_of_row_deleted)
    if(number_of_row_deleted !== undefined && number_of_row_deleted > 0){
        state = {'state' : '[OK] DELETE ' + req.params.id}
        await bindingDAO.deleteRowsfromIdTask(req.params.id)
    }
    
    buf = Buffer.from(JSON.stringify({'state' : state}));
    return res.end(buf); 
});

module.exports = router;