import Header from '../components/Header'
import { useState } from 'react';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(email + ' ' + username);
        
        try {
                const response = await fetch(`http://localhost:8000/register/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: username,  // Must match UserIn field names
                        email: email     // Must match UserIn field names
                    }),
                });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to fetch user');
            }

            const userData = await response.json();
            //setMessage(`User found: ${JSON.stringify(userData)}`);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Header/>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="button-63" disabled={isLoading}>
                    {isLoading ? 'Checking...' : 'Check User'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}