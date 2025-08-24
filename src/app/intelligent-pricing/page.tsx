import { PricingForm } from './pricing-form';
import { Lightbulb } from 'lucide-react';

export default function IntelligentPricingPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="p-3 bg-primary/10 rounded-full mb-4">
            <Lightbulb className="h-8 w-8 text-primary"/>
          </div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">
            Intelligent Pricing
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Leverage AI to get data-driven rental price suggestions for your
            properties.
          </p>
        </div>
        <PricingForm />
      </div>
    </div>
  );
}
