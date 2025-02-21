require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.czfhh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db("TasksyDB").collection("users");
    const taskCollection = client.db("TasksyDB").collection("tasks");

    app.post("/users", async (req, res) => {
      const user = req.body;
      // check if the user exists
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists" });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.post("/tasks", async (req, res)=>{
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    })

    app.get("/tasks/:email/:category", async (req, res)=>{
      const {email, category} = req.params;
      const query = {email: email, category:category}
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    })

     // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Let's do task...!");
});

app.listen(port, () => {
  console.log("Server running successful");
});
