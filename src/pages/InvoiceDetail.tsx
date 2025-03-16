
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Detalle de Factura</h1>
        <p>Visualizando factura con ID: {id}</p>
        <p>La página de detalle de facturas está en desarrollo.</p>
        <button 
          onClick={() => navigate("/invoices")}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Volver a Facturas
        </button>
      </div>
    </div>
  );
}
