import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/user";
import { isDemoMode } from "../services/apiClient";
import './QrBridge.css';

export default function QrBridge({ setIsAuthenticated }) {
  const [status, setStatus] = useState("Processing sign in…");
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    // Ensure variables are strings
    const usernameStr = String(username || '');
    const passwordStr = String(password || '');
    
    try {
        setError('');
        setStatus("Signing in…");
        await login(usernameStr, passwordStr);
        if (setIsAuthenticated) setIsAuthenticated(true);
        navigate('/dashboard');
      } catch (err) {
        console.error('Error during login or navigation:', err);
        setError('Invalid credentials. Please contact technical support.');
        setStatus("Authentication error");
      }
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    // Support generic demo params (demoUser, demoKey) and legacy param names
    const userNameUrl =
      url.searchParams.get("demoUser") ??
      url.searchParams.get("userName");
    const passwordUrl =
      url.searchParams.get("demoKey") ?? url.searchParams.get("rucCi");

    if (!userNameUrl || !passwordUrl) {
      setStatus("QR code is missing required parameters.");
      setError("Missing information required to sign in.");
      return;
    }
    handleLogin(userNameUrl, passwordUrl);
  }, []);

  const getStatusClass = () => {
    if (error) return 'error';
    if (status.includes('Processing') || status.includes('Signing')) return 'processing';
    if (status.includes('Error')) return 'error';
    return '';
  };

  return (
    <div className="qr-bridge-container">
      <div className="qr-bridge-form">
        {isDemoMode && (
          <div className="demo-banner" role="status">
            Demo mode: simulated sign-in. Not connected to a real system.
          </div>
        )}
        <h2>Sign In</h2>
        {error && <div className="error-message">{error}</div>}
        <div className={`status-message ${getStatusClass()}`}>
          <p>{status}</p>
        </div>
      </div>
    </div>
  );
}
