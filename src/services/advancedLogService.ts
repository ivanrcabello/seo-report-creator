
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
      
      let userId = null;
      
      // Try to get the user session safely
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          userId = data.session.user.id;
        }
      } catch (err) {
        console.error('Failed to get user session for logging:', err);
      }

      // Only attempt to insert log if the application_logs table exists
      try {
        // Try to verify if the table exists first
        const { error: tableCheckError } = await supabase
          .from('application_logs')
          .select('id')
          .limit(1);
        
        // If table doesn't exist or we can't access it, log to console only
        if (tableCheckError) {
          console.warn('Unable to access application_logs table, logging to console only:', tableCheckError.message);
          return callback();
        }
        
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
          console.error('Error saving log to Supabase:', error);
        }
      } catch (insertError) {
        console.error('Exception in Supabase log insert:', insertError);
      }

      callback();
    } catch (error) {
      console.error('Error in SupabaseTransport:', error);
      callback();
    }
  }
}

// Create a fallback console-only logger for extreme cases
const createFallbackLogger = () => {
  return winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ]
  });
};

// Create logger instance with configurable transports
const createLogger = () => {
  try {
    // Start with base transports array
    const transports: Transport[] = [];
    
    // Always add console transport
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    );
    
    // Enable Supabase logging - now with additional safety
    const enableSupabaseLogging = true;
    
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
  } catch (e) {
    console.error('Failed to create logger, using fallback:', e);
    return createFallbackLogger();
  }
};

// Main logger instance with try-catch for safety
let rootLogger: winston.Logger;
try {
  rootLogger = createLogger();
} catch (e) {
  console.error('Critical error creating root logger:', e);
  rootLogger = createFallbackLogger();
}

// Logger class for specific components
class Logger {
  private logger: winston.Logger;
  private component: string;

  constructor(component: string) {
    this.logger = rootLogger;
    this.component = component;
  }

  // Safe logging method that catches errors
  private safeLog(level: string, message: string, context: any = {}) {
    try {
      this.logger.log({
        level,
        message,
        component: this.component,
        ...context
      });
    } catch (e) {
      console.error(`Failed to log ${level} message:`, message, e);
    }
  }

  // Methods for different log levels
  error(message: string, context: any = {}) {
    this.safeLog('error', message, context);
  }

  warn(message: string, context: any = {}) {
    this.safeLog('warn', message, context);
  }

  info(message: string, context: any = {}) {
    this.safeLog('info', message, context);
  }

  debug(message: string, context: any = {}) {
    this.safeLog('debug', message, context);
  }

  trace(message: string, context: any = {}) {
    this.safeLog('trace', message, context);
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
