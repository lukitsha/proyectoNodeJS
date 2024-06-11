// Importar los módulos necesarios
const express = require('express');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const fs = require('fs');

const app = express();

// Configurar Express para manejar solicitudes JSON
app.use(express.json());

// Usar los routers para las rutas de productos y carritos
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;

// Iniciar el servidor en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});