const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
const serviceAccount = require('C:/Users/Dell/Downloads/reactwings-firebase-adminsdk-p3rrc-69df2a90aa.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // Firebase Firestore

// Registration API
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log('User Password:', password); // For debugging only
  const hashedPassword = await bcrypt.hash(password, 10);

  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('username', '==', username).get();

  if (!snapshot.empty) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  try {
    await usersRef.add({
      username: username,
      password: hashedPassword,
    });
    res.json({ message: 'Registration successful' });
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Login API
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('username', '==', username).get();

  if (snapshot.empty) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  const userDoc = snapshot.docs[0];
  const validPassword = await bcrypt.compare(password, userDoc.data().password);

  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  res.json({ message: 'Login successful' });
});

// Fetch all products
app.get('/products', async (req, res) => {
  try {
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'No products found' });
    }

    const products = snapshot.docs.map(doc => doc.data());
    res.json(products);
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Add a new product
app.post('/products', async (req, res) => {
  const { name, description, category, price, quantity } = req.body;

  try {
    await db.collection('products').add({
      name,
      description,
      category,
      price,
      quantity,
    });
    res.json({ message: 'Product added successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Update a product
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, category, price, quantity } = req.body;

  try {
    const productRef = db.collection('products').doc(id);
    const doc = await productRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await productRef.update({
      name,
      description,
      category,
      price,
      quantity,
    });

    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Delete a product
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const productRef = db.collection('products').doc(id);
    const doc = await productRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await productRef.delete();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Start the server
const PORT = 5300;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
