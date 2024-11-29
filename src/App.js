import React, { useEffect, useState } from 'react';
import './styles.css';
import ProductManagement from './ProductManagement';
import UsersManagement from './UsersManagement';
import Dashboard from './Dashboard';
import Login from './Login';
import Logout from './Logout';
import { db, auth } from './firebaseConfig'; // Import Firebase configuration
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

function App() {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const productsCollectionRef = collection(db, 'products');

    // Load products from Firebase when the app mounts
    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getDocs(productsCollectionRef);
            setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };

        fetchProducts();

        // Check login status (replace with Firebase Authentication logic if needed)
        const loginStatus = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(loginStatus === 'true');
    }, []);

    // Add a new product to Firebase
    const addProduct = async (newProduct) => {
        const docRef = await addDoc(productsCollectionRef, newProduct);
        setProducts((prevProducts) => [...prevProducts, { ...newProduct, id: docRef.id }]);
    };

    // Update an existing product in Firebase
    const updateProduct = async (id, updatedProduct) => {
        const productDoc = doc(db, 'products', id);
        await updateDoc(productDoc, updatedProduct);
        setProducts((prevProducts) =>
            prevProducts.map((product) => (product.id === id ? { ...updatedProduct, id } : product))
        );
    };

    // Delete a product from Firebase
    const deleteProduct = async (id) => {
        const productDoc = doc(db, 'products', id);
        await deleteDoc(productDoc);
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    };

    // Handle successful login
    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true'); // Replace with Firebase Authentication
    };

    // Handle logout
    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false'); // Replace with Firebase Authentication
    };

    // Function to handle section visibility
    const showSection = (sectionId) => {
        setActiveSection(sectionId);
    };

    return (
        <div>
            <header>
                <h1>WELCOME TO WINGS CAFE INVENTORY SYSTEM</h1>
            </header>

            {!isLoggedIn ? (
                <Login onLogin={handleLogin} />
            ) : (
                <>
                    <nav>
                        <button
                            className={activeSection === 'dashboard' ? 'active' : ''}
                            onClick={() => showSection('dashboard')}
                        >
                            Dashboard
                        </button>
                        <button
                            className={activeSection === 'productManagement' ? 'active' : ''}
                            onClick={() => showSection('productManagement')}
                        >
                            Product Management
                        </button>
                        <button
                            className={activeSection === 'usersManagement' ? 'active' : ''}
                            onClick={() => showSection('usersManagement')}
                        >
                            Users Management
                        </button>
                        <button onClick={handleLogout}>Logout</button>
                    </nav>
                    <main>
                        {activeSection === 'dashboard' && <Dashboard products={products} />}
                        {activeSection === 'productManagement' && (
                            <ProductManagement
                                products={products}
                                addProduct={addProduct}
                                updateProduct={updateProduct}
                                deleteProduct={deleteProduct}
                            />
                        )}
                        {activeSection === 'usersManagement' && <UsersManagement />}
                    </main>
                </>
            )}
        </div>
    );
}

export default App;
