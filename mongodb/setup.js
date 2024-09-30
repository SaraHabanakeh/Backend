const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");


const uri = "mongodb://localhost:27017";
const dbName = "lib";
const collectionName = "documents";


const dataFilePath = path.join(__dirname, "setup.json");
const jsonData = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

async function setupDatabase() {
    const client = new MongoClient(uri);

    try {

        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        await collection.deleteMany({});
        console.log(`Cleared collection: ${collectionName}`);

        const result = await collection.insertMany(jsonData);
        console.log(`${result.insertedCount} documents inserted into the collection`);

    } catch (error) {
        console.error("Error setting up database:", error);
    } finally {

        await client.close();
    }
}


setupDatabase();
