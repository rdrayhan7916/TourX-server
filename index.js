const express = require("express");
const { MongoClient } = require('mongodb');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v8i8y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db('services');
        const packageCollection = database.collection('package');

        app.post('/addservice', async (req, res) => {
            console.log(req.body);
            const result = await packageCollection.insertOne(req.body);
            res.send(result);
        })

        // Get Method
        app.get('/service', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages)
        })

    }
    finally {
        // await client.close();

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running My CRUD server')
})

app.listen(port, () => {
    console.log('Running Server on port ', port)
})