// Class propre à la table DB_Taches
class taskDAO{
    db;

    constructor(db_){
        console.log("[DAO] create taskDAO");
        this.db = db_;
    }

    // De la même façon que pour la base de données, on ne crée pas directement l'objet.
    // On crée l'objet dans une fonction statique asynchrone faisant appel au constructeur 
    // et retournant l'objet. 
    static async build_taskDAO(db_){
        return new Promise((resolve,reject) => {
            try {
                resolve(new taskDAO(db_));
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }

    // Liste des requêtes vers la table DB_Tag

    // Retourne un tableau avec une tache unique.
    async getTaskById(id){
        console.log("in db : " + id  )
        let data;
        let params = [id];
        let request = "SELECT * FROM DB_Tache WHERE id = (?)";
        return data = await this.db.db_get(request, params);
    }

    // Retourne un tableau de tâches.
    async getAllTasks(){
        let data;
        let request = "SELECT * FROM DB_Tache";
        return data = await this.db.db_get(request);
    }

    // Retourne l'ensemble des tuples en fonction des paramètres précisés : "Non précisé", "Une tâche est requise", "En cours"
    async getUnfinishedUncanceledTasks(){
        let data;
        let params = ["Non précisé", "Une tâche est requise", "En cours"];
        let request = "SELECT * FROM DB_Tache WHERE statut = (?) OR statut = (?) OR statut = (?)";
        return data = await this.db.db_get(request, params);
    }

    // Retourne un tableau contenant l'ID de la ligne inséré dans la base de données.
    async postOneTask(task){
        let data;
        let params =  [task.title, task.dateBegin, task.dateEnd, task.statut, task.tags];
        let request = "INSERT INTO DB_Tache(title, dateBegin, dateEnd, statut, tags) VALUES (?,?,?,?,?)";
        // La requête à la base de données retourne un entier.
        // Par confort, on le place dans un tableau (la requête get renvoi un tableau, je fais la même chose ici).
        // On retourne ce tableau.
        return data = [await this.db.db_run(request, params)];
    }

    // Met à jour une tâche dans la base de données.
    async updateOneTask(task){
        let data;
        let params =  [task.title, task.dateBegin, task.dateEnd, task.statut, task.tags, task.id];
        let request = "UPDATE DB_Tache SET title = (?), dateBegin = (?), dateEnd = (?), statut = (?), tags = (?) WHERE id = (?)";
        return data = [await this.db.db_run(request, params)];
    }

    // Supprime une tâche.
    async deleteOneRowFromId(id){
        let data;
        let params =  [id];
        let request = "DELETE FROM DB_Tache WHERE id = (?)";
        return data = await this.db.db_delete(request, params);
    }

}

module.exports = taskDAO;