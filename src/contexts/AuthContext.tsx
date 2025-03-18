
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import logger from '@/services/logService';
import { createTestUser as authServiceCreateTestUser } from '@/services/authService';

// Logger específico para el contexto de autenticación
const authLogger = logger.getLogger('AuthContext');

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  createTestUser: (email: string, password: string, name: string, role?: "admin" | "client") => Promise<any>;
  signInWithGoogle: () => Promise<{ error: any }>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    authLogger.info('Inicializando contexto de autenticación');
    
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        authLogger.info('Sesión inicial:', initialSession ? 'Activa' : 'No hay sesión');
        
        setSession(initialSession);
        setUser(initialSession?.user || null);
        
        if (initialSession?.user) {
          authLogger.info('Usuario encontrado en sesión inicial, configurando usuario:', initialSession.user.id);
          await setupUser(initialSession.user.id);
        }
      } catch (error) {
        authLogger.error('Error al obtener la sesión inicial:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Configurar listeners para cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      authLogger.info(`Cambio en estado de autenticación: ${event}`, newSession?.user?.id);
      
      setSession(newSession);
      setUser(newSession?.user || null);
      
      if (newSession?.user) {
        authLogger.info('Configurando usuario después de cambio en autenticación:', newSession.user.id);
        await setupUser(newSession.user.id);
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        setUserRole(null);
        authLogger.info('Usuario desconectado, reiniciando estado');
      }
      
      // Asegurarse de que isLoading se establece en false después de cualquier cambio de auth
      setIsLoading(false);
    });

    return () => {
      authLogger.debug('Limpiando suscripción a cambios de autenticación');
      subscription.unsubscribe();
    };
  }, []);

  // Función para configurar usuario y obtener rol
  const setupUser = async (userId: string) => {
    authLogger.info(`Configurando usuario: ${userId}`);
    try {
      const { data: roleData, error: roleError } = await supabase.rpc('get_user_role');
      
      if (roleError) {
        authLogger.error('Error al obtener el rol del usuario:', roleError);
        return;
      }
      
      authLogger.info(`Rol de usuario obtenido: ${roleData}`);
      setUserRole(roleData);
      setIsAdmin(roleData === 'admin');
    } catch (error) {
      authLogger.error('Error en setupUser:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    authLogger.info(`Intentando iniciar sesión con: ${email}`);
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        authLogger.error('Error en inicio de sesión:', error);
        setIsLoading(false);
        return { error };
      }
      
      authLogger.info('Inicio de sesión exitoso:', data);
      return { error: null };
    } catch (error) {
      authLogger.error('Excepción en signIn:', error);
      setIsLoading(false);
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    authLogger.info('Intentando iniciar sesión con Google');
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        authLogger.error('Error en inicio de sesión con Google:', error);
        setIsLoading(false);
        return { error };
      }
      
      authLogger.info('Inicio de sesión con Google exitoso:', data);
      return { error: null };
    } catch (error) {
      authLogger.error('Excepción en signInWithGoogle:', error);
      setIsLoading(false);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    authLogger.info(`Intentando registrar nuevo usuario: ${email}`);
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) {
        authLogger.error('Error en registro:', error);
      } else {
        authLogger.info('Registro exitoso:', data.user?.id);
      }
      
      setIsLoading(false);
      return { data, error };
    } catch (error) {
      authLogger.error('Excepción en signUp:', error);
      setIsLoading(false);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    authLogger.info('Cerrando sesión');
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      authLogger.info('Sesión cerrada exitosamente');
    } catch (error) {
      authLogger.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para crear usuarios de prueba
  const createTestUser = async (email: string, password: string, name: string, role: "admin" | "client" = "client") => {
    authLogger.info(`Creando usuario de prueba: ${email} con rol: ${role}`);
    try {
      const result = await authServiceCreateTestUser(email, password, name, role);
      authLogger.info(`Usuario de prueba creado exitosamente: ${email}`);
      return result;
    } catch (error) {
      authLogger.error(`Error al crear usuario de prueba ${email}:`, error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    userRole,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    createTestUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
