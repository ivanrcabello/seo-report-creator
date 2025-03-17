
import { createContext, useContext, useState, ReactNode } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContractFormValues, contractFormSchema } from "../ContractFormSchema";
import { ContractSection } from "@/types/client";

interface ContractFormContextProps {
  form: UseFormReturn<ContractFormValues>;
  sections: ContractSection[];
  setSections: (sections: ContractSection[]) => void;
  saving: boolean;
  setSaving: (saving: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  clientId?: string;
  contractId?: string;
}

const ContractFormContext = createContext<ContractFormContextProps | undefined>(undefined);

export const useContractForm = () => {
  const context = useContext(ContractFormContext);
  if (!context) {
    throw new Error("useContractForm must be used within a ContractFormProvider");
  }
  return context;
};

interface ContractFormProviderProps {
  children: ReactNode;
  clientId?: string;
  contractId?: string;
}

export const ContractFormProvider = ({ 
  children, 
  clientId, 
  contractId 
}: ContractFormProviderProps) => {
  const [sections, setSections] = useState<ContractSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      title: "",
      clientId: clientId || "",
      startDate: new Date(),
      phase1Fee: 0,
      monthlyFee: 0,
      status: "draft",
      clientInfo: {
        name: "",
        company: "",
        address: "",
        taxId: "",
      },
      professionalInfo: {
        name: "",
        company: "",
        address: "",
        taxId: "",
      },
      sections: [],
    },
  });

  return (
    <ContractFormContext.Provider
      value={{
        form,
        sections,
        setSections,
        saving,
        setSaving,
        loading,
        setLoading,
        clientId,
        contractId
      }}
    >
      {children}
    </ContractFormContext.Provider>
  );
};
