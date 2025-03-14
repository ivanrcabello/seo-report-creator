
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Client } from "@/types/client";

interface ActiveUsersProps {
  clients: Client[];
}

export const ActiveUsers = ({ clients }: ActiveUsersProps) => {
  // Function to get initials from client name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Generate random active percentage for demo
  const getRandomActivity = () => Math.floor(Math.random() * 70) + 30;

  return (
    <div className="space-y-4">
      {clients.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No hay clientes activos</p>
      ) : (
        clients.map((client) => {
          const activity = getRandomActivity();
          return (
            <div key={client.id} className="flex items-center space-x-4">
              <Avatar className="h-10 w-10 border border-gray-200">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{client.name}</p>
                  <span className="text-xs text-gray-500">{activity}%</span>
                </div>
                <Progress value={activity} className="h-1.5" />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
