
import type { Metadata } from 'next';
import './globals.css';
import { AppLayout } from '@/components/app-layout';
import { Toaster } from '@/components/ui/toaster';
import { CurrencyProvider } from '@/context/currency-context';
import { CompanyProfileProvider } from '@/context/company-profile-context';
import { getCompanyProfile } from './admin/company-profile/actions';
import { AuthChecker } from './auth-checker';
import { AuthorizationProvider } from '@/context/permission-context';

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getCompanyProfile();
  return {
    title: profile.name || 'Trust Famous Real Estate',
    description: 'Integrated Property Management Dashboard & Workflow Design',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <CompanyProfileProvider>
          <CurrencyProvider>
            <AuthorizationProvider>
              <AuthChecker>
                <AppLayout>{children}</AppLayout>
              </AuthChecker>
            </AuthorizationProvider>
          </CurrencyProvider>
        </CompanyProfileProvider>
        <Toaster />
      </body>
    </html>
  );
}
