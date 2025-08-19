import { PricingForm } from './pricing-form';

export default function IntelligentPricingPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
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
