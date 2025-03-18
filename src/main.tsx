
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import logger from './services/advancedLogService'

// Setup global error handling
const globalLogger = logger.getLogger('GlobalErrorHandler');

window.addEventListener('error', (event) => {
  globalLogger.error('Uncaught global error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

window.addEventListener('unhandledrejection', (event) => {
  globalLogger.error('Unhandled promise rejection', {
    reason: event.reason
  });
});

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  globalLogger.info("Application starting");
  createRoot(rootElement).render(<App />);
} catch (error) {
  globalLogger.error("Failed to render application", { error });
  // Add fallback UI for critical errors
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; margin-top: 50px; font-family: sans-serif;">
      <h1 style="color: #e53e3e;">Error al iniciar la aplicación</h1>
      <p>Ha ocurrido un problema al cargar la aplicación. Por favor, intenta recargar la página.</p>
      <button style="padding: 8px 16px; background: #3182ce; color: white; border: none; 
                    border-radius: 4px; margin-top: 20px; cursor: pointer;"
              onclick="window.location.reload()">
        Recargar
      </button>
    </div>
  `;
}
