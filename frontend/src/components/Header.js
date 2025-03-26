import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; // Optional for styling

function Header({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      {/* Logo with home link */}
      <div className="logo-container" onClick={() => navigate('/')}>
        <img src="/logo.png" alt="Water Tracker Logo" className="logo" />
        <h1>Water Tracker</h1>
      </div>

      {/* Navigation Links */}
      <nav className="main-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>

      {/* Auth Section */}
      <div className="auth-section">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="profile-link">
              <span>👤</span>
            </Link>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </>
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