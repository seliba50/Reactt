import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { db } from './firebaseConfig'; // Import Firebase configuration
import { collection, getDocs } from 'firebase/firestore';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = [
        '/images/images1.jpg',
        '/images/images2.jpg',
        '/images/images3.jpg',
        '/images/images4.jpg',
    ];

    // Rotate images every 3 seconds
    useEffect(() => {
        const imageRotationInterval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // 3-second interval

        return () => clearInterval(imageRotationInterval); // Cleanup on component unmount
    }, [images.length]);

    // Fetch products from Firestore
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsCollection = collection(db, 'products'); // Reference to 'products' collection
                const querySnapshot = await getDocs(productsCollection);
                const productList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProducts(productList);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const chartData = {
        labels: products.map((product) => product.name),
        datasets: [
            {
                label: 'Stock Quantity',
                data: products.map((product) => product.quantity),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Product Stock Overview',
                font: {
                    size: 20,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <section id="dashboard">
            <div id="stockOverview">
                {/* Rotating Image Section */}
                <div className="rotating-images">
                    <img
                        src={images[currentImageIndex]}
                        alt="Product showcase"
                        className="rotating-image"
                    />
                </div>

                {/* Bar Chart */}
                <div className="chart-container">
                    <h2>Stock Overview</h2>
                    <Bar data={chartData} options={options} />
                </div>
            </div>

            {/* Product Table */}
            <table className="stock-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map(
                            ({ id, name, description, category, price, quantity }) => (
                                <tr key={id}>
                                    <td>{name}</td>
                                    <td>{description}</td>
                                    <td>{category}</td>
                                    <td>M{parseFloat(price).toFixed(2)}</td>
                                    <td>{quantity}</td>
                                </tr>
                            )
                        )
                    ) : (
                        <tr>
                            <td colSpan="5">No products available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
}

export default Dashboard;
