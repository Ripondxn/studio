
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

export default function BatchDataExtractorPage() {
    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Batch Data Extractor</CardTitle>
                    <CardDescription>This feature is under construction.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg">
                        <Wrench className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">
                            The functionality to process multiple documents at once is coming soon.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
