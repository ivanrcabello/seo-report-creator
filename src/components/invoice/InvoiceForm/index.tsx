
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useInvoiceForm } from "./useInvoiceForm";
import { InvoiceFormHeader } from "./InvoiceFormHeader";
import { InvoiceFormSkeleton } from "./InvoiceFormSkeleton";
import { InvoiceFormError } from "./InvoiceFormError";
import { InvoiceFormNoClients } from "./InvoiceFormNoClients";
import { FormContent } from "./FormContent";

export interface InvoiceFormProps {
  isNew?: boolean;
}

export const InvoiceForm = ({ isNew }: InvoiceFormProps) => {
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

  // Consider isNew prop in addition to the internal isNewInvoice state
  const displayAsNew = isNew !== undefined ? isNew : isNewInvoice;

  if (isLoading) {
    return <InvoiceFormSkeleton isNewInvoice={displayAsNew} invoice={invoice} />;
  }

  if (error) {
    return <InvoiceFormError error={error} onGoBack={() => navigate(-1)} />;
  }

  if (displayAsNew && availableClients.length === 0) {
    return <InvoiceFormNoClients onGoBack={() => navigate(-1)} />;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <InvoiceFormHeader 
          isNewInvoice={displayAsNew} 
          invoice={invoice} 
          client={client} 
          onGoBack={() => navigate(-1)} 
        />
      </CardHeader>
      <CardContent>
        <FormContent
          form={form}
          invoice={invoice}
          client={client}
          isNewInvoice={displayAsNew}
          isSubmitting={isSubmitting}
          availableClients={availableClients}
          isLoading={isLoading}
          baseAmountNum={baseAmountNum}
          taxRateNum={taxRateNum}
          taxAmount={taxAmount}
          totalAmount={totalAmount}
          handleClientChange={handleClientChange}
          onSubmit={onSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
