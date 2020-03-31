# DB

### Créer la base

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

```
CREATE TABLE "Binding_Tache_Tag" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"id_tache"	INTEGER,
	"id_tag"	INTEGER
);
```

```
CREATE TABLE "DB_Tag" (
	"id"	INTEGER NOT NULL UNIQUE,
	"tag"	INTEGER NOT NULL UNIQUE,
	PRIMARY KEY("id","tag")
);
```

### Tronquer la base
```
DELETE FROM DB_gestionnaireDeTaches;
```
