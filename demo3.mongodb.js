db.movies.aggregate([
    //step 1,
    //step 2,
    //step 3,
    //...
])

db.movies.find({
    $expr: { $gt: [ {$size: '$actors' }, 5] }
})

db.movies.find({
    nbActors: { $gt: 5 }
}, { title: 1, nbActors: {$size: '$actors'} })

db.movies.find(
    {/* step 1 */}, 
    {/* step 5 */}
).sort( /* step 2 */)
.skip(/* step 3 */)
.limit(/* step 4*/)

db.movies.aggregate([
    { $match: {
      year: 1994
    } },
    { $project: { 
        title: 1, 
        nbActors: {$size: '$actors'},
        year: 1,
        score: 1
    }},
    { $match: {
        nbActors: { $gt: 5 }
    } },
    { $sort: {
        score: 1
    } },
    { $project: { score: 0 } }
])

// SELECT 
// *, LEN(actors) AS nbActors 
// FROM movies
db.movies.aggregate([
    { $addFields: { 
        nbActors: { $size : '$actors' },
    } }
])

// Random (échantillon alétoire)
db.movies.aggregate([
    { $sample: { size: 20 } },
    { $project: { title: 1 } }
])

// sortie
/*const temp = */db.movies.aggregate([
    { $match: { year: 2000 } },
    { $out: { 
        db: 'demo', coll: 'moviesOf2000' 
    } }
]).toArray()


// temp.filter(f => f.actors.length === 5)

// const echantillon = db.movies.aggregate([
//     { $sample: { size: 20 } },
//     { $project: { title: 1 } }
// ]).toArray()

// echantillon

// db.movies.aggregate([
//     { $match: { 
//         _id: { $nin: 
//             echantillon.map(m => m._id) 
//         } 
//     } },
//     { $sample: { size: 20 } },
//     { $project: { title: 1 } }
// ]).toArray()