import React, { useState, useEffect } from 'react';
import './ProductManagement.css';
import { db } from './firebaseConfig'; // Import Firebase configuration
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from 'firebase/firestore';

function ProductManagement() {
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [products, setProducts] = useState([]);

    const productsCollection = collection(db, 'products'); // Reference to 'products' collection

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const querySnapshot = await getDocs(productsCollection);
        const productList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        setProducts(productList);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            const productDoc = doc(db, 'products', editId);
            await updateDoc(productDoc, productData);
            setIsEditing(false);
            setEditId(null);
        } else {
            await addDoc(productsCollection, productData);
        }
        fetchProducts();
        setProductData({ name: '', description: '', category: '', price: '', quantity: '' });
    };

    const handleEdit = (product) => {
        setProductData(product);
        setIsEditing(true);
        setEditId(product.id);
    };

    const handleDelete = async (id) => {
        const productDoc = doc(db, 'products', id);
        await deleteDoc(productDoc);
        fetchProducts();
    };

    return (
        <section id="productManagement">
            <h2>Product Management</h2>
            <form className="product-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={productData.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={productData.description}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={productData.category}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={productData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                />
                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={productData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                />
                <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
            </form>

            <h3>Product List</h3>
            <div className="table-container">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.category}</td>
                                    <td>M{parseFloat(product.price).toFixed(2)}</td>
                                    <td>{product.quantity}</td>
                                    <td>
                                        <button onClick={() => handleEdit(product)}>Edit</button>
                                        <button onClick={() => handleDelete(product.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No products available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default ProductManagement;
