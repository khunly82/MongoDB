// récupérer la moyenne des scores sur 100 dans lesquels Tom Hanks a joué
db.movies.aggregate([
    { $match: { actors: /^tom hanks$/i } },
    { $group: {
        _id: 'Tom hanks',
        moyenne: { $avg: '$score' }
    } },
    { $project: { moyenne: { 
        $round: [
            { $multiply: ['$moyenne', 10] },
            2
        ]
    } } }
])

// recupérer tous les titres de films groupés par genre
db.movies.aggregate([
    { $unwind: '$genre' },
    { $group: {
      _id: '$genre',
      titles: { $push: '$title' }
    } }
])

// recupérer les 10 premiers titres de films groupés par genre
db.movies.aggregate([
    { $unwind: '$genre' },
    { $group: {
      _id: '$genre',
      titles: { $firstN: { input: '$title', n: 10 } }
    } }
])

// recupérer les 5 meilleures moyennes des scores des films groupés par acteur
db.movies.aggregate([
    { $unwind: '$actors' },
    { $group: {
        _id: '$actors',
        moyenne: { $avg: '$score' },
    } },
    { $sort: { moyenne: -1 } },
    { $limit: 5 },
])


// récupérer la moyenne des scores groupée par genre et par année
db.movies.aggregate([
    { $unwind: '$genre' },
    { $group: {
        _id: ['genre', '$year'],
        moyenne: { $avg: '$score' },
    } },
    { $sort: { _id: 1 } }
])


// récupérer par acteur le nombre nombre de films dans lesquels ils ont joué.
db.movies.aggregate([
    { $unwind: '$actors' },
    { $group: {
        _id: '$actors',
        count: { $count: {} },
    } },
    { $sort: { count: -1 } }
])

// récupérer par acteur l'ensemble des détails (genre, quantité) dans lesquels ils ont joué
// format souhaité: 
// [{ 
//    _id: john Doe, 
//    details : [ { genre: comedy, quantite: 2 }, { genre: Horror, quantite: 5 } , ... (autres détails) } ]
//  }, ... (autres acteurs)]
db.movies.aggregate([
    { $unwind: '$actors' },
    { $unwind: '$genre' },
    { $group: {
        _id: {a:'$actors', g:'$genre'},
        count: { $count: {} },
    } },
    { $sort: { _id: 1 } },
    { $group: {
        _id: '$_id.a',
        details: { $push: { 
            genre: '$_id.g', 
            quantite: '$count'
        } }
    } }
])

// récupérer les moyennes des films groupés par décenie ([1950-1959], [1960-1969], ... )
// indice : $bucket
db.movies.aggregate([
    { $bucket: {
        groupBy: '$year',
        boundaries: [1950, 1960, 1970,1980,1990,2000,2010,2020],
        output: {
            moyenne: { $avg: '$score' }
        },
        // default: 'before 1980'
    } }
])

db.movies.aggregate([
    { $addFields: {
        decenie: { $toString: { 
            $floor: { 
                $divide: ['$year', 10] } 
            } 
        }
    } },
    { $group: {
        _id: { $concat: [
            '[', 
            '$decenie', 
            '0 - ', 
            '$decenie', 
            '9]'
        ] } ,
        moyenne: { $avg: '$score' }
    } }
])

// récupérer pour chaque décenie, le titre des films qui ont eu le meilleur score et le titre des films qui ont le pire score 

// problème on ne recupére pas les égalités
db.movies.aggregate([
    { $bucket: {
        groupBy: '$year',
        boundaries: [1950, 1960, 1970,1980,1990,2000,2010,2020],
        output: {
            meilleur: { $top: { 
                output: '$title', sortBy: { score: -1 } 
            } },
            pire: { $bottom: { 
                output: '$title', sortBy: { score: -1 } 
            } },
        },
    } }
])

db.movies.aggregate([
    { $addFields: {
        decenie: { 
            $floor: { 
                $divide: ['$year', 10] } 
            } 
        }
    },
    { $setWindowFields: {
        partitionBy: '$decenie',
        output: {
            min: { $min: '$score' },
            max: { $max: '$score' },
        }
    } },
    { $group: {
        _id: '$decenie',
        pires: { $push: { $cond: [
            { $eq: ['$min', '$score'] },
            '$title',
            '$$REMOVE'
        ] } },
        meilleurs: { $push: { $cond: [
            { $eq: ['$max', '$score'] },
            '$title',
            '$$REMOVE'
        ] } }
    } }
])