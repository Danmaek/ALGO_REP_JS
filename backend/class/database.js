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

    
    // db_run(sql,params){
    //     return new Promise((resolve, reject) => {
    //         this.instance.run(sql, params, (err, result) => {
    //             if(err) reject(err)
    //             console.log("db_run : " +  this.lastID)
    //             resolve(result);
    //         });
    //     });
    // };

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
    
    // async db_run_tag(id_tache, tags){
    //     return new Promise(async (resolve, reject) => {
    //         console.log("*========================*")
    //         console.log(tags);
    //         let req_get_tag_id = "SELECT id FROM DB_Tag WHERE tag = (?)";
    //         let req_add_tag = "INSERT INTO DB_Tag(tag) VALUES (?)";
    //         let req_binding = "INSERT INTO Binding_Tache_Tag(id_tache, id_tag) VALUES (?),(?)";
    //         let req_result;
    //         for (let index = 0; index < tags.length; index++) {
    //             console.log("*------------ index = " + index + " -----------*")
                
                
    //         }
    //         resolve('ok')
    //     })
    // }
    
    // async db_get_tag(tags){
    //     for
    //     return new Promise((resolve, reject) => {
    //         this.instance.run(sql, params, (err, result) => {
    //             if(err) reject(err)
    //             resolve(result);
    //         });
    //     });
    // }
    
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