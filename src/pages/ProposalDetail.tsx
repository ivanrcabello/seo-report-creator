
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProposalDetail() {
  const { proposalId } = useParams<{ proposalId: string }>();
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Detalle de Propuesta</h1>
        <p>Visualizando propuesta con ID: {proposalId}</p>
        <p>La página de detalle de propuestas está en desarrollo.</p>
        <button 
          onClick={() => navigate("/proposals")}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Volver a Propuestas
        </button>
      </div>
    </div>
  );
}
