
import { createClient } from '@supabase/supabase-js';
import winston from 'winston';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Obtener información del entorno
const ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = ENV === 'production' ? 'info' : 'debug';

// Identificador único de sesión para agrupar logs relacionados
const SESSION_ID = uuidv4();

// Definir niveles personalizados y colores para la consola
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Añadir colores a winston
winston.addColors(colors);

// Crear un formateador JSON personalizado
const jsonFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  // Extraer userId del contexto de autenticación si está disponible
  let userId = null;
  try {
    const session = supabase.auth.session();
    if (session?.user) {
      userId = session.user.id;
    }
  } catch (e) {
    // No hacer nada si no se puede obtener el usuario
  }

  // Crear objeto de log estructurado
  const logObject = {
    timestamp,
    level,
    message,
    session_id: SESSION_ID,
    user_id: userId,
    ...metadata,
  };

  return JSON.stringify(logObject);
});

// Crear un transportador personalizado para Supabase
class SupabaseTransport extends winston.Transport {
  constructor(opts?: winston.transport.TransportStreamOptions) {
    super(opts);
  }

  async log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    try {
      // Extraer información básica
      const { level, message, component, path, context, timestamp } = info;
      
      // Extraer userId si está disponible
      let userId = null;
      let clientId = null;
      
      try {
        const session = supabase.auth.getSession();
        if (session) {
          userId = session.data.session?.user.id;
        }
      } catch (e) {
        // Ignorar errores al obtener el usuario
      }

      // Si hay un contexto con clientId, extraerlo
      if (context && context.clientId) {
        clientId = context.clientId;
      }

      // Enviar a Supabase solo si no estamos en modo prueba
      if (ENV !== 'test') {
        const { error } = await supabase.from('application_logs').insert({
          level,
          message,
          path,
          user_id: userId,
          component,
          context: typeof context === 'object' ? context : { data: context },
          client_id: clientId,
          session_id: SESSION_ID
        });

        if (error) {
          console.error('Error saving log to Supabase:', error);
        }
      }
    } catch (error) {
      console.error('Error in Supabase transport:', error);
    }

    callback();
  }
}

// Configurar logger
const logger = winston.createLogger({
  level: LOG_LEVEL,
  levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    jsonFormat
  ),
  defaultMeta: { service: 'seo-manager' },
  transports: [
    // Consola para desarrollo
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(
          ({ level, message, timestamp, component, ...metadata }) => {
            let msg = `${timestamp} [${level}]`;
            
            if (component) {
              msg += ` [${component}]`;
            }
            
            msg += `: ${message}`;
            
            // Mostrar metadata pero limpiar para no sobrecargar la consola
            const cleanMetadata = { ...metadata };
            delete cleanMetadata.service;
            delete cleanMetadata.session_id;
            
            if (Object.keys(cleanMetadata).length > 0) {
              msg += ` ${JSON.stringify(cleanMetadata)}`;
            }
            
            return msg;
          }
        )
      ),
    }),
    // Transportador Supabase para todos los entornos excepto pruebas
    ...(ENV !== 'test' ? [new SupabaseTransport()] : []),
  ],
  // Evitar que la aplicación se cierre si hay un error en el logging
  exitOnError: false,
});

// Función para crear loggers específicos para componentes
export const getLogger = (component: string) => {
  return {
    debug: (message: string, context: any = {}) => 
      logger.debug(message, { component, context }),
    
    info: (message: string, context: any = {}) => 
      logger.info(message, { component, context }),
    
    warn: (message: string, context: any = {}) => 
      logger.warn(message, { component, context }),
    
    error: (message: string, error?: any) => {
      const errorObj = error instanceof Error 
        ? { 
            message: error.message, 
            stack: error.stack,
            name: error.name
          }
        : error;
      
      logger.error(message, { 
        component, 
        context: { error: errorObj } 
      });
    },
    
    http: (message: string, context: any = {}) => 
      logger.http(message, { component, context }),
  };
};

// Proporcionar un logger por defecto para uso general
export default {
  debug: (message: string, context: any = {}) => 
    logger.debug(message, { context }),
  
  info: (message: string, context: any = {}) => 
    logger.info(message, { context }),
  
  warn: (message: string, context: any = {}) => 
    logger.warn(message, { context }),
  
  error: (message: string, error?: any) => {
    const errorObj = error instanceof Error 
      ? { 
          message: error.message, 
          stack: error.stack,
          name: error.name
        }
      : error;
    
    logger.error(message, { 
      context: { error: errorObj } 
    });
  },
  
  http: (message: string, context: any = {}) => 
    logger.http(message, { context }),
  
  getLogger
};
