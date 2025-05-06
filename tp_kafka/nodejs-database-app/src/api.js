const express = require('express');
const { connectToMongoDB } = require('./database/mongoClient');

const app = express();
const port = 3000;
const collectionName = 'messages';

// Endpoint pour la route racine
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Kafka-MongoDB');
});

// Endpoint pour récupérer tous les messages
app.get('/messages', async (req, res) => {
    try {
        const db = await connectToMongoDB();
        const collection = db.collection(collectionName);

        const messages = await collection.find({}).toArray();
        res.status(200).json(messages);
    } catch (err) {
        console.error('Erreur lors de la récupération des messages :', err);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`API REST démarrée sur http://localhost:${port}`);
});