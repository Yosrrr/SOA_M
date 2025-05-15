const { Kafka } = require('kafkajs');
const Perfume = require('./models/Perfume');

// Configurer Kafka
const kafka = new Kafka({
    clientId: 'perfume-service',
    brokers: ['kafka:9092'],
});
const producer = kafka.producer();

const resolvers = {
    Query: {
        perfume: async (_, { id }) => {
            try {
                const perfume = await Perfume.findOne({ id });
                if (!perfume) throw new Error('Perfume not found');
                return perfume;
            } catch (err) {
                throw new Error(err.message);
            }
        },
        perfumes: async () => {
            try {
                return await Perfume.find();
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
    Mutation: {
        createPerfume: async (_, { name, brand, fragranceNotes }) => {
            try {
                const id = Date.now().toString(); // Générer un ID unique
                const perfume = new Perfume({ id, name, brand, fragranceNotes });
                const savedPerfume = await perfume.save();

                // Publier un événement Kafka
                await producer.connect();
                await producer.send({
                    topic: 'perfume-events',
                    messages: [
                        { value: JSON.stringify({ action: 'CREATE', perfume: savedPerfume }) },
                    ],
                });

                return savedPerfume;
            } catch (err) {
                throw new Error(err.message);
            }
        },
        updatePerfume: async (_, { id, name, brand, fragranceNotes }) => {
            try {
                const perfume = await Perfume.findOneAndUpdate(
                    { id },
                    { name, brand, fragranceNotes },
                    { new: true }
                );
                if (!perfume) throw new Error('Perfume not found');

                // Publier un événement Kafka
                await producer.connect();
                await producer.send({
                    topic: 'perfume-events',
                    messages: [
                        { value: JSON.stringify({ action: 'UPDATE', perfume }) },
                    ],
                });

                return perfume;
            } catch (err) {
                throw new Error(err.message);
            }
        },
        deletePerfume: async (_, { id }) => {
            try {
                const perfume = await Perfume.findOneAndDelete({ id });
                if (!perfume) throw new Error('Perfume not found');

                // Publier un événement Kafka
                await producer.connect();
                await producer.send({
                    topic: 'perfume-events',
                    messages: [
                        { value: JSON.stringify({ action: 'DELETE', perfume }) },
                    ],
                });

                return perfume;
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
};

module.exports = resolvers;