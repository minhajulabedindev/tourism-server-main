const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
//middle were
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wehqx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("tourism");
    const offerCollection = database.collection("country");
    const bookingCollection = database.collection("booking");
    //post api
    app.post("/offers", async (req, res) => {
      const cursor = req.body;
      const result = await offerCollection.insertOne(cursor);
      res.json(result);
    });

    //single api
    app.get("/offers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await offerCollection.findOne(query);
      res.json(result);
    });
    // app.get("/offers/:booking", async (req, res) => {
    //   const booking = req.params.booking;
    //   const query = { _id: ObjectId(booking) };
    //   const result = await offerCollection.findOne(query);
    //   res.json(result);
    // });
    //get api
    app.get("/offers", async (req, res) => {
      const cursor = offerCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    //-------------------------------------------------
    app.get("/booking", async (req, res) => {
      const cursor = bookingCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/booking", async (req, res) => {
      const cursor = req.body;
      const result = await bookingCollection.insertOne(cursor);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
