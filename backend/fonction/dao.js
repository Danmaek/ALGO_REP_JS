const database = require('../class/database');
const taskDAO = require('../class/taskDAO');
const tagDAO = require('../class/tagDAO');
const bindingDAO = require('../class/bindingDAO');

// On ne définit que des fonction tampon permettant d'encapsuler la création d'objet DAO dans de l'asynchrone.
// Il est ensuite possible, dans le code contrôleur, de faire une attente (await) 
// sur ces fonctions (et donc le création de ressources).

module.exports = {
    
    return_database_object : async function () {
        console.log("[DAO] returning database_object");
        return database.build_db_connexion();
    },

    return_taskDAO : async function(db){
        console.log("[DAO] returning taskDAO");
        return taskDAO.build_taskDAO(db);
    },

    return_tagDAO : async function(db){
        console.log("[DAO] returning tagDAO");
        return tagDAO.build_tagDAO(db);
    },

    return_bindingDAO : async function(db){
        console.log("[DAO] returning bindingDAO");
        return bindingDAO.build_bindingDAO(db);
    }
}

