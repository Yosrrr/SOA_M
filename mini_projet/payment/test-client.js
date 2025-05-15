const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const paymentProtoPath = 'payment.proto';
const paymentProtoDefinition = protoLoader.loadSync(paymentProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const paymentProto = grpc.loadPackageDefinition(paymentProtoDefinition).payment;

// Créer le client
const client = new paymentProto.PaymentService(
    'localhost:50054',
    grpc.credentials.createInsecure()
);

// Test de la méthode processPayment
const testProcessPayment = () => {
    const paymentRequest = {
        amount: 100.50,
        currency: 'EUR',
        source: 'CARD_123456789'
    };

    console.log('Envoi de la requête de paiement:', paymentRequest);

    client.processPayment(paymentRequest, (err, response) => {
        if (err) {
            console.error('Erreur lors du traitement du paiement:', err);
            return;
        }
        console.log('Réponse du service de paiement:', response);
    });
};

// Exécuter le test
console.log('Test du service de paiement...');
testProcessPayment(); 