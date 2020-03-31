class taskDAO{
    db;

    constructor(db_){
        console.log("[DAO] create taskDAO")
        this.db = db_;
    }

    static async build_taskDAO(db_){
        return new Promise((resolve,reject) => {
            try {
                resolve(new taskDAO(db_));
            } catch (error) {
                console.log(error)
                reject(error);
            }
        });
    }

    // retourne un tableau avec une tache unique
    async getTaskById(id){
        console.log("in db : " + id  )
        let data;
        let params = [id]
        let request = "SELECT * FROM DB_Tache WHERE id = (?)";
        return data = await this.db.db_get(request, params);
    }

    // retourne un tableau de tache
    async getAllTasks(){
        let data;
        let request = "SELECT * FROM DB_Tache";
        return data = await this.db.db_get(request);
    }

    async getUnfinishedUncanceledTasks(){
        let data;
        let params = ["Non précisé", "Une tâche est requise", "En cours"]
        let request = "SELECT * FROM DB_Tache WHERE statut = (?) OR statut = (?) OR statut = (?)";
        return data = await this.db.db_get(request, params);
    }

    // retourne un tableau contenant l'ID de la ligne inséré dans la base de données
    async postOneTask(task){
        let data;
        let params =  [task.title, task.dateBegin, task.dateEnd, task.statut, task.tags]
        let request = "INSERT INTO DB_Tache(title, dateBegin, dateEnd, statut, tags) VALUES (?,?,?,?,?)";
        return data = [await this.db.db_run(request, params)];
    }

    async updateOneTask(task){
        let data;
        let params =  [task.title, task.dateBegin, task.dateEnd, task.statut, task.tags, task.id]
        let request = "UPDATE DB_Tache SET title = (?), dateBegin = (?), dateEnd = (?), statut = (?), tags = (?) WHERE id = (?)";
        return data = [await this.db.db_run(request, params)];
    }

    async deleteOneRowFromId(id){
        let data;
        let params =  [id]
        let request = "DELETE FROM DB_Tache WHERE id = (?)";
        return data = [await this.db.db_delete(request, params)];
    }

}

module.exports = taskDAO;