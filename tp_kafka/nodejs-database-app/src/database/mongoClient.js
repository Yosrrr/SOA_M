const { MongoClient } = require('mongodb'); // Corrigez cette ligne

const mongoUri = 'mongodb://localhost:27017';
const dbName = 'kafkaDB';

let client;
let db;

const connectToMongoDB = async () => {
    if (!client) {
        client = new MongoClient(mongoUri);
        await client.connect();
        console.log('Connecté à MongoDB');
        db = client.db(dbName);
    }
    return db;
};

module.exports = { connectToMongoDB };