
import React from "react";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useInvoiceForm } from "./useInvoiceForm";
import { InvoiceFormHeader } from "./InvoiceFormHeader";
import { InvoiceFormSkeleton } from "./InvoiceFormSkeleton";
import { InvoiceFormError } from "./InvoiceFormError";
import { InvoiceFormNoClients } from "./InvoiceFormNoClients";
import { ClientSelection } from "../ClientSelection";
import { InvoiceStatus } from "../InvoiceStatus";
import { InvoiceNumberField } from "../InvoiceNumberField";
import { DateFields } from "../DateFields";
import { AmountFields } from "../AmountFields";
import { AmountSummary } from "../AmountSummary";
import { NotesField } from "../NotesField";

export const InvoiceForm = () => {
  const {
    form,
    invoice,
    client,
    availableClients,
    isLoading,
    isSubmitting,
    isNewInvoice,
    error,
    baseAmountNum,
    taxRateNum,
    taxAmount,
    totalAmount,
    handleClientChange,
    onSubmit,
    navigate
  } = useInvoiceForm();

  if (isLoading) {
    return <InvoiceFormSkeleton isNewInvoice={isNewInvoice} invoice={invoice} />;
  }

  if (error) {
    return <InvoiceFormError error={error} onGoBack={() => navigate(-1)} />;
  }

  if (isNewInvoice && availableClients.length === 0) {
    return <InvoiceFormNoClients onGoBack={() => navigate(-1)} />;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <InvoiceFormHeader 
          isNewInvoice={isNewInvoice} 
          invoice={invoice} 
          client={client} 
          onGoBack={() => navigate(-1)} 
        />
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
