const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const PORT = 9000;

const MONGO_URI = "mongodb+srv://ak6339742:4ymw4kgGc6uU1HOC@cluster0.ses0a.mongodb.net/";
const DB_NAME = "vehicles";
const COLLECTION_NAME = "vehicle";

let db;
let client;

// Middleware
app.use(cors());
app.use(express.json()); // To handle JSON payloads

async function connectToDB() {
    try {
        client = new MongoClient(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await client.connect();
        db = client.db(DB_NAME);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit process on failure
    }
}

// Fetch all vehicles
app.get("/data", async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: "Database not initialized" });
        }
        const vehicles = await db.collection(COLLECTION_NAME).find({}).toArray();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
});

// Graceful Shutdown
process.on("SIGINT", async () => {
    if (client) {
        await client.close();
        console.log("MongoDB connection closed");
    }
    process.exit(0);
});

// Start the server
app.listen(PORT, async () => {
    await connectToDB();
    console.log(`Server started successfully on port ${PORT}`);
});
