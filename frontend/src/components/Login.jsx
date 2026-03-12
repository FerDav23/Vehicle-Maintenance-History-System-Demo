import { useState } from 'react';
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
  const navigate = useNavigate();

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
          <div className="login-demo-note" role="alert" aria-live="polite">
            <strong className="login-demo-note-title">Demo mode</strong>
            <p className="login-demo-note-text">Use <strong>any username</strong> and <strong>any password</strong> to sign in. No account required.</p>
          </div>
        )}
      </div>
    </div>
  );
} 