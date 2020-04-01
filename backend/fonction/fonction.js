// Ensemble des fonctions utilisées par le contrôleur pour contrôler les données reçues.

// Vérifie les valeurs entré dans la date sont correctes.
function isCorrectDateFormat(date){
    let boo = false;
    const exploded = date.split('-');
    const d = parseInt(exploded[2]);
    const m = parseInt(exploded[1]);
    const y = parseInt(exploded[0]);
    
    if((d >= 1 && d <= 31) && (m >= 1 && m <= 12) && (y >= 0 && y <= 9999)){
        boo = true;
    }
    
    return boo;
}

// Prend un date envoyé depuis le frontend vers le back.
// Parse et rassemble la date dans le format voulu.
function reformat(date){
    const exploded = date.split('-');
    const d = exploded[2];
    const m = exploded[1];
    const y = exploded[0];
    let s_date = d + "/" + m + "/" + y;
    
    return s_date;
}

// Prend en paramètre une chaîne de caractère, la segmente en fonction du caractère ',' et renvoie un tableau de tag.
function tags_format(tags){
    let exploded = tags.split(',');
    for (let index = 0; index < exploded.length; index++) {
        exploded[index] = exploded[index].trim();
    }
    exploded = Array.from(new Set(exploded));
    for (let index = 0; index < exploded.length; index++) {
        if(exploded[index].length == 0){exploded.splice(index,1);break}
    }
    
    return exploded;
}

// Prend en paramètre dateBegin et dateEnd et vérifie que dateEnd est après dateBegin.
function isCorrectDates(date1, date2){
    let boo = true;
    exp_date1 = date1.split('/');
    exp_date2 = date2.split('/');
    if(exp_date1[2] > exp_date2[2]){
        boo = false;
    } else if(exp_date1[1] > exp_date2[1]){
        boo = false;
    } else if(exp_date1[0] > exp_date2[0]){
        boo = false;
    }
    return boo;
}

// Export des fonctions pour en bénéficier dans l'ensemble du programme.
module.exports = {isCorrectDateFormat, reformat, tags_format, isCorrectDates}