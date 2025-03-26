import Header from '../components/Header';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        
        try {
            const response = await fetch(`http://localhost:8000/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: username,
                    email: email
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Registration failed');
            }

            navigate('/login');
        } catch (error) {
            setMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <Header/>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Register</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input 
                            type="text" 
                            placeholder="Enter your username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <button 
                        type="submit" 
                        style={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                {message && <p style={styles.message}>{message}</p>}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    formContainer: {
        maxWidth: '400px',
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '1.5rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.9rem',
        color: '#555',
        fontWeight: '500',
    },
    input: {
        padding: '0.8rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem',
        transition: 'border-color 0.3s',
    },
    inputFocus: {
        outline: 'none',
        borderColor: '#646cff',
        boxShadow: '0 0 0 2px rgba(100, 108, 255, 0.2)',
    },
    button: {
        padding: '0.8rem',
        backgroundColor: '#646cff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    buttonHover: {
        backgroundColor: '#535bf2',
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
        cursor: 'not-allowed',
    },
    message: {
        marginTop: '1rem',
        padding: '0.8rem',
        borderRadius: '4px',
        backgroundColor: '#ffebee',
        color: '#d32f2f',
        textAlign: 'center',
    },
};