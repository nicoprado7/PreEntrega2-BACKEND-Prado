const express = require('express');
const fs = require('fs');
const router = express.Router();
const cartsFilePath = './carts.json';
const productsFilePath = './products.json';

// Función para leer carritos desde archivos.
const readCarts = () => {
  const data = fs.readFileSync(cartsFilePath);
  return JSON.parse(data);
};

// Función  para escribir carros en archivos.
const writeCarts = (carts) => {
  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

// POST /api/carts/
router.post('/', (req, res) => {
  const carts = readCarts();
  const newCart = {
    id: (carts.length ? Math.max(...carts.map(c => c.id)) + 1 : 1).toString(),
    products: []
  };
  carts.push(newCart);
  writeCarts(carts);
  res.status(201).json(newCart);
});

// GET /api/carts/:cid
router.get('/:cid', (req, res) => {
  const { cid } = req.params;
  const carts = readCarts();
  const cart = carts.find(c => c.id === cid);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const carts = readCarts();
  const cartIndex = carts.findIndex(c => c.id === cid);
  if (cartIndex === -1) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }

  const products = readProducts();
  const product = products.find(p => p.id === pid);
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  const cart = carts[cartIndex];
  const productInCart = cart.products.find(p => p.product === pid);
  if (productInCart) {
    productInCart.quantity += 1;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  carts[cartIndex] = cart;
  writeCarts(carts);
  res.status(201).json(cart);
});

module.exports = router;
