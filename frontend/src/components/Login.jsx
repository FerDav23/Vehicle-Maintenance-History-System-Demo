import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/user';
import { isDemoMode } from '../services/apiClient';
import logoCIMImg from '../assets/CIM_LOGOTIPO.png';
import logoImg from '../assets/FJ-LOGOTIPO.png';
import './Login.css';

export default function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDemoPopup, setShowDemoPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDemoMode) setShowDemoPopup(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(username, password);
      if (setIsAuthenticated) setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error during login or navigation:', err);
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      {isDemoMode && showDemoPopup && (
        <div
          className="demo-popup-overlay"
          onClick={() => setShowDemoPopup(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-popup-title"
        >
          <div
            className="demo-popup-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="demo-popup-close"
              onClick={() => setShowDemoPopup(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="demo-popup-icon">✨</div>
            <h2 id="demo-popup-title" className="demo-popup-title">Demo mode</h2>
            <p className="demo-popup-subtitle">How to sign in (no account needed)</p>
            <ul className="demo-popup-steps">
              <li>Enter <strong>any username</strong> — e.g. <em>demo</em>, <em>test</em>. <span className="demo-popup-required">Do not leave in blank.</span></li>
              <li>Enter <strong>any password</strong> — e.g. <em>123</em>, <em>password</em> . <span className="demo-popup-required">Do not leave in blank.</span></li>
              <li>Click <strong>Sign In</strong> — you’ll be logged in immediately</li>
            </ul>
            <p className="demo-popup-note">This is a simulated login. No real credentials are used.</p>
            <button
              type="button"
              className="demo-popup-cta"
              onClick={() => setShowDemoPopup(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <div className="login-form">
        <div className="logo-container">
        <img src={logoImg} alt="CIM Logo" className="login-logo" style={{ 
            maxWidth: '70px', 
            height: '70px', 
            position: 'absolute',
            zIndex: 1,
            marginRight: '335px',
            marginTop: '-32px'
           }} />
          <img src={logoCIMImg} alt="CIM Logo" className="login-logo" />
        </div>
        <h2>Sign In</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Sign In</button>
        
        </form>
        {isDemoMode && (
          <button
            type="button"
            className="login-demo-reopen"
            onClick={() => setShowDemoPopup(true)}
          >
            View demo instructions
          </button>
        )}
      </div>
    </div>
  );
} 