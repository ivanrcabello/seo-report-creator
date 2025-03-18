
import { useParams } from "react-router-dom";

export interface ContractFormProps {
  clientId?: string;
  contractId?: string;
  isNew?: boolean;
}

export const ContractFormComponent = ({ clientId, contractId, isNew }: ContractFormProps) => {
  console.log("ContractForm component initialized with:");
  console.log("- clientId:", clientId);
  console.log("- contractId:", contractId);
  console.log("- isNew:", isNew);
  
  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">
        {isNew ? "Crear Nuevo Contrato" : "Editar Contrato"}
      </h2>
      
      {/* Form will be implemented here */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">
          Formulario de contrato para {isNew ? "crear nuevo contrato" : `editar contrato ${contractId}`}
          {clientId && ` para el cliente ${clientId}`}
        </p>
      </div>
    </div>
  );
};

export default ContractFormComponent;
