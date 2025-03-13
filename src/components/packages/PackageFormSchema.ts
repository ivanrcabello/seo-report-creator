
import * as z from "zod";

// Schema for the package form
export const packFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.coerce.number().positive("El precio debe ser positivo"),
  features: z.union([
    z.string().transform(val => val.split("\n").map(item => item.trim()).filter(Boolean)),
    z.array(z.string())
  ]),
  isActive: z.boolean().default(true)
});

export type PackFormValues = z.infer<typeof packFormSchema>;
