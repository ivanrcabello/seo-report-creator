
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProposalDetail() {
  const { proposalId } = useParams<{ proposalId: string }>();
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Propuesta</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-2">Visualizando propuesta con ID: {proposalId}</p>
          <p className="text-gray-500 mb-4">La página de detalle de propuestas está en desarrollo.</p>
          <Button 
            onClick={() => navigate("/proposals")}
            variant="outline"
          >
            Volver a Propuestas
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
