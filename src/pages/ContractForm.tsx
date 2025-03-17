
import { useParams } from "react-router-dom";
import { ContractFormComponent } from "@/components/contracts/ContractForm";

const ContractForm = () => {
  const { clientId } = useParams<{ clientId: string }>();
  
  console.log("ContractForm page loaded with clientId:", clientId);
  
  return (
    <div className="container mx-auto py-6">
      <ContractFormComponent clientId={clientId} />
    </div>
  );
};

export default ContractForm;
