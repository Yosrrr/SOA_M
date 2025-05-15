const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');

const resolvers = require('./resolvers');
const typeDefs = require('./schema');

// Configuration MongoDB avec retry
const connectWithRetry = async () => {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/perfume_db';
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

// Initial connection attempt
connectWithRetry();

const app = express();

// Middlewares globaux
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: false,
    cache: 'bounded',
});

// Démarrage d'Apollo Server
async function startServer() {
    await server.start();
    
    // Configuration du middleware Apollo
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => {
            return { req };
        },
    }));

    // Démarrage du serveur Express
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        console.log(`API Gateway running on port ${port}`);
        console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
    });
}

// Routes REST avec gestion d'erreur améliorée
app.get('/api/perfumes', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3003/api/perfumes');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching perfumes:', error);
        res.status(500).json({ 
            error: 'Internal Server Error', 
            details: error.response?.data || error.message 
        });
    }
});

app.get('/api/perfumes/:id', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:3003/api/perfumes/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching perfume:', error);
        if (error.response?.status === 404) {
            return res.status(404).json({ error: 'Perfume not found' });
        }
        res.status(500).json({ 
            error: 'Internal Server Error', 
            details: error.response?.data || error.message 
        });
    }
});

app.post('/api/perfumes', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:3003/api/perfumes', req.body);
        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating perfume:', error);
        res.status(500).json({ 
            error: 'Internal Server Error', 
            details: error.response?.data || error.message 
        });
    }
});

app.put('/api/perfumes/:id', async (req, res) => {
    try {
        const response = await axios.put(`http://localhost:3003/api/perfumes/${req.params.id}`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error updating perfume:', error);
        if (error.response?.status === 404) {
            return res.status(404).json({ error: 'Perfume not found' });
        }
        res.status(500).json({ 
            error: 'Internal Server Error', 
            details: error.response?.data || error.message 
        });
    }
});

app.delete('/api/perfumes/:id', async (req, res) => {
    try {
        const response = await axios.delete(`http://localhost:3003/api/perfumes/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error deleting perfume:', error);
        if (error.response?.status === 404) {
            return res.status(404).json({ error: 'Perfume not found' });
        }
        res.status(500).json({ 
            error: 'Internal Server Error', 
            details: error.response?.data || error.message 
        });
    }
});

// Route de santé
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        services: {
            apiGateway: 'running',
            mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
        }
    });
});

// Route par défaut
app.get('/', (req, res) => {
    res.json({
        message: 'API Gateway is running',
        endpoints: {
            perfumes: '/api/perfumes',
            graphql: '/graphql',
            health: '/health'
        }
    });
});

// Middleware de gestion d'erreur global
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Démarrer le serveur
startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});