import client, { isDemoMode } from './apiClient';

// Token expiration time in milliseconds (24 hours)
const TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

// --- Demo mock data (used when VITE_DEMO_MODE=true) ---
const DEMO_PLACAS = [
  { placa: 'DEMO-001' },
  { placa: 'DEMO-002' },
  { placa: 'DEMO-003' },
];

function getDemoHistorial() {
  return {
    historial: [
      {
        fecha: '2024-06-15T00:00:00.000Z',
        orden: 'ORD-1001',
        km: '45000',
        asesor: 'Asesor Demo',
        CANTTotal: 3,
        tipo: [
          {
            tipoName: 'Preventivo',
            CANT: 2,
            tipoArray: [
              { cant: 1, codigo: 'COD-A01', detalle: 'Cambio de aceite motor' },
              { cant: 1, codigo: 'COD-A02', detalle: 'Filtro de aceite' },
            ],
          },
          {
            tipoName: 'Correctivo',
            CANT: 1,
            tipoArray: [
              { cant: 1, codigo: 'COD-B01', detalle: 'Revisión frenos (demo)' },
            ],
          },
        ],
      },
      {
        fecha: '2024-05-10T00:00:00.000Z',
        orden: 'ORD-1002',
        km: '42000',
        asesor: 'Asesor Demo',
        CANTTotal: 2,
        tipo: [
          {
            tipoName: 'Preventivo',
            CANT: 2,
            tipoArray: [
              { cant: 1, codigo: 'COD-A03', detalle: 'Alineación y balanceo' },
              { cant: 1, codigo: 'COD-A04', detalle: 'Rotación de neumáticos' },
            ],
          },
        ],
      },
    ],
  };
}

// Store token with expiration timestamp
function storeTokenWithExpiration(token) {
  const expirationTime = Date.now() + TOKEN_EXPIRATION_TIME;
  localStorage.setItem('authToken', token);
  localStorage.setItem('tokenExpiration', expirationTime.toString());
}

// Check if token is expired
function isTokenExpired() {
  const expirationTime = localStorage.getItem('tokenExpiration');
  if (!expirationTime) return true;
  
  return Date.now() > parseInt(expirationTime);
}

// Clear expired token
function clearExpiredToken() {
  if (isTokenExpired()) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('user');
    return true;
  }
  return false;
}

// Get valid token or null if expired
function getValidToken() {
  if (isTokenExpired()) {
    clearExpiredToken();
    return null;
  }
  return localStorage.getItem('authToken');
}

export async function login(username, password) {
  try {
    if (isDemoMode) {
      const demoUser = username?.trim() || 'Demo User';
      const demoToken = 'demo-token-not-real';
      storeTokenWithExpiration(demoToken);
      localStorage.setItem('user', JSON.stringify(demoUser));
      return { token: demoToken, userName: demoUser };
    }
    const response = await client.post('/users/login', { username, password });
    storeTokenWithExpiration(response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.userName));
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('tokenExpiration');
  localStorage.removeItem('user');
}

export async function fetchPlacas() {
  try {
    if (isDemoMode) {
      await new Promise((r) => setTimeout(r, 300));
      return { placas: DEMO_PLACAS };
    }
    if (isTokenExpired()) {
      clearExpiredToken();
      throw new Error('Token has expired. Please login again.');
    }
    const user = localStorage.getItem('user');
    if (!user) {
      throw new Error('No user found in localStorage. Please login again.');
    }
    const response = await client.get(`/report/placas/${encodeURIComponent(user)}`);
    if (!response.data) {
      throw new Error('Invalid response format from server');
    }
    return response.data;
  } catch (error) {
    console.error('Failed to fetch placas:', error.message);
    throw error;
  }
}

export async function getHistorialData(placa, startDate, endDate) {
  try {
    if (isDemoMode) {
      await new Promise((r) => setTimeout(r, 400));
      return getDemoHistorial();
    }
    if (isTokenExpired()) {
      clearExpiredToken();
      throw new Error('Token has expired. Please login again.');
    }
    const response = await client.get(`/report/historial/${placa}?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch historial data:', error);
    throw error;
  }
}

// Export utility functions for use in other components
export { isTokenExpired, clearExpiredToken, getValidToken };

