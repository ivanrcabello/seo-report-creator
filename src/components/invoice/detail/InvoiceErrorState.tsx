
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface InvoiceErrorStateProps {
  error: string;
}

export const InvoiceErrorState = ({ error }: InvoiceErrorStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center my-12">
      <p className="text-red-500 mb-4">{error}</p>
      <Button onClick={() => navigate("/invoices")}>Volver a Facturas</Button>
    </div>
  );
};
