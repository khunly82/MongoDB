// SELECT * FROM movies
db.movies.find()
// SELECT * FROM movies LIMIT 1
db.movies.findOne()
// SELECT * FROM movies ... GROUP HAVING JOIN (sera vu le 2eme jour) 
db.movies.aggregate([ /* ensemble des opérations */ ])


// SELECT title, year FROM movies
db.movies.find({ /* filtres */ }, { 
    /* projection */
    title: 1,
    year: 1,
    _id: 0
})

// SELECT *, sauf title FROM movies
db.movies.find({}, {
    title: 0
})

// on ne peut pas mélanger des true et des false dans une projection
db.movies.find({}, {
    title: 0,
    year: 1
})

// colonne calculée
db.movies.find({}, {
    title: 1,
    score: 1,
    actors: 1,
    score100: { $multiply: ['$score', 10] },
    nbActors: { $size: ['$actors'] }
})

// SELECT title, year FROM movies WHERE year = 1994
db.movies.find({
    // est égal à
    // year: { $eq: 1994 }
    // idem
    // year: 1994,
    // title: /forrest gump/i, // contient
    // title: /^forrest/i // commence par
    // title: /!$/i // se termine par
    // score : { $lt: 2 } // plus petit
    // year: { $ne: 1994 }
    // year: { $gt: 1990, $lte: 2000 }, // entre
    // year: { $in: [1990, 2000, 2010] }
    // $or: [
    //     { year: 1994 },
    //     { title: /^a/i },
    //     { $and: [
    //         { $or: [{}, {}] },
    //         { year: { $gt: 1988 } }
    //     ] }
    // ]
    //(? || ? || ? ((? || ?) && ?  ))
    // genre: ['Action', 'Adventure']
    $or: [
        { genre: 'Action' },
        { genre: 'Adventure' },
    ]
}, { title: 1, year: 1, genre: 1 })
.sort({ year: -1, score: 1 })
.skip(0)
.limit(100)
.toArray()
// le tri sera toujours executé avant skip et avan limit

db.movies.find({ year: { $in: [1990, 2000, 2010] } }).count()


db.movies.find({
    /*  filtres <=> where */
}, {
    /* projection <=> select */
})

db.movies.find({
    year: { $gt: 2000 }
}, {
    title: 1,
    year: 1
}).sort({
    year: 1
}).skip(10)
.limit(10)

