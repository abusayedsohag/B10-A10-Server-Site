const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5001;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    const data = "Connected"
    res.send(data)
})

//MongoDB section
const uri = `mongodb+srv://${process.env.MongoDB_user}:${process.env.MongoDB_pass}@cluster0.6ksrb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("campaignsDB");

    const datalist = database.collection("datalist");
    const userlist = database.collection("userlist")

    app.get('/campaigns', async(req, res) => {
        const cursor = datalist.find().limit(6);
        const result = await cursor.toArray(cursor);
        res.send(result);
    })

    app.get('/allcampaigns', async(req, res) => {
        const cursor = datalist.find();
        const result = await cursor.toArray(cursor);
        res.send(result);
    })

    app.get('/campaigns/:id', async(req, res) => {
        const id = req.params.id;
        const find = {_id: new ObjectId(id)}
        const result = await datalist.findOne(find)
        res.send(result)
    })

    app.post('/campaigns', async(req , res) => {
        const newCampaigns = req.body;
        const result = await datalist.insertOne(newCampaigns)
        res.send(result)
    })

    app.get('/user', async(req, res) => {
        const cursor = userlist.find();
        const result = await cursor.toArray(cursor);
        res.send(result);
    })

    app.post('/user', async(req, res) => {
        const newUser = req.body;
        const result = await userlist.insertOne(newUser)
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.listen(port , () => {
    console.log('Connected')
})