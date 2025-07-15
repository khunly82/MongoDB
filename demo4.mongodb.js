db.movies.aggregate([
    { $group: {
        // colonne(s) sur la/lesquelle on souhaite regrouper 
        _id: '$year',
        moyenne: { $avg: '$score' },
        nbFilms: { $count: {} },
        nbFilms2: { $sum: 1 },
        // titles: { $push: '$title' }
        titles: { 
            $topN: 
            { 
                output: '$title', 
                n: 10, 
                sortBy: { title: -1 } 
            } 
        }
    } },
    { $match: { moyenne: { $gt: 2 } } },
    { $sort: { _id : 1 } }
])


db.movies.aggregate([
    { $limit :1000 },
    { $addFields: { genres: '$genre' } },
    { $unwind: '$genre' },
    { $group: {
        _id: '$genre',
        count: { $count: {} },
        titles: { $push: { 
            title: '$title', genres: '$genres' 
        } }
    } }
])

db.movies.aggregate([
    { $group: {
        _id: ['$year','$rating'],
        films: { 
            $firstN: { 
                input: '$title', 
                n: 25 
            } 
        }
    } },
    { $sort: { _id: 1 } }
])


db.movies.aggregate([
    { $setWindowFields: {
      partitionBy: '$year',
      output: {
        moyenne: { $avg: '$score' },
        max: { $max: '$score' }
      }
    } },
    { $match: {
        $expr: { 
            $lt: ['$score', '$moyenne'] 
        }
    } }
])
