const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Ruta para obtener todos los productos
router.get('/', (req, res) => {
    fs.readFile('./data/productos.json', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error interno del servidor');
        } else {
            const productos = JSON.parse(data);
            res.json(productos);
        }
    });
});

// Ruta para obtener un producto por ID
router.get('/:pid', (req, res) => {
    const pid = req.params.pid;
    fs.readFile('./data/productos.json', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error interno del servidor');
        } else {
            const productos = JSON.parse(data);
            const producto = productos.find(p => p.id === pid);
            if (producto) {
                res.json(producto);
            } else {
                res.status(404).send('Producto no encontrado');
            }
        }
    });
});

// Ruta para agregar un nuevo producto
router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    const id = uuidv4(); // Generar un ID único para evitar conflictos futuros
    const status = true;
    
    // Verificar que todos los campos obligatorios estén presentes
    if (!title || !description || !code || !price || !stock || !category) {
        res.status(400).send('Todos los campos son obligatorios');
    } else {
        const newProduct = { id, title, description, code, price, status, stock, category, thumbnails };
        fs.readFile('./data/productos.json', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error interno del servidor');
            } else {
                const productos = JSON.parse(data);
                productos.push(newProduct);
                fs.writeFile('./data/productos.json', JSON.stringify(productos, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error interno del servidor');
                    } else {
                        res.status(201).send('Producto agregado correctamente');
                    }
                });
            }
        });
    }
});

// Ruta para actualizar un producto por ID
router.put('/:pid', (req, res) => {
    const pid = req.params.pid;
    const updatedFields = req.body;
    
    fs.readFile('./data/productos.json', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error interno del servidor');
        } else {
            let productos = JSON.parse(data);
            const index = productos.findIndex(p => p.id === pid);
            if (index !== -1) {
                productos[index] = { ...productos[index], ...updatedFields };
                fs.writeFile('./data/productos.json', JSON.stringify(productos, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error interno del servidor');
                    } else {
                        res.send('Producto actualizado correctamente');
                    }
                });
            } else {
                res.status(404).send('Producto no encontrado');
            }
        }
    });
});

// Ruta para eliminar un producto por ID
router.delete('/:pid', (req, res) => {
    const pid = req.params.pid;
    
    fs.readFile('./data/productos.json', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error interno del servidor');
        } else {
            let productos = JSON.parse(data);
            const index = productos.findIndex(p => p.id === pid);
            if (index !== -1) {
                productos.splice(index, 1);
                fs.writeFile('./data/productos.json', JSON.stringify(productos, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error interno del servidor');
                    } else {
                        res.send('Producto eliminado correctamente');
                    }
                });
            } else {
                res.status(404).send('Producto no encontrado');
            }
        }
    });
});

module.exports = router;