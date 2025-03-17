
import { ContractFormProvider } from "./form/ContractFormContext";
import { ContractFormContent } from "./form/ContractFormContent";
import { useState } from "react";

interface ContractFormProps {
  clientId?: string;
  contractId?: string;
}

export const ContractFormComponent = ({ clientId: propClientId, contractId: propContractId }: ContractFormProps) => {
  console.log("ContractForm component initialized with:");
  console.log("- clientId from props:", propClientId);
  console.log("- contractId from props:", propContractId);

  return (
    <ContractFormProvider clientId={propClientId} contractId={propContractId}>
      <ContractFormContent />
    </ContractFormProvider>
  );
};

export const ContractForm = ContractFormComponent;
