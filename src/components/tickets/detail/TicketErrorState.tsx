
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronLeft } from "lucide-react";

interface TicketErrorStateProps {
  error: unknown;
}

export function TicketErrorState({ error }: TicketErrorStateProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Error</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al cargar el ticket</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "No se pudo cargar la información del ticket."}
          </AlertDescription>
        </Alert>
        <Button 
          className="mt-4" 
          variant="secondary"
          onClick={() => navigate('/tickets')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Volver a tickets
        </Button>
      </CardContent>
    </Card>
  );
}
