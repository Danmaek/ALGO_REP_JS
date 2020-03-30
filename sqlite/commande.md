# DB
### Créer la base
```
CREATE TABLE "DB_gestionnaireDeTaches" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"title"	TEXT,
	"dateBegin"	TEXT NOT NULL,
	"dateEnd"	TEXT NOT NULL,
	"statut"	TEXT,
	"tags"	TEXT
)
```

### Tronquer la base
```
DELETE FROM DB_gestionnaireDeTaches;
```
