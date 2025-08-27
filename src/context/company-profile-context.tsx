
'use client';

import { getCompanyProfile, type CompanyProfile } from '@/app/admin/company-profile/actions';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CompanyProfileContextType {
  profile: CompanyProfile;
}

const CompanyProfileContext = createContext<CompanyProfileContextType | undefined>(undefined);

export const CompanyProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    getCompanyProfile().then(settings => {
      setProfile(settings);
    });
  }, []);
  
  if (!profile) {
    return null; // Or a loading spinner for the whole app
  }

  return (
    <CompanyProfileContext.Provider value={{ profile }}>
      {children}
    </CompanyProfileContext.Provider>
  );
};

export const useCompanyProfile = () => {
  const context = useContext(CompanyProfileContext);
  if (context === undefined) {
    throw new Error('useCompanyProfile must be used within a CompanyProfileProvider');
  }
  return context;
};
