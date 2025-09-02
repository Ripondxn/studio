
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This page is being consolidated. Redirect to the main document processor.
export default function SingleDataExtractorPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/document-processor');
    }, [router]);

    return null;
}
