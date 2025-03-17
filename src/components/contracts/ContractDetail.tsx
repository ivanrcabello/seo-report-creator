
import { SeoContract, Client } from "@/types/client";
import { ContractDetailLayout } from "./detail";

interface ContractDetailProps {
  contract: SeoContract;
  client: Client;
}

export const ContractDetail = ({ contract, client }: ContractDetailProps) => {
  return <ContractDetailLayout contract={contract} client={client} />;
};
