import type { InvestmentRecommendationOutput } from '@/ai/flows/generate-investment-recommendation';
import type { GenerateNeighborhoodInsightsOutput } from '@/ai/flows/generate-neighborhood-insights';

export type CombinedAiOutput = {
  investmentAnalysis: InvestmentRecommendationOutput;
  detailedNeighborhoodInsights: GenerateNeighborhoodInsightsOutput;
};

export type ServerActionResponse = {
  data?: CombinedAiOutput;
  error?: string | ZodErrorResponse;
};

// More specific error type for Zod validation errors if needed
export type ZodErrorField = {
  path: (string | number)[];
  message: string;
};
export type ZodErrorResponse = ZodErrorField[];
