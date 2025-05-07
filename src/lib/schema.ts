import { z } from 'zod';

export const PropertyAnalysisFormSchema = z.object({
  propertyPrice: z.coerce.number({invalid_type_error: 'Property price must be a number.'}).positive("Property price must be positive."),
  rent: z.coerce.number({invalid_type_error: 'Monthly rent must be a number.'}).positive("Monthly rent must be positive."),
  expenses: z.coerce.number({invalid_type_error: 'Monthly expenses must be a number.'}).min(0, "Monthly expenses cannot be negative."),
  neighborhood: z.string().min(1, "Neighborhood name is required.").max(100, "Neighborhood name is too long."),
});

export type PropertyAnalysisFormData = z.infer<typeof PropertyAnalysisFormSchema>;
