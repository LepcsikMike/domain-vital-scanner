
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PlanType = 'free' | 'enterprise';

interface PlanContextType {
  plan: PlanType;
  isEnterprise: boolean;
  dailyScansUsed: number;
  dailyScansLimit: number;
  canScan: boolean;
  incrementDailyScans: () => void;
  upgradeToPro: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

interface PlanProviderProps {
  children: ReactNode;
}

export const PlanProvider = ({ children }: PlanProviderProps) => {
  const [plan, setPlan] = useState<PlanType>('free');
  const [dailyScansUsed, setDailyScansUsed] = useState(0);
  const dailyScansLimit = 1; // Free plan limit

  useEffect(() => {
    // Check for Enterprise plan (could be from Stripe subscription, localStorage, etc.)
    const storedPlan = localStorage.getItem('userPlan');
    if (storedPlan === 'enterprise') {
      setPlan('enterprise');
    }

    // Reset daily scans counter at midnight
    const today = new Date().toDateString();
    const lastScanDate = localStorage.getItem('lastScanDate');
    
    if (lastScanDate !== today) {
      setDailyScansUsed(0);
      localStorage.setItem('lastScanDate', today);
      localStorage.removeItem('dailyScansUsed');
    } else {
      const storedScans = parseInt(localStorage.getItem('dailyScansUsed') || '0');
      setDailyScansUsed(storedScans);
    }
  }, []);

  const incrementDailyScans = () => {
    if (plan === 'enterprise') return; // No limits for enterprise
    
    const newCount = dailyScansUsed + 1;
    setDailyScansUsed(newCount);
    localStorage.setItem('dailyScansUsed', newCount.toString());
  };

  const upgradeToPro = () => {
    window.open('https://buy.stripe.com/7sYeVegbJekDdQbdjy8AE04', '_blank');
  };

  const canScan = plan === 'enterprise' || dailyScansUsed < dailyScansLimit;

  return (
    <PlanContext.Provider
      value={{
        plan,
        isEnterprise: plan === 'enterprise',
        dailyScansUsed,
        dailyScansLimit,
        canScan,
        incrementDailyScans,
        upgradeToPro,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};
