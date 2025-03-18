
import React, { Component, ErrorInfo, ReactNode } from 'react';
import logger from '@/services/advancedLogService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Logger for ErrorBoundary
const errorLogger = logger.getLogger('ErrorBoundary');

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error with contextual details
    errorLogger.error('Uncaught React error', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      componentStack: errorInfo.componentStack
    });
  }

  private handleReload = () => {
    errorLogger.info('User initiated app reload after error');
    window.location.reload();
  };

  private handleNavigateHome = () => {
    errorLogger.info('User navigated to home after error');
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      // Render custom error UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle size={20} />
                Se ha producido un error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Lo sentimos, ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
              </p>
              
              {import.meta.env.DEV && this.state.error && (
                <div className="bg-gray-100 p-4 rounded overflow-x-auto text-xs">
                  <strong>{this.state.error.toString()}</strong>
                  <pre className="mt-2 text-gray-700">
                    {this.state.errorInfo?.componentStack || this.state.error.stack}
                  </pre>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={this.handleReload}
                  className="flex items-center gap-1"
                >
                  <RefreshCw size={16} />
                  Recargar
                </Button>
                <Button 
                  onClick={this.handleNavigateHome}
                >
                  Ir al inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
