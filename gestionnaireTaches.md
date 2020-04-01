# TP Projet d'algo répartie

## Contrôleur

Le contrôleur est l'intégralité du service de traitement. Dans le projet, il s'agit du programme backend.
Spécification du contrôleur : 
```
RUN : localhost:3000
Endpoint unique : /taches
Communication : Vue , base de données
```

## Vue
Il s'agit du programme "utilisateur" permettant à l'utilisateur de visualiser ses données et de commander des traitements.
Spécification de la vue : 
```
RUN : localhost:3001
Communique avec : localhost:3000/taches
Communication : Contrôleur
```

## Base de données

__date Begin  et dateEnd__:	
Les dates sont au format de la  norme ISO8601, c'est-à-dire : YYYY-MM-DD HH:MM:SS.SSS 

## Description du protocole de communication 

### Récupérer un objet
On récupère l'objet ciblé par l'id rentré dans l'URL
```
URL : localhost:3000/taches/$id
METHOD : GET
BODY : pas de body
```

### Créer un objet 
```
URL : localhost:3000/taches
METHOD : POST
BODY :
{ 
    'tache' : {
        'id'        : 'tache_id',
        'title'     : 'tache_title',
        'dateBegin' : 'tache_dateBegin',
        'dateEnd'   : 'tache_dateEnd',
        'statut'    : 'tache_statut',
        'tags'      : [
            'tache_tags'
            ]
    }
}
```

### Modifier un objet
On modifie l'objet ciblé par l'id rentré dans l'URL
```
URL : localhost:3000/taches/$id
METHOD : PUT
BODY :
{ 
    'tache' : {
        'id'        : 'new_tache_id',
        'title'     : 'new_tache_title',
        'dateBegin' : 'new_tache_dateBegin',
        'dateEnd'   : 'new_tache_dateEnd',
        'statut'    : 'new_tache_statut',
        'tags'      : [
            'new_tache_tags'
            ]
        
    }
}
```

### Supprimer un objet
On supprime l'objet ciblé par l'id rentré dans l'URL
```
URL : localhost:3000/taches/$id
METHOD : DELETE
BODY : pas de body
```