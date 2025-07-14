// créer une collection
// CREATE TABLE Personne()
db.createCollection('personne');

// changer de database 
use('demo2');
db.createCollection('personne');

// supprimer une collection
use('demo2');
db.personne.drop();

// inserer un document
db.personne.insertOne({
    prenom: 'Khun',
    nom: 'Ly',
    // iso 8601
    dateDeNaissance: '1982-05-06',
    adresse: {
        rue: 'Rue des chouettes',
        numero: '42',
        cp: 5000,
        ville: 'Namur'
    } 
});

db.personne.insertOne({
    name: 'Person',
    firstName: 'Michael'
})

const personSchema = {
    "type": "object",
    "required": ["nom", "prenom", "dateNaissance", "ssn", "titre"],
    "properties": {
        "nom": { "type": "string", "minLength": 2, "maxLength": 255 },
        "prenom": { "type": "string", "minLength": 2, "maxLength": 255 },
        "dateNaissance": { "bsonType": "date" },
        "email": { "type": "string" },
        "ssn": { "type": "string", "pattern": "^[0-9]{2}\\.[0-9]{2}\\.[0-9]{2}-[0-9]{3}\\.[0-9]{2}$" },
        "adresse": {
            "type": "object",
            "required": ["rue", "numero"],
            "properties": {
                "rue": { "type": "string" },
                "numero": { "bsonType": "int" },
                "codePostal": { "type": "string", "pattern": "^[1-9]\\d{3}$" },
                "ville": { "type": "string" }
            }
        },
        "titre": { "enum": ["Mr", "Mme", "Melle"] }   
    }
}

// créer une collection avec un schema
// db.createCollection('personne', {
//     validator: {
//         $jsonSchema: personSchema
//     }
// })

// modifier une collection existente avec un schema
db.runCommand({
    collMod: 'personne',
    validator: {
        $jsonSchema: personSchema
    }
})

db.personne.insertOne({
    nom: 'Lennon',
    prenom: 'John',
    titre: 'Mr',
    dateNaissance: new Date('1970-06-13'),
    ssn: '70.06.13-555.13'
})


const productSchema = {
    "type": "object",
    "required": ["nom", "reference", "prix", "categorie", "tags", "commentaires"],
    "properties": {
        "nom" : { "type": "string", "minLength":3, "maxLength": 100 },
        "prix": { "type": "number", "minimum": 0, "exclusiveMinimum": true, "maximum": 9999, "multipleOf": 0.01 },
        "reference" : { "type": "string", "pattern": "^\\d{10}$" },
        "categorie" : { "enum": ["Boisson", "Viande", "Legumes"] },
        "tags" : { "type": "array", "items": { "type": "string" }, "uniqueItems": true, "maxItems": 10 },
        "commentaires": { "type": "array", "items": { 
            "type": "object",
            "required": ["auteur", "date", "message"],
            "properties": {
                "auteur": { "type": "string" },
                "message": { "type": "string" },
                "date": { "bsonType": "date" }
            } 
        } }
    }
}

db.createCollection('product', {
    validator: { $jsonSchema: productSchema }
})

db.product.insertOne({
    "nom": "Coca",
    "prix": 1.20,
    "reference": "1234567896",
    "categorie": "Boisson",
    "tags": ["Soda", "Sucre", "Caféine"],
    "commentaires": [
        { "auteur": "Khun LY", "date": new Date("1982-01-01"), "message": "TROP de sucre" },
        { "auteur": "M Jordan", "date": new Date("1982-01-02"), "message": "Le coca c'est la vie" },
    ]
})

// création d'index unique 
db.product.createIndex({ "reference": 1 }, { unique: true })