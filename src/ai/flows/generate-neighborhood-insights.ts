// src/ai/flows/generate-neighborhood-insights.ts
'use server';

/**
 * @fileOverview A flow for generating neighborhood insights based on the neighborhood name.
 *
 * - generateNeighborhoodInsights - A function that generates insights about a given neighborhood.
 * - GenerateNeighborhoodInsightsInput - The input type for the generateNeighborhoodInsights function.
 * - GenerateNeighborhoodInsightsOutput - The return type for the generateNeighborhoodInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNeighborhoodInsightsInputSchema = z.object({
  neighborhoodName: z
    .string()
    .describe('The name of the neighborhood to generate insights for.'),
});
export type GenerateNeighborhoodInsightsInput = z.infer<
  typeof GenerateNeighborhoodInsightsInputSchema
>;

const GenerateNeighborhoodInsightsOutputSchema = z.object({
  safety: z.string().describe('Insights about the safety of the neighborhood.'),
  walkability: z
    .string()
    .describe('Insights about the walkability of the neighborhood.'),
  amenities: z.string().describe('Insights about the amenities in the neighborhood.'),
});
export type GenerateNeighborhoodInsightsOutput = z.infer<
  typeof GenerateNeighborhoodInsightsOutputSchema
>;

export async function generateNeighborhoodInsights(
  input: GenerateNeighborhoodInsightsInput
): Promise<GenerateNeighborhoodInsightsOutput> {
  return generateNeighborhoodInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNeighborhoodInsightsPrompt',
  input: {schema: GenerateNeighborhoodInsightsInputSchema},
  output: {schema: GenerateNeighborhoodInsightsOutputSchema},
  prompt: `You are an expert on neighborhoods. Generate insights about the safety, walkability, and amenities for the following neighborhood:

Neighborhood Name: {{{neighborhoodName}}}

Format your response as a JSON object with the following keys:
- safety: Insights about the safety of the neighborhood.
- walkability: Insights about the walkability of the neighborhood.
- amenities: Insights about the amenities in the neighborhood.`,
});

const generateNeighborhoodInsightsFlow = ai.defineFlow(
  {
    name: 'generateNeighborhoodInsightsFlow',
    inputSchema: GenerateNeighborhoodInsightsInputSchema,
    outputSchema: GenerateNeighborhoodInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
