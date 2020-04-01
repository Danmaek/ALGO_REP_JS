// importation du module sqlite en mode verbose
const sqlite3 = require('sqlite3').verbose();

class Database{
    
    instance;
    
    // À ne pas appeler directement
    constructor(db){
        // création de l'objet database, vérification par une fonction de callback
        if (typeof db === 'undefined') {
            throw new Error('Cannot be called directly');
        } else {
            console.log("[DB] bdd is opening");
            this.instance = db;
        }
    }
    
    // Méthode static permettant de créer l'objet database sans passer par un constructeur.
    // Cette technique permet d'éviter les actions asynchrones dans le constructeur.
    static async build_db_connexion(){
        return new Promise((resolve,reject) => {
            const db = new sqlite3.Database('../sqlite/gestionnaireTache.db',(err) => {
                if (err) {
                    reject(err.message);
                }else{
                    resolve( new Database(db));
                }
            });
        });
    }
    
    // Encapsulation de la requête get dans une promesse (asynchrone)
    db_get(sql,params){
        return new Promise((resolve, reject) => {
            this.instance.all(sql, params, (err, result) => {
                if(err) reject(err);
                resolve(result);
            });
        });
    };

    // Encapsulation de la query dans une promesse (asynchrone)
    // Résoud l'id de la dernière insertion effectué sous forme d'integer
    db_run(sql,params){
        return new Promise((resolve, reject) => {
            this.instance.run(sql, params, function (err) {
                if(err) reject(err.message);
                resolve(this.lastID);
            });
        });
    };

    // Encapsulation de la query dans une promesse (asynchrone)
    // Résoud le nombre de tuple supprimé
    db_delete(sql,params){
        return new Promise((resolve, reject) => {
            this.instance.run(sql, params, function (err) {
                if(err) reject(err.message);
                resolve(this.changes);
            });
        });
    };

    // Ferme le connecteur de la base de données
    db_close(){
        this.instance.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log("[DB] bdd is closing") ;
        });
    }
    
}

// Export de la class à l'ensemble du code.
module.exports = Database;