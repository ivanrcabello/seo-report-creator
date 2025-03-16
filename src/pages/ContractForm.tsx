
import { useParams } from "react-router-dom";
import { ContractFormComponent } from "@/components/contracts/ContractForm";

const ContractForm = () => {
  const { clientId } = useParams<{ clientId: string }>();
  return <ContractFormComponent clientId={clientId} />;
};

export default ContractForm;
