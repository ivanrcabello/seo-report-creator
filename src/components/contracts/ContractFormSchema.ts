
import * as z from "zod";

// Schema for the form validation
export const contractFormSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  clientId: z.string().min(1, "El cliente es obligatorio"),
  startDate: z.date(),
  endDate: z.date().optional(),
  phase1Fee: z.coerce.number().min(0, "El importe debe ser mayor o igual a 0"),
  monthlyFee: z.coerce.number().min(0, "El importe debe ser mayor o igual a 0"),
  status: z.enum(["draft", "active", "completed", "cancelled"]),
  clientInfo: z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    company: z.string().optional(),
    address: z.string().optional(),
    taxId: z.string().optional(),
  }),
  professionalInfo: z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    company: z.string().min(1, "La empresa es obligatoria"),
    address: z.string().min(1, "La dirección es obligatoria"),
    taxId: z.string().min(1, "El CIF/NIF es obligatorio"),
  }),
  sections: z.array(
    z.object({
      title: z.string().min(1, "El título de la sección es obligatorio"),
      content: z.string().min(1, "El contenido de la sección es obligatorio"),
      order: z.number(),
    })
  ),
});

export type ContractFormValues = z.infer<typeof contractFormSchema>;
