
import { useParams } from "react-router-dom";
import { ContractFormComponent } from "@/components/contracts/ContractForm";

const ContractForm = () => {
  // Get client ID and contract ID from the URL parameters
  const { clientId, id } = useParams<{ clientId: string; id: string }>();
  
  console.log("ContractForm page initialized with:");
  console.log("- clientId:", clientId);
  console.log("- contractId:", id);
  
  return (
    <div className="container mx-auto py-6">
      <ContractFormComponent clientId={clientId} contractId={id} />
    </div>
  );
};

export default ContractForm;
