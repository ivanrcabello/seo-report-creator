
import { ReactNode } from "react";

interface InvoiceDetailContainerProps {
  children: ReactNode;
}

export const InvoiceDetailContainer = ({ children }: InvoiceDetailContainerProps) => {
  return (
    <div className="container mx-auto py-8">
      {children}
    </div>
  );
};
