
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useInvoiceForm } from "./useInvoiceForm";
import { InvoiceFormHeader } from "./InvoiceFormHeader";
import { InvoiceFormSkeleton } from "./InvoiceFormSkeleton";
import { InvoiceFormError } from "./InvoiceFormError";
import { InvoiceFormNoClients } from "./InvoiceFormNoClients";
import { FormContent } from "./FormContent";

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
        <FormContent
          form={form}
          invoice={invoice}
          client={client}
          isNewInvoice={isNewInvoice}
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
