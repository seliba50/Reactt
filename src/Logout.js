import React from 'react';

function Logout({ onLogout }) {
    return (
        <section id="logout">
            <h2>Logout</h2>
            <button onClick={onLogout}>Logout</button>
        </section>
    );
}

export default Logout;
