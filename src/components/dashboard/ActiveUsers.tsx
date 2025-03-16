
import { ClientSummary } from "@/types/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface ActiveUsersProps {
  clients: ClientSummary[];
}

export const ActiveUsers = ({ clients }: ActiveUsersProps) => {
  // If there are no clients, show a message
  if (clients.length === 0) {
    return (
      <div className="text-center py-3">
        <p className="text-sm text-gray-500">No hay clientes activos</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {clients.map((client) => (
        <div key={client.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
          <Avatar className="h-9 w-9 border border-gray-200">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
              {getInitials(client.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{client.name}</p>
            {client.company && (
              <p className="text-xs text-gray-500 truncate">{client.company}</p>
            )}
          </div>
          <div className="flex-shrink-0">
            <span className={`px-2 py-1 text-xs rounded-full ${client.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {client.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
