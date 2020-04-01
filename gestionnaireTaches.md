# TP/Projet d'algorithmie répartie

L'objetif de ce projet est la création d'un gestionnaire de tâches via l'implémentation REST sous l'architecture SOA.

__REST__ : representational state transfer

__SOA__ : service oriented architecture

## Backend

Le contrôleur est l'intégralité du service de traitement. Dans le projet, il s'agit du programme backend.
Spécification du contrôleur : 
```
RUN : localhost:3000
Endpoint : /taches
Communication : Vue , base de données
Lancement : node /backend/backend.js
```
Il regroupe les modèles dans des classes et implémente le pattern DAO, simplifiant l'accès à la base de données.
Il permet également le contrôle des données via un contrôleur (module express qui redirige les requêtes vers leur zone de traitement).
Mon objectif concernant l'accès à la base de données à été de permettre une utilisation asynchrone gérant la possibilité de plusieurs connexions simultané au service (et donc plusieurs connexions à la base de données).

## Frontend

Il s'agit du programme "utilisateur" permettant à l'utilisateur de visualiser ses données et de commander des traitements.
Spécification de la vue : 
```
RUN : localhost:3001
Communique avec : localhost:3000/taches
Communication : Contrôleur
Lancement : node /backend/backend.js
```

Il s'agit de la vue. Elle permet d'afficher les données et de passer des requêtes graphiquement (User Interface).

## Description du protocole de communication 

### Récupérer un objet
On récupère l'objet ciblé par l'id rentré dans l'URL
```
URL : localhost:3000/taches/$id
METHOD : GET
BODY : pas de body
```
### Récupérer l'ensemble des objets
```
URL : localhost:3000/taches
METHOD : GET
BODY : pas de body
```

### Récupérer les objets !achevées, !annulées
```
URL : localhost:3000/taches/state
METHOD : GET
BODY : pas de body
```

### Récupérer un objet en fonction de son tag
```
URL : localhost:3000/taches/:tag
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
        'title'     : 'tache_title',
        'dateBegin' : 'tache_dateBegin',
        'dateEnd'   : 'tache_dateEnd',
        'statut'    : 'tache_statut',
        'tags'      : 'tache_tags'
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
        'tags'      : 'new_tache_tags'
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

## Base de données

### Créer la base de données

Tout est déjà fait dans la base de données SQLite.

#### Table DB_Tache
```
CREATE TABLE "DB_Tache" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"title"	TEXT,
	"dateBegin"	TEXT NOT NULL,
	"dateEnd"	TEXT NOT NULL,
	"statut"	TEXT,
	"tags"	TEXT
);
```

#### Table DB_Tag
```
CREATE TABLE "DB_Tag" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"tag"	TEXT UNIQUE
);
```

#### Table Binding_Tache_Tag
```
CREATE TABLE "Binding_Tache_Tag" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"id_tache"	INTEGER,
	"id_tag"	INTEGER
);
```

