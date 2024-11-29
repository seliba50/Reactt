import React, { useState } from 'react';
import './styles.css';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Correctly import the initialized auth instance

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Logged in as:', user.email);
            onLogin(); // Calls the parent component's login function
            alert('Login successful!');
        } catch (error) {
            setError(error.message);
            console.error('Login error:', error.message);
        }
    };

    // Handle registration
    const handleRegister = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Registered as:', user.email);
            alert('Registration successful! You can now log in.');
            setIsRegistering(false); // Switch to login mode
        } catch (error) {
            setError(error.message);
            console.error('Registration error:', error.message);
        }
    };

    return (
        <section id="login">
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
            </form>
            {error && <p className="error">{error}</p>} {/* Display error messages */}
            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Already have an account? Login' : 'Don’t have an account? Register'}
            </button>
        </section>
    );
}

export default Login;
