import Header from '../components/Header';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8000/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const userData = await response.json();
      localStorage.setItem('userid', userData);
      localStorage.setItem('loggedIn', 'true');
      navigate('/water');
      
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Header/>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Please enter your credentials to login</p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {})
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  formContainer: {
    maxWidth: '450px',
    width: '90%',
    margin: '2rem auto',
    padding: '2.5rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  title: {
    textAlign: 'center',
    color: '#2d3748',
    fontSize: '1.8rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    textAlign: 'center',
    color: '#718096',
    marginBottom: '2rem',
    fontSize: '0.95rem',
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
    color: '#4a5568',
    fontWeight: '500',
  },
  input: {
    padding: '0.9rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.2s',
  },
  inputFocus: {
    outline: 'none',
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
  },
  button: {
    padding: '1rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '0.5rem',
  },
  buttonHover: {
    backgroundColor: '#5a67d8',
  },
  buttonDisabled: {
    backgroundColor: '#c3dafe',
    cursor: 'not-allowed',
  },
  error: {
    backgroundColor: '#fff5f5',
    color: '#e53e3e',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
  },
  footerText: {
    textAlign: 'center',
    color: '#718096',
    marginTop: '2rem',
    fontSize: '0.95rem',
  },
  link: {
    color: '#667eea',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  
};
