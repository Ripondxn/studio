'use client';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getSuggestedPrice } from './actions';
import type { SuggestRentalPriceOutput } from '@/ai/flows/suggest-rental-price';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Lightbulb } from 'lucide-react';

const formSchema = z.object({
  propertyAddress: z.string().min(1, 'Property address is required.'),
  propertyType: z.string().min(1, 'Property type is required.'),
  bedrooms: z.coerce.number().min(0, 'Bedrooms must be a positive number.'),
  bathrooms: z.coerce.number().min(0, 'Bathrooms must be a positive number.'),
  squareFootage: z.coerce
    .number()
    .min(1, 'Square footage must be greater than 0.'),
  locationFeatures: z.string().min(1, 'Location features are required.'),
  propertyFeatures: z.string().min(1, 'Property features are required.'),
  marketRentals: z.string().min(1, 'Market rentals examples are required.'),
});

export function PricingForm() {
  const [result, setResult] = useState<SuggestRentalPriceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyAddress: '',
      propertyType: '',
      bedrooms: 1,
      bathrooms: 1,
      squareFootage: 1000,
      locationFeatures: '',
      propertyFeatures: '',
      marketRentals: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const response = await getSuggestedPrice(values);

    if (response.success) {
      setResult(response.data!);
    } else {
      setError(response.error);
    }
    setIsLoading(false);
  }

  return (
    <>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline">Property Details</CardTitle>
              <CardDescription>
                Fill in the details to get a price suggestion.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="propertyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Address</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 123 Main St, Anytown, USA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="House">House</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Townhouse">Townhouse</SelectItem>
                          <SelectItem value="Condo">Condo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="squareFootage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Square Footage (sqft)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyFeatures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Features</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Hardwood floors, updated kitchen, balcony, new appliances"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locationFeatures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Features</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Close to parks, downtown, good school district"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marketRentals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comparable Market Rentals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 2 bed/1 bath at 456 Oak Ave rented for $2200/mo."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isLoading ? 'Analyzing...' : 'Suggest Price'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {isLoading && (
         <Card className="mt-8">
            <CardContent className="p-6 text-center">
                 <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-accent" />
                    <p className="text-muted-foreground">AI is analyzing the market data... </p>
                </div>
            </CardContent>
         </Card>
      )}

      {error && (
        <Alert variant="destructive" className="mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="mt-8">
          <CardHeader className="text-center bg-muted/30">
            <div className="mx-auto bg-accent/20 text-accent rounded-full p-3 w-fit">
              <Lightbulb className="h-8 w-8" />
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              Suggested Monthly Rent
            </p>
            <CardTitle className="text-5xl font-bold font-headline text-primary">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(result.suggestedRentalPrice)}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2 font-headline">
              Price Justification
            </h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {result.priceJustification}
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
