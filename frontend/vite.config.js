import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	  plugins: [react()],
	  server: {
		      host: '0.0.0.0',
		      allowedHosts: ['sistema.cim-clientes.com'],
		      port: 5173,
		    },
});

