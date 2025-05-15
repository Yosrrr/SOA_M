const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const perfumeProtoPath = 'perfume.proto';
const perfumeProtoDefinition = protoLoader.loadSync(perfumeProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const perfumeProto = grpc.loadPackageDefinition(perfumeProtoDefinition).perfume;

// Configuration Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Stockage en mémoire des parfums
let perfumes = [
    { id: '1', name: 'Perfume 1', brand: 'Brand A', fragranceNotes: 'Woody, Spicy' },
    { id: '2', name: 'Perfume 2', brand: 'Brand B', fragranceNotes: 'Fruity, Sweet' },
];

const perfumeService = {
    getPerfume: (call, callback) => {
        try {
            const perfume = perfumes.find(p => p.id === call.request.perfume_id);
            if (!perfume) {
                return callback({
                    code: grpc.status.NOT_FOUND,
                    details: 'Perfume not found'
                });
            }
            callback(null, { perfume });
        } catch (error) {
            callback({
                code: grpc.status.INTERNAL,
                details: error.message
            });
        }
    },
    searchPerfumes: (call, callback) => {
        try {
            callback(null, { perfumes });
        } catch (error) {
            callback({
                code: grpc.status.INTERNAL,
                details: error.message
            });
        }
    },
    createPerfume: (call, callback) => {
        try {
            const { id, name, brand, fragranceNotes } = call.request;
            if (!id || !name || !brand || !fragranceNotes) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    details: 'All fields are required'
                });
            }
            const newPerfume = { id, name, brand, fragranceNotes };
            perfumes.push(newPerfume);
            callback(null, { perfume: newPerfume });
        } catch (error) {
            callback({
                code: grpc.status.INTERNAL,
                details: error.message
            });
        }
    },
    updatePerfume: (call, callback) => {
        try {
            const { id, name, brand, fragranceNotes } = call.request;
            const perfume = perfumes.find(p => p.id === id);
            if (!perfume) {
                return callback({
                    code: grpc.status.NOT_FOUND,
                    details: 'Perfume not found'
                });
            }
            if (name) perfume.name = name;
            if (brand) perfume.brand = brand;
            if (fragranceNotes) perfume.fragranceNotes = fragranceNotes;
            callback(null, { perfume });
        } catch (error) {
            callback({
                code: grpc.status.INTERNAL,
                details: error.message
            });
        }
    },
    deletePerfume: (call, callback) => {
        try {
            const { id } = call.request;
            const index = perfumes.findIndex(p => p.id === id);
            if (index === -1) {
                return callback({
                    code: grpc.status.NOT_FOUND,
                    details: 'Perfume not found'
                });
            }
            const deletedPerfume = perfumes.splice(index, 1)[0];
            callback(null, { perfume: deletedPerfume });
        } catch (error) {
            callback({
                code: grpc.status.INTERNAL,
                details: error.message
            });
        }
    }
};

// Démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(perfumeProto.PerfumeService.service, perfumeService);

const port = process.env.PORT || 50053;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
    if (err) {
        console.error('Failed to bind server:', err);
        return;
    }
    server.start();
    console.log(`Perfume microservice running on port ${bindPort}`);
});

// Routes REST
app.get('/api/perfumes', (req, res) => {
    console.log('GET /api/perfumes - Returning all perfumes');
    try {
        res.json(perfumes);
    } catch (error) {
        console.error('Error in GET /api/perfumes:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/perfumes/:id', (req, res) => {
    console.log(`GET /api/perfumes/${req.params.id}`);
    try {
        const perfume = perfumes.find(p => p.id === req.params.id);
        if (!perfume) {
            console.log(`Perfume with id ${req.params.id} not found`);
            return res.status(404).json({ error: 'Perfume not found' });
        }
        res.json(perfume);
    } catch (error) {
        console.error(`Error in GET /api/perfumes/${req.params.id}:`, error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/perfumes', (req, res) => {
    console.log('POST /api/perfumes - Creating new perfume:', req.body);
    try {
        const { id, name, brand, fragranceNotes } = req.body;
        if (!id || !name || !brand || !fragranceNotes) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const newPerfume = { id, name, brand, fragranceNotes };
        perfumes.push(newPerfume);
        res.status(201).json(newPerfume);
    } catch (error) {
        console.error('Error in POST /api/perfumes:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/perfumes/:id', (req, res) => {
    console.log(`PUT /api/perfumes/${req.params.id} - Updating perfume:`, req.body);
    try {
        const { id } = req.params;
        const { name, brand, fragranceNotes } = req.body;
        const perfume = perfumes.find(p => p.id === id);
        if (!perfume) {
            return res.status(404).json({ error: 'Perfume not found' });
        }
        if (name) perfume.name = name;
        if (brand) perfume.brand = brand;
        if (fragranceNotes) perfume.fragranceNotes = fragranceNotes;
        res.json(perfume);
    } catch (error) {
        console.error(`Error in PUT /api/perfumes/${req.params.id}:`, error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/perfumes/:id', (req, res) => {
    console.log(`DELETE /api/perfumes/${req.params.id}`);
    try {
        const { id } = req.params;
        const index = perfumes.findIndex(p => p.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Perfume not found' });
        }
        const deletedPerfume = perfumes.splice(index, 1)[0];
        res.json(deletedPerfume);
    } catch (error) {
        console.error(`Error in DELETE /api/perfumes/${req.params.id}:`, error);
        res.status(500).json({ error: error.message });
    }
});

// Middleware de gestion d'erreur
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Démarrer le serveur HTTP
const httpPort = process.env.HTTP_PORT || 3003;
app.listen(httpPort, '0.0.0.0', () => {
    console.log(`HTTP server running on port ${httpPort}`);
    console.log(`Available endpoints:`);
    console.log(`- GET    http://localhost:${httpPort}/api/perfumes`);
    console.log(`- GET    http://localhost:${httpPort}/api/perfumes/:id`);
    console.log(`- POST   http://localhost:${httpPort}/api/perfumes`);
    console.log(`- PUT    http://localhost:${httpPort}/api/perfumes/:id`);
    console.log(`- DELETE http://localhost:${httpPort}/api/perfumes/:id`);
});

module.exports = {
    Query: {
        perfume: (_, { id }) => {
            const client = new perfumeProto.PerfumeService(
                'localhost:50053',
                grpc.credentials.createInsecure()
            );
            return new Promise((resolve, reject) => {
                client.getPerfume({ perfume_id: id }, (err, response) => {
                    if (err) {
                        console.error('GraphQL getPerfume error:', err);
                        reject(err);
                    } else {
                        resolve(response.perfume);
                    }
                });
            });
        },
        perfumes: () => {
            const client = new perfumeProto.PerfumeService(
                'localhost:50053',
                grpc.credentials.createInsecure()
            );
            return new Promise((resolve, reject) => {
                client.searchPerfumes({}, (err, response) => {
                    if (err) {
                        console.error('GraphQL searchPerfumes error:', err);
                        reject(err);
                    } else {
                        resolve(response.perfumes);
                    }
                });
            });
        },
    },
};

// filepath: c:\Users\GIGABYTE\SOA\mini_projet\apiGateway\schema.js
