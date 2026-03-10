import { useState, useEffect, useRef } from 'react';
import { fetchPlacas, logout } from '../services/user';
import { isDemoMode } from '../services/apiClient';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import InfoTable from './InfoTable';
import InfoTableMobile from './InfoTableMobile';

function ChevronDownIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="1em" height="1em" fill="currentColor" aria-hidden>
      <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
    </svg>
  );
}

export default function Dashboard({setIsAuthenticated}) {
  const [placas, setPlacas] = useState([]);
  const [selectedPlaca, setSelectedPlaca] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [userName, setUserName] = useState('');
  const [placasError, setPlacasError] = useState(null);
  const [placasLoading, setPlacasLoading] = useState(true);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const loadPlacas = async () => {
    setPlacasError(null);
    setPlacasLoading(true);
    try {
      const data = await fetchPlacas();
      setPlacas(data.placas);
    } catch (error) {
      const message = error?.message?.includes('Token')
        ? 'Sesión expirada. Por favor, inicie sesión de nuevo.'
        : 'No se pudieron cargar las placas. Intente de nuevo.';
      setPlacasError(message);
      if (import.meta.env.DEV) {
        console.error('Error loading plates:', error);
      }
    } finally {
      setPlacasLoading(false);
    }
  };

  useEffect(() => {
    // Load user name from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      // Remove quotes from the user name
      setUserName(user.replace(/"/g, ''));
    }
    loadPlacas();

    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (dropdownOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [dropdownOpen]);


  const handlePlacaSelect = (placa) => {
    setSelectedPlaca(placa);
    setSearchTerm(placa);
    setDropdownOpen(false);
  };

  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) {
      setSearchTerm(selectedPlaca);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputClick = (e) => {
    e.stopPropagation(); // Prevent the dropdown from closing when clicking input
    if (!dropdownOpen) {
      setDropdownOpen(true);
    }
  };

  const getFilteredPlacas = () => {
    if (!searchTerm) return placas;
    
    return placas.filter(item => 
      item.placa.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
      // Sort by best match (starts with search term first)
      const aStartsWith = a.placa.toLowerCase().startsWith(searchTerm.toLowerCase());
      const bStartsWith = b.placa.toLowerCase().startsWith(searchTerm.toLowerCase());
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      // Then sort alphabetically
      return a.placa.localeCompare(b.placa);
    });
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false)
    navigate('/login');
  };


  return (
    <div className='main-container'>
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Reporte Historial Mantenimiento</h2>
        <button onClick={handleLogout} className="logout-btn">
          Cerrar Sesión
        </button>
      </div>
      
      {isDemoMode && (
        <div className="demo-data-banner" role="status">
          Datos de demostración. No se conecta a un backend real.
        </div>
      )}
      <div className="welcome-section">
        <div className="welcome-content">
          <h3 className="welcome-title">
            ¡Bienvenido{userName ? ` ${userName}` : ''}!
          </h3>
          <p className="welcome-message">
            Bienvenido al sistema de gestión de historial de mantenimiento.
          </p>
        </div>
      </div>
      
      {placasError && (
        <div className="placas-error-banner">
          <span>{placasError}</span>
          <button type="button" className="placas-retry-btn" onClick={loadPlacas}>
            Reintentar
          </button>
          {placasError.includes('Sesión expirada') && (
            <button type="button" className="placas-retry-btn" onClick={handleLogout}>
              Ir a iniciar sesión
            </button>
          )}
        </div>
      )}
      <div className="filter-container">
        <form>
          <div className="filter-row">
            <div className="form-group">
              <label htmlFor="placa">Seleccione Placa:</label>
              {placasLoading && !placasError && (
                <span className="placas-loading" aria-hidden="true">Cargando placas...</span>
              )}
              <div className={`custom-select-container ${dropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
                <div 
                  className="custom-select-header"
                  onClick={handleToggleDropdown}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    className="custom-select-input"
                    placeholder="Seleccionar..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onClick={handleInputClick}
                  />
                  <ChevronDownIcon className="dropdown-icon" />
                </div>
                {dropdownOpen && (
                  <div className="custom-select-options">
                    {getFilteredPlacas().length > 0 ? (
                      getFilteredPlacas().map((placa) => (
                        <div 
                          key={placa.placa} 
                          className={`custom-select-option ${selectedPlaca === placa.placa ? 'selected' : ''}`}
                          onClick={() => handlePlacaSelect(placa.placa)}
                        >
                          {placa.placa}
                        </div>
                      ))
                    ) : (
                      <div className="custom-select-no-results">
                        No se encontraron placas
                      </div>
                    )}
                  </div>
                )}
                <input 
                  type="hidden"
                  id="placa"
                  name="placa"
                  value={selectedPlaca}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="startDate">Fecha inicio:</label>
              <input 
                id="startDate" 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate">Fecha fin:</label>
              <input 
                id="endDate" 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="codigo">Código:</label>
              <input 
                id="codigo" 
                type="text" 
                value={codigo} 
                onChange={(e) => setCodigo(e.target.value)}
                className="form-input"
                placeholder="Ingrese código"
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción de Mantenimiento:</label>
              <input 
                id="descripcion" 
                type="text" 
                value={descripcion} 
                onChange={(e) => setDescripcion(e.target.value)}
                className="form-input"
                placeholder="Ingrese descripción"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
    {isMobile ? (
      <InfoTableMobile 
        placa={selectedPlaca} 
        startDate={startDate} 
        endDate={endDate} 
        codigo={codigo}
        descripcion={descripcion}
      />
    ) : (
      <InfoTable 
        placa={selectedPlaca} 
        startDate={startDate} 
        endDate={endDate} 
        codigo={codigo}
        descripcion={descripcion}
      />
    )}
    </div>
  );
} 