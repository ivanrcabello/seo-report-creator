
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export const ReportNotFoundState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Informe no encontrado
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">El informe que estás buscando no existe o no está disponible.</p>
          <Button onClick={() => navigate("/reports")} className="mt-2">
            Volver a Informes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
