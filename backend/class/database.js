// importation du module sqlite en mode verbose
const sqlite3 = require('sqlite3').verbose();

class Database{
    
    instance;
    
    // à ne pas appeler directement
    constructor(db){
        // création de l'objet database, vérification par une fonction de callback
        if (typeof db === 'undefined') {
            throw new Error('Cannot be called directly');
        } else {
            console.log("[DB] bdd is open")
            this.instance = db;
        }
    }
    
    static async build_db_connexion(){
        return new Promise((resolve,reject) => {
            const db = new sqlite3.Database('../sqlite/gestionnaireTache.db',(err) => {
                if (err) {
                    reject(err.message);
                }else{
                    resolve( new Database(db))
                }
            });
        });
    }
    
    db_get(sql,params){
        return new Promise((resolve, reject) => {
            this.instance.all(sql, params, (err, result) => {
                if(err) reject(err)
                resolve(result);
            });
        });
    };

    // résoud l'id de la dernière insertion effectué sous forme d'integer
    db_run(sql,params){
        return new Promise((resolve, reject) => {
            this.instance.run(sql, params, function (err) {
                if(err) reject(err.message)
                resolve(this.lastID);
            });
        });
    };

    db_delete(sql,params){
        return new Promise((resolve, reject) => {
            this.instance.run(sql, params, function (err) {
                if(err) reject(err.message)
                resolve(this.changes);
            });
        });
    };

    db_close(){
        this.instance.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log("[DB] bdd is close") 
        });
    }
    
}

module.exports = Database;