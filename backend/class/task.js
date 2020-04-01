// Class tack correspondant aux tâches
class task{
    id;
    title;
    dateBegin;
    dateEnd;
    statut;
    tags;

    constructor(task_title, task_dateBegin, task__dateEnd, task_statut, task_tags){
        this.title = task_title;
        this.dateBegin =task_dateBegin;
        this.dateEnd = task__dateEnd;
        this.statut = task_statut;
        this.tags = task_tags;
    }

    // Permet de renseigner l'id de l'objet
    setId(task_id){
        if(typeof(task_id) == "number"){
            this.id = task_id.toString();
        } else {
            this.id = task_id;
        }
    }
}

module.exports = task;