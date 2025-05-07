'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Building, DollarSign, Landmark, ShieldCheck, MapPin, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { PropertyAnalysisFormSchema, type PropertyAnalysisFormData } from '@/lib/schema';
import type { CombinedAiOutput, ServerActionResponse, ZodErrorResponse } from '@/lib/types';
import { analyzePropertyAction } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';

const InvestmentAnalyzerPage: React.FC = () => {
  const [results, setResults] = useState<CombinedAiOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<PropertyAnalysisFormData>({
    resolver: zodResolver(PropertyAnalysisFormSchema),
    defaultValues: {
      propertyPrice: undefined, 
      rent: undefined,
      expenses: undefined,
      neighborhood: '',
    },
  });

  const onSubmit = (data: PropertyAnalysisFormData) => {
    setError(null);
    setResults(null);
    startTransition(async () => {
      const response: ServerActionResponse = await analyzePropertyAction(data);
      if (response.error) {
        let errorMessage = 'An error occurred.';
        if (typeof response.error === 'string') {
          errorMessage = response.error;
        } else if (Array.isArray(response.error)) { 
          errorMessage = response.error.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
        }
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: errorMessage,
        });
      } else if (response.data) {
        setResults(response.data);
        toast({
          title: 'Analysis Complete',
          description: 'Investment insights generated successfully.',
        });
      }
    });
  };

  const renderRecommendationBadge = (recommendation: string) => {
    const lowerRec = recommendation.toLowerCase();
    if (lowerRec.includes('good') || lowerRec.includes('positive') || lowerRec.includes('recommended')) {
      return <Badge variant="default" className="bg-accent text-accent-foreground">Good Investment</Badge>;
    }
    if (lowerRec.includes('bad') || lowerRec.includes('negative') || lowerRec.includes('not recommended')) {
      return <Badge variant="destructive">Consider Risks</Badge>;
    }
    return <Badge variant="secondary">{recommendation.split(' ')[0]}</Badge>;
  };
  
  const formatPercentage = (value: number) => `${(value * 100).toFixed(2)}%`;

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          InvestAI Advisor
        </h1>
        <p className="mt-3 text-lg text-muted-foreground sm:text-xl">
          Leverage AI to analyze property deals and gain neighborhood insights.
        </p>
      </header>

      <Card className="w-full max-w-2xl mx-auto shadow-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            Property Details
          </CardTitle>
          <CardDescription>Enter property information to get an AI-powered analysis.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="propertyPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 300000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Monthly Rent ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Monthly Expenses ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 800 (taxes, insurance, maintenance)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Neighborhood Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Downtown, Willow Creek" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Property'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isPending && (
        <Card className="w-full max-w-2xl mx-auto mt-8 shadow-xl">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-3/4" />
            </div>
             <div className="space-y-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Separator />
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Separator />
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </CardContent>
        </Card>
      )}

      {results && !isPending && (
        <Card className="w-full max-w-2xl mx-auto mt-8 shadow-xl transition-opacity duration-500 ease-in-out opacity-100">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
             <DollarSign className="h-6 w-6 text-primary"/>
              AI Analysis Results
            </CardTitle>
            <CardDescription>Insights generated for your property investment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Key Financial Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-secondary/30">
                  <CardHeader>
                    <CardTitle className="text-base">Return on Investment (ROI)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-2xl font-bold ${results.investmentAnalysis.recommendation.toLowerCase().includes('good') ? 'text-accent' : 'text-foreground'}`}>
                      {formatPercentage(results.investmentAnalysis.roi)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/30">
                  <CardHeader>
                    <CardTitle className="text-base">Capitalization Rate (Cap Rate)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-2xl font-bold ${results.investmentAnalysis.recommendation.toLowerCase().includes('good') ? 'text-accent' : 'text-foreground'}`}>
                      {formatPercentage(results.investmentAnalysis.capRate)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">AI Investment Recommendation</h3>
              <div className="flex items-center space-x-2 mb-2">
                 {renderRecommendationBadge(results.investmentAnalysis.recommendation)}
              </div>
              <p className="text-muted-foreground">{results.investmentAnalysis.recommendation}</p>
            </div>
            
            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
               <Landmark className="h-5 w-5 text-primary" />
                Neighborhood Overview
              </h3>
              <p className="text-muted-foreground italic mb-4">{results.investmentAnalysis.neighborhoodInsights}</p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Safety</h4>
                    <p className="text-sm text-muted-foreground">{results.detailedNeighborhoodInsights.safety}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Home className="h-5 w-5 text-primary mt-1 shrink-0" /> 
                  <div>
                    <h4 className="font-medium text-foreground">Walkability & Lifestyle</h4>
                    <p className="text-sm text-muted-foreground">{results.detailedNeighborhoodInsights.walkability}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Amenities</h4>
                    <p className="text-sm text-muted-foreground">{results.detailedNeighborhoodInsights.amenities}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvestmentAnalyzerPage;
