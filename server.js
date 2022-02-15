const { request } = require('express');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();

app.use(express.json());
app.set('port', 3000)

app.use(function(req, res, next) {
    console.log("In comes a " + req.method + " request to " + req.url);
    next();
})
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

let db;

MongoClient.connect('mongodb+srv://Hadassah:Hadassah2001@cluster0.exxms.mongodb.net', (err, client) => {
    db = client.db('schoolclub');
});

app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g., /collectionName');
});

app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName);
    return next();
});

app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results);
    });
});

app.get('/collection/:collectionName/:k', (req, res) => {
    var key_1 = req.params.k;
    console.log("Searched term: " + key_1);
    
    req.collection.find({$or: [ {subject: { $regex: key_1, $options: "i" }}, {location: { $regex: key_1, $options: "i" }}]}).toArray((e, results) => {
        if (e) return console.log(e)
        res.send(results);
    });
});

app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insertOne(req.body, (e, results) => {
        if (e) return next(e);
        res.send(results.ops);
    });
});

const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collectionName/:id', (req, res, next) => {
req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
if (e) return next(e)
res.send(result)
})
})

app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
    {_id: new ObjectID(req.params.id)},
    {$set: req.body},
    {safe: true, multi: false},
    (e, result) => {
    if (e) return next(e)
    // res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
    res.send(
    
        result.modifiedCount === 1 ? { msg: "success" } : { msg: "error" }
        
        );
    
    })
    })


    // app.get('/collection/lessons/:k', (req, res) => {
    //     var key_1 = req.params.k;
    //     console.log("hello: " + key_1);
    //     // req.collection.find({ subject: {$regex: req.params.keyword, $options: "i"} }).toArray((e, results) => {
    //     //     if (e) return next(e)
    //     //     res.send(results);
    //     // });
    //     res.end("hello");
    // });




const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server running...");
});


