const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const paymentProtoPath = 'payment.proto';
const paymentProtoDefinition = protoLoader.loadSync(paymentProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const paymentProto = grpc.loadPackageDefinition(paymentProtoDefinition).payment;

const server = new grpc.Server();

// Implémentation de la méthode gRPC
server.addService(paymentProto.PaymentService.service, {
    ProcessPayment: (call, callback) => {
        const { amount, currency, source } = call.request;

        // Simulez une réponse de paiement avec un paymentId unique
        callback(null, {
            status: 'SUCCESS',
            paymentId: uuidv4(), // Génère un ID unique
            amount,
            currency,
            error: '', // Pas d'erreur
        });
    },
});

// Démarrage du serveur gRPC
const port = 50054;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
    if (err) {
        console.error('Failed to start gRPC server:', err);
        return;
    }
    server.start();
    console.log(`Payment microservice running on port ${bindPort}`);
});

// Ajout d'une API REST pour tester la méthode gRPC
const app = express();
app.use(bodyParser.json());

app.post('/api/payments', (req, res) => {
    const { amount, currency, source } = req.body;

    // Validation des données
    if (!amount || !currency || !source) {
        return res.status(400).json({ error: 'All fields (amount, currency, source) are required' });
    }

    // Simulez un appel à la méthode gRPC
    const paymentRequest = { amount, currency, source };
    const client = new paymentProto.PaymentService(
        'localhost:50054',
        grpc.credentials.createInsecure()
    );

    client.ProcessPayment(paymentRequest, (err, response) => {
        if (err) {
            console.error('Error calling gRPC method:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(response);
    });
});

// Démarrage du serveur HTTP
const httpPort = 3004;
app.listen(httpPort, () => {
    console.log(`HTTP server running on port ${httpPort}`);
});