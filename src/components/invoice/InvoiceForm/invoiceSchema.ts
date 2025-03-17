
import * as z from "zod";
import { InvoiceStatus, InvoiceFormValues } from "@/types/invoiceTypes";

// Schema for invoice validation
export const invoiceSchema = z.object({
  clientId: z.string().uuid("El cliente es obligatorio"),
  packId: z.string().uuid("El paquete es obligatorio").optional(),
  proposalId: z.string().uuid("La propuesta es obligatoria").optional(),
  baseAmount: z.coerce.number().min(0, "El importe base no puede ser negativo"),
  taxRate: z.coerce.number()
    .min(0, "El tipo de IVA no puede ser negativo")
    .max(100, "El tipo de IVA no puede superar el 100%")
    .default(21),
  status: z.enum(["draft", "pending", "paid", "cancelled"] as const),
  issueDate: z.string(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  invoiceNumber: z.string().optional(),
});

export type { InvoiceFormValues };
