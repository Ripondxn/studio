
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OldDataExtractorPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/data-processing/batch-data-extractor');
    }, [router]);

    return null;
}
