'use server';

import { z } from 'zod';
import { PropertyAnalysisFormSchema, type PropertyAnalysisFormData } from '@/lib/schema';
import type { ServerActionResponse, CombinedAiOutput } from '@/lib/types';
import { generateInvestmentRecommendation } from '@/ai/flows/generate-investment-recommendation';
import { generateNeighborhoodInsights } from '@/ai/flows/generate-neighborhood-insights';

export async function analyzePropertyAction(
  formData: PropertyAnalysisFormData
): Promise<ServerActionResponse> {
  try {
    // Validate form data on the server side as well
    const validationResult = PropertyAnalysisFormSchema.safeParse(formData);
    if (!validationResult.success) {
      console.error("Server-side validation failed:", validationResult.error.flatten().fieldErrors);
      return { 
        error: validationResult.error.errors.map(e => ({ path: e.path, message: e.message }))
      };
    }
    
    const validatedData = validationResult.data;

    // Using Promise.all to run AI calls concurrently
    const [investmentResult, neighborhoodResult] = await Promise.all([
      generateInvestmentRecommendation({
        propertyPrice: validatedData.propertyPrice,
        rent: validatedData.rent,
        expenses: validatedData.expenses,
        neighborhood: validatedData.neighborhood,
      }),
      generateNeighborhoodInsights({
        neighborhoodName: validatedData.neighborhood,
      }),
    ]);

    const combinedOutput: CombinedAiOutput = {
      investmentAnalysis: investmentResult,
      detailedNeighborhoodInsights: neighborhoodResult,
    };

    return { data: combinedOutput };
  } catch (error) {
    console.error("Error in analyzePropertyAction:", error);
    // Genkit errors or other unexpected errors
    let errorMessage = 'An unexpected error occurred during analysis. Please try again.';
    if (error instanceof Error) {
        // Potentially more specific error handling for AI errors if they have a distinct type or message pattern
        errorMessage = error.message;
    }
    return { error: errorMessage };
  }
}
