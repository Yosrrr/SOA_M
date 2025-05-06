const express = require('express');
const app = express();
const PORT = 3002; // Modification du port
const products = [ // Ajout des données factices pour /products
  { id: 1, name: 'Laptop', price: 1200 },
  { id: 2, name: 'Phone', price: 800 }
];
app.get('/products', (req, res) => res.json(products)); // Nouvel endpoint

app.listen(PORT, () => console.log(`Service B running on :${PORT}`));