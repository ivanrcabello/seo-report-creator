
import { useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import logger from '@/services/advancedLogService';

/**
 * Hook personalizado para obtener un logger con contexto de componente
 * y automáticamente incluir información del usuario y la ruta actual
 */
export function useLogger(componentName: string) {
  const { user } = useAuth();
  const location = useLocation();
  
  const componentLogger = useMemo(() => {
    return logger.getLogger(componentName);
  }, [componentName]);
  
  // Registrar montaje y desmontaje del componente
  useEffect(() => {
    componentLogger.debug(`Componente montado`, {
      path: location.pathname,
      userId: user?.id
    });
    
    return () => {
      componentLogger.debug(`Componente desmontado`, {
        path: location.pathname,
        userId: user?.id
      });
    };
  }, [componentLogger, location.pathname, user?.id]);
  
  // Retornar funciones de logging con contexto pre-configurado
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
