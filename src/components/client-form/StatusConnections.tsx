
import React from "react";
import { Power } from "lucide-react";
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";

type StatusConnectionsProps = {
  form: UseFormReturn<any>;
  analyticsConnected: boolean;
  setAnalyticsConnected: (value: boolean) => void;
  searchConsoleConnected: boolean;
  setSearchConsoleConnected: (value: boolean) => void;
};

export const StatusConnections = ({ 
  form, 
  analyticsConnected, 
  setAnalyticsConnected,
  searchConsoleConnected,
  setSearchConsoleConnected
}: StatusConnectionsProps) => {
  return (
    <div className="space-y-5">
      <h3 className="text-base font-medium text-gray-800">Estado y conexiones</h3>
      
      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50">
            <div className="space-y-0.5">
              <FormLabel className="flex items-center gap-2 text-base">
                <Power className="h-4 w-4 text-seo-blue" />
                Estado del cliente
              </FormLabel>
              <FormDescription>
                Determina si el cliente está activo o inactivo en la plataforma
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <div className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50">
        <div className="space-y-0.5">
          <Label className="flex items-center gap-2 text-base">
            Google Analytics
          </Label>
          <div className="text-sm text-muted-foreground">
            ¿El cliente tiene conectada su cuenta de Google Analytics?
          </div>
        </div>
        <Switch
          checked={analyticsConnected}
          onCheckedChange={setAnalyticsConnected}
        />
      </div>
      
      <div className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50">
        <div className="space-y-0.5">
          <Label className="flex items-center gap-2 text-base">
            Google Search Console
          </Label>
          <div className="text-sm text-muted-foreground">
            ¿El cliente tiene conectada su cuenta de Search Console?
          </div>
        </div>
        <Switch
          checked={searchConsoleConnected}
          onCheckedChange={setSearchConsoleConnected}
        />
      </div>
    </div>
  );
};
