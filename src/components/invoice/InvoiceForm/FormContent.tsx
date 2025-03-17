
import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { ClientSelection } from "../ClientSelection";
import { InvoiceStatus } from "../InvoiceStatus";
import { InvoiceNumberField } from "../InvoiceNumberField";
import { DateFields } from "../DateFields";
import { AmountFields } from "../AmountFields";
import { AmountSummary } from "../AmountSummary";
import { NotesField } from "../NotesField";
import { UseFormReturn } from "react-hook-form";
import { Invoice } from "@/types/invoice";
import { Client } from "@/types/client";
import { InvoiceFormValues } from "./invoiceSchema";

interface FormContentProps {
  form: UseFormReturn<InvoiceFormValues>;
  invoice: Invoice | null;
  client: Client | null;
  isNewInvoice: boolean;
  isSubmitting: boolean;
  availableClients: Client[];
  isLoading: boolean;
  baseAmountNum: number;
  taxRateNum: number;
  taxAmount: number;
  totalAmount: number;
  handleClientChange: (clientId: string) => void;
  onSubmit: (data: InvoiceFormValues) => Promise<void>;
}

export const FormContent = ({
  form,
  invoice,
  isNewInvoice,
  isSubmitting,
  availableClients,
  isLoading,
  baseAmountNum,
  taxRateNum,
  taxAmount,
  totalAmount,
  handleClientChange,
  onSubmit
}: FormContentProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ClientSelection 
            form={form} 
            isNewInvoice={isNewInvoice} 
            isLoading={isLoading}
            availableClients={availableClients}
            onClientChange={handleClientChange} 
          />
          <InvoiceStatus form={form} />
          
          {!isNewInvoice && (
            <InvoiceNumberField 
              form={form} 
              isNewInvoice={isNewInvoice} 
              invoiceNumber={invoice?.invoiceNumber} 
            />
          )}
          
          <DateFields form={form} />
          
          <AmountFields form={form} />
          
          <AmountSummary 
            baseAmount={baseAmountNum} 
            taxRate={taxRateNum} 
            taxAmount={taxAmount} 
            totalAmount={totalAmount} 
          />
          
          <NotesField form={form} />
        </div>
        
        <Button 
          type="submit" 
          className="gap-2 mt-6"
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "Guardando..." : isNewInvoice ? "Crear Factura" : "Actualizar Factura"}
        </Button>
      </form>
    </Form>
  );
};
