
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import logger from './services/advancedLogService'

// Setup global error handling
const globalLogger = logger.getLogger('GlobalErrorHandler');

// Definir una función para renderizar un error UI
function renderErrorUI(message: string) {
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; margin-top: 50px; font-family: sans-serif;">
      <h1 style="color: #e53e3e;">Error al iniciar la aplicación</h1>
      <p>${message}</p>
      <p>Por favor, intenta recargar la página o contacta al soporte técnico.</p>
      <div style="margin-top: 20px; padding: 10px; background: #f8f8f8; border-radius: 4px; text-align: left; max-width: 80%; margin-left: auto; margin-right: auto;">
        <p style="font-weight: bold;">Detalles técnicos:</p>
        <pre style="overflow-x: auto; white-space: pre-wrap; word-break: break-word;">${message}</pre>
      </div>
      <button style="padding: 8px 16px; background: #3182ce; color: white; border: none; 
                    border-radius: 4px; margin-top: 20px; cursor: pointer;"
              onclick="window.location.reload()">
        Recargar
      </button>
    </div>
  `;
}

// Capturar errores no controlados
window.addEventListener('error', (event) => {
  const errorMessage = `Uncaught global error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`;
  globalLogger.error(errorMessage, {
    error: event.error
  });
  
  // Si la aplicación aún no se ha renderizado, mostrar UI de error
  if (!document.getElementById('root')?.hasChildNodes()) {
    renderErrorUI(errorMessage);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  const errorMessage = `Unhandled promise rejection: ${event.reason}`;
  globalLogger.error(errorMessage, {
    reason: event.reason
  });
  
  // Si la aplicación aún no se ha renderizado, mostrar UI de error
  if (!document.getElementById('root')?.hasChildNodes()) {
    renderErrorUI(errorMessage);
  }
});

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  globalLogger.info("Application starting");
  
  // Asegurar que cualquier error aquí sea capturado
  try {
    createRoot(rootElement).render(<App />);
    globalLogger.info("Application rendered successfully");
  } catch (renderError) {
    globalLogger.error("React render failed", { error: renderError });
    renderErrorUI(`Error al renderizar la aplicación: ${renderError instanceof Error ? renderError.message : String(renderError)}`);
  }
} catch (error) {
  globalLogger.error("Failed to initialize application", { error });
  
  // Añadir fallback UI para errores críticos
  renderErrorUI(`Error crítico de inicialización: ${error instanceof Error ? error.message : String(error)}`);
}
