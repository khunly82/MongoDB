// récupérer 20 titres de films aléatoires
db.movies.aggregate([
    { $sample: { size: 20 } },
    { $project: {
      title: 1,
      _id: 0
    } }
])
// récupérer les 20 premiers films triés par ordre
// croissant sur leur titre
db.movies.aggregate([
    { $sort : { title: 1 } },
    { $limit: 20 }
])

// récupérer les 20 suivants
db.movies.aggregate([
    { $sort : { title: 1 } },
    { $skip: 20 },
    { $limit: 20 },
])


// récupérer toutes les propriétés des films en ajoutant leur score sur 100 
// dans lesquels Tom Hanks a joué, 
// triés par ordre décroissant sur leur score
db.movies.aggregate([
    { $match: {
      actors: /^tom hanks$/i
    } },
    { $sort: { score: -1 } },
    { $addFields: {
      score100: { $round: [{$multiply: ['$score', 10]}, 0] }
    } }
])