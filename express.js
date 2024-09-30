const express = require('express');
const cors = require('cors');
const { getCollection } = require('./mongodb/db');
const { ObjectId } = require('mongodb');


const app = express();
const port = 1337;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    const { collection, client } = await getCollection();
    const data = await collection.find({}).toArray();

    res.json(data);
    await client.close();
});


app.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { collection, client } = await getCollection();
    const document = await collection.findOne({ _id: new ObjectId(id) });

    if (document) {
        res.json(document);
    } else {
        res.status(404).send('Document not found');
    }
    await client.close();
});


app.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const { collection, client } = await getCollection();
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedData }
        );

        if (result.matchedCount === 0) {
            res.status(404).send('Document not found');
        } else {
            res.send('Document updated successfully');
        }

        await client.close();
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).send('Error updating document');
    }
});


app.post('/new', async (req, res) => {
    const newDocument = req.body;

    try {
        const { collection, client } = await getCollection();

        if (!newDocument || typeof newDocument !== 'object' || Array.isArray(newDocument)) {
            return res.status(400).send('Invalid document data');
        }
        const result = await collection.insertOne(newDocument);

        res.status(201).json({
            message: 'Document inserted successfully',
            document: { _id: result.insertedId, ...newDocument }
        });

        await client.close();
    } catch (error) {
        console.error('Error inserting document:', error);
        res.status(500).send('Error inserting document');
    }
});


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
