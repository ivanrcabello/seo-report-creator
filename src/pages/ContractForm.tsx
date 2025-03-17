
import { useParams } from "react-router-dom";
import { ContractFormComponent } from "@/components/contracts/ContractForm";

const ContractForm = () => {
  // Updated params to match our new route structure
  const { clientId, id } = useParams<{ clientId: string; id: string }>();
  
  console.log("ContractForm page loaded with clientId:", clientId, "and contractId:", id);
  
  return (
    <div className="container mx-auto py-6">
      <ContractFormComponent clientId={clientId} contractId={id} />
    </div>
  );
};

export default ContractForm;
