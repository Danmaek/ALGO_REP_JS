class tagDAO{
    db;

    constructor(db_){
        console.log("[DAO] create tagDAO")
        this.db = db_;
    }

    static async build_tagDAO(db_){
        return new Promise((resolve,reject) => {
            try {
                resolve(new tagDAO(db_));
            } catch (error) {
                console.log(error)
                reject(error);
            }
        });
    }

    async getIdByTag(tag){
        let data;
        let params = tag;
        let request = "SELECT id FROM DB_Tag WHERE tag = (?)";
        return data = await this.db.db_get(request, params);
    }

    async postOneTag(tag){
        let data;
        let params =  [tag]
        let request = "INSERT INTO DB_Tag(tag) VALUES (?)";
        return data = [await this.db.db_run(request, params)];
    }
}

module.exports = tagDAO;