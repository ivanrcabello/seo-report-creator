
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { getClient } from "@/services/clientService";
import { UseFormReturn } from "react-hook-form";

interface ClientSelectionProps {
  form: UseFormReturn<any>;
  isNewInvoice: boolean;
  isLoading: boolean;
  onClientChange: (clientId: string) => void;
}

export const ClientSelection = ({ 
  form, 
  isNewInvoice, 
  isLoading, 
  onClientChange 
}: ClientSelectionProps) => {
  return (
    <FormField
      control={form.control}
      name="clientId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cliente</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="ID del cliente"
              disabled={!isNewInvoice || isLoading}
              onChange={(e) => {
                field.onChange(e);
                onClientChange(e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
