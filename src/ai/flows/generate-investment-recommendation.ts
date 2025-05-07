'use server';


import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InvestmentRecommendationInputSchema = z.object({
  propertyPrice: z.number().describe('The price of the property.'),
  rent: z.number().describe('The expected monthly rental income.'),
  expenses: z.number().describe('The total monthly expenses for the property.'),
  neighborhood: z.string().describe('The name of the neighborhood.'),
});
export type InvestmentRecommendationInput = z.infer<
  typeof InvestmentRecommendationInputSchema
>;

const InvestmentRecommendationOutputSchema = z.object({
  roi: z.number().describe('The estimated return on investment (ROI).'),
  capRate: z.number().describe('The capitalization rate (cap rate).'),
  recommendation: z
    .string()
    .describe('An AI-generated investment recommendation (good or bad investment).'),
  neighborhoodInsights:
    z.string().describe('AI-generated insights about the neighborhood.'),
});
export type InvestmentRecommendationOutput = z.infer<
  typeof InvestmentRecommendationOutputSchema
>;

export async function generateInvestmentRecommendation(
  input: InvestmentRecommendationInput
): Promise<InvestmentRecommendationOutput> {
  return generateInvestmentRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'investmentRecommendationPrompt',
  input: {schema: InvestmentRecommendationInputSchema},
  output: {schema: InvestmentRecommendationOutputSchema},
  prompt: `You are an expert real estate investment advisor.

  Based on the provided property details, calculate the ROI and cap rate, provide an investment recommendation (good or bad investment), and generate insights about the neighborhood.

  Property Price: {{propertyPrice}}
  Rent: {{rent}}
  Expenses: {{expenses}}
  Neighborhood: {{neighborhood}}

  First, calculate the ROI and cap rate using the following formulas:

  ROI = ((Rent - Expenses) * 12) / Property Price
  Cap Rate = (Net Operating Income / Property Price) * 100
  Net Operating Income = (Rent - Expenses) * 12

  Then, provide a concise investment recommendation based on the calculated ROI, cap rate, and neighborhood insights.
`,
});

const generateInvestmentRecommendationFlow = ai.defineFlow(
  {
    name: 'generateInvestmentRecommendationFlow',
    inputSchema: InvestmentRecommendationInputSchema,
    outputSchema: InvestmentRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
