
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function AuthChecker({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userProfile = sessionStorage.getItem('userProfile');
        if (userProfile) {
            setIsLoggedIn(true);
        } else {
            if (pathname !== '/login') {
                router.push('/login');
            }
        }
    }, [pathname, router]);

    if (pathname === '/login' || isLoggedIn) {
        return <>{children}</>;
    }

    return null;
}
