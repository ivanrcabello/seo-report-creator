
import winston from 'winston';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Definir los niveles de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4
};

// Formateador personalizado para logs estructurados en JSON
const jsonFormatter = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Creamos un transporte personalizado para Supabase
class SupabaseTransport extends winston.Transport {
  constructor(opts?: any) {
    super(opts);
    this.name = 'supabase';
    this.level = opts?.level || 'info';
  }

  // Este método se llama cada vez que se genera un log
  async log(info: any, callback: Function) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    try {
      // Extraer datos para almacenar en la base de datos
      const { level, message, component, ...rest } = info;
      
      // Verificar si hay un usuario autenticado
      let userId = null;
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user) {
        userId = sessionData.session.user.id;
      }

      // Crear entrada de log en la base de datos
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
        // Si hay error al guardar en Supabase, registrarlo en consola
        console.error('Error al guardar log en Supabase:', error);
      }

      callback();
    } catch (error) {
      console.error('Error en SupabaseTransport:', error);
      callback();
    }
  }
}

// Crear una instancia del logger con el transporte de Supabase
const createLogger = () => {
  const supabaseTransport = new SupabaseTransport({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  });

  // También enviamos los logs a la consola en desarrollo
  const transports = [
    supabaseTransport,
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ];

  return winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    levels,
    format: jsonFormatter,
    transports
  });
};

// Instancia del logger principal
const rootLogger = createLogger();

// Clase Logger que permite crear loggers específicos para componentes
class Logger {
  private logger: winston.Logger;
  private component: string;

  constructor(component: string) {
    this.logger = rootLogger;
    this.component = component;
  }

  // Métodos para los diferentes niveles de log
  error(message: string, context: any = {}) {
    this.logger.log({
      level: 'error',
      message,
      component: this.component,
      ...context
    });
  }

  warn(message: string, context: any = {}) {
    this.logger.log({
      level: 'warn',
      message,
      component: this.component,
      ...context
    });
  }

  info(message: string, context: any = {}) {
    this.logger.log({
      level: 'info',
      message,
      component: this.component,
      ...context
    });
  }

  debug(message: string, context: any = {}) {
    this.logger.log({
      level: 'debug',
      message,
      component: this.component,
      ...context
    });
  }

  trace(message: string, context: any = {}) {
    this.logger.log({
      level: 'trace',
      message,
      component: this.component,
      ...context
    });
  }
}

// Factory para crear loggers específicos para componentes
class LoggerFactory {
  getLogger(component: string): Logger {
    return new Logger(component);
  }
}

// Exportar una instancia única de LoggerFactory
const logger = new LoggerFactory();
export default logger;
