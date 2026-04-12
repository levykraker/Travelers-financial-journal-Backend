require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require('cors')
const routes = require('./routes/routes');
const app = express();

app.use(cors());
app.use(express.json());


const client = new MongoClient(process.env.DB_STRING);

async function startServer() {
  try {
    await client.connect();

    const db = client.db(process.env.DB_NAME);
    app.locals.db = db;
    app.use("/api",routes);

    app.listen(process.env.API_PORT || API_PORT, () => {
        console.log(`Go catch the server at PORT ${process.env.API_PORT || API_PORT}`)
    });
  } catch (error) {
    console.error("Connection error:", error);
  }
}

startServer().catch(console.error);