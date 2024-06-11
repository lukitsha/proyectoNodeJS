const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
    const id = uuidv4(); // Generar un ID único
    const cart = { id, products: [] };
    
    fs.readFile('./data/carrito.json', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error interno del servidor');
        } else {
            const carts = JSON.parse(data);
            carts.push(cart);
            fs.writeFile('./data/carrito.json', JSON.stringify(carts, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error interno del servidor');
                } else {
                    res.status(201).send('Carrito creado correctamente');
                }
            });
        }
    });
});

// Ruta para obtener un carrito por ID
router.get('/:cid', (req, res) => {
    const cid = req.params.cid;
    
    fs.readFile('./data/carrito.json', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error interno del servidor');
        } else {
            const carts = JSON.parse(data);
            const cart = carts.find(c => c.id === cid);
            if (cart) {
                res.json(cart);
            } else {
                res.status(404).send('Carrito no encontrado');
            }
        }
    });
});

// Ruta para agregar un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;
    
    fs.readFile('./data/carrito.json', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error interno del servidor');
        } else {
            let carts = JSON.parse(data);
            const cartIndex = carts.findIndex(c => c.id === cid);
            if (cartIndex !== -1) {
                let cart = carts[cartIndex];
                const productIndex = cart.products.findIndex(p => p.id === pid);
                if (productIndex !== -1) {
                    cart.products[productIndex].quantity += quantity;
                } else {
                    cart.products.push({ id: pid, quantity });
                }
                fs.writeFile('./data/carrito.json', JSON.stringify(carts, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error interno del servidor');
                    } else {
                        res.status(201).send('Producto agregado al carrito correctamente');
                    }
                });
            } else {
                res.status(404).send('Carrito no encontrado');
            }
        }
    });
});

module.exports = router;
