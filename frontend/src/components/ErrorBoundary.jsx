import { Component } from 'react';
import './ErrorBoundary.css';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h1>Algo salió mal</h1>
            <p>Ha ocurrido un error inesperado. Por favor, intente recargar la página.</p>
            <button type="button" className="error-boundary-btn" onClick={this.handleReload}>
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
