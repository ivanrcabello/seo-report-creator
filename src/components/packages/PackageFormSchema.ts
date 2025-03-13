
import * as z from "zod";

// Schema for the package form
export const packFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.coerce.number().positive("El precio debe ser positivo"),
  features: z.string().min(1, "Debes incluir al menos una característica"),
  isActive: z.boolean().default(true)
});

// Transform the features string to array when submitting
export const transformFormData = (values: z.infer<typeof packFormSchema>) => {
  return {
    ...values,
    features: values.features
      .split("\n")
      .map(item => item.trim())
      .filter(Boolean)
  };
};

export type PackFormValues = z.infer<typeof packFormSchema>;
