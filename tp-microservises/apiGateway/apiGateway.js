// apiGateway.js
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// Charger les fichiers proto pour les films et les séries TV
const movieProtoPath = 'movie.proto';
const tvShowProtoPath = 'tvShow.proto';
const resolvers = require('./resolvers');
const typeDefs = require('./schema');
// Créer une nouvelle application Express
const app = express();
const movieProtoDefinition = protoLoader.loadSync(movieProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const tvShowProtoDefinition = protoLoader.loadSync(tvShowProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const movieProto = grpc.loadPackageDefinition(movieProtoDefinition).movie;
const tvShowProto = grpc.loadPackageDefinition(tvShowProtoDefinition).tvShow;
// Créer une instance ApolloServer avec le schéma et les résolveurs importés
const server = new ApolloServer({ typeDefs, resolvers });
// Appliquer le middleware ApolloServer à l'application Express
server.start().then(() => {
    app.use(
        cors(),
        bodyParser.json(),
        expressMiddleware(server),
    );
});
12

app.get('/movies', (req, res) => {
    const client = new movieProto.MovieService('localhost:50051',
        grpc.credentials.createInsecure());
    client.searchMovies({}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.movies);
        }
    });
});

app.get('/movies/:id', (req, res) => {
    const client = new movieProto.MovieService('localhost:50051',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getMovie({ movieId: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.movie);
        }
    });
});
app.get('/tvshows', (req, res) => {
    const client = new tvShowProto.TVShowService('localhost:50052',
        grpc.credentials.createInsecure());
    client.searchTvshows({}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.tv_shows);
        }
    });
});
app.get('/tvshows/:id', (req, res) => {
    const client = new tvShowProto.TVShowService('localhost:50052',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getTvshow({ tvShowId: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.tv_show);
        }
    });
});
app.post('/movies', async (req, res) => {
    const movieData = req.body;
    await sendMessage('movies_topic', movieData);
    res.send({ message: 'Movie created', data: movieData });
});

// Démarrer l'application Express
const port = 3000;
app.listen(port, () => {
    console.log(`API Gateway en cours d'exécution sur le port ${port}`);
});


const { Kafka } = require('kafkajs');
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});
const producer = kafka.producer();
const sendMessage = async (topic, message) => {
    await producer.connect();
    await producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
    });
    await producer.disconnect();
};


/*  hedhy consumer ahna nesteha9ouhech 
const consumer = kafka. consumer ({ groupId: 'group-id' }) ;

const consumeMessages = async (topic) => {
await consumer. connect ();
await consumer. subscribe ({ topic, fromBeginning: true } ) ;

await consumer.run ({
eachMessage: async ({ topic, partition, message } ) => {
console.log ('Received message: ${message. value. toString () } ') ;
// Traitez le message ici 
},
});
};*/