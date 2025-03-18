
import React from "react";
import { InvoiceForm as InvoiceFormComponent } from "@/components/invoice/InvoiceForm";

interface InvoiceFormProps {
  isNew?: boolean;
}

export default function InvoiceForm({ isNew }: InvoiceFormProps) {
  return (
    <div className="container mx-auto py-6">
      <InvoiceFormComponent isNew={isNew} />
    </div>
  );
}
