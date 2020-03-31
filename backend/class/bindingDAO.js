class bindingDAO{
    db;

    constructor(db_){
        console.log("[DAO] create bindingDAO")
        this.db = db_;
    }

    static async build_bindingDAO(db_){
        return new Promise((resolve,reject) => {
            try {
                resolve(new bindingDAO(db_));
            } catch (error) {
                console.log(error)
                reject(error);
            }
        });
    }

    async getRowsFromIdTag(id_tag){
        let data;
        let params = [id_tag];
        let request = "SELECT id_tache FROM Binding_Tache_Tag WHERE id_tag = (?)";
        return data = await this.db.db_get(request, params);
    }

    async postOneRow(id_task, id_tag){
        let data;
        let params =  [id_task, id_tag]
        let request = "INSERT INTO Binding_Tache_Tag(id_tache, id_tag) VALUES (?,?)";
        return data = [await this.db.db_run(request, params)];
    }

    async deleteRowsfromIdTask(id_task){
        let data;
        let params =  [id_task]
        let request = "DELETE FROM Binding_Tache_Tag WHERE id_tache = (?)";
        return data = [await this.db.db_run(request, params)];
    }
}

module.exports = bindingDAO;