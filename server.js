const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const port = 3000;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'))



let db;
MongoClient.connect('mongodb://<dbuser>:<dbpassword>@ds261678.mlab.com:61678/quotes', { useNewUrlParser: true }, (err,client) => {
    if (err) return console.log(err)
    db = client.db('quotes')

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    })
    
})


app.get('/', (req,res) => {
    // res.send("Hello World")
    // res.sendFile(__dirname + '/index.html');
    db.collection('quotes').find().toArray( (err,results) => {
        if (err) return console.log(err);
        res.render('index.ejs', {quotes: results})
    });
})

app.post('/quotes', (req,res) => {
    db.collection('quotes').insertOne(req.body, (err,result) => {
        if (err) return console.log(err);

        console.log('saved to database');
        res.redirect('/');    
    })
})

app.put('/quotes', (req,res) => {
    // Handle Put request
    db.collection('quotes').findOneAndUpdate(
        {
            name: 'Yoda'
        },
        {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        },
        {
            sort: {_id:-1},
            upsert: true
        },
            (err,results) => {
                if (err) return res.send(err);
                res.send(results);
        })
})

app.delete('/quotes', (req,res) =>{
    // Handle delete request here
    db.collection('quotes').findOneAndDelete(
        {
            name: req.body.name
        },
        (err,results) => {
            if (err) return res.send(500, err);
            res.send({message: "A darth vader quote has been deleted"});
        }
    )
})  