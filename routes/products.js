const express = require('express');
const fs = require('fs');
const router = express.Router();
const productsFilePath = './products.json';

//  Función  para leer productos desde un archivo
const readProducts = () => {
  const data = fs.readFileSync(productsFilePath);
  return JSON.parse(data);
};

// Función para escribir productos en el archivo
const writeProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// GET /api/products/
router.get('/', (req, res) => {
  const { limit } = req.query;
  const products = readProducts();
  if (limit) {
    return res.json(products.slice(0, Number(limit)));
  }
  res.json(products);
});

// GET /api/products/:pid
router.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const products = readProducts();
  const product = products.find(p => p.id === pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

// POST /api/products/
router.post('/', (req, res) => {
  const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  const products = readProducts();
  const newProduct = {
    id: (products.length ? Math.max(...products.map(p => p.id)) + 1 : 1).toString(),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  };
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

// PUT /api/products/:pid
router.put('/:pid', (req, res) => {
  const { pid } = req.params;
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  const products = readProducts();
  const productIndex = products.findIndex(p => p.id === pid);
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  const updatedProduct = { ...products[productIndex], title, description, code, price, status, stock, category, thumbnails };
  products[productIndex] = updatedProduct;
  writeProducts(products);
  res.json(updatedProduct);
});

// DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
  const { pid } = req.params;
  let products = readProducts();
  const productIndex = products.findIndex(p => p.id === pid);
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  products = products.filter(p => p.id !== pid);
  writeProducts(products);
  res.status(204).send();
});

module.exports = router;
