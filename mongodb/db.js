const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'lib';
const collectionName = 'documents';


async function getCollection() {
    const client = new MongoClient(uri);

    try {

        await client.connect();
        console.log('Connected to MongoDB');


        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        return {
            collection,
            client,
        };
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

module.exports = {
    getCollection,
};
