import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UnitPage() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Units</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the page for managing units.</p>
        </CardContent>
      </Card>
    </div>
  );
}
