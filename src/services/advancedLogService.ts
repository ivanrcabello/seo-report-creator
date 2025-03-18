
import winston from 'winston';
import { supabase } from '@/integrations/supabase/client';
import Transport from 'winston-transport';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4
};

// Custom JSON formatter for structured logs
const jsonFormatter = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Custom Supabase transport for Winston
class SupabaseTransport extends Transport {
  constructor(opts?: any) {
    super(opts);
  }

  // This method is called for each log
  async log(info: any, callback: Function) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    try {
      // Extract data to store in the database
      const { level, message, component, ...rest } = info;
      
      // Check if a user is authenticated
      let userId = null;
      try {
        // Fix: Get user session properly
        const { data, error } = await supabase.auth.getSession();
        if (data?.session?.user) {
          userId = data.session.user.id;
        }
      } catch (err) {
        console.error('Error getting user session:', err);
      }

      // Create log entry in database
      // Fix: Use proper table insertion
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
        // If error saving to Supabase, log to console
        console.error('Error saving log to Supabase:', error);
      }

      callback();
    } catch (error) {
      console.error('Error in SupabaseTransport:', error);
      callback();
    }
  }
}

// Create logger instance with Supabase transport
const createLogger = () => {
  // Only log to console in development
  const transports: Transport[] = [];
  
  // Add console transport in browser
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  );
  
  // Only add Supabase transport in non-development environment or explicitly enable it
  const enableSupabaseLogging = false; // Set to true when you want to enable database logging
  
  if (enableSupabaseLogging) {
    try {
      const supabaseTransport = new SupabaseTransport({
        level: 'info'
      });
      transports.push(supabaseTransport);
    } catch (error) {
      console.error('Failed to initialize Supabase logging:', error);
    }
  }

  return winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    levels,
    format: jsonFormatter,
    transports
  });
};

// Main logger instance
const rootLogger = createLogger();

// Logger class for specific components
class Logger {
  private logger: winston.Logger;
  private component: string;

  constructor(component: string) {
    this.logger = rootLogger;
    this.component = component;
  }

  // Methods for different log levels
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

// Factory for creating component-specific loggers
class LoggerFactory {
  getLogger(component: string): Logger {
    return new Logger(component);
  }
}

// Export singleton LoggerFactory instance
const logger = new LoggerFactory();
export default logger;
