
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface TestUserCreatorProps {
  email: string;
  password: string;
  name: string;
  role?: "admin" | "client";
  autoCreate?: boolean;
}

export function TestUserCreator({ 
  email, 
  password, 
  name, 
  role = "client",
  autoCreate = true 
}: TestUserCreatorProps) {
  const { createTestUser, isAdmin } = useAuth();

  useEffect(() => {
    const createUser = async () => {
      if (autoCreate && isAdmin) {
        try {
          await createTestUser(email, password, name, role);
          toast.success(`Usuario de prueba creado: ${email}`);
        } catch (error) {
          console.error("Failed to create test user:", error);
        }
      }
    };

    createUser();
  }, [autoCreate, email, password, name, role, createTestUser, isAdmin]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
      <h3 className="font-semibold mb-2">Usuario de Prueba</h3>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Contraseña:</strong> {password}</p>
      <p><strong>Rol:</strong> {role}</p>
      <button 
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        onClick={() => createTestUser(email, password, name, role)}
      >
        Crear Usuario
      </button>
    </div>
  );
}
