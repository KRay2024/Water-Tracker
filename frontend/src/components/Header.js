import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; // Optional for styling
import logo from '../logo.png'; // Adjust path as needed

function Header({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const logged = localStorage.getItem('loggedIn');

  const handleLogout = () => {
    localStorage.setItem('loggedIn', 'false');
    localStorage.setItem('userid', -1);
    navigate('/'); // Redirect to home after logout
  };

  return (
    <header className="app-header">

      <div className="logo-container" onClick={() => navigate('/')}>
      <img src={logo} alt="Water Tracker Logo" className="logo" />
        <h1>Water Tracker</h1>
      </div>
      <nav className="main-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          {logged === 'true' ? (
            <li><Link to="/water">Water Page</Link></li>
          ) : null}
        </ul>
      </nav>

      
      <div className="auth-section">
        {logged === 'true' ? (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        ) : (
          <>
            <button 
              onClick={() => navigate('/login')} 
              className="login-btn"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')} 
              className="register-btn"
            >
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;