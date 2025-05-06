const { Kafka } = require('kafkajs');
const { connectToMongoDB } = require('./database/mongoClient');

// Configuration Kafka
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});
const consumer = kafka.consumer({ groupId: 'test-group' });

const collectionName = 'messages';

const run = async () => {
    // Connexion à MongoDB
    const db = await connectToMongoDB();
    const collection = db.collection(collectionName);

    // Connexion au consommateur Kafka
    await consumer.connect();
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const messageValue = message.value.toString();
            console.log({ value: messageValue });

            // Insertion du message dans MongoDB
            try {
                await collection.insertOne({
                    topic,
                    partition,
                    value: messageValue,
                    timestamp: new Date()
                });
                console.log('Message enregistré dans MongoDB');
            } catch (err) {
                console.error('Erreur lors de l\'insertion dans MongoDB', err);
            }
        },
    });
};

run().catch(console.error);