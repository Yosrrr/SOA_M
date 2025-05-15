const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const deliveryProtoPath = 'delivery.proto';
const deliveryProtoDefinition = protoLoader.loadSync(deliveryProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const deliveryProto = grpc.loadPackageDefinition(deliveryProtoDefinition).delivery;

// Créer le client
const client = new deliveryProto.DeliveryService(
    'localhost:50055',
    grpc.credentials.createInsecure()
);

// Test de la méthode CreateShipment
const testCreateShipment = () => {
    const shipmentRequest = {
        orderId: 'ORDER_123',
        address: '123 Rue Example, Paris, 75001, France'
    };

    console.log('Envoi de la requête de livraison:', shipmentRequest);

    client.CreateShipment(shipmentRequest, (err, response) => {
        if (err) {
            console.error('Erreur lors de la création de la livraison:', err);
            return;
        }
        console.log('Réponse du service de livraison:', response);
    });
};

// Exécuter le test
console.log('Test du service de livraison...');
testCreateShipment(); 