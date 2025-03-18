
// Import loglevel for browser-compatible logging
import log from 'loglevel';
import { supabase } from '@/integrations/supabase/client';

// Define interface for log context
interface LogContext {
  component?: string;
  path?: string;
  clientId?: string;
  error?: any;
  [key: string]: any; // Allow additional dynamic properties
}

// Configure the default logger
log.setLevel(log.levels.INFO);

// Optional prefix for log messages
const createPrefixer = (component: string) => {
  return (message: string) => `[${component}] ${message}`;
};

// Class for sending logs to Supabase
class SupabaseLogger {
  static async logToSupabase(level: string, message: string, meta: LogContext = {}) {
    try {
      // Extract data for storage
      const { component, ...rest } = meta;
      
      let userId = null;
      
      // Safely try to get user session
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          userId = data.session.user.id;
        }
      } catch (err) {
        console.error('Failed to get user session for logging:', err);
      }

      // Attempt to insert the log
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
  }
}

// Enable Supabase logging (disabled by default)
let enableSupabaseLogging = false;

// Public API to control Supabase logging
export const configureLogging = {
  enableSupabaseLogging: (enable = true) => {
    enableSupabaseLogging = enable;
    return enableSupabaseLogging;
  },
  setLogLevel: (level: log.LogLevelDesc) => {
    log.setLevel(level);
  }
};

// Logger class that wraps loglevel
class Logger {
  private component: string;
  private prefix: (message: string) => string;

  constructor(component: string) {
    this.component = component;
    this.prefix = createPrefixer(component);
  }

  private async _logToSupabase(level: string, message: string, context: LogContext = {}) {
    if (!enableSupabaseLogging) return;
    
    try {
      await SupabaseLogger.logToSupabase(level, message, {
        component: this.component,
        ...context
      });
    } catch (e: any) {
      console.error(`Failed to log to Supabase: ${e.message}`);
    }
  }

  error(message: string, context: LogContext = {}) {
    log.error(this.prefix(message), context);
    this._logToSupabase('error', message, context);
  }

  warn(message: string, context: LogContext = {}) {
    log.warn(this.prefix(message), context);
    this._logToSupabase('warn', message, context);
  }

  info(message: string, context: LogContext = {}) {
    log.info(this.prefix(message), context);
    this._logToSupabase('info', message, context);
  }

  debug(message: string, context: LogContext = {}) {
    log.debug(this.prefix(message), context);
    this._logToSupabase('debug', message, context);
  }

  trace(message: string, context: LogContext = {}) {
    log.trace(this.prefix(message), context);
    this._logToSupabase('trace', message, context);
  }
}

// Factory for creating component-specific loggers
class LoggerFactory {
  getLogger(component: string) {
    return new Logger(component);
  }
}

// Export singleton LoggerFactory
const logger = new LoggerFactory();
export default logger;
