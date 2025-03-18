
// Niveles de log
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Configuración global para los logs
const LOG_CONFIG = {
  // Nivel mínimo de logs que se mostrarán en consola
  minLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  // Si está habilitado el envío de logs a servicio externo (para producción)
  enableRemote: false,
  // Prefijo para todos los logs
  prefix: '[SEO-Manager]',
};

// Función para formatear mensajes de log
const formatMessage = (level: LogLevel, message: string, data?: any): string => {
  const timestamp = new Date().toISOString();
  const prefix = `${LOG_CONFIG.prefix} [${level.toUpperCase()}] [${timestamp}]`;
  return `${prefix} ${message}`;
};

// Función para determinar si un nivel de log debe mostrarse
const shouldLog = (level: LogLevel): boolean => {
  const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
  const minLevelIndex = levels.indexOf(LOG_CONFIG.minLevel as LogLevel);
  const currentLevelIndex = levels.indexOf(level);
  
  return currentLevelIndex >= minLevelIndex;
};

// API principal de logging
export const logger = {
  debug: (message: string, data?: any) => {
    if (shouldLog('debug')) {
      console.debug(formatMessage('debug', message), data !== undefined ? data : '');
    }
  },
  
  info: (message: string, data?: any) => {
    if (shouldLog('info')) {
      console.info(formatMessage('info', message), data !== undefined ? data : '');
    }
  },
  
  warn: (message: string, data?: any) => {
    if (shouldLog('warn')) {
      console.warn(formatMessage('warn', message), data !== undefined ? data : '');
    }
  },
  
  error: (message: string, error?: any) => {
    if (shouldLog('error')) {
      console.error(formatMessage('error', message), error || '');
      
      // Podemos capturar stacktrace si hay un error
      if (error instanceof Error) {
        console.error(error.stack);
      }
    }
  },
  
  // Crea un logger con un prefijo específico para un componente o servicio
  getLogger: (component: string) => {
    return {
      debug: (message: string, data?: any) => 
        logger.debug(`[${component}] ${message}`, data),
      info: (message: string, data?: any) => 
        logger.info(`[${component}] ${message}`, data),
      warn: (message: string, data?: any) => 
        logger.warn(`[${component}] ${message}`, data),
      error: (message: string, error?: any) => 
        logger.error(`[${component}] ${message}`, error),
    };
  }
};

export default logger;
