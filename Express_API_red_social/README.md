
Crear proyecto
```
npm init
name       : Express_api_red_social
descripcion: API REST con Node, Mongo, Express, JWT para una red social
licencia   : MIT

npm i express mongoose mongoose-pagination multer moment validator bcrypt jwt-simple cors 
npm i -D nodemon
```

Iniciar proyecto 
```
npm start
npm run debug
```

```mermaid
---
title: Entidades principales de la red social
---
classDiagram

    class USER{
        +_id
        +name
        +nick
        +password
        +role
        +image
        +created_at
    }

    class PUBLICATION{
        +_id
        +text
        +file
        +created_at
        +user
    }

    class FOLLOW{
        +_id
        +user
        +followed
        +created_at
    }

    USER <|-- PUBLICATION : user
    USER <|-- FOLLOW : user
    USER <|-- FOLLOW : followed
```
