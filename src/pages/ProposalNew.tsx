
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const ProposalNew = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nueva Propuesta</h1>
        <Button variant="outline" onClick={() => navigate("/proposals")} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Redirigiendo a formulario de propuesta...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-4">Estás siendo redirigido al formulario de propuesta...</p>
          <div className="flex justify-center py-4">
            <Button onClick={() => navigate("/proposals/form")}>
              Ir al formulario de propuesta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProposalNew;
