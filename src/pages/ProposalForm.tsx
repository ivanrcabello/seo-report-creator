
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProposalForm() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Nueva Propuesta</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">El formulario de propuestas está en desarrollo.</p>
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
