import React, { useState, useEffect } from 'react';
import './UsersManagement.css';
import { db } from './firebaseConfig'; // Import Firebase configuration
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where
} from 'firebase/firestore';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [updateUser, setUpdateUser] = useState({ oldUsername: '', newUsername: '', newPassword: '' });
    const [deleteUsername, setDeleteUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const usersCollection = collection(db, 'users'); // Reference to 'users' collection

    // Fetch all users from Firestore
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(usersCollection);
            const userList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(userList);
        } catch (error) {
            console.error('Error fetching users:', error);
            setMessage('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(); // Load users on component mount
    }, []);

    // Update an existing user in Firestore
    const updateExistingUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const q = query(usersCollection, where('username', '==', updateUser.oldUsername));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setMessage('User not found.');
            } else {
                const userDoc = querySnapshot.docs[0];
                const userRef = doc(db, 'users', userDoc.id);
                await updateDoc(userRef, {
                    username: updateUser.newUsername,
                    password: updateUser.newPassword
                });
                setMessage('User updated successfully.');
                fetchUsers(); // Refresh user list
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setMessage('Failed to update user.');
        } finally {
            setLoading(false);
            setUpdateUser({ oldUsername: '', newUsername: '', newPassword: '' });
        }
    };

    // Delete a user from Firestore
    const deleteUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const q = query(usersCollection, where('username', '==', deleteUsername));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setMessage('User not found.');
            } else {
                const userDoc = querySnapshot.docs[0];
                const userRef = doc(db, 'users', userDoc.id);
                await deleteDoc(userRef);
                setMessage('User deleted successfully.');
                fetchUsers(); // Refresh user list
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            setMessage('Failed to delete user.');
        } finally {
            setLoading(false);
            setDeleteUsername('');
        }
    };

    return (
        <section id="usersManagement">
            <h2>Users Management</h2>
            {message && <div className="message">{message}</div>}

            {/* Container for Update and Delete User Forms */}
            <div className="form-container">
                {/* Update User Form */}
                <form id="updateUserForm" onSubmit={updateExistingUser}>
                    <label>Current Username:</label>
                    <input
                        type="text"
                        value={updateUser.oldUsername}
                        onChange={(e) => setUpdateUser({ ...updateUser, oldUsername: e.target.value })}
                        required
                    />
                    <label>New Username:</label>
                    <input
                        type="text"
                        value={updateUser.newUsername}
                        onChange={(e) => setUpdateUser({ ...updateUser, newUsername: e.target.value })}
                        required
                    />
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={updateUser.newPassword}
                        onChange={(e) => setUpdateUser({ ...updateUser, newPassword: e.target.value })}
                        required
                    />
                    <button type="submit" disabled={loading}>Update User</button>
                </form>

                {/* Delete User Form */}
                <form id="deleteUserForm" onSubmit={deleteUser}>
                    <label>Username to delete:</label>
                    <input
                        type="text"
                        value={deleteUsername}
                        onChange={(e) => setDeleteUsername(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>Delete User</button>
                </form>
            </div>

            {/* Users List Table */}
            <h3>Users List:</h3>
            <table id="usersList">
                <thead>
                    <tr>
                        <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="1">No users found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
};

export default UsersManagement;
