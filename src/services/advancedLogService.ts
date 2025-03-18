
// Importamos solo las utilidades básicas que necesitamos
import { supabase } from '@/integrations/supabase/client';

// Definir niveles de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4
};

// Clase básica para transporte de logs
class BrowserTransport {
  constructor() {}

  log(level, message, meta = {}) {
    return new Promise((resolve) => {
      // Estrategia básica de logging en consola del navegador
      switch (level) {
        case 'error':
          console.error(`[${meta.component || 'App'}]`, message, meta);
          break;
        case 'warn':
          console.warn(`[${meta.component || 'App'}]`, message, meta);
          break;
        case 'info':
          console.info(`[${meta.component || 'App'}]`, message, meta);
          break;
        case 'debug':
        case 'trace':
        default:
          console.log(`[${meta.component || 'App'}][${level}]`, message, meta);
          break;
      }
      resolve();
    });
  }
}

// Clase para enviar logs a Supabase
class SupabaseTransport extends BrowserTransport {
  constructor() {
    super();
  }

  async log(level, message, meta = {}) {
    // Primero logamos en consola para tener un respaldo
    await super.log(level, message, meta);

    try {
      // Extraer datos para almacenar en la base de datos
      const { component, ...rest } = meta;
      
      let userId = null;
      
      // Intentar obtener la sesión del usuario de forma segura
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          userId = data.session.user.id;
        }
      } catch (err) {
        console.error('Failed to get user session for logging:', err);
      }

      // Solo intentar insertar el log si creemos que hay conexión a Supabase
      const { error } = await supabase
        .from('application_logs')
        .insert({
          level,
          message,
          component,
          user_id: userId,
          path: rest.path || null,
          client_id: rest.clientId || null,
          context: rest
        });

      if (error) {
        // Logar en consola pero no lanzar error - esto no debería romper la app
        console.error('Error saving log to Supabase:', error);
      }
    } catch (insertError) {
      console.error('Exception in Supabase log insert:', insertError);
    }
  }
}

// Crear una clase Logger para la aplicación
class Logger {
  constructor(component) {
    this.component = component;
    this.transport = new BrowserTransport();
    
    // Deshabilitar el logging a Supabase durante la carga inicial
    const enableSupabaseLogging = false;
    
    if (enableSupabaseLogging) {
      try {
        this.supabaseTransport = new SupabaseTransport();
      } catch (error) {
        console.error('Failed to initialize Supabase logging:', error);
      }
    }
  }

  // Método seguro de logging que captura errores
  async _safeLog(level, message, context = {}) {
    try {
      // Siempre usar el transporte básico
      await this.transport.log(level, message, {
        component: this.component,
        ...context
      });
      
      // Si existe el transporte de Supabase, intentar usarlo
      if (this.supabaseTransport) {
        try {
          await this.supabaseTransport.log(level, message, {
            component: this.component,
            ...context
          });
        } catch (e) {
          console.error(`Failed to log to Supabase: ${e.message}`);
        }
      }
    } catch (e) {
      // Si el registro falla, usar console como fallback
      console.error(`Logging error: ${e.message}`);
      const consoleMethod = level === 'error' ? console.error : 
                            level === 'warn' ? console.warn : 
                            level === 'info' ? console.info : console.debug;
      consoleMethod(`[${this.component}] ${message}`, context);
    }
  }

  // Métodos para diferentes niveles de log
  error(message, context = {}) {
    this._safeLog('error', message, context);
  }

  warn(message, context = {}) {
    this._safeLog('warn', message, context);
  }

  info(message, context = {}) {
    this._safeLog('info', message, context);
  }

  debug(message, context = {}) {
    this._safeLog('debug', message, context);
  }

  trace(message, context = {}) {
    this._safeLog('trace', message, context);
  }
}

// Factory para crear loggers específicos de componentes
class LoggerFactory {
  getLogger(component) {
    return new Logger(component);
  }
}

// Exportar singleton LoggerFactory
const logger = new LoggerFactory();
export default logger;
