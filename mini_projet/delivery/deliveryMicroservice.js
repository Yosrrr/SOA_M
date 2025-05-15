const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');

const deliveryProtoPath = 'delivery.proto';
const deliveryProtoDefinition = protoLoader.loadSync(deliveryProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const deliveryProto = grpc.loadPackageDefinition(deliveryProtoDefinition).delivery;

// Fonction pour créer un client gRPC
const createGrpcClient = () => {
    // Dans un environnement Docker, utiliser le nom du service
    const host = process.env.NODE_ENV === 'production' ? 'delivery-service' : 'localhost';
    return new deliveryProto.DeliveryService(
        `${host}:${port}`,
        grpc.credentials.createInsecure()
    );
};

const server = new grpc.Server();

server.addService(deliveryProto.DeliveryService.service, {
    CreateShipment: (call, callback) => {
        const { orderId, address } = call.request;

        // Validation des données
        if (!orderId || !address) {
            return callback({
                code: grpc.status.INVALID_ARGUMENT,
                details: 'orderId and address are required'
            });
        }

        // Simulez une réponse de livraison avec un trackingId unique
        callback(null, {
            status: 'SUCCESS',
            trackingId: uuidv4(), // Génère un ID unique pour le suivi
            error: '', // Pas d'erreur
        });
    },
});

const port = 50055; // Corrigé pour correspondre au docker-compose.yml
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
    if (err) {
        console.error('Failed to start gRPC server:', err);
        return;
    }
    console.log(`Delivery microservice running on port ${bindPort}`);
});

const app = express();
app.use(bodyParser.json());

app.post('/api/shipments', (req, res) => {
    const { orderId, address } = req.body;

    // Validation des données
    if (!orderId) {
        return res.status(400).json({ error: 'orderId is required' });
    }
    if (!address) {
        return res.status(400).json({ error: 'address is required' });
    }

    const client = createGrpcClient();

    client.CreateShipment({ orderId, address }, (err, response) => {
        if (err) {
            console.error('Error calling gRPC method:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(response);
    });
});

const httpPort = 3005; // Changé pour éviter les conflits de ports
app.listen(httpPort, () => {
    console.log(`HTTP server running on port ${httpPort}`);
});