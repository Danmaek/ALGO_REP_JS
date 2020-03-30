// importation du module sqlite en mode verbose
const sqlite3 = require('sqlite3').verbose();

class Database{

    instance;

    // à ne pas appeler
    constructor(db){
        // création de l'objet database, vérification par une fonction de callback
        if (typeof db === 'undefined') {
            throw new Error('Cannot be called directly');
        } else {
            console.log("[DB] ouverture bdd")
            this.instance = db;
        }
    }
 
//create_db_connexion(){
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
    
    // TODO : mise à niveau fléché / this.instance
    db_run(sql,params){
        return new Promise((resolve, reject) => {
            this.instance.run(sql, params, (err, result) => {
                if(err) reject(err)
                resolve(result);
            });
        });
    };
    
    db_close(){
        
        this.instance.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log("[DB] fermeture dbb") 
        });
    }
}

module.exports = Database;