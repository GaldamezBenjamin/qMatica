// Example component or function in your React app
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth'; // or createUserWithEmailAndPassword for new users
import { auth } from '../../../firebaseClient'; // Adjust path as needed

function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [idToken, setIdToken] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setIdToken('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Get the ID Token
            const token = await user.getIdToken();
            setIdToken(token);
            setMessage('Login successful! Your Firebase ID Token is below.');
            console.log('Firebase User UID:', user.uid);
            console.log('Firebase ID Token:', token);

            // You can now use this token to make requests to your backend
            // Example: makeAuthenticatedRequest(token);

            // Optionally, force token refresh if custom claims were just set
            // For example, if you just ran createAdmin.js and want to ensure the 'admin' role is in the token
            await user.getIdToken(true); // Forces a refresh
            const refreshedToken = await user.getIdToken();
            console.log('Refreshed Firebase ID Token (might contain new custom claims):', refreshedToken);
            setIdToken(refreshedToken);


        } catch (error) {
            console.error('Error during login:', error);
            setMessage(`Login failed: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Login to Get Firebase ID Token</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>

            {message && <p>{message}</p>}
            {idToken && (
                <div>
                    <h3>Your Firebase ID Token:</h3>
                    <textarea
                        readOnly
                        value={idToken}
                        rows="10"
                        cols="80"
                        style={{ width: '100%', wordWrap: 'break-word' }}
                    />
                    <p>Copy this token and paste it into your `users.rest` file.</p>
                </div>
            )}
        </div>
    );
}

export default LoginComponent;