
import { useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import logger from '@/services/advancedLogService';

/**
 * Custom hook to get a component-specific logger that
 * automatically includes user and route information
 */
export function useLogger(componentName: string) {
  const { user } = useAuth();
  const location = useLocation();
  
  const componentLogger = useMemo(() => {
    return logger.getLogger(componentName);
  }, [componentName]);
  
  // Log component mount and unmount
  useEffect(() => {
    componentLogger.debug(`Component mounted`, {
      path: location.pathname,
      userId: user?.id
    });
    
    return () => {
      componentLogger.debug(`Component unmounted`, {
        path: location.pathname,
        userId: user?.id
      });
    };
  }, [componentLogger, location.pathname, user?.id]);
  
  // Return logging functions with pre-configured context
  return {
    debug: (message: string, context: any = {}) => 
      componentLogger.debug(message, {
        ...context,
        path: location.pathname,
        userId: user?.id
      }),
    
    info: (message: string, context: any = {}) => 
      componentLogger.info(message, {
        ...context,
        path: location.pathname,
        userId: user?.id
      }),
    
    warn: (message: string, context: any = {}) => 
      componentLogger.warn(message, {
        ...context,
        path: location.pathname,
        userId: user?.id
      }),
    
    error: (message: string, error?: any) => 
      componentLogger.error(message, {
        error,
        path: location.pathname,
        userId: user?.id
      }),
      
    trace: (action: string, data: any = {}) =>
      componentLogger.info(`TRACE: ${action}`, {
        ...data,
        path: location.pathname,
        userId: user?.id,
        action,
        timestamp: new Date().toISOString()
      })
  };
}

export default useLogger;
