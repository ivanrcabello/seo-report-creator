
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Factura</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-2">Visualizando factura con ID: {id}</p>
          <p className="text-gray-500 mb-4">La página de detalle de facturas está en desarrollo.</p>
          <Button 
            onClick={() => navigate("/invoices")}
            variant="outline"
          >
            Volver a Facturas
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
