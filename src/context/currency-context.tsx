
'use client';

import { getCurrencySettings, type CurrencySettings } from '@/app/admin/currency/actions';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrencyContextType {
  currencyCode: string;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currencyCode, setCurrencyCode] = useState('AED');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrencySettings().then(settings => {
      setCurrencyCode(settings.currencyCode);
      setIsLoading(false);
    });
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <CurrencyContext.Provider value={{ currencyCode, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
