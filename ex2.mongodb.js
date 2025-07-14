// récupérer les 10 premiers films triés par ordre décroissant
// sur le score
db.movies.find({}, {
    title: 1,
    score: 1
}).sort({ score: -1 }).limit(10)

// récupérer les 10 suivants
db.movies.find({}, {
    title: 1,
    score: 1
}).sort({ score: -1 }).limit(10).skip(10)

// récupérer le titre, le rating de tous les films 
// qui ont un rating égal à 3
const filtre = { rating: 3 };
const projection = { title: 1, rating: 1 };
db.movies.find(filtre, projection)

// récupérer le titre, l'année de tous les films qui sont sortis 
// dans les années 90 (de 1990 à 1999)
db.movies.find({
    year: { $gte: 1990, $lt: 2000 }
}, {
    title: 1,
    year: 1
})

// récupérer le titre tous les films d'horreur sortis après 2000
db.movies.find({
    year: { $gte: 2000 },
    genre: /^horror$/i
}, { title: 1 })

// récupérer le titre des films dans lesquels tom hanks a joué 
// triés par année
db.movies.find({ 
    actors: /^(tom|thomas) /i
}, {
    title: 1,
    year: 1,
    actors: 1
}).sort({ year: 1 }).toArray()


// récupérer le titre, le nombre d'acteurs 
// des films d'aventure sortis dans les années 2000 
// triés par rating
// indices: $size 
db.movies.find({
    year: { $gte: 2000, $lt: 2010 }
}, {
    title: 1,
    nbActors: { $size: '$actors' },
}).sort({ rating: 1 })

// récupérer le titre, les acteurs des films 
// dont le nombre d'acteurs = 5
// indices: $size 
db.movies.find({
    actors: { $size: 5 }
}, { title: 1, actors: 1 })

// récupérer le titre, les acteurs des films 
// dont le nombre d'acteurs > 5
// indices: $expr ou $where (déprécié)
db.movies.find({
    $expr: { $gt: [{ $size: '$actors' }, 5] }
}, { title: 1, actors: 1 })

// récupérer le nombre de films d'horreur ou de comédie
db.movies.find({
    $or: [ 
        { genre: /^horror$/i },
        { genre: /^comedy$/i },
    ]
}).count()

db.movies.countDocuments({
    genre: { $in: ['Horror', 'Comedy'] },
})

// récupérer le nombre films qui contiennent le mot "christmas"

db.movies.countDocuments({ title: /christmas/i })

// récupérer le titre, 
// les 5 premiers acteurs (triés par ordre croissant) 
// des films sortis dans les années 90 
// et dont le genre est "Horror" ou "Comedy"
// indices: $sortArray et $slice
db.movies.find({
    year: { $gte: 1990, $lt: 2000 },
    genre: { $in: [/^horror$/i, /^comedy$/i] }
}, {
    title: 1,
    actors: 1,
    // actorsS: { $sortArray: { input: '$actors', sortBy: 1 } },
    // actors5: { $slice: [ '$actors', 5 ] },
    actorsM:  { $sortArray: { 
        input: { $slice: [ '$actors', 5 ] }, 
        sortBy: 1 
    } },
    actorsM2: { $slice: [ 
        { $sortArray: { input: '$actors', sortBy: 1 } },
        5 
    ] },
})

// récupérer le titre, 
// le classement ("très bon" si le score est au dessus de 9, "bon si le score est entre 7 et 9", "moyen" si entre 5 et 7, "navet sinon")
// indices: $switch ou $cond
db.movies.find({}, {
    title: 1,
    classement: {
        $switch: {
            branches: [
                { case: { $gt:[ '$score', 9 ] }, then: 'tres bien' },
                { case: { $gt:[ '$score', 7 ] }, then: 'bien' },
                { case: { $gt:[ '$score', 5 ] }, then: 'moyen' },
            ], default: 'navet'
        }
    }
}).limit(10000).toArray()