const database = require('../class/database');
const taskDAO = require('../class/taskDAO');
const tagDAO = require('../class/tagDAO');
const bindingDAO = require('../class/bindingDAO');


module.exports = {
    
    return_database_object : async function () {
        console.log("[DAO] returning database_object")
        return database.build_db_connexion();
    },

    return_taskDAO : async function(db){
        console.log("[DAO] returning taskDAO")
        return taskDAO.build_taskDAO(db);
    },

    return_tagDAO : async function(db){
        console.log("[DAO] returning tagDAO")
        return tagDAO.build_tagDAO(db);
    },

    return_bindingDAO : async function(db){
        console.log("[DAO] returning bindingDAO")
        return bindingDAO.build_bindingDAO(db);
    }
}

