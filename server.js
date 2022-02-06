const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();

app.use(express.json());
app.set('port', 3000)

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

app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e);
        res.send(results.ops);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server running...");
});


