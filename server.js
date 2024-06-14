import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import configureHandlebars from './config/handlebars.config.js';
import paths from './config/path.config.js';
import configureSocket from './config/socket.config.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Puerto y host
const PORT = 8080;
const HOST = 'localhost';

// Middleware para servir archivos estáticos
app.use(express.static(paths.publicPath));

// Función para leer productos del archivo JSON
const getProducts = () => {
    try {
        const data = fs.readFileSync(paths.productsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error al leer productos:', err);
        return [];
    }
};

// Función para guardar productos en el archivo JSON
const saveProducts = (products) => {
    try {
        fs.writeFileSync(paths.productsFilePath, JSON.stringify(products, null, 2));
    } catch (err) {
        console.error('Error al guardar productos:', err);
    }
};

// Configuración de Handlebars
configureHandlebars(app);

// Configuración de Socket.IO
configureSocket(io, getProducts, saveProducts);

// Ruta para eliminar un producto
app.post('/product/delete/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    let products = getProducts();
    products = products.filter(product => product.id !== productId);
    saveProducts(products);
    io.emit('updateProducts', products); // Emitir la lista actualizada
    res.redirect('/');
});

// Ruta para la vista home
app.get('/', (req, res) => {
    const products = getProducts();
    res.render('home', { products });
});

// Ruta para la vista realTimeProducts
app.get('/realtimeproducts', (req, res) => {
    const products = getProducts();
    res.render('realTimeProducts', { products });
});

// Iniciar el servidor
server.listen(PORT, HOST, () => {
    console.log(`Ejecutándose en http://${HOST}:${PORT}`);
});
